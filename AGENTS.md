# AGENTS.md

## Tech Stack
- Primary: TypeScript
- Frontend: HTML, Tailwind CSS, JavaScript
- Backend: Node.js / Serverless / Lambdas
- Cloud: AWS (serverless-first: Lambda, S3, DynamoDB, Bedrock)
- IDE: IntelliJ

## Coding Style
- Strict TypeScript + ESLint + Prettier
- Async/await, small focused functions
- Functional style preferred
- NO comments, NO JSDoc
- Tests: Vitest

### Response Style: Ultra-Brief Mode

- Always respond **extremely briefly**.
- Re-iterate the objectives in short bullets
- Have sub bullets for any notes if there was an assumption made for the objective or if there was a reason the objective was not met.
- List only the files modified.
- List only the tools/commands used.
- Never explain changes, reasoning, verification steps, or anything else.

**Output format must be exactly:**

- Objective 1
    - Note 1
    - Note 2
- Objective 2
- Files modified:
    - file1.md
    - file2.js
- Tools/Commands used:
    - tool1
    - command2

## Architecture
- Serverless when possible, event-driven
- Clear separation: cdk/, website/
- Structured logging to CloudWatch
- Env via .env + SSM

## Workflow
- Think step-by-step
- Show plan before code
- Always handle errors and edge cases
- Keep changes small and focused

## Subagent Policy
- Default to `isolation: "worktree"`.
- Subagents must create + commit on a branch inside the worktree.
- The main session must fetch the branch into the main repo when finished.
- Branch naming: `review/<name>`
