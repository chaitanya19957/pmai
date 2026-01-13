# Architecture Boundaries

This document defines the non-negotiable boundaries of the PMAI system.

## Dependency Flow

```
Automations → Workflows → Skills → MCP → External Systems
                ↓           ↓
              Context    History
```

## Layer Responsibilities

| Layer | May Call | Must Not Call | Writes To |
|-------|----------|---------------|-----------|
| Automations | Workflows | Skills, MCP | — |
| Workflows | Skills | MCP | History (decisions only) |
| Skills | MCP, Context | — | History (outputs) |
| Context | — | — | — (read-only) |
| History | — | — | — (append-only) |

## MCP Configuration

- **Location:** `.mcp.json` at repo root (tracked in git)
- **Secrets:** `.env` at repo root (gitignored)
- **Template:** `.env.example` (tracked, no real values)

MCP config is wiring, not product logic. Skills reference MCP servers by name; the actual server definitions live in `.mcp.json`.

## Design Smells

These patterns indicate broken abstractions:

1. **Workflow mentions MCP server** — Workflows orchestrate skills, not integrations
2. **Workflow contains template path** — Use skill abstraction instead
3. **Skill does multiple jobs** — Split into atomic skills
4. **Output not written to History** — System cannot learn
5. **`tools/` directory exists** — Premature abstraction (use MCP directly)

## Why No Tools Layer

The `tools/` abstraction was removed to:

1. Reduce indirection (Skills → MCP is simpler than Skills → Tools → MCP)
2. Leverage MCP's built-in schemas (no need for duplicate contracts)
3. Speed up iteration (fewer files to maintain)

**Reintroduce tools/ when:**
- Multiple skills share complex invocation logic
- You need to mock external systems for testing
- Contracts require versioning independent of MCP servers
