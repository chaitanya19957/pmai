# Triggers

Event listeners that invoke PMAI workflows in response to external events.

## Rules
- Triggers listen for external events (Slack, webhooks, cron)
- Triggers invoke workflows only (never skills directly)
- Triggers normalize event payloads into workflow inputs

## Structure

```
triggers/
├── slack/              # Slack Events API listener
│   ├── index.js        # Express server
│   ├── lib/
│   │   ├── workflow_runner.js
│   │   └── slack_poster.js
│   ├── package.json
│   └── SETUP.md
└── README.md
```

## Slack Trigger

The Slack trigger watches for `pmai run <workflow>` commands and executes workflows.

### Command Format
```
pmai run <workflow_name> [--arg=value ...]
```

### Examples
```
pmai run discovery_to_prd --project_id=my-feature --feature_name="User Auth"
pmai run prd_to_stories --project_id=my-feature
```

### Setup

1. Install dependencies:
   ```bash
   cd triggers/slack
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   SLACK_BOT_TOKEN=xoxb-...
   SLACK_SIGNING_SECRET=...
   PORT=3000
   ```

3. Start the listener:
   ```bash
   npm start
   ```

4. Expose via ngrok for Slack Events API:
   ```bash
   ngrok http 3000
   ```

5. Configure Slack App Event Subscriptions:
   - URL: `https://<ngrok-url>/slack/events`
   - Subscribe to: `message.channels`, `message.groups`, `message.im`

### Endpoints
- `POST /slack/events` - Slack Events API
- `GET /health` - Health check (lists available workflows)

## Workflow Discovery

Workflows are auto-discovered from `workflows/*.md`:
- Files must match pattern: `NN_workflow_name.md`
- The workflow name is extracted (e.g., `01_discovery_to_prd.md` → `discovery_to_prd`)
- Files starting with `_` are ignored

## History Output

Each workflow run creates artifacts in:
```
history/projects/<project_id>/
├── inputs/
│   ├── run_metadata.json                    # Run context
│   └── claude_prompt_<feature>_<time>.md    # Prompt sent to Claude
├── artifacts/
│   ├── discovery_summary.md                 # Intermediate artifacts
│   └── claude_output.md                     # Claude response
├── prd/
│   └── prd.md                               # Generated PRD
└── stories/
    └── stories.md                           # Generated stories
```
