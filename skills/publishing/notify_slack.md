# Skill: notify_slack

## Purpose
Send a notification to Slack about workflow status or project updates.

## Inputs
- project_id
- workflow_name
- status (SUCCESS | FAILURE | IN_PROGRESS)
- summary (brief description of what happened)
- artifacts (optional, list of artifact paths created)

## Reads
- context/preferences/voice.md (for tone)

## Tools (MCP)
- slack.post_message(channel, text)

## Steps
1) Format message using project_id, workflow_name, status, summary
2) If artifacts provided, append artifact list to message
3) Invoke slack.post_message() via MCP with formatted text
4) Capture response (message timestamp + link)
5) Write notification record to history

## Outputs (History)
- history/projects/<project_id>/artifacts/notifications.md (append log entry)

## Message Format
```
*[PMAI]* {STATUS} — *{project_id}* — `{workflow_name}`
*Summary:* {summary}
*Artifacts:* {artifact_list}
```
