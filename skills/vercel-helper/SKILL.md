# vercel-helper

Description:
A minimal OpenClaw skill that provides safe wrappers around common Vercel operations: git connect, preflight checks, and deploy. Uses the VERCEL_TOKEN from secure storage.

Install steps:
1. Ensure VERCEL_TOKEN is available at /home/moriahkeeper/.openclaw/secrets/VERCEL_TOKEN or instance path.
2. Install skill files into skills/vercel-helper and register with OpenClaw skill registry.

Safety:
- Reads token only from secure path.
- Preflight checks run before any deploy: ensures public/index.html exists, .nvmrc matches package.json engines, and package-lock.json up-to-date.
- All deploys logged to instance DB and workspace/logs/vercel_* files.

Commands exposed:
- vercel_preflight: runs preflight checks
- vercel_git_connect: runs `vercel git connect` safely
- vercel_deploy: runs `vercel --prod --token $VERCEL_TOKEN`

Verification:
- Run vercel_preflight -> expect OK or a concrete actionable error
- Run vercel_git_connect -> returns success or reproducible error
