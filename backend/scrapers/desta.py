"""DESTA (Design of Trade Agreements) database scraper.

DESTA is a Swiss/British academic database covering ~900 trade agreements with
structured metadata. They publish CSV downloads on their site.

Reference: https://www.designoftradeagreements.org/downloads/

Strategy: download the public CSV, normalize columns to our schema. DESTA
updates roughly every 6-12 months, so this only contributes new historical
records, not real-time updates.
"""
from __future__ import annotations

import csv
import io
import logging
from typing import Any

from .base import http_get, make_source

log = logging.getLogger(__name__)

# Replace with the actual CSV URL once verified — DESTA rotates filenames.
# As of recent versions they host: https://www.designoftradeagreements.org/media/filer_public/ ...
# We try a couple of candidate paths.
DESTA_CANDIDATES = [
    "https://www.designoftradeagreements.org/downloads/desta_list_treaties.csv",
    "https://www.designoftradeagreements.org/media/filer_public/desta_list.csv",
]


def fetch() -> list[dict[str, Any]]:
    log.info("DESTA: trying download")
    for url in DESTA_CANDIDATES:
        r = http_get(url)
        if r and r.status_code == 200 and len(r.content) > 1000:
            return _parse(r.content, url)
    log.warning("DESTA: no CSV reachable — skipping (re-check URL on https://www.designoftradeagreements.org/downloads/)")
    return []


def _parse(content: bytes, url: str) -> list[dict[str, Any]]:
    text = content.decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(text))
    out = []
    src = make_source("DESTA", url)
    for row in reader:
        try:
            # DESTA column names vary by release; map by best guess
            name = (row.get("name") or row.get("Treaty") or row.get("treaty_name") or "").strip()
            if not name:
                continue
            year = (row.get("year") or row.get("entry_year") or "").strip()
            parties_raw = (row.get("Parties") or row.get("parties_iso") or "").strip()
            parties = [p.strip() for p in parties_raw.split(",") if p.strip()]

            out.append({
                "id": _slugify(name),
                "name": name,
                "nameZh": name,
                "status": "in_force",
                "type": "regional" if len(parties) > 2 else "bilateral",
                "era": _era_for_year(year),
                "parties": parties,
                "partyNames": parties,
                "partyNamesZh": parties,
                "keyDates": {"signed": f"{year}-01"} if year.isdigit() else {},
                "description": f"DESTA-listed trade agreement, treaty year {year}.",
                "descriptionZh": "",
                "_confidence": 0.9,
                "_source": src,
            })
        except Exception as e:
            log.debug("DESTA row failed: %s", e)
    log.info("DESTA: %d records", len(out))
    return out


def _slugify(name: str) -> str:
    import re
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:64]


def _era_for_year(year: str) -> str:
    try:
        y = int(year)
    except ValueError:
        return "fragmentation"
    if y < 1947:           return "pre_gatt"
    if y < 1994:           return "gatt_era"
    if y < 2000:           return "wto_birth"
    if y < 2015:           return "fta_boom"
    if y < 2025:           return "fragmentation"
    return "post_liberation"
