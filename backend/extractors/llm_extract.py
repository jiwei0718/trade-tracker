"""Use Gemini (free tier) to convert raw news/article references into
structured status updates for known agreements.

Falls back gracefully when:
  - GEMINI_API_KEY is unset → returns [] (pure-scraper mode)
  - Gemini API is down       → returns [] for that batch
  - LLM output unparseable   → skips that batch

We rate-limit ourselves to stay inside the free tier (15 RPM, 1500 RPD as of
2025-06). One batch == up to 25 articles, so daily usage is well under cap.
"""
from __future__ import annotations

import json
import logging
import os
import re
import time
from typing import Any

log = logging.getLogger(__name__)

MODEL = "gemini-2.5-flash"
BATCH_SIZE = 25
RATE_LIMIT_SEC = 5.0  # ~12 RPM, safely under 15 RPM cap


SYSTEM_PROMPT = """You are a trade agreement analyst. For each news article below,
decide whether it announces a STATUS CHANGE for a specific trade agreement.

Output STRICT JSON, an array. For each article either output one finding or omit it.

Each finding shape:
{
  "agreement_id_hint": "<best-match id from the known list, or null if a new agreement>",
  "agreement_name": "<the agreement name as referenced in the article>",
  "parties": ["<ISO-like codes or country names>"],
  "new_status": "<one of: in_force | signed | concluded | negotiating | suspended | cancelled | proposed | superseded | expired>",
  "key_date": "<YYYY-MM if mentioned, else null>",
  "key_date_kind": "<one of: signed | in_force | concluded | started | suspended | cancelled, else null>",
  "confidence": <0-1 float>,
  "source_url": "<from the article>",
  "evidence_quote": "<short quote from headline>"
}

RULES:
- Only output findings when the article clearly references a SPECIFIC agreement
  AND a status change.
- Ignore commentary, opinion pieces, anniversaries, general trade news.
- If the article is about US tariffs (not an agreement), skip it.
- Be conservative: confidence should be 0.4-0.8 typical.

Output ONLY the JSON array, no surrounding prose.
"""


def extract_updates(
    news_items: list[dict[str, Any]],
    known_agreement_ids: list[str],
) -> list[dict[str, Any]]:
    """Return list of agreement update dicts produced by LLM."""
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        log.info("LLM extractor: no GEMINI_API_KEY — skipping (pure-scraper mode)")
        return []

    if not news_items:
        return []

    try:
        import google.generativeai as genai
    except ImportError:
        log.warning("google-generativeai not installed; skipping LLM extraction")
        return []

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(MODEL, system_instruction=SYSTEM_PROMPT)

    all_findings: list[dict[str, Any]] = []
    id_list_str = ", ".join(known_agreement_ids[:200])

    for i in range(0, len(news_items), BATCH_SIZE):
        batch = news_items[i:i + BATCH_SIZE]
        articles_block = "\n\n".join(_render_article(idx, n) for idx, n in enumerate(batch))
        prompt = (
            f"Known agreement IDs (for matching):\n{id_list_str}\n\n"
            f"Articles:\n{articles_block}"
        )
        try:
            resp = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json", "temperature": 0.1},
            )
            text = resp.text
            findings = _parse_json(text)
        except Exception as e:
            log.warning("LLM batch %d failed: %s", i // BATCH_SIZE, e)
            findings = []

        all_findings.extend(findings)
        time.sleep(RATE_LIMIT_SEC)

    log.info("LLM extractor: %d findings from %d articles", len(all_findings), len(news_items))
    return [_finding_to_update(f) for f in all_findings if _is_valid(f)]


def _render_article(idx: int, raw: dict) -> str:
    a = raw.get("_raw_news", {})
    src = raw.get("_source", {})
    return (
        f"[Article {idx}]\n"
        f"  Source: {src.get('name', '?')}\n"
        f"  Title: {a.get('title', '')}\n"
        f"  Summary: {a.get('summary', '')[:300]}\n"
        f"  URL: {a.get('url', '')}\n"
        f"  Date: {a.get('seendate') or a.get('published', '')}"
    )


def _parse_json(text: str) -> list[dict]:
    text = text.strip()
    # Strip code fences if present
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```\s*$", "", text)
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict) and "findings" in parsed:
            return parsed["findings"]
    except json.JSONDecodeError as e:
        log.warning("LLM JSON parse error: %s — text was: %s", e, text[:300])
    return []


def _is_valid(f: dict) -> bool:
    return bool(f.get("new_status")) and (f.get("agreement_id_hint") or f.get("agreement_name"))


def _finding_to_update(f: dict) -> dict[str, Any]:
    """Convert one LLM finding into an update dict for the reconciler."""
    agreement_id = f.get("agreement_id_hint") or _slugify(f.get("agreement_name", ""))
    key_dates: dict[str, str] = {}
    if f.get("key_date") and f.get("key_date_kind"):
        key_dates[f["key_date_kind"]] = f["key_date"]

    return {
        "id": agreement_id,
        "name": f.get("agreement_name", agreement_id),
        "nameZh": f.get("agreement_name", agreement_id),
        "status": f.get("new_status"),
        "type": "bilateral",  # unknown until matched
        "era": "post_liberation",  # safe default for new/changed records
        "parties": f.get("parties", []),
        "partyNames": f.get("parties", []),
        "partyNamesZh": f.get("parties", []),
        "keyDates": key_dates,
        "description": f.get("evidence_quote", ""),
        "descriptionZh": "",
        "_confidence": float(f.get("confidence", 0.5)),
        "_source": {
            "name": "LLM extraction",
            "url": f.get("source_url", ""),
            "fetched_at": _now_iso(),
            "evidence": f.get("evidence_quote", ""),
        },
    }


def _slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:64]


def _now_iso() -> str:
    import datetime as dt
    return dt.datetime.now(dt.timezone.utc).isoformat()
