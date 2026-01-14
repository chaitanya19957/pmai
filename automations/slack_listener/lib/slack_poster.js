/**
 * Slack Poster
 *
 * Utilities for posting messages to Slack threads.
 * Uses Slack Web API as the primary method.
 */

/**
 * Post a message to a Slack thread
 *
 * @param {WebClient} slack - Slack Web API client
 * @param {string} channel - Channel ID
 * @param {string} threadTs - Thread timestamp to reply to
 * @param {string} text - Message text (supports Slack mrkdwn)
 * @returns {Promise<object>} - Slack API response
 */
async function postToThread(slack, channel, threadTs, text) {
  try {
    const result = await slack.chat.postMessage({
      channel,
      thread_ts: threadTs,
      text,
      unfurl_links: false,
      unfurl_media: false
    });

    console.log(`Posted to thread ${threadTs}: ${text.slice(0, 50)}...`);
    return result;

  } catch (err) {
    console.error('Failed to post to Slack:', err.message);
    throw err;
  }
}

/**
 * Format a workflow status message
 */
function formatStatusMessage({ status, workflowName, summary, artifacts, runId, nextCommand }) {
  const statusEmoji = status === 'SUCCESS' ? '✅' : '❌';

  const artifactList = artifacts && artifacts.length > 0
    ? artifacts.map(a => `  • \`${a}\``).join('\n')
    : '  (none)';

  let message = `${statusEmoji} *${status}* — \`${workflowName}\`\n\n`;

  if (summary) {
    message += `*Summary:*\n${summary}\n\n`;
  }

  message += `*Artifacts:*\n${artifactList}\n\n`;
  message += `*Run ID:* \`${runId}\``;

  if (nextCommand) {
    message += `\n*Next:* \`pmai run ${nextCommand}\``;
  }

  return message;
}

/**
 * Format an error message
 */
function formatErrorMessage({ workflowName, error }) {
  return `❌ *FAILED* — \`${workflowName}\`\n\n` +
    `*Error:* ${error}\n\n` +
    `Check logs for details.`;
}

/**
 * Format a "running" acknowledgment message
 */
function formatRunningMessage(workflowName) {
  return `⏳ Running \`${workflowName}\`... I'll post results here.`;
}

module.exports = {
  postToThread,
  formatStatusMessage,
  formatErrorMessage,
  formatRunningMessage
};
