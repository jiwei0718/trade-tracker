"""WTO RTA-IS scraper — bulk Excel export.

The WTO publishes a one-click "Export All RTAs" endpoint that returns an .xlsx
with every RTA notified to the GATT/WTO (~658 rows as of 2026), including name,
type, status, signature/notification/entry-into-force dates, composition
(parties), region, and signatories.

Endpoint: https://rtais.wto.org/UI/ExportAllRTAList.aspx
This replaced the old ASP.NET GridView scrape (which needed __VIEWSTATE).
"""
from __future__ import annotations

import io
import logging
import re
from typing import Any

from .base import http_get, make_source
from .country_names import normalize_party

log = logging.getLogger(__name__)


def _parse_parties(rta_name: str, signatories: str) -> tuple[list[str], list[str], list[str]]:
    """Return (codes, en_names, zh_names).

    Parse from the RTA name by splitting on ' - ' (hyphen with surrounding
    spaces). We avoid splitting the signatories column on commas because many
    official names contain commas ("Korea, Republic of").
    """
    # Split RTA name on ' - ' (hyphen with surrounding spaces)
    raw = [p.strip() for p in re.split(r"\s+-\s+", rta_name) if p.strip()]

    codes, ens, zhs = [], [], []
    seen = set()
    for p in raw:
        code, en, zh = normalize_party(p)
        if code in seen:
            continue
        seen.add(code)
        codes.append(code)
        ens.append(en)
        zhs.append(zh)
    return codes, ens, zhs

EXPORT_URL = "https://rtais.wto.org/UI/ExportAllRTAList.aspx"
LIST_URL = "https://rtais.wto.org/"

# WTO status strings → our internal vocab
def _normalize_status(s: str) -> str:
    s = (s or "").strip().lower()
    if "in force" in s or "entered into force" in s:
        return "in_force"
    if "early announcement" in s or "under negotiation" in s or "proposed" in s:
        return "negotiating"
    if "signed" in s and "not" not in s:
        return "signed"
    if "inactive" in s or "terminated" in s:
        return "expired"
    return "in_force"  # default: most notified RTAs are in force


def _wto_type(t: str) -> str:
    t = (t or "").strip().lower()
    if "plurilateral" in t:
        return "plurilateral"
    if "bilateral" in t:
        return "bilateral"
    return "regional"


def _slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-")
    return ("wto-rta-" + s)[:72]


def _era_for_date(d: str) -> str:
    if not d:
        return "fragmentation"
    try:
        y = int(d.split("-")[0])
    except ValueError:
        return "fragmentation"
    if y < 1947:  return "pre_gatt"
    if y < 1994:  return "gatt_era"
    if y < 2000:  return "wto_birth"
    if y < 2015:  return "fta_boom"
    if y < 2025:  return "fragmentation"
    return "post_liberation"


def _fmt_date(v: Any) -> str:
    if not v:
        return ""
    s = str(v)
    # openpyxl may give datetime
    m = re.search(r"(\d{4})[-/](\d{1,2})", s)
    if m:
        return f"{m.group(1)}-{int(m.group(2)):02d}"
    m = re.search(r"(\d{4})", s)
    return m.group(1) + "-01" if m else ""


def fetch() -> list[dict[str, Any]]:
    log.info("WTO RTA-IS: downloading bulk export")
    r = http_get(EXPORT_URL, headers={"User-Agent": "Mozilla/5.0"})
    if not r or len(r.content) < 5000:
        log.warning("WTO export unavailable")
        return []

    try:
        import openpyxl
    except ImportError:
        log.warning("openpyxl not installed; skipping WTO export")
        return []

    try:
        wb = openpyxl.load_workbook(io.BytesIO(r.content), read_only=True)
        ws = wb.active
        rows = list(ws.iter_rows(values_only=True))
    except Exception as e:
        log.error("WTO xlsx parse failed: %s", e)
        return []

    if not rows:
        return []

    header = [str(h or "").strip() for h in rows[0]]
    idx = {name: i for i, name in enumerate(header)}

    def col(row, name, default=""):
        i = idx.get(name)
        return row[i] if (i is not None and i < len(row) and row[i] is not None) else default

    src = make_source("WTO RTA-IS", LIST_URL)
    out: list[dict[str, Any]] = []
    for row in rows[1:]:
        try:
            name = str(col(row, "RTA Name") or "").strip()
            if not name:
                continue
            status = _normalize_status(str(col(row, "Status")))
            # NB: "RTA Composition" = Bilateral/Plurilateral (a TYPE), not parties.
            composition = str(col(row, "RTA Composition") or "")
            wtype = _wto_type(composition) if composition else _wto_type(str(col(row, "Type")))
            signatories = str(col(row, "Current signatories") or col(row, "Original signatories") or "")
            codes, party_en, party_zh = _parse_parties(name, signatories)

            key_dates: dict[str, str] = {}
            sig = _fmt_date(col(row, "Date of Signature (G)")) or _fmt_date(col(row, "Date of Signature (S)"))
            eif = _fmt_date(col(row, "Date of Entry into Force (G)")) or _fmt_date(col(row, "Date of Entry into Force (S)"))
            inactive = _fmt_date(col(row, "Inactive Date"))
            if sig:      key_dates["signed"] = sig
            if eif:      key_dates["in_force"] = eif
            if inactive: key_dates["expired"] = inactive
            # NB: we deliberately do NOT map "Date of Notification" — it is often
            # recent (re-notifications) and would pollute "latest progress" sorting.

            era_date = eif or sig
            coverage = str(col(row, "Coverage") or "")
            region = str(col(row, "Region") or "")

            name_zh = "–".join(party_zh) if party_zh else name

            out.append({
                "id": _slugify(name),
                "name": name,
                "nameZh": name_zh,
                "status": status,
                "type": wtype,
                "era": _era_for_date(era_date),
                "parties": codes or [name],
                "partyNames": party_en or [name],
                "partyNamesZh": party_zh or [name],
                "keyDates": key_dates,
                "description": f"WTO-notified RTA. Coverage: {coverage or 'n/a'}. Region: {region or 'n/a'}.",
                "descriptionZh": f"已通報 WTO 的區域貿易協定（{name}）。涵蓋範圍：{coverage or '未註明'}。",
                "tags": ["wto-notified"],
                "_confidence": 0.95,
                "_source": src,
            })
        except Exception as e:
            log.debug("WTO row failed: %s", e)
            continue

    log.info("WTO RTA-IS: %d records", len(out))
    return out
