---
name: railway-deploy
description: Deploy and manage FreedomBot on Railway. Use when deploying code to Railway, troubleshooting Railway deployments, checking Railway logs, checking deployment status, or configuring Railway environment variables. Also use when an agent says "deploy" or needs to push code changes to production. Covers the full deploy workflow including build config, environment setup, debugging failed deploys, and rollback procedures.
---

# Railway Standard Operating Procedures — FreedomBot

> Step-by-step guide for deploying and managing FreedomBot on Railway.

---

## Project Details

| Key                   | Value                                                            |
| --------------------- | ---------------------------------------------------------------- |
| **Project Name**      | FreedomBot                                                       |
| **Service Name**      | FreedomBot Service                                               |
| **Environment**       | `production`                                                     |
| **Runtime**           | Node.js 22 (via nixpacks.toml)                                   |
| **Project Directory** | /Users/alethea/Documents/AntiGravity/FreedomBot                  |
| **Dashboard URL**     | https://railway.com/project/e6bfc5f5-91cd-4a15-96d2-ea5357702bed |
| **GitHub Repo**       | https://github.com/tmnsystems/FreedomBot                         |

---

## Prerequisites

1. **Railway CLI installed**

   ```bash
   npm install -g @railway/cli
   railway --version
   ```

2. **Logged in**

   ```bash
   railway login --browserless
   ```

3. **Project linked** — run inside `/Users/alethea/Documents/AntiGravity/FreedomBot`:

   ```bash
   railway link
   ```

4. **Environment variables set on Railway**

   ```bash
   railway variables set TELEGRAM_BOT_TOKEN="your-token"
   railway variables set ANTHROPIC_API_KEY="your-key"
   # ... repeat for all env vars
   ```

   Key vars: TELEGRAM_BOT_TOKEN, ANTHROPIC_API_KEY, PINECONE_API_KEY, PINECONE_INDEX=alethea, SUPABASE_URL, SUPABASE_KEY, NOTION_API_KEY, NOTION_TASKS_DB_ID, FIRECRAWL_API_KEY

---

## The Dev Cycle

```
1. Pause Railway  →  2. Test Locally  →  3. Deploy  →  4. Verify
```

### Phase 1: Pause Railway (Enter Dev Mode)

Two bot instances polling the same Telegram token will fight over messages. Always pause Railway before local testing.

```bash
railway down
```

### Phase 2: Test Locally

```bash
npm run dev
```

This runs `tsx watch src/index.ts` — auto-restarts on code changes. Test via Telegram.

When done, stop with `Ctrl+C`.

### Phase 3: Deploy to Railway

**3a. Type-check** to catch errors before deploying:

```bash
npx tsc --noEmit
```

**3b. Set new env vars** (if you added any):

```bash
railway variables set NEW_VAR_NAME="value"
```

**3c. Deploy:**

```bash
railway up --detach
```

Railway uses nixpacks (not Docker) to build. Takes ~60–90 seconds.

**Important:** `railway redeploy` replays the cached image — it does NOT pull new code. Always use `railway up --detach` for code changes.

### Phase 4: Verify

**Check deployment status FIRST** — don't just watch logs:

```bash
railway deployment list
```

This shows actual deployment statuses (SUCCESS/FAILED). If the deploy failed, `railway logs` will show the *previous* successful deployment's logs, which is useless.

For a failed deploy, get build logs:

```bash
railway logs -b --lines 100 <DEPLOYMENT_ID>
```

For a successful deploy, check runtime logs:

```bash
railway logs --lines 40
```

Expected startup output:
- `✅ Soul loaded (soul.md)`
- `✅ Connected as @freedombot_bot`
- `✅ Heartbeat scheduled`
- No crash traces or unhandled errors

---

## Quick Reference

| Task                    | Command                             |
| ----------------------- | ----------------------------------- |
| Pause the live bot      | `railway down`                      |
| Start local dev         | `npm run dev`                       |
| Type-check              | `npx tsc --noEmit`                  |
| Deploy to Railway       | `railway up --detach`               |
| Check deploy status     | `railway deployment list`           |
| View live logs          | `railway logs --lines 100`          |
| View build logs (fail)  | `railway logs -b --lines 100 <ID>`  |
| Set a new env var       | `railway variables set KEY="value"` |
| List all env vars       | `railway variables`                 |
| Open dashboard          | `railway open`                      |

---

## Architecture

### Build Config (nixpacks.toml)

```toml
[phases.setup]
nixPkgs = ["nodejs_22", "ffmpeg-full"]

[phases.install]
cmds = ["npm install"]

[start]
cmd = "npx tsx src/index.ts"
```

No Dockerfile. No Docker. Railway uses nixpacks to build from this config.

### Memory (persists across deploys)

- **Supabase** — conversation history (last 30 messages), analytics, task queue, heartbeat
- **Pinecone** — semantic long-term memory (index: `alethea`, namespace: `tina`, model: llama-text-embed-v2)

Railway's filesystem is ephemeral — nothing written to disk survives a redeploy.

### LLM

Model: `claude-sonnet-4-6` (hardcoded in `src/config.ts`). Never change this without Tina's approval.

---

## Troubleshooting

| Problem                           | What to do                                                              |
| --------------------------------- | ----------------------------------------------------------------------- |
| **Deploy not updating**           | Run `railway deployment list` — check if deploy FAILED                  |
| **Build failed**                  | `railway logs -b --lines 100 <DEPLOYMENT_ID>` — look for Node/TS errors |
| **Bot crashes on startup**        | Check for missing env vars: `railway variables`                         |
| **Messages going to wrong place** | Two instances running — `railway down` before `npm run dev`             |
| **Need to rollback**              | Fix the issue locally, then `railway up --detach` again                 |
| **Logs show old deployment**      | `railway logs` defaults to last SUCCESS — use deployment list first     |
