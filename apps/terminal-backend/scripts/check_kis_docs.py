#!/usr/bin/env python
from __future__ import annotations

import urllib.error
import urllib.request

URLS = [
    "https://apiportal.koreainvestment.com",
    "https://raw.githubusercontent.com/koreainvestment/open-trading-api/main/README.md",
]


def main() -> int:
    ok = True
    for url in URLS:
        try:
            with urllib.request.urlopen(url, timeout=15) as response:
                print(f"OK  {url} status={response.status}")
        except urllib.error.URLError as exc:
            ok = False
            print(f"ERR {url} reason={exc}")

    if not ok:
        print("One or more documentation endpoints were unreachable.")
        return 1

    print("KIS documentation endpoints reachable.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
