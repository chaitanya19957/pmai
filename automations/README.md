# Automations

Scheduled or rule-based orchestration that trigger workflows.

## Rules
- Automations trigger workflows only (never skills directly)
- Automations do not call MCP tools directly
- Automations normalize event payloads into workflow inputs

## Structure

```
automations/
├── scripts/            # Utility scripts
└── README.md
```

## Difference: Automations vs Triggers

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Triggers** | Listen for external events | Slack messages, webhooks, cron |
| **Automations** | Schedule and orchestrate | Daily reports, batch processing |

See `triggers/` for event-driven automation (Slack listener, etc.)
