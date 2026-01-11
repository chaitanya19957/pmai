# Skill: break_into_stories

## Purpose
Convert an approved PRD into implementation-ready stories.

## Inputs
- project_id
- prd_markdown

## Reads
- context/templates/story.template.md
- context/standards/writing.md
- context/preferences/voice.md

## Steps
1) Identify epics / themes
2) Break into stories that are independently valuable
3) Add acceptance criteria and dependencies
4) Add analytics events/properties where applicable

## Outputs (History)
- history/projects/<project_id>/stories/stories.md
