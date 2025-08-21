#!/bin/bash

# Agent Self-Checks

# 1. Check for 5W1H headings in prompts
if ! grep -q -E '(Who|What|Why|Where|When|How|Evidence)' prompts/00-agent-frame.md; then
  echo "Error: 5W1H headings not found in prompts/00-agent-frame.md"
  exit 1
fi

# 2. Check for path sandbox violations (dummy check)
# In a real scenario, this would involve more complex checks
if grep -q -E '(\~|/etc/)' claude.project.json; then
  echo "Error: Potential path sandbox violation in claude.project.json"
  exit 1
fi

# 3. Check for redaction script
if [ ! -f scripts/redact-log.js ]; then
  echo "Error: Redaction script not found at scripts/redact-log.js"
  exit 1
fi

# 4. Check runlog for unredacted secrets (dummy check)
if [ -f runlog.jsonl ] && grep -q -E '(password|secret|token)' runlog.jsonl; then
  echo "Warning: Potential unredacted secrets found in runlog.jsonl"
fi

echo "Agent self-checks passed."