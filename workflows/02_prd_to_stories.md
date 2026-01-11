# Workflow: PRD → Stories

## Purpose
Convert an approved PRD into implementation-ready stories.

## Inputs
- project_id
- prd_markdown (or history path)

## Steps (Orchestration)
1) Skill: skills/delivery/break_into_stories
2) Skill: skills/publishing/write_to_history
   - Write outputs to: history/projects/<project_id>/stories/stories.md
3) (Optional) Append key decisions to: history/projects/<project_id>/decisions.md

## Outputs (History)
- history/projects/<project_id>/stories/stories.md
- history/projects/<project_id>/decisions.md (optional)

## Rules
- Stories must be independently valuable
- If requirements are unclear: create open questions instead of guessing
