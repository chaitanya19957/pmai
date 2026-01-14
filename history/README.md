# History (Append-only Memory)

History is the long-term memory store. Do not overwrite; add new artifacts.

## Structure
history/projects/<project_id>/
  inputs/
  artifacts/
  prd/
  stories/
  releases/
  decisions.md

history/decisions/   -> global decisions (architecture, conventions)
history/patterns/    -> reusable patterns discovered over time

## Naming
- Use ISO dates when helpful: YYYY-MM-DD
- Prefer stable project ids: short, kebab-case (e.g., vin-plus-nmvtis)

## Non-negotiable
- Every workflow run writes outputs to history/projects/<project_id>/...
- Decisions must include rationale and date.
