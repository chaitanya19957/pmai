# Stories: Intake Form

**Source PRD:** `prd/prd.md`
**Generated:** 2026-01-11
**Skill:** `break_into_stories`

---

## Epics

| Epic | Description | Stories |
|------|-------------|---------|
| E1: Form Infrastructure | Web-based intake form setup | S1 |
| E2: Required Fields | Core fields that must be completed | S2, S3, S4 |
| E3: Optional Fields | Additional context fields | S5 |
| E4: Output Generation | Structured markdown output | S6 |
| E5: Notifications | Submitter confirmation | S7 |

---

## S1: Create Single-Page Intake Form

User story:
As a **product manager**, I want **a single-page web form for intake requests** so that **I have one consistent place to submit requirements**.

### Acceptance Criteria
- [ ] Form is accessible via a web URL
- [ ] Form loads on a single page (no multi-step wizard)
- [ ] Form displays inline guidance text for context
- [ ] Form can be completed in under 5 minutes
- [ ] Form works on desktop browsers (mobile not required for V1)

### Dependencies
- None (foundational story)

### Analytics
- Events: `intake_form_viewed`, `intake_form_started`
- Properties: `user_id`, `referrer`, `timestamp`

### Priority
Must-have

---

## S2: Add Required Field - Problem Statement

User story:
As a **product manager**, I want **a required problem statement field** so that **every submission clearly articulates what problem needs solving**.

### Acceptance Criteria
- [ ] Problem statement is a required text field
- [ ] Field has inline guidance: "Describe the problem you're trying to solve"
- [ ] Field has example placeholder text
- [ ] Form cannot be submitted without this field
- [ ] Minimum character limit enforced (e.g., 50 chars)

### Dependencies
- S1: Form infrastructure must exist

### Analytics
- Events: `field_completed`
- Properties: `field_name: problem_statement`, `char_count`

### Priority
Must-have

---

## S3: Add Required Field - Owner

User story:
As a **team member**, I want **a required owner field** so that **there is clear accountability for each request**.

### Acceptance Criteria
- [ ] Owner is a required field
- [ ] Field accepts name or email
- [ ] Field has inline guidance: "Who is responsible for this request?"
- [ ] Form cannot be submitted without this field

### Dependencies
- S1: Form infrastructure must exist

### Analytics
- Events: `field_completed`
- Properties: `field_name: owner`

### Priority
Must-have

---

## S4: Add Required Field - Success Criteria

User story:
As an **engineering team member**, I want **required success criteria on every submission** so that **I know how to measure when the work is done**.

### Acceptance Criteria
- [ ] Success criteria is a required text field
- [ ] Field has inline guidance: "How will we know this is successful?"
- [ ] Field encourages measurable criteria (example text provided)
- [ ] Form cannot be submitted without this field

### Dependencies
- S1: Form infrastructure must exist

### Analytics
- Events: `field_completed`
- Properties: `field_name: success_criteria`, `char_count`

### Priority
Must-have

---

## S5: Add Optional Fields with Progressive Disclosure

User story:
As a **product manager**, I want **optional fields for additional context** so that **I can provide more detail when relevant without being forced to**.

### Acceptance Criteria
- [ ] Optional fields include: target users, timeline, dependencies
- [ ] Optional fields are collapsed by default (progressive disclosure)
- [ ] User can expand to reveal optional fields
- [ ] Form can be submitted with optional fields empty
- [ ] Each optional field has inline guidance

### Dependencies
- S1: Form infrastructure must exist
- S2-S4: Required fields should be implemented first

### Analytics
- Events: `optional_fields_expanded`, `field_completed`
- Properties: `field_name`, `fields_completed_count`

### Priority
Should-have

---

## S6: Generate Structured Markdown Output

User story:
As an **engineering team member**, I want **submissions output as structured markdown** so that **I can easily consume and reference requirements in my workflow**.

### Acceptance Criteria
- [ ] On submit, form generates markdown document
- [ ] Markdown includes all submitted fields with clear headings
- [ ] Markdown follows consistent template structure
- [ ] Output is stored/accessible after submission
- [ ] Empty optional fields are omitted from output

### Dependencies
- S1: Form infrastructure
- S2-S4: Required fields (minimum viable output)

### Analytics
- Events: `intake_form_submitted`, `markdown_generated`
- Properties: `submission_id`, `fields_completed`, `timestamp`

### Priority
Must-have

---

## S7: Send Confirmation to Submitter

User story:
As a **product manager**, I want **a confirmation after submitting** so that **I know my request was received successfully**.

### Acceptance Criteria
- [ ] Confirmation message displayed on successful submission
- [ ] Confirmation includes summary of what was submitted
- [ ] Confirmation includes submission ID or reference
- [ ] (Optional) Email confirmation sent to submitter

### Dependencies
- S6: Markdown output must be generated first

### Analytics
- Events: `confirmation_displayed`, `confirmation_email_sent`
- Properties: `submission_id`, `delivery_method`

### Priority
Should-have

---

## Open Questions (from PRD)

These questions remain open and may affect story implementation:

| Question | Impact |
|----------|--------|
| Who are the primary users filling out the form? | May affect UX copy and field design |
| What systems should the form integrate with? | May spawn integration stories |
| What fields are mandatory vs optional? | Assumed based on PRD; confirm with Product Lead |
| What is the expected volume of submissions? | May affect infrastructure choices |
| Should submissions trigger notifications or workflows? | May expand S7 scope |

---

## Summary

| Priority | Count | Stories |
|----------|-------|---------|
| Must-have | 5 | S1, S2, S3, S4, S6 |
| Should-have | 2 | S5, S7 |
| **Total** | **7** | |
