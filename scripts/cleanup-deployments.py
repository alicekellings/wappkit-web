#!/usr/bin/env python3
"""Delete old Vercel deployments, keeping only the newest production ones.

Runs from GitHub Actions (weekly). Keeps the newest `--keep-prod` production
deployments for rollback and deletes everything else that is READY, so
Deployment Storage stays far below the Hobby plan's 10 GB limit.

Env:
    VERCEL_TOKEN        token scoped to the team that owns the project
    VERCEL_PROJECT_ID   the project id (prj_...)
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone

API = "https://api.vercel.com"
KEEP_PROD = int(os.environ.get("KEEP_PROD", "3"))


def api(path, params=None, method="GET"):
    url = API + path
    if params and method == "GET":
        url += "?" + "&".join(f"{k}={v}" for k, v in params.items() if v is not None)
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", "Bearer " + os.environ["VERCEL_TOKEN"])
    try:
        return json.load(urllib.request.urlopen(req, timeout=30))
    except urllib.error.HTTPError as e:
        print("API error", e.code, e.read().decode("utf-8", "replace")[:200])
        raise SystemExit(1)


def main():
    token = os.environ.get("VERCEL_TOKEN")
    project = os.environ.get("VERCEL_PROJECT_ID")
    if not token or not project:
        raise SystemExit("VERCEL_TOKEN and VERCEL_PROJECT_ID are required")

    deps, until = [], None
    while True:
        params = {"projectId": project, "limit": "100", "state": "READY"}
        if until:
            params["until"] = str(until)
        batch = api("/v6/deployments", params).get("deployments", [])
        deps.extend(batch)
        if len(batch) < 100:
            break
        until = int(batch[-1]["created"]) - 1

    prod_sorted = sorted(
        (d for d in deps if d.get("target") == "production"),
        key=lambda d: d["created"],
        reverse=True,
    )
    keep = {d["uid"] for d in prod_sorted[:KEEP_PROD]}
    to_delete = [d for d in deps if d["uid"] not in keep]

    print(f"deployments: {len(deps)} total, keeping newest {KEEP_PROD} production, "
          f"deleting {len(to_delete)}")

    ok = fail = 0
    for i, d in enumerate(to_delete, 1):
        when = datetime.fromtimestamp(d["created"] / 1000, tz=timezone.utc).strftime("%m-%d")
        r = api(f"/v13/deployments/{d['uid']}", method="DELETE")
        if "__error__" in r:
            fail += 1
            print(f"  [{i}/{len(to_delete)}] FAILED {r['__error__']} {d['uid']}")
        else:
            ok += 1
            if i % 15 == 0 or i == len(to_delete):
                print(f"  [{i}/{len(to_delete)}] deleted, oldest {when}")
        time.sleep(0.2)

    print(f"done: deleted {ok}, failed {fail}, kept {len(keep)}")


if __name__ == "__main__":
    main()
