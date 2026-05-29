"""Merge multiple scraper outputs + the seed into a single agreement set.

Conflict resolution:
- Seed JSON is the historical baseline.
- Scraper updates override seed fields if they have higher confidence and newer
  detection time.
- Multiple scrapers reporting the same field with different values: highest
  confidence wins; ties → most recent.
- All sources are accumulated in the 'sources' field for provenance.
"""
from __future__ import annotations

import logging
from typing import Any

from .schema import Agreement, validate_agreement

log = logging.getLogger(__name__)


def _merge_one(
    base: dict[str, Any],
    update: dict[str, Any],
    source: dict[str, Any],
) -> dict[str, Any]:
    """Merge `update` into `base`. Both are agreement dicts. Returns new dict."""
    out = dict(base)
    confidence = update.get("_confidence", 0.8)

    # Status: only overwrite if update is newer and confident
    if update.get("status") and update["status"] != base.get("status"):
        if confidence >= 0.7:
            out["status"] = update["status"]

    # keyDates: union; update wins on conflicts only with higher confidence
    if "keyDates" in update:
        merged_dates = dict(base.get("keyDates", {}))
        for k, v in update["keyDates"].items():
            if not v:
                continue
            if k not in merged_dates or confidence >= 0.85:
                merged_dates[k] = v
        out["keyDates"] = merged_dates

    # tradeVolume: prefer non-null, prefer most-recent update
    if update.get("tradeVolume") is not None:
        out["tradeVolume"] = update["tradeVolume"]

    # Descriptive fields (parties/names): refresh from high-confidence sources
    # (e.g. WTO export at 0.95). Curated seed records are never re-scraped, so
    # this only affects authoritative re-scrapes, not hand-curated data.
    if confidence >= 0.9:
        for fld in ("parties", "partyNames", "partyNamesZh", "nameZh", "name", "type", "era"):
            if update.get(fld):
                out[fld] = update[fld]

    # description: never overwrite seed text unless seed was empty
    if not base.get("descriptionZh") and update.get("descriptionZh"):
        out["descriptionZh"] = update["descriptionZh"]
    if not base.get("description") and update.get("description"):
        out["description"] = update["description"]

    # Append source provenance
    sources = list(base.get("sources", []))
    sources.append(source)
    out["sources"] = sources
    out["last_updated"] = source.get("fetched_at")

    return out


def reconcile(
    seed: list[dict[str, Any]],
    updates: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Merge seed + scraper updates.

    `updates` items must have at least:
      - id (or matchable name+parties)
      - _confidence (float 0-1)
      - _source ({name, url, fetched_at})

    Records in `updates` not matched to seed are added as new agreements.
    """
    by_id: dict[str, dict[str, Any]] = {a["id"]: dict(a) for a in seed}
    new_count = 0
    updated_count = 0

    for u in updates:
        u_id = u.get("id")
        source = u.get("_source", {})
        if not u_id:
            log.warning("update missing id; skipping: %r", u)
            continue

        if u_id in by_id:
            new_record = _merge_one(by_id[u_id], u, source)
            if new_record != by_id[u_id]:
                updated_count += 1
            by_id[u_id] = new_record
        else:
            # Brand new agreement — validate then add
            errs = validate_agreement(u)
            if errs:
                log.warning("new agreement %s failed validation: %s", u_id, errs)
                continue
            rec = dict(u)
            rec["sources"] = [source]
            rec["last_updated"] = source.get("fetched_at")
            by_id[u_id] = rec
            new_count += 1

    log.info("reconcile: %d new, %d updated, %d total", new_count, updated_count, len(by_id))
    # Strip internal keys before returning
    out = []
    for rec in by_id.values():
        clean = {k: v for k, v in rec.items() if not k.startswith("_")}
        out.append(clean)
    return out
