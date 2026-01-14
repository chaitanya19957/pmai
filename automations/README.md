# Automations

Automations listen to external events and trigger workflows.

## Rules
- Automations trigger workflows only (never skills directly)
- Automations do not call MCP tools directly
- Automations normalize event payloads into workflow inputs

## Structure

```
automations/
├── triggers/           # Event listeners
│   └── slack/          # Slack Events API listener
│       ├── index.js
│       ├── lib/
│       │   ├── workflow_runner.js
│       │   └── slack_poster.js
│       └── package.json
├── scripts/            # Utility scripts
└── README.md
```

## Slack Trigger

See `triggers/slack/README.md` for setup and usage.

### Quick Start
```bash
cd automations/triggers/slack
npm install
npm start
```

### Command Format
```
pmai run <workflow_name> [--arg=value ...]
```

### Examples
```
pmai run discovery_to_prd --project_id=my-feature --feature_name="User Auth"
pmai run prd_to_stories --project_id=my-feature
```
