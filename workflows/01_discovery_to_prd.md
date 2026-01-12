# Workflow: Discovery → PRD

## Purpose
Turn messy discovery notes into a structured PRD artifact.

## Inputs
- project_id
- feature_name
- discovery_notes (text/markdown)

## Steps (Orchestration)
1) Skill: skills/publishing/write_to_history
   - Write inputs to: history/projects/<project_id>/inputs/discovery_notes.md
2) Skill: skills/discovery/summarize_discovery
3) Skill: skills/prd/generate_prd
4) (Optional) Append key decisions to: history/projects/<project_id>/decisions.md
5) Skill: skills/publishing/notify_slack
   - project_id: <project_id>
   - workflow_name: "discovery_to_prd"
   - status: SUCCESS
   - summary: "PRD generated for {feature_name}"
   - artifacts: [discovery_summary.md, prd.md]

## Outputs (History)
- history/projects/<project_id>/inputs/discovery_notes.md
- history/projects/<project_id>/artifacts/discovery_summary.md
- history/projects/<project_id>/prd/prd.md
- history/projects/<project_id>/decisions.md (optional)
- history/projects/<project_id>/artifacts/notifications.md (via notify_slack)

## Rules
- Use simple English
- If unclear: record assumptions + open questions (don’t guess)
