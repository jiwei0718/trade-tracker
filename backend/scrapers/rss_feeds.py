"""Pull from a small set of curated RSS feeds about trade.

These provide higher signal-to-noise than GDELT for status-change detection,
because they're hand-curated by trade press.
"""
from __future__ import annotations

import logging
from typing import Any

import feedparser

from .base import make_source, now_iso

log = logging.getLogger(__name__)

FEEDS = [
    # EU DG Trade press releases
    {"name": "EU DG Trade",  "url": "https://policy.trade.ec.europa.eu/news_en.atom"},
    # USTR press releases
    {"name": "USTR",         "url": "https://ustr.gov/rss.xml"},
    # WTO news room
    {"name": "WTO news",     "url": "https://www.wto.org/library/rss/latest_news_e.xml"},
    # Politico trade
    {"name": "Politico EU Trade", "url": "https://www.politico.eu/feed/?post_type=article&trade=trade"},
]


def fetch() -> list[dict[str, Any]]:
    """Return raw article entries to be classified downstream."""
    out: list[dict[str, Any]] = []
    for f in FEEDS:
        try:
            parsed = feedparser.parse(f["url"])
            if parsed.bozo and not parsed.entries:
                log.warning("RSS %s: parse failed (%s)", f["name"], parsed.bozo_exception)
                continue
            log.info("RSS %s: %d entries", f["name"], len(parsed.entries))
            for e in parsed.entries[:30]:
                out.append({
                    "_raw_news": {
                        "title": e.get("title", ""),
                        "url": e.get("link", ""),
                        "summary": e.get("summary", "")[:500],
                        "published": e.get("published", e.get("updated", "")),
                    },
                    "_source": make_source(f["name"], f["url"]),
                    "_confidence": 0.6,
                })
        except Exception as exc:
            log.warning("RSS %s: %s", f["name"], exc)
    return out
