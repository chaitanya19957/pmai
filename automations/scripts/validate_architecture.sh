#!/bin/bash
# PMAI Architecture Validator
# Run this script to check for design smell violations

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ERRORS=0

echo "PMAI Architecture Validation"
echo "============================"
echo ""

# Check 1: tools/ directory should not exist
if [ -d "$REPO_ROOT/tools" ]; then
    echo "FAIL: tools/ directory exists (premature abstraction)"
    echo "      Remove tools/ and use MCP directly from skills"
    ERRORS=$((ERRORS + 1))
else
    echo "PASS: No tools/ directory (MCP-first)"
fi

# Check 2: workflows/ should not contain direct MCP references
echo ""
echo "Checking workflows for direct MCP references..."
if grep -rE '\.(post_message|create_issue|send|fetch)\(' "$REPO_ROOT/workflows" 2>/dev/null; then
    echo "FAIL: Workflow contains direct MCP/integration calls"
    echo "      Workflows must call skills, not MCP directly"
    ERRORS=$((ERRORS + 1))
else
    echo "PASS: Workflows do not contain direct MCP calls"
fi

# Check 3: workflows/ should not mention specific MCP servers by implementation
echo ""
echo "Checking workflows for MCP server implementation details..."
if grep -rEi '(slack\.post|jira\.create|notion\.update|figma\.get)' "$REPO_ROOT/workflows" 2>/dev/null; then
    echo "FAIL: Workflow mentions specific MCP server methods"
    echo "      Use skill abstraction instead"
    ERRORS=$((ERRORS + 1))
else
    echo "PASS: Workflows use skill abstraction"
fi

# Check 4: .mcp.json should exist
echo ""
if [ -f "$REPO_ROOT/.mcp.json" ]; then
    echo "PASS: .mcp.json configuration exists"
else
    echo "FAIL: .mcp.json configuration missing"
    echo "      Create .mcp.json at repo root for MCP server definitions"
    ERRORS=$((ERRORS + 1))
fi

# Check 5: .env should be gitignored
echo ""
if grep -q "^\.env$" "$REPO_ROOT/.gitignore" 2>/dev/null; then
    echo "PASS: .env is gitignored"
else
    echo "WARN: .env may not be gitignored (check .gitignore)"
fi

# Summary
echo ""
echo "============================"
if [ $ERRORS -eq 0 ]; then
    echo "All checks passed"
    exit 0
else
    echo "FAILED: $ERRORS violation(s) found"
    exit 1
fi
