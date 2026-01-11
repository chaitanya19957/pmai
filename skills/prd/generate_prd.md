# Skill: generate_prd

## Purpose
Generate a PRD artifact from discovery insights using the PRD template.

## Inputs
- project_id
- feature_name
- discovery_summary (structured or markdown)

## Reads
- context/templates/prd.template.md
- context/standards/writing.md
- context/preferences/voice.md

## Steps
1) Load PRD template
2) Populate sections using discovery_summary
3) Make assumptions explicit
4) List open questions with suggested owners (if known)
5) Ensure metrics are measurable where possible

## Outputs (History)
- history/projects/<project_id>/prd/prd.md
