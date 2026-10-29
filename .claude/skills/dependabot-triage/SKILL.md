---
name: dependabot-triage
description: Triage all open Dependabot PRs in parallel and produce one risk-ordered table with recommendations. Use when the user asks to review, triage or clean up Dependabot or dependency-bump PRs.
---

# Dependabot triage

You coordinate the triage. The `dependabot-triager` subagents do the investigating; you dispatch them and merge their reports. Nothing is written to GitHub without the user's explicit approval.

## 1. Collect

```sh
gh pr list --author app/dependabot --state open \
  --json number,title,headRefName,mergeStateStatus,statusCheckRollup
```

If `gh` isn't on `PATH`, call it by its full path (for example `/opt/homebrew/bin/gh`). If there are no open PRs, say so and stop.

## 2. Plan the fan-out

Group the PRs to keep the number of agents small, usually at most 6:

| PRs | Agents |
|---|---|
| Each **failing** npm PR | One agent each, with `isolation: "worktree"`, because it will install and may commit a fix |
| Green **github-actions** PRs | One agent for the whole batch, read-only, no worktree needed |
| Green **bundler + gradle** PRs | One agent for the whole batch, read-only |
| Green **npm** PRs | One agent for the batch, with a worktree, so it can run the checks |

Tell the user the plan in one short table before you launch.

## 3. Launch

Spawn all agents in a **single message** so they run in parallel. Use `subagent_type: "dependabot-triager"` and `run_in_background: true`. Each prompt names its PR number(s) and anything specific you already noticed, such as "CI shows a Yarn crash" or "this is a major bump of X".

While they run, post a short update as each report arrives. Don't predict results that haven't arrived.

## 4. Merge the reports

Once all agents are done, reply with:

1. **One table**, ordered from highest risk to lowest: PR, bump, risk, recommendation.
2. **Short notes** for anything high-risk or needing a decision. Give the options and say which one you'd pick.
3. **Human-only checks**: what green CI didn't test (pod install, Pages, release, Android).
4. **Proposed actions**, numbered, each needing approval. Examples: push the fix commit on branch X, re-run CI on #n, merge in order A → B → C, add an ignore or group to `dependabot.yml`.
5. **Local leftovers**: list the worktrees and branches holding fix commits. Recommend removing the worktrees (`git worktree remove`) and keeping only the branches with fixes worth keeping.

## Guardrails

- Never push, comment, merge, close or re-run on GitHub without the user's go-ahead for that specific action.
- A recommendation to ignore a dependency becomes a proposed `dependabot.yml` edit with a comment explaining why. Don't just leave it as advice.
- An ignore rule in `dependabot.yml` only stops new PRs; it doesn't close open ones. For each open PR an ignore rule covers, propose closing it (with approval) using `gh pr close <n> --comment "<reason>; ignored in .github/dependabot.yml"`. Prefer this to `@dependabot ignore …` commands: those also close the PR, but they store a hidden ignore condition that's visible only through `@dependabot show <dep> ignore conditions`.
- If several runs show the same lesson (a recurring noise pattern, a plugin that always lags), propose adding it to the "Repo-specific knowledge" section of `.claude/agents/dependabot-triager.md`.
