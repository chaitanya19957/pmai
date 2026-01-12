# PMAI — Personal Product Management AI (Claude Code)

PMAI is a **Personal Product Management Operating System** that turns PM work into reusable infrastructure.

Instead of ad-hoc prompts, this repo encodes:
- **How product work is done**
- **What gets produced**
- **What decisions were made**
- **How tools get invoked**

This is a **Claude Code–first PM agent**, designed to move from reactive chat → structured execution → tool-driven automation.

---

## Mental Model

This system follows four layers:

1. **Skills** — how work is executed
2. **Context** — standards, voice, and templates
3. **History** — durable memory of decisions and outputs
4. **Automation / Tools** — integrations and triggers

Everything is versioned, inspectable, and repeatable.

---

## Repository Structure

### `context/` — How the PM thinks and writes
Persistent standards that shape every output.

context/
├── preferences/
│ └── voice.md # Writing tone, verbosity, style
├── standards/
│ └── writing.md # Formatting rules, conventions
└── templates/
├── prd.template.md # Canonical PRD structure
└── story.template.md # Canonical user story structure

yaml
Copy code

**Rule:** Context never contains project-specific data.

---

### `skills/` — Atomic execution units
Skills are **single-purpose, composable instructions** used by workflows.

skills/
├── discovery/
│ └── summarize_discovery.md
├── prd/
│ └── generate_prd.md
├── delivery/
│ └── break_into_stories.md
├── validation/
│ └── validate_prd_readiness.md
└── publishing/
└── write_to_history.md

yaml
Copy code

**Rule:**  
- Skills do not know about tools  
- Skills do not manage sequencing  
- Skills produce deterministic outputs  

---

### `workflows/` — End-to-end product flows
Workflows define **when** and **in what order** skills are executed.

workflows/
├── _shared/
│ └── workflow_contract.md # Input/output expectations
└── (future workflows)

yaml
Copy code

Examples of workflows:
- Discovery → PRD
- PRD → Validation → Stories
- Intake → PRD → Jira publish → Slack notify

---

### `history/` — System memory (the most important folder)
Everything the system learns is stored here.

history/
├── decisions/ # Cross-project architectural or product decisions
├── learnings/ # Retrospective insights
├── patterns/ # Reusable heuristics discovered over time
└── projects/
├── calorie-tracker/
│ ├── inputs/ # Intake requests, discovery notes
│ ├── prd/ # Generated PRDs
│ ├── stories/ # Story breakdowns
│ ├── artifacts/ # Readiness checks, summaries
│ └── decisions.md # Project-specific decisions
├── demo-intake-form/
└── demo-intake-form-run2/

yaml
Copy code

**Rule:**  
History is append-only.  
This is how the PM agent improves over time.

---

### `tools/` — External system contracts
Tool definitions describe **how the PM agent talks to systems**.

tools/
├── _shared/
│ ├── canonical_models.md # Common data shapes
│ └── tool_contract.template.md # Standard tool interface
├── jira/
│ └── tool.md # Jira create/update contract
└── slack/
└── tool.md # Slack notification contract

yaml
Copy code

**Rule:**  
Tools define **capabilities**, not execution logic.

---

### `automations/` — Triggers and runners
This layer connects the system to the outside world.

automations/
├── scripts/ # Runners (CLI, cron, CI, etc.)
└── triggers/ # Event definitions (future: webhooks, schedules)

yaml
Copy code

Today: manual execution via Claude Code  
Next: event-driven execution (Jira, Slack, GitHub, Calendar)

---

## How PMAI Is Used (Today)

1. Create a project intake under:
history/projects/<project>/inputs/

markdown
Copy code

2. Run workflows manually in Claude Code:
- Summarize discovery
- Generate PRD
- Validate readiness
- Break into stories

3. Outputs are written to:
history/projects/<project>/

yaml
Copy code

4. Decisions and learnings are committed to Git.

---

## Design Principles

- **Systems > prompts**
- **Templates > free-form writing**
- **Workflows > manual sequencing**
- **History > memory in chat**
- **Claude Code is the executor**

---

## Roadmap

- [ ] Formalize core workflows
- [ ] Jira tool execution
- [ ] Slack notifications
- [ ] Intake via form / webhook
- [ ] Weekly retros auto-capture
- [ ] Pattern extraction across projects

---

## Status

✅ Folder structure stabilized  
✅ Intake flows tested  
🔄 Tool integration in progress  

This repo is the foundation for a persistent PM agent.
