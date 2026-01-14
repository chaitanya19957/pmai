/**
 * PMAI Slack Listener
 *
 * Listens for Slack events and triggers workflows based on commands.
 * Command format: pmai run <workflow_name> [args]
 */

require('dotenv').config({ path: '../../.env' });

const express = require('express');
const crypto = require('crypto');
const { WebClient } = require('@slack/web-api');
const { discoverWorkflows, runWorkflow } = require('./lib/workflow_runner');
const { postToThread } = require('./lib/slack_poster');

const app = express();
const PORT = process.env.PORT || 3000;

// Slack client for posting messages
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Discover available workflows at startup
const WORKFLOWS = discoverWorkflows();
console.log('Discovered workflows:', Object.keys(WORKFLOWS));

/**
 * Verify Slack request signature
 */
function verifySlackSignature(req) {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) {
    console.warn('SLACK_SIGNING_SECRET not set, skipping verification');
    return true;
  }

  const timestamp = req.headers['x-slack-request-timestamp'];
  const signature = req.headers['x-slack-signature'];

  // Check timestamp to prevent replay attacks (5 min window)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) {
    return false;
  }

  const sigBaseString = `v0:${timestamp}:${req.rawBody}`;
  const mySignature = 'v0=' + crypto
    .createHmac('sha256', signingSecret)
    .update(sigBaseString)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(mySignature),
    Buffer.from(signature)
  );
}

/**
 * Parse PMAI command from message text
 * Format: pmai run <workflow_name> [args]
 */
function parsePmaiCommand(text) {
  const match = text.match(/^pmai\s+run\s+(\S+)(.*)$/i);
  if (!match) return null;

  return {
    workflowName: match[1],
    rawArgs: match[2].trim()
  };
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    workflows: Object.keys(WORKFLOWS),
    timestamp: new Date().toISOString()
  });
});

/**
 * Slack Events API endpoint
 */
app.post('/slack/events', async (req, res) => {
  // Handle URL verification challenge
  if (req.body.type === 'url_verification') {
    console.log('Received URL verification challenge');
    return res.json({ challenge: req.body.challenge });
  }

  // Verify signature
  if (!verifySlackSignature(req)) {
    console.error('Invalid Slack signature');
    return res.status(401).send('Invalid signature');
  }

  // Acknowledge immediately (Slack requires response within 3s)
  res.status(200).send();

  const event = req.body.event;
  if (!event || event.type !== 'message') return;

  // Ignore bot messages to prevent loops
  if (event.bot_id || event.subtype === 'bot_message') {
    return;
  }

  // Parse command
  const command = parsePmaiCommand(event.text || '');
  if (!command) return;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`[TRIGGER] Slack message received`);
  console.log(`[TRIGGER] Command: pmai run ${command.workflowName}`);

  const channel = event.channel;
  const threadTs = event.thread_ts || event.ts;
  const userId = event.user;

  // Check if workflow exists
  const workflow = WORKFLOWS[command.workflowName];
  if (!workflow) {
    await postToThread(slack, channel, threadTs,
      `Unknown workflow: \`${command.workflowName}\`\n` +
      `Available workflows: ${Object.keys(WORKFLOWS).map(w => `\`${w}\``).join(', ')}`
    );
    return;
  }

  // Post acknowledgment (skip if Slack posting fails - e.g., in local test mode)
  try {
    await postToThread(slack, channel, threadTs,
      `Running \`${command.workflowName}\`... I'll post results here.`
    );
  } catch (ackErr) {
    console.log('Could not post acknowledgment (local test mode?):', ackErr.message);
  }

  // Execute workflow
  try {
    const result = await runWorkflow({
      workflowName: command.workflowName,
      workflowPath: workflow.path,
      rawArgs: command.rawArgs,
      channel,
      threadTs,
      userId,
      slack
    });

    // Post results - minimal output
    const resultMsg = formatWorkflowResult(result, command);

    console.log('Result:', resultMsg);

    try {
      await postToThread(slack, channel, threadTs, resultMsg);
    } catch (postErr) {
      console.log('Could not post result to Slack:', postErr.message);
    }

  } catch (err) {
    console.error('Workflow execution failed:', err);
    const errorMsg = ` *FAILED* — \`${command.workflowName}\`\n\n` +
      `*Error:* ${err.message}\n\n` +
      `Check logs for details.`;

    console.log('Error result:', errorMsg);

    try {
      await postToThread(slack, channel, threadTs, errorMsg);
    } catch (postErr) {
      console.log('Could not post error to Slack:', postErr.message);
    }
  }
});

/**
 * Format workflow result for Slack - minimal output
 */
function formatWorkflowResult(result, command) {
  if (result.status !== 'SUCCESS') {
    return `:x: *${command.workflowName}* failed: ${result.summary}`;
  }

  // Get the main output based on workflow type
  const mainOutput = getMainOutput(command.workflowName, result.artifacts);
  const nextStep = getNextStep(command.workflowName, result.projectId);

  let msg = `:white_check_mark: *${command.workflowName}* done\n\n`;
  msg += `*Output:* \`${mainOutput}\`\n\n`;
  msg += `Review and update before proceeding.`;

  if (nextStep) {
    msg += `\n\n*Next:* \`${nextStep}\``;
  }

  return msg;
}

/**
 * Get the main output file for a workflow
 */
function getMainOutput(workflowName, artifacts) {
  const outputPatterns = {
    'discovery_to_prd': '/prd/',
    'prd_to_stories': '/stories/'
  };

  const pattern = outputPatterns[workflowName];
  if (pattern) {
    const match = artifacts.find(a => a.includes(pattern));
    if (match) return match;
  }

  return artifacts[0] || 'No output';
}

/**
 * Get next step command
 */
function getNextStep(workflowName, projectId) {
  const steps = {
    'discovery_to_prd': `pmai run prd_to_stories --project_id=${projectId}`,
    'prd_to_stories': null
  };
  return steps[workflowName];
}

app.listen(PORT, () => {
  console.log(`PMAI Slack Listener running on port ${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  POST /slack/events - Slack Events API`);
  console.log(`  GET  /health       - Health check`);
});
