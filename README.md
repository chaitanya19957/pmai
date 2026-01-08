# PMAI — Personal Product Management AI (Claude Code)

PMAI is a **Personal AI Infrastructure for Product Managers**, built using **Claude Code**.

It encodes how I work across the **entire Product SDLC** using **Context, Skills, Workflows, History, and Automation**.

This is **not a chatbot**.  
This is an **operating system for PM work**.

---

## Core Mental Model

Context → How I work
Skills → What I can do
Workflows → How work is orchestrated
History → What the system remembers
Automation → When the system acts


> I don’t prompt Claude.  
> I run workflows.  
> Workflows call skills.  
> Skills follow context.  
> Outputs go into history.

---

## Why PMAI Exists

Product work is fragmented across:
- Documents
- Tickets
- Meetings
- Slack messages
- Releases
- Post-launch learnings

PMAI turns this fragmented work into a **repeatable, composable system** where:
- Outputs are consistent
- Decisions are remembered
- Processes are reusable
- Learning compounds over time

---

## Repository Structure

pmai/
├── context/ # How I work
│ ├── templates/ # Output structure (PRDs, stories, release notes)
│ └── standards.md # Writing standards, preferences, voice
│
├── skills/ # Atomic capabilities (verbs)
│ ├── summarize_discovery.md
│ ├── generate_prd.md
│ └── break_into_stories.md
│
├── workflows/ # Orchestration (process)
│ ├── 01_discovery_to_prd.md
│ └── 02_prd_to_stories.md
│
├── history/ # Long-term memory
│ ├── decisions/
│ ├── learnings/
│ └── projects/
│
├── automations/ # Hooks & triggers (optional / later)
│ ├── hooks/
│ └── scripts/
│
└── demos/ # Repeatable demo inputs & outputs


---

## Context — How I Work

Context defines **constraints**, not actions.

It includes:
- Templates (PRD, stories, release notes)
- Writing standards
- Preferences
- Voice

Context is:
- Persistent
- Always loaded
- Never executed

Example:
> “Whenever a PRD is created, it must follow this structure.”

Templates **belong in context**, not skills.

---

## Skills — What I Can Do

Skills are **atomic, reusable capabilities**.

Examples:
- Summarize discovery notes
- Generate a PRD
- Break a PRD into stories
- Draft release notes

Rules:
- One responsibility per skill
- No orchestration logic
- No automation triggers
- Reusable across workflows

Skills answer:
> “What can the system do?”

---

## Workflows — How Work Is Done

Workflows define **process and order**.

Example: **Discovery → PRD**

Summarize discovery notes

Identify users, problems, and goals

Generate PRD using template

Save artifact

Log decisions


Workflows:
- Orchestrate multiple skills
- Reference context (templates, standards)
- Write outputs to history

Workflows answer:
> “In what order should skills be run to complete a task?”

---

## History — What the System Remembers

History is **long-term memory** that compounds value.

It stores:
- Decisions and rationale
- Patterns
- Learnings
- Project artifacts

History is:
- Append-only
- Never overwritten
- Used to improve future execution

---

## Automation — When the System Acts (Optional)

Automation answers:
> “When should the system act without me asking?”

Examples:
- Calendar event → run discovery workflow
- PR merged → run release workflow
- Jira status change → generate update

Important:
- Automation triggers **workflows**
- Automation does **not** trigger skills directly

---

## Example: Discovery → PRD Flow

Interview Notes
↓
Skill: summarize_discovery
↓
Structured Insights
↓
Skill: generate_prd
↓ (uses PRD template)
PRD.md

csharp
Copy code

Wrapped by:
Workflow: Discovery → PRD

css
Copy code

Saved to:
history/projects/<feature>/prd.md


---

## Design Rules (Non-Negotiable)

- Templates belong in **Context**
- Skills must be **atomic**
- Workflows must be **explicit**
- History must be **persistent**
- Automation must be **predictable**

---

## Guiding Principle

**Structure beats prompts.  
Systems beat memory.  
Workflows beat heroics.**

This repository is designed to scale **how I think**, not just how fast I type.