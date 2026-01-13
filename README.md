# PMAI — Personal Product Management AI (Claude Code)

PMAI is a **Personal Product Management Operating System** that turns PM work into reusable infrastructure.

Instead of ad-hoc prompts, this repo encodes:
- **How product work is done**
- **What gets produced**
- **What decisions were made**
- **How external systems are invoked (via MCP)**

This is a **Claude Code–first PM agent**, designed to move from reactive chat → structured execution → MCP-driven automation.

---

## Mental Model

This system follows five components with clear responsibilities:

| Component | Role | Key Rule |
|-----------|------|----------|
| **Context** | Constrains | Always loaded, never executed |
| **Workflows** | Orchestrate | Define order + gates, never do work |
| **Skills** | Execute | Atomic capabilities, invoke MCP directly |
| **History** | Remember | Append-only system memory |
| **Automations** | Trigger | Decide *when*, not *how* |

**Claude Code is the executor** — it loads context, runs workflows, executes skills, and invokes MCP servers.

### Dependency Rules

```
Automations → Workflows → Skills → MCP → External Systems
                ↓           ↓
              Context    History
```

- **Workflows** MAY call Skills
- **Skills** MAY read Context
- **Skills** MAY invoke MCP servers (Slack, Jira, etc.)
- **Skills** MUST write outputs to History
- **Workflows** MUST NOT call MCP directly
- **Automations** MUST NOT call Skills or MCP directly (only Workflows)

Everything is versioned, inspectable, and repeatable.

---

## Why MCP-First (No Tools Layer)

This repo deliberately omits a `tools/` abstraction layer:

1. **Fewer abstractions** — MCP servers already define their own schemas and capabilities
2. **Less coupling** — Skills call MCP directly; no intermediate contract to maintain
3. **Faster iteration** — Demo and prototype without extra indirection
4. **Clear ownership** — `.mcp.json` is the single source of truth for integrations

**When to reintroduce a tools layer:**
- When multiple skills share complex tool invocation logic
- When you need to mock external systems for testing
- When contracts need versioning independent of MCP servers

Until then: Skills → MCP → External Systems.

---

## Repository Structure

### `context/` — How the PM thinks and writes
Persistent standards that shape every output.

```
context/
├── preferences/
│   └── voice.md              # Writing tone, verbosity, style
├── standards/
│   ├── writing.md            # Formatting rules, conventions
│   └── architecture.md       # System boundaries and rules
└── templates/
    ├── prd.template.md       # Canonical PRD structure
    └── story.template.md     # Canonical user story structure
```

**Rule:** Context never contains project-specific data.

---

### `skills/` — Atomic execution units
Skills are **single-purpose, composable instructions** used by workflows.

```
skills/
├── discovery/
│   └── summarize_discovery.md
├── prd/
│   └── generate_prd.md
├── delivery/
│   └── break_into_stories.md
├── validation/
│   └── validate_prd_readiness.md
└── publishing/
    ├── notify_slack.md
    └── write_to_history.md
```

**Rule:**
- Skills MAY invoke MCP servers (e.g., create Jira issue, post to Slack)
- Skills do not manage sequencing (workflows do)
- Skills MUST write outputs to History
- One skill = one job

---

### `workflows/` — End-to-end product flows
Workflows orchestrate skills — they define **order, branching, and gates**, but never do the work themselves.

```
workflows/
├── _shared/
│   └── workflow_contract.md  # Input/output expectations
├── 01_discovery_to_prd.md    # Discovery notes → PRD
└── 02_prd_to_stories.md      # PRD → Validated stories
```

**Rule:**
- Workflows call Skills (never MCP directly)
- Define the process: order, branching, retries, gates
- Own sequencing; delegate execution to skills

Examples of workflows:
- Discovery → PRD
- PRD → Validation → Stories
- Intake → PRD → Publish to Jira → Notify via Slack

---

### `history/` — System memory (the most important folder)
Everything the system learns is stored here.

```
history/
├── decisions/                # Cross-project architectural or product decisions
├── learnings/                # Retrospective insights
├── patterns/                 # Reusable heuristics discovered over time
└── projects/
    ├── calorie-tracker/
    │   ├── inputs/           # Intake requests, discovery notes
    │   ├── prd/              # Generated PRDs
    │   ├── stories/          # Story breakdowns
    │   ├── artifacts/        # Readiness checks, summaries
    │   └── decisions.md      # Project-specific decisions
    ├── demo-intake-form/
    └── demo-intake-form-run2/
```

**Rule:**
History is append-only.
This is how the PM agent improves over time.

---

### `automations/` — Triggers and runners
This layer connects the system to the outside world. Automations decide **when** work happens, not **how**.

```
automations/
├── scripts/
│   └── validate_architecture.sh  # Guardrail checks
└── triggers/                     # Event definitions (future: webhooks, schedules)
```

**Rule:**
- Automations trigger **Workflows only** — never Skills or MCP directly
- No business logic — just event routing
- Normalize external events into workflow inputs

Today: manual execution via Claude Code
Next: event-driven execution (Jira, Slack, GitHub, Calendar)

---

## MCP Configuration

MCP server configuration lives at the repo root:

| File | Purpose | Tracked |
|------|---------|---------|
| `.mcp.json` | MCP server definitions (command, args, env mappings) | Yes |
| `.env` | Actual secrets (tokens, URLs) | No (gitignored) |
| `.env.example` | Template showing required variables | Yes |

To set up integrations:
1. Copy `.env.example` to `.env`
2. Fill in your credentials
3. MCP servers will load env vars from `.env` at runtime

---

## Architecture Guardrails

Run the architecture validation script to check for violations:

```bash
./automations/scripts/validate_architecture.sh
```

This script fails if:
- `workflows/` contains direct MCP references
- A `tools/` directory exists (premature abstraction)

---

## How PMAI Is Used (Today)

1. Create a project intake under:
   ```
   history/projects/<project>/inputs/
   ```

2. Run workflows manually in Claude Code:
   - Summarize discovery
   - Generate PRD
   - Validate readiness
   - Break into stories

3. Outputs are written to:
   ```
   history/projects/<project>/
   ```

4. Decisions and learnings are committed to Git.

---

## Design Principles

- **Systems > prompts**
- **Templates > free-form writing**
- **Workflows > manual sequencing**
- **History > memory in chat**
- **MCP > custom integrations**
- **Claude Code is the executor**

---

## Roadmap

- [ ] Formalize core workflows
- [ ] Jira MCP execution
- [ ] Slack MCP notifications
- [ ] Intake via form / webhook
- [ ] Weekly retros auto-capture
- [ ] Pattern extraction across projects

---

## Status

✅ Folder structure stabilized
✅ MCP configuration added
🔄 MCP server execution in progress

This repo is the foundation for a persistent PM agent.
