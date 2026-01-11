# Tool: Jira

## Purpose
Create/update Epics and Stories from canonical models.

## Auth (env vars)
- JIRA_BASE_URL
- JIRA_EMAIL
- JIRA_API_TOKEN
- JIRA_PROJECT_KEY

## Capabilities
- create_epic(canonical_epic) -> {key, url}
- create_story(canonical_story) -> {key, url}
- update_issue(key, patch) -> {key, url}
- search(jql) -> [{key, url}]

## Inputs
- Canonical Story
- (Optional) Canonical Epic

## Outputs
- Jira issue key + URL

## Idempotency
- Use deterministic externalId label or a stored mapping in history/projects/<project_id>/stories/story_map.json

## Failure modes
- Auth failure -> stop, report required env vars
- Validation errors -> write to history as issues to resolve
