# MMTU Claude Flow

This repository contains a variant of `claude-flow` enhanced to run with MMTU governance.

## What it does

This tool provides a framework for running Claude AI models with a specific set of governance rules, ensuring that all actions are logged, auditable, and adhere to MMTU's operational standards.

## Why it exists

To provide a safe and reliable way to automate tasks using Claude AI, with a strong emphasis on security, auditability, and predictability.

## How to use it

### Quick Start

1.  Clone the repository: `git clone <repo-url>`
2.  Install dependencies: `pnpm install` (or `npm install` if pnpm is not available)
3.  Run the CLI: `npx mmtu-claude-flow run --task "Your task description"`

### Governance

The agent operates under the following principles:

*   **5W1H Outputs**: All outputs will be framed with Who, What, Why, Where, When, and How.
*   **PR-First Changes**: All changes to the codebase must be made via pull requests.
*   **Atomic Steps**: Each operation should be atomic and take less than 10 minutes to complete.
*   **Explicit Rollback**: Every operation must have a defined rollback procedure.
*   **No Secrets in Logs**: Logs are redacted to prevent secrets from being exposed.
*   **Fast CI**: The CI/CD pipeline includes a smoke test that completes in under 3 minutes.

### Done/Rollback

*   **Done**: A task is considered "done" when the build is green, and all tests pass.
*   **Rollback**: If a step fails, the system will attempt to roll back the changes to the previous stable state.

### 5W1H Output Example

```
*WHO*: MMTU Claude Flow Agent
*WHAT*: Executing 'pnpm install' to install dependencies.
*WHY*: To ensure all required packages are available for the build process.
*WHERE*: In the root directory of the `mmtu-claude-flow` project.
*WHEN*: 2025-08-21T12:00:00Z
*HOW*: By running the `pnpm install` command using the shell executor.
*EVIDENCE*: The `pnpm install` command returned a zero exit code.
```

### Required CI Checks

The following CI job names must be used as required checks for pull requests:

*   `mmtu-claude-flow / smoke`
*   `security`