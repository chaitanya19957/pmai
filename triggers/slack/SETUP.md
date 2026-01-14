# PMAI Slack Listener Setup Guide

Get the Slack automation running locally in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- ngrok installed (`brew install ngrok` or https://ngrok.com/download)
- A Slack workspace where you can create apps
- Claude Code CLI installed (optional, for full workflow execution)

## Step 1: Create Slack App

1. Go to https://api.slack.com/apps
2. Click **Create New App** → **From scratch**
3. Name: `PMAI Bot` (or your preference)
4. Workspace: Select your workspace
5. Click **Create App**

## Step 2: Configure Bot Permissions

1. In the app settings, go to **OAuth & Permissions**
2. Under **Scopes** → **Bot Token Scopes**, add:
   - `chat:write` - Post messages
   - `channels:history` - Read channel messages
   - `groups:history` - Read private channel messages
   - `im:history` - Read DM messages
   - `users:read` - Read user info

3. Click **Install to Workspace** and authorize
4. Copy the **Bot User OAuth Token** (`xoxb-...`)

## Step 3: Get Signing Secret

1. Go to **Basic Information** in your app settings
2. Under **App Credentials**, copy the **Signing Secret**

## Step 4: Configure Environment

Create/update `.env` in the repo root:

```bash
# In repo root (pmai/)
cat >> .env << 'EOF'
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
PORT=3000
EOF
```

## Step 5: Install Dependencies

```bash
cd automations/slack_listener
npm install
```

## Step 6: Start the Listener

```bash
npm start
```

You should see:
```
Discovered workflows: [ 'discovery_to_prd', 'prd_to_stories' ]
PMAI Slack Listener running on port 3000
Endpoints:
  POST /slack/events - Slack Events API
  GET  /health       - Health check
```

## Step 7: Expose with ngrok

In a new terminal:

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

## Step 8: Configure Event Subscriptions

1. In Slack app settings, go to **Event Subscriptions**
2. Toggle **Enable Events** to ON
3. **Request URL**: `https://your-ngrok-url/slack/events`
   - Wait for the green checkmark (URL verification)
4. Under **Subscribe to bot events**, add:
   - `message.channels`
   - `message.groups`
   - `message.im`
5. Click **Save Changes**

## Step 9: Invite Bot to Channel

In Slack:
```
/invite @PMAI Bot
```

## Step 10: Test It!

In the channel, type:
```
pmai run discovery_to_prd --project_id=test-project --feature_name="Test Feature"
```

### Expected Response

1. **Immediate acknowledgment:**
   ```
   ⏳ Running `discovery_to_prd`... I'll post results here.
   ```

2. **Final result (after execution):**
   ```
   ✅ SUCCESS — `discovery_to_prd`

   Summary:
   Demo mode: Placeholder artifacts created (install Claude CLI for full execution)

   Artifacts:
     • history/projects/test-project/artifacts/discovery_summary.md
     • history/projects/test-project/prd/prd.md

   Run ID: discovery_to_prd-2025-01-13T12-00-00

   Next: `pmai run prd_to_stories`
   ```

### Expected Files

```
history/projects/test-project/
├── inputs/
│   ├── run_metadata.json
│   └── claude_prompt.md
├── artifacts/
│   └── discovery_summary.md
└── prd/
    └── prd.md
```

## Troubleshooting

### "Invalid signature" error

- Ensure `SLACK_SIGNING_SECRET` is correct (from Basic Information, not OAuth)
- Check that ngrok is running and URL is up to date
- Verify the Request URL in Event Subscriptions matches your ngrok URL

### Bot doesn't respond

- Check that the bot is invited to the channel (`/invite @PMAI Bot`)
- Verify Event Subscriptions are enabled and saved
- Check terminal for errors
- Ensure message format is exactly `pmai run <workflow>`

### "Unknown workflow" response

- Run `GET /health` to see discovered workflows
- Check that workflow files exist in `workflows/` with correct naming (e.g., `01_discovery_to_prd.md`)

### Thread replies not appearing

- Ensure `chat:write` scope is added
- Check that `SLACK_BOT_TOKEN` starts with `xoxb-`

### ngrok URL changed

- Update the Request URL in Slack Event Subscriptions
- Restart ngrok with a reserved subdomain (requires paid plan) to avoid this

## Full Workflow Execution

For actual workflow execution (not demo mode), install Claude Code CLI:

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

With Claude CLI installed, the listener will execute workflows using Claude and produce real artifacts.

## Architecture

```
Slack Message
    ↓
POST /slack/events
    ↓
Parse "pmai run <workflow>"
    ↓
Post "Running..." to thread
    ↓
workflow_runner.js
    ↓
Claude Code CLI (or demo mode)
    ↓
Write artifacts to history/
    ↓
Post results to thread
```
