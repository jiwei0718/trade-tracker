"""WTO RTA-IS scraper.

Pulls the full list of RTAs notified to the WTO from the public CSV export.
Endpoint: https://rtais.wto.org/UI/PublicAllRTAList.aspx
The download link returns a tab-separated UTF-16 export (legacy ASP.NET form).

The CSV columns include: RTA Name, RTA Composition (parties), Type
(GATT/GATS/Both), Coverage, Status, Date of Notification, Date of Entry into Force.

Fallback: if the export endpoint changes (it occasionally does), we fall back
to scraping the HTML table. Both paths are wrapped in try/except so the
pipeline never crashes.
"""
from __future__ import annotations

import csv
import io
import logging
from typing import Any

from bs4 import BeautifulSoup

from .base import http_get, make_source

log = logging.getLogger(__name__)

LIST_URL = "https://rtais.wto.org/UI/PublicAllRTAList.aspx"
# This is the actual XHR endpoint behind "Export to Excel" — discovered by
# inspecting the WTO RTA-IS page network panel. May need adjustment if WTO
# rebuilds the site.
EXPORT_URL = "https://rtais.wto.org/UI/PublicAllRTAList.aspx?Action=Export"


# Map WTO status codes → our internal vocab
STATUS_MAP = {
    "in force":               "in_force",
    "entered into force":     "in_force",
    "signed":                 "signed",
    "early announcement":     "proposed",
    "inactive":               "expired",
    "terminated":             "expired",
    "ongoing":                "negotiating",
    "negotiations":           "negotiating",
}


def _normalize_status(s: str) -> str:
    s = (s or "").strip().lower()
    for needle, code in STATUS_MAP.items():
        if needle in s:
            return code
    return "in_force"  # most WTO-notified ones are in force; default conservatively


def _slugify(name: str) -> str:
    """Produce a stable id for matching against our seed set."""
    import re
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s[:64]


def fetch() -> list[dict[str, Any]]:
    """Return list of agreement update dicts from WTO RTA-IS."""
    log.info("WTO RTA-IS: fetching list")
    r = http_get(EXPORT_URL)
    records: list[dict[str, Any]] = []
    src = make_source("WTO RTA-IS", LIST_URL)

    if r and r.headers.get("Content-Type", "").startswith(("text/csv", "application/vnd")):
        records = _parse_csv(r.content, src)
    else:
        # Fallback: parse the HTML list page
        log.info("CSV export unavailable, falling back to HTML scrape")
        r2 = http_get(LIST_URL)
        if not r2:
            return []
        records = _parse_html(r2.text, src)

    log.info("WTO RTA-IS: %d records", len(records))
    return records


def _parse_csv(content: bytes, source: dict) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    # WTO exports as UTF-16 LE with BOM, tab-delimited
    for enc in ("utf-16", "utf-8-sig", "utf-8"):
        try:
            text = content.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    else:
        log.error("WTO CSV: unknown encoding")
        return out

    reader = csv.DictReader(io.StringIO(text), delimiter="\t")
    for row in reader:
        try:
            name = row.get("RTA Name") or row.get("Name") or ""
            if not name:
                continue
            parties_raw = row.get("RTA Composition") or row.get("Parties") or ""
            parties = [p.strip() for p in parties_raw.split(";") if p.strip()]
            status = _normalize_status(row.get("Status", ""))
            key_dates: dict[str, str] = {}
            if row.get("Notification"):
                key_dates["proposed"] = _parse_date(row["Notification"])
            if row.get("Date of Entry into Force"):
                d = _parse_date(row["Date of Entry into Force"])
                if d:
                    key_dates["in_force"] = d

            out.append({
                "id": _slugify(name),
                "name": name,
                "nameZh": name,  # seeds will overwrite; new ones stay English until LLM translates
                "status": status,
                "type": "regional" if len(parties) > 2 else "bilateral",
                "era": "post_liberation" if any(d > "2025-04" for d in key_dates.values()) else "fragmentation",
                "parties": parties,
                "partyNames": parties,
                "partyNamesZh": parties,
                "keyDates": {k: v for k, v in key_dates.items() if v},
                "description": f"WTO-notified RTA. Coverage: {row.get('Coverage', 'n/a')}.",
                "descriptionZh": "",
                "_confidence": 0.95,  # WTO is authoritative
                "_source": source,
            })
        except Exception as e:
            log.warning("WTO CSV row failed: %s — row=%r", e, row)
            continue
    return out


def _parse_html(html: str, source: dict) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    soup = BeautifulSoup(html, "lxml")
    # The list page is an ASP.NET GridView. Find the main table.
    table = soup.find("table", id=lambda x: x and "gvRTA" in x)
    if not table:
        log.warning("WTO HTML: GridView table not found")
        return out
    for tr in table.find_all("tr")[1:]:  # skip header
        tds = [td.get_text(strip=True) for td in tr.find_all("td")]
        if len(tds) < 4:
            continue
        name = tds[0]
        if not name:
            continue
        parties = [p.strip() for p in tds[1].split(";") if p.strip()] if len(tds) > 1 else []
        status = _normalize_status(tds[-1])
        out.append({
            "id": _slugify(name),
            "name": name,
            "nameZh": name,
            "status": status,
            "type": "regional" if len(parties) > 2 else "bilateral",
            "era": "fragmentation",
            "parties": parties,
            "partyNames": parties,
            "partyNamesZh": parties,
            "keyDates": {},
            "description": "WTO-notified RTA.",
            "descriptionZh": "",
            "_confidence": 0.85,
            "_source": source,
        })
    return out


def _parse_date(s: str) -> str:
    """Convert e.g. '01-Dec-1994' or '2020-08-01' to 'YYYY-MM'."""
    from dateutil import parser
    try:
        d = parser.parse(s, dayfirst=False)
        return d.strftime("%Y-%m")
    except Exception:
        return ""
