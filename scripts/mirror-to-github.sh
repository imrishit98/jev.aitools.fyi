#!/usr/bin/env bash
# Mirror Origin main to GitHub (replaces stub on github.com/imrishit98/jev.aitools.fyi).
# Requires auth: export GH_TOKEN=<github_pat_with_repo_scope> or run `gh auth login`.
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE="${GITHUB_REMOTE:-github}"
URL="${GITHUB_REPO_URL:-https://github.com/imrishit98/jev.aitools.fyi.git}"
if ! git remote get-url "$REMOTE" &>/dev/null; then
  git remote add "$REMOTE" "$URL"
fi
if [[ -n "${GH_TOKEN:-}" ]]; then
  git push "https://x-access-token:${GH_TOKEN}@github.com/imrishit98/jev.aitools.fyi.git" main:main --force
else
  git push "$REMOTE" main:main --force
fi
echo "Pushed $(git rev-parse HEAD) to $URL (main)"
