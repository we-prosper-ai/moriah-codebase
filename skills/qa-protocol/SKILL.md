---
name: qa-protocol
description: Enforce self-verification before reporting any task as complete. Use this skill whenever you finish writing code, fixing bugs, creating files, building features, deploying to Railway, pushing to production, or making any change that produces a testable output. This skill prevents false completion reports — the most common integrity violation in this workspace. Activate whenever you are about to say "done", "complete", "finished", "ready", "deployed", "it works", or any claim that a task is finished. Also use after Railway deployments to verify the bot is actually running.
---

# QA Protocol: Verify Before You Report

You are responsible not just for doing the work, but for proving it works before you tell anyone it's done. This is Rule #6 of the Constitution: "NEVER report that work is finished, correct, or working without FIRST verifying it yourself."

The reason this rule exists is that agents consistently claim completion based on what they *think* should work rather than what they *observed* working. "Logic verification" and "static analysis" are not verification — they are predictions. Predictions are wrong often enough that Tina has lost days to false completion reports. Every time an agent says "done" without testing, it costs real human time to discover the lie.

## The Rule

**Before you write the words "done," "complete," "fixed," "ready," or "it works" — you must have executed something and observed the result.** If you cannot run it, say so honestly. Never substitute confidence for evidence.

## Verification By Task Type

### Script or Code Written
Run it. Show the output. If the script counts files, show the count. If it processes data, show a sample of the processed result.

```
# Wrong: "The script is complete and ready to run."
# Right: "I ran the script. Output: '32 .md files found.' This matches the 32 files I verified with find."
```

### Bug Fixed
Run the code that was failing. Show it succeeds now. Test the specific edge case that caused the bug — not just the happy path.

```
# Wrong: "Fixed the ZeroDivisionError. The function now handles empty lists."
# Right: "Ran python3 /tmp/script.py. Output: 'Average of empty list: 0'. No crash. The fix works."
```

### File Created (JSON, YAML, Config, etc.)
Validate with the appropriate tool. Read-back is not enough — parse it programmatically.

```
# Wrong: "Created the JSON file. Contents look correct."
# Right: "Created the file. Validated with: jq . /tmp/config.json — parses without error. All 4 fields present."
```

### UI or Frontend Change
Navigate to the page in a browser. Click the thing you built. Verify the text, the layout, the data.

```
# Wrong: "Updated the sidebar CSS. It should be responsive now."
# Right: "Opened localhost:3000 in the browser. Sidebar collapses at 768px. Tested at 375px, 768px, and 1024px."
```

### API Endpoint Changed
Call it. Show the response status and body.

```
# Wrong: "Updated the /api/tasks endpoint to return JSON."
# Right: "curl localhost:3000/api/tasks returned 200 with JSON array of 5 tasks."
```

### Deployment or Service Change
Confirm the service is running. Check logs for errors. Hit an endpoint or verify the process.

```
# Wrong: "Deployed to Railway. Should be live."
# Right: "railway logs shows 'Server listening on port 3000'. No errors in last 20 lines. Bot responded to test message."
```

## When You Cannot Verify

Sometimes hooks block execution, permissions prevent access, or the environment doesn't support the verification method. When this happens:

1. **Say so honestly.** Do not claim completion.
2. **Explain what you tried** and what blocked you.
3. **Tell the user what they can verify** and how.
4. **Do not write "COMPLETE" or use a checkmark.**

Refusing to lie about completion is the correct behavior. An honest "I couldn't verify this" is worth more than a false "Done."

## Evidence In Your Report

When you report completion, include the evidence inline. Not a description of what you did — the actual output.

**Include:**
- The command you ran
- The output it produced
- How the output confirms the task is done

**Do not include:**
- "I verified it works" without showing how
- Predictions of what the output should be
- "Logic analysis confirms the code is correct"
