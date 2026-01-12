#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${1:-}"
WORKFLOW="${2:-}"
STATUS="${3:-SUCCESS}"
SUMMARY="${4:-}"
ARTIFACTS_CSV="${5:-}"

if [[ -z "$PROJECT_ID" || -z "$WORKFLOW" ]]; then
  echo "Usage: slack_notify.sh <project_id> <workflow> [status] [summary] [artifacts_csv]"
  exit 1
fi

# Load .env if present
if [[ -f ".env" ]]; then
  export $(grep -v '^#' .env | xargs) || true
fi

if [[ -z "${SLACK_WEBHOOK_URL:-}" ]]; then
  echo "ERROR: SLACK_WEBHOOK_URL is not set. Put it in .env"
  exit 1
fi

GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")"
GIT_COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")"

ARTIFACTS_TEXT=""
if [[ -n "$ARTIFACTS_CSV" ]]; then
  IFS=',' read -ra ITEMS <<< "$ARTIFACTS_CSV"
  for p in "${ITEMS[@]}"; do
    ARTIFACTS_TEXT="${ARTIFACTS_TEXT}\n• $(echo "$p" | xargs)"
  done
fi

if [[ -z "$SUMMARY" ]]; then
  SUMMARY="Workflow completed."
fi

TEXT="*[PMAI]* ${STATUS} — *${PROJECT_ID}* — \`${WORKFLOW}\`\n*Summary:* ${SUMMARY}\n*Artifacts:*${ARTIFACTS_TEXT}\n*Git:* \`${GIT_BRANCH}\` @ \`${GIT_COMMIT}\`"

export PMAI_SLACK_TEXT="$TEXT"
payload="$(python3 - <<'PY'
import json, os
print(json.dumps({"text": os.environ.get("PMAI_SLACK_TEXT", "")}))
PY
)"

curl -sS -X POST -H 'Content-type: application/json' \
  --data "$payload" \
  "$SLACK_WEBHOOK_URL"

echo "Slack notified: ${PROJECT_ID} ${WORKFLOW} ${STATUS}"
