"""Scraper modules. Each one exposes a `fetch() -> list[ScraperRecord]` function.

A ScraperRecord is a dict with at least:
  id          : str — matches our agreement.id when possible (else new id)
  _confidence : float (0–1)
  _source     : dict { name, url, fetched_at }

Plus any fields it has structured information for (status, keyDates, tradeVolume, etc.)

Scrapers should NEVER raise on network errors — they should log and return [].
"""
