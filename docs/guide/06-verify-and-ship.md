# Verify the result and open a PR

"It compiles" is not evidence. The [Prove It Works principle](../../skills/principle-prove-it-works/SKILL.md) makes the agent check the real artifact before it reports success, and your job is to make "the real artifact" checkable. This page covers stating a finish condition, generating a verification skill for your app, opening the PR, and driving it to merged.

![A prototype plane flies a real test course while she times it with a stopwatch and robots film and checklist the run; the terminal reads verify: pass, evidence: captured.](./images/verification.jpg)

## State the finish condition up front

Put what done means in the first prompt, in whatever words fit:

```text
/poteto-mode add json output to this command. text output stays byte-identical, the json parses, both run against the sample project. show me the evidence.
```

Now the agent has three checks it can run, not a mood to satisfy. When the reply comes back, it should carry the exact commands and outputs. If a check couldn't run, a good reply says "inconclusive", and you should treat a confident reply without evidence as a red flag.

Match the check to the change:

- A CLI change runs the real command.
- A UI change walks the changed flow in the running app.
- A parser or migration replays a saved input.
- A perf change compares before and after profiles.
- A storage change reads back the written value.

For a small diff you don't fully trust, [`/blast-radius`](../../skills/blast-radius/SKILL.md) finds what it could break elsewhere. It picks the one fact the change is safe because of and proves it by running code instead of writing an essay about it.

## Create a project verification skill

The UI bullet above hides a real requirement. The agent needs a scripted way to drive your app. If your project has one, great. If not, run:

```text
/create-verification-skill
```

[`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) interviews the repository, not you. It works out what a user touches, how the app launches locally, what can drive it (an existing harness first, otherwise browser and CDP, a PTY, or plain HTTP), what evidence proves behavior, and whether two instances can run side by side. It asks you only what the code can't answer.

It writes `.opencode/skills/verify-<app>/`, agent-facing instructions with exact Launch, Doctor, Drive, Evidence, and Cleanup sections. It also writes a feature map under `features/` that records what the app does and what result proves each feature works. The skill ships a [worked feature-map example](../../skills/create-verification-skill/references/feature-map-example/). Before handoff, the generator proves the skill once end to end: launch, doctor check, drive one feature, capture evidence, and clean up. If that proof fails, do not use the output.

From then on, "verify it in the app" is a step any agent can execute, in this repo, with no setup conversation.

Once the verify skill works, a [`/swarm`](../../skills/swarm/SKILL.md) can split a full pass by feature-map entry and aggregate the results.

## Keep the verification skill honest

Apps change and feature maps rot. When yours drifts, run:

```text
/maintain-verification-skill
```

[`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md) audits the generated skill: one read-only source reader per feature in parallel, then one live pass that drives every mapped feature. It ends in exactly one of three outcomes. `clean` means full coverage and nothing to ship. `changed` means one PR of proven corrections, confined to the verification skill's own directory. `blocked` names the blocker. It never edits product code. If the live pass catches a product regression, it reports the regression instead of papering over it in docs.

## Open the PR

```text
/poteto-mode open the pr. small ordered commits, evidence in the description.
```

The [Opening a PR playbook](../../skills/poteto-mode/playbooks/opening-a-pr.md) works from a worktree, rebases the work into small ordered commits, cleans the diff, unslops the prose, and returns the PR link. Five narrow PRs beat one fat one, and stacked follow-ups beat a growing branch.

## Drive the PR to merge-ready with Babysit

An open PR starts collecting blockers immediately. Checks fail, reviewers comment, trunk moves. Hand that churn to the [Babysit playbook](../../skills/poteto-mode/playbooks/babysit.md):

```text
/poteto-mode babysit this pr. get it green.
```

Babysit uses the bundled watcher and takes blockers in order: conflicts, review threads, and then CI. It batches known fixes into one push, so checks restart once. OpenCode reports background completion events; Babysit does not poll active subagents. The comment triage is skeptical because humans and bots can both report valid findings and noise. A real finding gets a fix. Noise gets a reply with the disproof. When you only want status, ask a smaller question:

```text
/poteto-mode check on pr 123. anything outstanding?
```

Babysit stops at merge-ready. It never merges, even with everything green, because merging is a different decision.

## Land the stack with Shipping

Green is not the same as safe. When you're ready to land, say so:

```text
/poteto-mode land the stack.
```

The [Shipping playbook](../../skills/poteto-mode/playbooks/shipping.md) verifies each PR independently before it arms anything. One fresh agent per PR proves the behavior live, and the agent that judges a change is never the one that wrote it. Then Shipping lands only the contiguous verified run from the bottom, one PR at a time through GitHub by default or Origin when its CLI is available, and reports the first PR that breaks the chain. A verified PR sitting above an unverified one waits, because merging it would pull the gap in underneath.

Next: [Run autonomous work](./07-overnight.md).
