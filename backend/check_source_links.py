"""Check that the source links of curated agreements still open (read-only).

    npx tsx scripts/export-curated.ts        # refresh backend/.cache/curated.json first
    python backend/check_source_links.py

Lists every link that does not answer 200. Redirects (302/307), "forbidden" (403) and
timeouts are usually sites that refuse scripts and open fine in a browser; 404 and 410
mean the page is gone and the source should be replaced.
"""
from __future__ import annotations

import concurrent.futures
import json
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path

CURATED = Path(__file__).parent / ".cache" / "curated.json"
GONE = {404, 410}


def status(url: str) -> int | str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=20, context=ssl.create_default_context()) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:  # timeouts, DNS, TLS
        return type(e).__name__


def main() -> int:
    data = json.loads(CURATED.read_text(encoding="utf-8"))
    used: dict[str, list[str]] = {}
    for aid, detail in data["details"].items():
        for doc in detail.get("sourceDocs") or []:
            if doc.get("url"):
                used.setdefault(doc["url"], []).append(aid)
    with concurrent.futures.ThreadPoolExecutor(12) as pool:
        results = dict(zip(used, pool.map(status, used)))
    gone = {u: s for u, s in results.items() if s in GONE}
    other = {u: s for u, s in results.items() if s != 200 and s not in GONE}
    print(f"{len(used)} links; {len(gone)} gone; {len(other)} refused or redirected (check in a browser)")
    for u, s in sorted(gone.items()):
        print(f"  GONE {s}  {u}  ← {', '.join(used[u][:3])}")
    for u, s in sorted(other.items(), key=lambda x: str(x[1])):
        print(f"  {s}  {u[:100]}")
    return 1 if gone else 0


if __name__ == "__main__":
    sys.exit(main())
