# PMAI Operating Rules (Non-negotiable)

## Mental model
- Context constrains (always loaded, never executed)
- Workflows orchestrate (order + gates)
- Skills execute (atomic capabilities, invoke MCP)
- History remembers (append-only)
- Automation triggers workflows (never skills directly)

## Dependency flow
```
Automations → Workflows → Skills → MCP → External Systems
                ↓           ↓
              Context    History
```

## Dependency rules
- Workflows MAY call Skills
- Skills MAY read Context
- Skills MAY invoke MCP servers
- Skills MUST write outputs to History
- Workflows MAY log decisions to History
- Workflows MUST NOT call MCP directly
- Automation MUST NOT call Skills/MCP directly (only Workflows)

## MCP configuration
- MCP server config lives in `.mcp.json` (tracked)
- Secrets live in `.env` (gitignored)
- Skills reference MCP servers by name, not by implementation

## Design smell checks
- If a workflow mentions an MCP server (Jira/Slack/etc), abstraction is broken.
- If a workflow mentions a specific template path, abstraction is broken.
- If a skill does more than one job, split it.
- If outputs are not written to history, the system cannot learn.
- If a `tools/` directory exists, you have premature abstraction.
