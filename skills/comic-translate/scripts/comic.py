"""Locate the user's framework and run its resumable local chat workflow."""
import argparse
import os
from pathlib import Path
import sys


def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--repo", type=Path)
    args, remaining = parser.parse_known_args()
    candidates = ([args.repo] if args.repo else []) + [
        Path(os.environ["CTT_REPO"]) if os.environ.get("CTT_REPO") else None,
        *Path(__file__).resolve().parents,
    ]
    root = next((p for p in candidates if p and (p / "backend/ctt/chat.py").is_file()), None)
    if root is None:
        raise SystemExit("Framework not found; pass --repo <swell-cartoon-translate directory>")
    sys.path.insert(0, str(root / "backend"))
    from ctt.chat import main as workflow
    if "--config" not in remaining:
        remaining = ["--config", str(root / "ctt.toml"), *remaining]
    return workflow(remaining)


if __name__ == "__main__":
    raise SystemExit(main())
