# Railway Deploy Scripts

Executable helper scripts for managing Railway deployments. These scripts are designed to be called by AI agents or run manually.

## Available Scripts

### `status.sh`
Check the current status of your Railway service.

```bash
./status.sh
```

### `logs.sh`
View Railway logs with sensible defaults (100 lines).

```bash
./logs.sh                    # Last 100 lines
./logs.sh --lines 50         # Last 50 lines
./logs.sh --follow           # Follow logs in real-time
```

### `deploy.sh`
Full deployment workflow with type-checking and verification.

```bash
./deploy.sh                  # Full workflow with type-check
./deploy.sh --skip-typecheck # Skip type-check (faster)
```

**What it does:**
1. Runs TypeScript type-check (unless skipped)
2. Deploys to Railway with `railway up --detach`
3. Waits 60 seconds for build
4. Checks logs for success indicators:
   - Soul loaded
   - Bot connected to Telegram
   - Heartbeat scheduled
   - No obvious errors

### `pause.sh`
Pause the Railway service to enter local development mode.

```bash
./pause.sh
```

**Use case:** Before testing locally with `npm run dev`, pause Railway to avoid Telegram polling conflicts (409 errors).

### `resume.sh`
Resume Railway service after local testing.

```bash
./resume.sh
```

**Use case:** After local testing is complete, resume the Railway deployment.

## Usage from AI Agents

AI agents can call these scripts directly:

```markdown
To deploy FreedomBot to Railway:
bash initialize\ engine/.agent/skills/railway-deploy/scripts/deploy.sh
```

## Prerequisites

All scripts require:
- Railway CLI installed: `npm install -g @railway/cli`
- Logged in: `railway login --browserless`
- Project linked: `railway link` (run from project directory)
