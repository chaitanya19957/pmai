# PRD: Intake Form Missing (Run 2)

## Problem
Teams lack a consistent way to capture requirements. Information is scattered across Slack, docs, and meeting notes, leading to:
- Missing context when work begins
- Unclear ownership of requirements
- Vague or unmeasurable success criteria

## Users
- **Primary:** Product managers, project leads, and team members who submit requirements
- **Secondary:** Engineering teams who consume requirements to build features

## Goals
- Provide a single intake form that produces structured, consistent output
- Ensure every submission includes: context, owner, and success metrics
- Reduce time spent chasing missing information after submission

## Non-goals
- Replacing project management tools (Jira, Linear, etc.)
- Automating requirement prioritization
- Building a full requirements management system

## Requirements
| # | Requirement | Priority |
|---|-------------|----------|
| 1 | Single-page intake form accessible via web | Must-have |
| 2 | Required fields: problem statement, owner, success criteria | Must-have |
| 3 | Optional fields: target users, timeline, dependencies | Should-have |
| 4 | Structured output in markdown format | Must-have |
| 5 | Confirmation sent to submitter on successful submission | Should-have |

## UX Notes
- Keep the form simple; aim for < 5 minutes to complete
- Use progressive disclosure for optional fields
- Provide inline guidance/examples for each field
- Mobile-friendly design not required in V1

## Metrics / Success Criteria
| Metric | Baseline | Target |
|--------|----------|--------|
| % submissions with complete required fields | Unknown (no current process) | 95% |
| Time to gather missing info post-submission | Unknown | Reduce by 50% |
| User adoption (submissions/week) | 0 | TBD based on team size |

## Risks / Open Questions

### Risks
- **Adoption:** Users may continue using Slack/docs out of habit
- **Scope creep:** Requests to add more fields or integrations in V1

### Open Questions
| Question | Suggested Owner | Status |
|----------|-----------------|--------|
| Who are the primary users filling out the form? | Product Lead | Open |
| What systems should the form integrate with? | Engineering Lead | Open |
| What fields are mandatory vs optional? | Product Lead | Open |
| What is the expected volume of submissions? | Product Lead | Open |
| Should submissions trigger notifications or workflows? | Engineering Lead | Open |

### Assumptions
- No formal intake process exists today
- Web-based form is the preferred solution
- Markdown is an acceptable output format for downstream consumers

## Rollout Plan
1. **V1:** Internal pilot with one team (2 weeks)
2. **V2:** Incorporate feedback, expand to additional teams
3. **V3:** Add integrations based on demand (Slack notifications, Jira sync)
