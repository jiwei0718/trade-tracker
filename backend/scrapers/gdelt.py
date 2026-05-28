"""GDELT 2.0 events scraper for trade-related signals.

GDELT (https://www.gdeltproject.org/) tracks global news using CAMEO event
codes. The codes relevant to trade agreements:

  036 — "Express intent to engage in material cooperation, not specified below"
  037 — "Express intent to engage in economic cooperation"
  057 — "Sign formal agreement"
  066 — "Engage in economic cooperation"
  087 — "Provide economic aid"
  136 — "Reduce relations, economic"

We query the free DOC 2.0 API by event code + date range.
"""
from __future__ import annotations

import datetime as dt
import logging
from typing import Any

from .base import http_get, make_source

log = logging.getLogger(__name__)

# Free GDELT Doc 2.0 API
GDELT_URL = "https://api.gdeltproject.org/api/v2/doc/doc"

TRADE_KEYWORDS = (
    '"trade agreement" OR "free trade" OR FTA OR "trade deal" OR '
    '"economic partnership" OR CEPA OR "joint statement" OR '
    '"customs union" OR "trade pact"'
)


def fetch(days_back: int = 3) -> list[dict[str, Any]]:
    """Query GDELT for recent trade-related news articles.

    Returns raw article references. The LLM extractor pass will turn these
    into structured status updates. (If LLM is disabled, the records are
    ignored downstream.)
    """
    end = dt.datetime.now(dt.timezone.utc)
    start = end - dt.timedelta(days=days_back)
    params = {
        "query": TRADE_KEYWORDS,
        "mode": "ArtList",
        "format": "json",
        "maxrecords": 250,
        "startdatetime": start.strftime("%Y%m%d%H%M%S"),
        "enddatetime": end.strftime("%Y%m%d%H%M%S"),
        "sort": "datedesc",
    }

    r = http_get(GDELT_URL, params=params)
    if not r:
        return []

    try:
        data = r.json()
    except Exception as e:
        log.warning("GDELT: bad JSON: %s", e)
        return []

    articles = data.get("articles", [])
    log.info("GDELT: %d articles", len(articles))

    out = []
    src = make_source("GDELT 2.0", GDELT_URL)
    for a in articles:
        out.append({
            "_raw_news": {
                "title": a.get("title", ""),
                "url": a.get("url", ""),
                "language": a.get("language", ""),
                "domain": a.get("domain", ""),
                "seendate": a.get("seendate", ""),
            },
            "_source": src,
            "_confidence": 0.4,  # news headlines are signals only
            # NB: no `id` yet — LLM extractor (or rule-based matcher) will
            # assign one if the article references a known agreement.
        })
    return out
