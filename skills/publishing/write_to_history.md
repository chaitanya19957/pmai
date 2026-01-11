# Skill: write_to_history

## Purpose
Write a generated artifact to the correct history location in a predictable structure.

## Inputs
- project_id
- artifact_type (inputs|artifacts|prd|stories|releases)
- filename
- content (markdown/text)
- (optional) metadata (source, timestamps, tool links)

## Reads
- None (this is a pure write utility)

## Steps
1) Ensure folder exists under history/projects/<project_id>/<artifact_type>/
2) Write content to history/projects/<project_id>/<artifact_type>/<filename>
3) If metadata is provided, append to history/projects/<project_id>/decisions.md or a metadata file (optional)

## Outputs (History)
- history/projects/<project_id>/<artifact_type>/<filename>
