"""WTO Joint Statement Initiatives (JSI) scraper.

JSIs are the 'plurilateral with WTO blessing' track for issues that can't get
unanimous consensus. Currently 7 active streams:
  - E-commerce
  - Investment Facilitation for Development (IFD)
  - Services Domestic Regulation (SDR)
  - MSME (Micro, Small and Medium-Sized Enterprises)
  - Plastics Pollution
  - TESSD (Trade and Environmental Sustainability Structured Discussions)
  - Fossil Fuel Subsidy Reform

Each JSI page lists co-sponsors and current status. We hardcode the URLs since
they're stable and there's no index page.
"""
from __future__ import annotations

import logging
from typing import Any

from bs4 import BeautifulSoup

from .base import http_get, make_source

log = logging.getLogger(__name__)

JSI_PAGES = [
    {
        "id": "wto-jsi-ecommerce",
        "nameZh": "WTO電子商務聯合聲明倡議 (E-commerce JSI)",
        "name": "WTO Joint Statement Initiative on E-commerce",
        "url": "https://www.wto.org/english/tratop_e/ecom_e/joint_statement_e.htm",
    },
    {
        "id": "wto-jsi-ifd",
        "nameZh": "WTO投資便利化發展協定 (Investment Facilitation for Development)",
        "name": "WTO Investment Facilitation for Development (IFD)",
        "url": "https://www.wto.org/english/tratop_e/invfac_public_e/invfac_e.htm",
    },
    {
        "id": "wto-jsi-sdr",
        "nameZh": "WTO服務業國內法規聯合倡議 (Services Domestic Regulation JSI)",
        "name": "WTO Services Domestic Regulation JSI",
        "url": "https://www.wto.org/english/tratop_e/serv_e/jsdomreg_e.htm",
    },
    {
        "id": "wto-jsi-msme",
        "nameZh": "WTO微中小企業聯合倡議 (MSME JSI)",
        "name": "WTO Informal Working Group on MSMEs",
        "url": "https://www.wto.org/english/tratop_e/msmes_e/msmes_e.htm",
    },
    {
        "id": "wto-jsi-plastics",
        "nameZh": "WTO塑膠污染與環境永續貿易對話 (Plastics Pollution)",
        "name": "WTO Dialogue on Plastics Pollution",
        "url": "https://www.wto.org/english/tratop_e/ppesp_e/ppesp_e.htm",
    },
    {
        "id": "wto-jsi-tessd",
        "nameZh": "WTO貿易與環境永續結構化討論 (TESSD)",
        "name": "WTO TESSD",
        "url": "https://www.wto.org/english/tratop_e/envir_e/tessd_e.htm",
    },
    {
        "id": "wto-jsi-ffsr",
        "nameZh": "WTO化石燃料補貼改革倡議 (Fossil Fuel Subsidy Reform)",
        "name": "WTO Fossil Fuel Subsidy Reform Initiative",
        "url": "https://www.wto.org/english/tratop_e/envir_e/fossil_fuel_e.htm",
    },
]


def fetch() -> list[dict[str, Any]]:
    log.info("WTO JSI: fetching %d initiative pages", len(JSI_PAGES))
    out: list[dict[str, Any]] = []
    for meta in JSI_PAGES:
        r = http_get(meta["url"])
        if not r:
            log.warning("JSI %s: fetch failed", meta["id"])
            continue
        rec = _parse_page(meta, r.text)
        if rec:
            out.append(rec)
    log.info("WTO JSI: %d records", len(out))
    return out


def _parse_page(meta: dict, html: str) -> dict[str, Any] | None:
    soup = BeautifulSoup(html, "lxml")

    # WTO pages structure: main content is in <div id="content"> or similar.
    main = soup.find("div", id="content") or soup.find("main") or soup.body
    if not main:
        return None
    text = " ".join(main.stripped_strings)[:2000]

    # Heuristic status detection
    status = "negotiating"
    lower = text.lower()
    if "entered into force" in lower or "incorporated into" in lower:
        status = "in_force"
    elif "concluded" in lower and "negotiations" in lower:
        status = "concluded"
    elif "signed" in lower and "by" in lower:
        status = "signed"
    elif "suspended" in lower:
        status = "suspended"

    # Try to count co-sponsors (often listed as "X co-sponsors" or "members")
    import re
    members_match = re.search(r"(\d{2,3})\s+(?:co[- ]sponsors?|participants?|members?|economies)", lower)
    members = int(members_match.group(1)) if members_match else None

    return {
        "id": meta["id"],
        "name": meta["name"],
        "nameZh": meta["nameZh"],
        "shortName": meta["nameZh"].split("(")[0].strip(),
        "type": "jsi",
        "status": status,
        "era": "fragmentation",
        "parties": ["WTO-JSI"],
        "partyNames": [f"{members} WTO members" if members else "WTO Members"],
        "partyNamesZh": [f"{members}個WTO成員" if members else "WTO各成員"],
        "keyDates": {},
        "description": text[:400],
        "descriptionZh": "",
        "tags": ["jsi", "plurilateral", "wto"],
        "_confidence": 0.8,
        "_source": make_source("WTO JSI page", meta["url"]),
    }
