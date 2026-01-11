# PMAI Operating Rules (Non-negotiable)

## Mental model
- Context constrains (always loaded, never executed)
- Workflows orchestrate (order + gates)
- Skills execute (atomic capabilities)
- Tools integrate (external I/O)
- History remembers (append-only)
- Automation triggers workflows (never skills directly)

## Dependency rules
- Workflows MAY call Skills
- Skills MAY read Context
- Skills MAY use Tools
- Skills MUST write outputs to History
- Workflows MAY log decisions to History
- Workflows MUST NOT call Tools directly
- Automation MUST NOT call Skills/Tools directly (only Workflows)

## Design smell checks
- If a workflow mentions a specific tool (Jira/Slack/etc), abstraction is broken.
- If a workflow mentions a specific template path, abstraction is broken.
- If a skill does more than one job, split it.
- If outputs are not written to history, the system cannot learn.
