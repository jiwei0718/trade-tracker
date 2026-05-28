"""Pipeline entrypoint.

Run from repo root:
    python backend/run.py

What it does:
1. Loads seed/previous agreements.json
2. Runs all scrapers (collects updates + raw news)
3. Runs LLM extractor on raw news (if GEMINI_API_KEY set)
4. Reconciles everything into a new agreements.json
5. Diffs vs previous → events.json
6. Writes data/agreements.json, data/events.json, data/meta.json

Failures in any one scraper are isolated; the pipeline always produces output.
"""
from __future__ import annotations

import datetime as dt
import json
import logging
import os
import sys
import traceback
from pathlib import Path

# Make backend importable when run as `python backend/run.py`
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.pipeline import reconcile, diff_agreements  # noqa: E402
from backend.scrapers import wto_rta, wto_jsi, desta, gdelt, rss_feeds  # noqa: E402
from backend.extractors import llm_extract  # noqa: E402

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-7s [%(name)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("pipeline")

ROOT = Path(__file__).parent.parent
DATA = ROOT / "data"
SEED = DATA / "seed" / "agreements.seed.json"
OUT_AGREEMENTS = DATA / "agreements.json"
OUT_EVENTS = DATA / "events.json"
OUT_META = DATA / "meta.json"


def _load_json(path: Path, fallback) -> object:
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        log.warning("load %s failed: %s", path, e)
        return fallback


def _safe_run(scraper_module, label: str) -> list[dict]:
    try:
        return scraper_module.fetch()
    except Exception:
        log.error("scraper %s crashed:\n%s", label, traceback.format_exc())
        return []


def main() -> int:
    # ── 1. Load seed + previous output ─────────────────────────────────
    seed = _load_json(SEED, {"agreements": []})
    seed_agreements = seed.get("agreements", []) if isinstance(seed, dict) else []
    log.info("loaded %d seed agreements", len(seed_agreements))

    previous = _load_json(OUT_AGREEMENTS, None)
    previous_agreements = (
        previous.get("agreements", []) if isinstance(previous, dict) else seed_agreements
    )

    # ── 2. Run scrapers ────────────────────────────────────────────────
    scraper_results: dict[str, list[dict]] = {}
    structured_updates: list[dict] = []
    raw_news: list[dict] = []

    log.info("─── running WTO RTA-IS ───────────────────────────────")
    rta = _safe_run(wto_rta, "wto_rta")
    scraper_results["wto_rta"] = rta
    structured_updates.extend(rta)

    log.info("─── running WTO JSI ──────────────────────────────────")
    jsi = _safe_run(wto_jsi, "wto_jsi")
    scraper_results["wto_jsi"] = jsi
    structured_updates.extend(jsi)

    log.info("─── running DESTA ────────────────────────────────────")
    desta_data = _safe_run(desta, "desta")
    scraper_results["desta"] = desta_data
    structured_updates.extend(desta_data)

    log.info("─── running RSS feeds ────────────────────────────────")
    rss = _safe_run(rss_feeds, "rss_feeds")
    scraper_results["rss"] = rss
    raw_news.extend(rss)

    log.info("─── running GDELT ────────────────────────────────────")
    gdelt_data = _safe_run(gdelt, "gdelt")
    scraper_results["gdelt"] = gdelt_data
    raw_news.extend(gdelt_data)

    # ── 3. LLM extraction over raw news ────────────────────────────────
    log.info("─── running LLM extractor on %d news items ──────────", len(raw_news))
    known_ids = [a["id"] for a in previous_agreements]
    try:
        llm_updates = llm_extract.extract_updates(raw_news, known_ids)
    except Exception:
        log.error("LLM extractor crashed:\n%s", traceback.format_exc())
        llm_updates = []
    structured_updates.extend(llm_updates)

    # ── 4. Reconcile ──────────────────────────────────────────────────
    log.info("─── reconciling %d updates against %d previous ──────",
             len(structured_updates), len(previous_agreements))
    merged = reconcile(previous_agreements, structured_updates)

    # ── 5. Diff vs previous → events ──────────────────────────────────
    events = diff_agreements(previous_agreements, merged)
    log.info("─── %d events detected ──────────────────────────────", len(events))

    # ── 6. Write outputs ──────────────────────────────────────────────
    now_iso = dt.datetime.now(dt.timezone.utc).isoformat()
    DATA.mkdir(exist_ok=True)
    OUT_AGREEMENTS.write_text(json.dumps({
        "schema_version": 1,
        "generated_at": now_iso,
        "generator": "pipeline-run",
        "count": len(merged),
        "agreements": merged,
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    # Events file: append to existing
    prev_events = _load_json(OUT_EVENTS, {"events": []})
    prev_event_list = prev_events.get("events", []) if isinstance(prev_events, dict) else []
    # Keep last 365 days
    cutoff = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=365)).isoformat()
    kept = [e for e in prev_event_list if e.get("detected_at", "") >= cutoff]
    OUT_EVENTS.write_text(json.dumps({
        "schema_version": 1,
        "generated_at": now_iso,
        "events": events + kept,
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    # Meta: provenance + per-source stats
    OUT_META.write_text(json.dumps({
        "last_run_at": now_iso,
        "agreement_count": len(merged),
        "event_count_this_run": len(events),
        "source_counts": {k: len(v) for k, v in scraper_results.items()},
        "llm_findings": len(llm_updates),
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    log.info("─── DONE: %d agreements, %d events this run ─────────",
             len(merged), len(events))
    return 0


if __name__ == "__main__":
    sys.exit(main())
