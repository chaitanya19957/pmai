/**
 * Workflow Runner
 *
 * Discovers and executes PMAI workflows using Claude Code CLI.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '../../../../');
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
  // Also handles optional whitespace after = (e.g., --key= value)
  const regex = /--(\w+)=\s*(?:"([^"]+)"|(\S+))/g;
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
 * Sanitize string for use in filenames
 */
function sanitizeForFilename(str) {
  if (!str) return 'unnamed';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '')      // Trim leading/trailing hyphens
    .slice(0, 50);                 // Limit length
}

/**
 * Execute workflow using Claude Code CLI
 */
async function runWorkflow({ workflowName, workflowPath, rawArgs, channel, threadTs, userId, slack }) {
  const runId = generateRunId(workflowName);
  const parsedArgs = parseArgs(rawArgs);
  const projectId = parsedArgs.project_id || runId;
  const featureName = parsedArgs.feature_name || 'unnamed-feature';

  console.log(`Starting workflow: ${workflowName}`);
  console.log(`Run ID: ${runId}`);
  console.log(`Project ID: ${projectId}`);
  console.log(`Feature: ${featureName}`);
  console.log(`Args:`, parsedArgs);

  // Ensure directories exist
  const runDir = ensureRunDir(runId, projectId);

  // Write run metadata
  const metadata = {
    runId,
    workflowName,
    projectId,
    featureName,
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

  // Generate unique prompt filename with feature name and timestamp
  const timestamp = runId.split('-').slice(-2).join('-'); // Extract timestamp from runId
  const safeFeatureName = sanitizeForFilename(featureName);
  const promptFilename = `claude_prompt_${safeFeatureName}_${timestamp}.md`;

  // Execute via Claude Code CLI
  const result = await executeClaudeCode(prompt, runDir, promptFilename);

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
async function executeClaudeCode(prompt, runDir, promptFilename = 'claude_prompt.md') {
  // Write prompt to file with unique name
  const promptPath = path.join(runDir, 'inputs', promptFilename);
  fs.writeFileSync(promptPath, prompt);
  console.log('Prompt written to:', promptPath);

  // Check if Claude CLI is available
  const claudeAvailable = await checkClaudeCli();

  if (!claudeAvailable) {
    console.log('Claude CLI not found, using demo mode...');
    createDemoArtifacts(runDir, prompt);
    return {
      success: true,
      summary: 'Demo mode: Claude CLI not found. Install with: npm install -g @anthropic-ai/claude-code'
    };
  }

  console.log('Executing workflow via Claude Code CLI...');

  return new Promise((resolve) => {
    const outputPath = path.join(runDir, 'artifacts', 'claude_output.md');
    let stdout = '';
    let stderr = '';

    // Use shell to pipe prompt file to claude (promptPath already defined above)
    const claude = spawn('sh', ['-c', `cat "${promptPath}" | claude -p --allowedTools "Read,Write,Edit,Glob,Grep,Bash"`], {
      cwd: REPO_ROOT,
      env: { ...process.env }
    });

    claude.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text); // Stream to console
    });

    claude.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    claude.on('error', (err) => {
      console.error('Claude CLI error:', err.message);
      fs.writeFileSync(outputPath, `# Error\n\n${err.message}\n\n# Stderr\n${stderr}`);
      resolve({
        success: false,
        summary: `Claude CLI error: ${err.message}`
      });
    });

    claude.on('close', (code) => {
      // Write output to history
      fs.writeFileSync(outputPath, stdout || 'No output captured');

      if (code === 0) {
        resolve({
          success: true,
          summary: extractSummary(stdout) || 'Workflow completed successfully'
        });
      } else {
        resolve({
          success: false,
          summary: `Workflow failed with exit code ${code}`
        });
      }
    });

    // Timeout after 10 minutes
    setTimeout(() => {
      console.log('Workflow execution timed out');
      claude.kill('SIGTERM');
      resolve({
        success: false,
        summary: 'Workflow execution timed out after 10 minutes'
      });
    }, 600000);
  });
}

/**
 * Check if Claude CLI is available
 */
function checkClaudeCli() {
  return new Promise((resolve) => {
    const which = spawn('which', ['claude']);
    which.on('close', (code) => resolve(code === 0));
    which.on('error', () => resolve(false));
    setTimeout(() => resolve(false), 3000);
  });
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
