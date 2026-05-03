"""
MPC News Generator
------------------
Generates a new article daily using the Claude API and opens a GitHub PR.

Usage:
    python main.py                         # Start the scheduler (runs daily at CRON_HOUR:CRON_MINUTE UTC)
    python main.py --now                   # Generate one article immediately and exit
    python main.py --now --topic "..."     # Generate with a specific topic and exit
"""

import argparse
import os
import sys
import time
from datetime import datetime

import schedule
from dotenv import load_dotenv

load_dotenv()

from lib.generate import generate_post
from lib.github import submit_to_github


def run(override_topic: str | None = None) -> None:
    print(f"\n[{datetime.utcnow().isoformat()}Z] Starting post generation...")
    try:
        post = submit_to_github(generate_post(override_topic))
        print(f"[run] Done. PR: {post['pr_url']}\n")
    except Exception as exc:
        print(f"[run] ERROR: {exc}", file=sys.stderr)


def _validate_env() -> None:
    required = ["ANTHROPIC_API_KEY", "GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO"]
    missing = [k for k in required if not os.environ.get(k)]
    if missing:
        sys.exit(f"Missing required environment variables: {', '.join(missing)}\n"
                 "Copy app/.env.example to app/.env and fill in the values.")


def main() -> None:
    _validate_env()

    parser = argparse.ArgumentParser(description="MPC News Generator")
    parser.add_argument("--now", action="store_true", help="Run once immediately and exit")
    parser.add_argument("--topic", type=str, default=None, help="Override the topic for this run")
    args = parser.parse_args()

    if args.now:
        run(args.topic)
        return

    # Scheduler mode — run daily at a configurable UTC time
    run_hour = int(os.environ.get("RUN_HOUR", "8"))
    run_minute = int(os.environ.get("RUN_MINUTE", "0"))
    run_time = f"{run_hour:02d}:{run_minute:02d}"

    schedule.every().day.at(run_time).do(run)

    print(f"[MPC News Generator] Scheduled daily at {run_time} UTC")
    print(f"[MPC News Generator] Run now:  python main.py --now")
    print(f"[MPC News Generator] Stop:     Ctrl+C\n")

    while True:
        schedule.run_pending()
        time.sleep(30)


if __name__ == "__main__":
    main()
