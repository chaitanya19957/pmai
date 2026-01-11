#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${1:-}"
FEATURE_NAME="${2:-}"

if [[ -z "$PROJECT_ID" || -z "$FEATURE_NAME" ]]; then
  echo "Usage: ./scripts/new_project.sh <project_id> <feature_name>"
  exit 1
fi

BASE="history/projects/${PROJECT_ID}"
mkdir -p "${BASE}/inputs" "${BASE}/artifacts" "${BASE}/prd" "${BASE}/stories" "${BASE}/releases"
touch "${BASE}/decisions.md"

cat > "${BASE}/README.md" <<EOT
# Project: ${FEATURE_NAME}
project_id: ${PROJECT_ID}

## Links
- PRD: prd/prd.md
- Stories: stories/stories.md
- Decisions: decisions.md
EOT

echo "Created project scaffold at: ${BASE}"
echo "Next: add discovery notes to ${BASE}/inputs/discovery_notes.md"
