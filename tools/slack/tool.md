# Tool: Slack

## Purpose
Post workflow updates and summaries to Slack channels.

## Auth (env vars)
- SLACK_BOT_TOKEN
- SLACK_DEFAULT_CHANNEL

## Capabilities
- post_message(channel, text) -> {ts, link}
- post_thread(channel, parent_ts, text) -> {ts, link}

## Inputs
- Text payloads (summaries, release notes, status updates)

## Outputs
- Slack message timestamp + link

## Failure modes
- Missing channel -> use default channel or stop with error
- Rate limit -> retry with backoff
