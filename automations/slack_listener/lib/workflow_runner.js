/**
 * Workflow Runner
 *
 * Discovers and executes PMAI workflows using Claude Code CLI.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '../../../');
const WORKFLOWS_DIR = path.join(REPO_ROOT, 'workflows');
const HISTORY_DIR = path.join(REPO_ROOT, 'history');

/**
 * Discover available workflows from workflows/ folder
 * Returns map of workflow_name -> { path, displayName }
 */
function discoverWorkflows() {
  const workflows = {};

  if (!fs.existsSync(WORKFLOWS_DIR)) {
    console.warn('Workflows directory not found:', WORKFLOWS_DIR);
    return workflows;
  }

  const files = fs.readdirSync(WORKFLOWS_DIR);

  for (const file of files) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;

    // Extract workflow name: 01_discovery_to_prd.md -> discovery_to_prd
    const match = file.match(/^\d+_(.+)\.md$/);
    if (!match) continue;

    const name = match[1];
    workflows[name] = {
      path: path.join(WORKFLOWS_DIR, file),
      displayName: name.replace(/_/g, ' ')
    };
  }

  return workflows;
}

/**
 * Generate a unique run ID
 */
function generateRunId(workflowName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${workflowName}-${timestamp}`;
}

/**
 * Parse raw args into structured inputs
 * Format: --project_id=foo --feature_name="bar baz"
 */
function parseArgs(rawArgs) {
  const args = {};

  // Match --key=value or --key="value with spaces"
  const regex = /--(\w+)=(?:"([^"]+)"|(\S+))/g;
  let match;

  while ((match = regex.exec(rawArgs)) !== null) {
    const key = match[1];
    const value = match[2] || match[3];
    args[key] = value;
  }

  return args;
}

/**
 * Ensure run directory exists
 */
function ensureRunDir(runId, projectId) {
  // Use project_id if provided, otherwise use run_id as project identifier
  const identifier = projectId || runId;
  const runDir = path.join(HISTORY_DIR, 'projects', identifier);

  const subdirs = ['inputs', 'artifacts', 'prd', 'stories'];
  for (const sub of subdirs) {
    const dir = path.join(runDir, sub);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  return runDir;
}

/**
 * Write run metadata to history
 */
function writeRunMetadata(runDir, metadata) {
  const metaPath = path.join(runDir, 'inputs', 'run_metadata.json');
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
  return metaPath;
}

/**
 * Read workflow file content
 */
function readWorkflowContent(workflowPath) {
  return fs.readFileSync(workflowPath, 'utf-8');
}

/**
 * Execute workflow using Claude Code CLI
 */
async function runWorkflow({ workflowName, workflowPath, rawArgs, channel, threadTs, userId, slack }) {
  const runId = generateRunId(workflowName);
  const parsedArgs = parseArgs(rawArgs);
  const projectId = parsedArgs.project_id || runId;

  console.log(`Starting workflow: ${workflowName}`);
  console.log(`Run ID: ${runId}`);
  console.log(`Project ID: ${projectId}`);
  console.log(`Args:`, parsedArgs);

  // Ensure directories exist
  const runDir = ensureRunDir(runId, projectId);

  // Write run metadata
  const metadata = {
    runId,
    workflowName,
    projectId,
    rawArgs,
    parsedArgs,
    slack: { channel, threadTs, userId },
    startedAt: new Date().toISOString()
  };
  writeRunMetadata(runDir, metadata);

  // Read workflow content
  const workflowContent = readWorkflowContent(workflowPath);

  // Build prompt for Claude Code
  const prompt = buildClaudePrompt(workflowName, workflowContent, parsedArgs, projectId, runDir);

  // Execute via Claude Code CLI
  const result = await executeClaudeCode(prompt, runDir);

  // Collect artifacts
  const artifacts = collectArtifacts(runDir);

  // Write completion metadata
  const completionMeta = {
    ...metadata,
    completedAt: new Date().toISOString(),
    status: result.success ? 'SUCCESS' : 'FAILED',
    artifacts
  };
  writeRunMetadata(runDir, completionMeta);

  return {
    runId,
    projectId,
    status: result.success ? 'SUCCESS' : 'FAILED',
    summary: result.summary || 'Workflow completed',
    artifacts: artifacts.map(a => a.replace(REPO_ROOT + '/', ''))
  };
}

/**
 * Build prompt for Claude Code execution
 */
function buildClaudePrompt(workflowName, workflowContent, args, projectId, runDir) {
  const argsStr = Object.entries(args)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  return `Execute the following PMAI workflow.

## Workflow: ${workflowName}

${workflowContent}

## Inputs
- project_id: ${projectId}
${argsStr}

## Instructions
1. Follow the workflow steps exactly as specified
2. Write all outputs to: ${runDir}
3. Use the project structure:
   - inputs/ for input artifacts
   - artifacts/ for intermediate artifacts
   - prd/ for PRD documents
   - stories/ for story documents
4. Return a brief summary of what was accomplished

Start executing now.`;
}

/**
 * Execute Claude Code CLI
 */
async function executeClaudeCode(prompt, runDir) {
  // Write prompt to file
  const promptPath = path.join(runDir, 'inputs', 'claude_prompt.md');
  fs.writeFileSync(promptPath, prompt);
  console.log('Prompt written to:', promptPath);

  // For now, always use demo mode (creates placeholder artifacts)
  // TODO: Add Claude CLI integration when available
  console.log('Creating demo artifacts...');
  createDemoArtifacts(runDir, prompt);

  return {
    success: true,
    summary: 'Demo mode: Placeholder artifacts created. Run workflow manually with Claude for full execution.'
  };
}

/**
 * Create demo artifacts when Claude CLI is not available
 */
function createDemoArtifacts(runDir, prompt) {
  // Create discovery summary
  const summaryPath = path.join(runDir, 'artifacts', 'discovery_summary.md');
  fs.writeFileSync(summaryPath, `# Discovery Summary

*Generated: ${new Date().toISOString()}*

## Key Problems
- Problem 1: [Extracted from discovery notes]
- Problem 2: [Extracted from discovery notes]

## Target Users
- User persona 1
- User persona 2

## Goals
- Goal 1
- Goal 2

## Open Questions
- Question 1?
- Question 2?

---
*Note: This is a demo artifact. Install Claude CLI for full workflow execution.*
`);

  // Create PRD
  const prdPath = path.join(runDir, 'prd', 'prd.md');
  fs.writeFileSync(prdPath, `# PRD: Feature Name

*Generated: ${new Date().toISOString()}*

## Problem
[Problem statement]

## Users
[Target users]

## Goals
- Goal 1
- Goal 2

## Non-goals
- Non-goal 1

## Requirements
- Requirement 1
- Requirement 2

## Metrics / Success Criteria
- Metric 1
- Metric 2

## Risks / Open Questions
- Risk 1
- Question 1?

---
*Note: This is a demo artifact. Install Claude CLI for full workflow execution.*
`);
}

/**
 * Extract summary from Claude output
 */
function extractSummary(output) {
  if (!output) return null;

  // Look for summary section or last paragraph
  const lines = output.split('\n').filter(l => l.trim());
  if (lines.length === 0) return null;

  // Take last few meaningful lines as summary
  const summary = lines.slice(-5).join('\n');
  return summary.length > 500 ? summary.slice(0, 500) + '...' : summary;
}

/**
 * Collect artifact paths from run directory
 */
function collectArtifacts(runDir) {
  const artifacts = [];
  const subdirs = ['artifacts', 'prd', 'stories'];

  for (const sub of subdirs) {
    const dir = path.join(runDir, sub);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.json')) {
        artifacts.push(path.join(dir, file));
      }
    }
  }

  return artifacts;
}

module.exports = {
  discoverWorkflows,
  runWorkflow,
  generateRunId,
  parseArgs
};
