"""Shared helpers for scrapers."""
from __future__ import annotations

import datetime as dt
import logging
import time
from typing import Any

import requests

log = logging.getLogger(__name__)

DEFAULT_TIMEOUT = 30
USER_AGENT = (
    "TradeTrackerBot/1.0 (+https://github.com/yourname/trade-tracker; "
    "research, non-commercial)"
)


def http_get(url: str, *, params: dict | None = None, retries: int = 2, **kw) -> requests.Response | None:
    """GET wrapper with retry & polite UA."""
    headers = kw.pop("headers", {})
    headers.setdefault("User-Agent", USER_AGENT)
    headers.setdefault("Accept-Language", "en;q=0.9,zh-TW;q=0.7")

    last_exc: Exception | None = None
    for attempt in range(retries + 1):
        try:
            r = requests.get(url, params=params, headers=headers,
                             timeout=DEFAULT_TIMEOUT, **kw)
            if r.status_code == 200:
                return r
            log.warning("GET %s → %d", url, r.status_code)
        except requests.RequestException as e:
            last_exc = e
            log.warning("GET %s failed (attempt %d): %s", url, attempt + 1, e)
        time.sleep(1.5 * (attempt + 1))
    if last_exc:
        log.error("GET %s gave up: %s", url, last_exc)
    return None


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat()


def make_source(name: str, url: str) -> dict[str, Any]:
    return {"name": name, "url": url, "fetched_at": now_iso()}
