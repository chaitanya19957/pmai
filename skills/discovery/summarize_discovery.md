# Skill: summarize_discovery

## Purpose
Turn raw discovery notes into structured insights that can feed PRD generation.

## Inputs
- discovery_notes (text/markdown)
- project_id

## Reads
- context/standards/writing.md
- context/preferences/voice.md

## Steps
1) Extract: key user problems (top 3–5)
2) Identify: target users/personas (explicitly stated vs inferred)
3) Extract: goals + desired outcomes
4) Capture: risks, assumptions, and open questions
5) Produce a short summary + structured bullets

## Outputs (History)
- history/projects/<project_id>/artifacts/discovery_summary.md
