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

This system follows six components with clear responsibilities:

| Component | Role | Key Rule |
|-----------|------|----------|
| **Context** | Constrains | Always loaded, never executed |
| **Workflows** | Orchestrate | Define order + gates, never do work |
| **Skills** | Execute | Atomic capabilities, invoke tools via MCP |
| **Tools** | Integrate | MCP contracts for external I/O |
| **History** | Remember | Append-only system memory |
| **Automations** | Trigger | Decide *when*, not *how* |

**Claude Code is the executor** — it loads context, runs workflows, executes skills, and invokes MCP tools.

### Dependency Rules

```
Automations → Workflows → Skills → Tools
                ↓           ↓
              Context    History
```

- **Workflows** MAY call Skills
- **Skills** MAY read Context
- **Skills** MAY invoke Tools (via MCP)
- **Skills** MUST write outputs to History
- **Workflows** MUST NOT call Tools directly
- **Automations** MUST NOT call Skills or Tools directly (only Workflows)

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


**Rule:**
- Skills MAY invoke tools via MCP (e.g., create Jira issue, post to Slack)
- Skills do not manage sequencing (workflows do)
- Skills MUST write outputs to History
- One skill = one job  

---

### `workflows/` — End-to-end product flows
Workflows orchestrate skills — they define **order, branching, and gates**, but never do the work themselves.

workflows/
├── _shared/
│ └── workflow_contract.md # Input/output expectations
├── 01_discovery_to_prd.md # Discovery notes → PRD
└── 02_prd_to_stories.md # PRD → Validated stories


**Rule:**
- Workflows call Skills (never Tools directly)
- Define the process: order, branching, retries, gates
- Own sequencing; delegate execution to skills

Examples of workflows:
- Discovery → PRD
- PRD → Validation → Stories
- Intake → PRD → Publish to Jira → Notify via Slack

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


**Rule:**  
History is append-only.  
This is how the PM agent improves over time.

---

### `tools/` — MCP contracts for external systems
Tool definitions describe **how to talk to Jira, Slack, etc.** via MCP.

tools/
├── _shared/
│ ├── canonical_models.md # Common data shapes
│ └── tool_contract.template.md # Standard tool interface
├── jira/
│ └── tool.md # Jira create/update contract
└── slack/
└── tool.md # Slack notification contract


**Rule:**
- Tools define **capabilities**, not execution logic
- No sequencing, no decisions — just contracts
- Skills invoke tools; workflows and automations do not

---

### `automations/` — Triggers and runners
This layer connects the system to the outside world. Automations decide **when** work happens, not **how**.

automations/
├── scripts/ # Runners (CLI, cron, CI, etc.)
└── triggers/ # Event definitions (future: webhooks, schedules)


**Rule:**
- Automations trigger **Workflows only** — never Skills or Tools directly
- No business logic — just event routing
- Normalize external events into workflow inputs

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
