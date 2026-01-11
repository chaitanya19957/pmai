# Stories: Intake Form Missing

## Epic: Standardized Intake Artifact

### Story 1: Intake template creation
As a PM, I want a structured intake template so that I can capture consistent discovery outputs.

Acceptance Criteria:
- [ ] Template includes problem/users/goals/risks/assumptions/questions
- [ ] Saved under history/projects/<project_id>/...

Dependencies:
- None

Analytics:
- Event: intake_created
- Properties: project_id

### Story 2: PRD generation from intake
As a PM, I want intake notes converted into a PRD so that delivery teams can execute with clarity.

Acceptance Criteria:
- [ ] PRD generated follows the PRD template
- [ ] PRD stored in history/projects/<project_id>/prd/prd.md

Dependencies:
- Intake template

Analytics:
- Event: prd_generated
- Properties: project_id
