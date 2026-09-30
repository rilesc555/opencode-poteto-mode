### Autopilot-full

**You own the verdicts, not the PR changes. One owner runs each PR from build to merge. Nothing merges without an independent clean verdict.**

1. **Hold operator gates.** Items that the operator reserves stop at merge-ready. A request for a plan is not approval to run it. Start only after explicit approval. Record the objective, authority, and done condition in `decisions.tsv`.
2. **Assign one owner per PR.** Use one general background subagent per independent PR. Give each owner its own branch or worktree. The owner builds, opens the PR, proves the behavior, runs CI, applies **deslop** and **no-comments**, rebases, and reports its code-ready head SHA. The owner keeps `decisions.tsv` and `children.tsv` as uncommitted records.
3. **Keep writers separate.** Run independent owners in parallel. Serialize overlapping changes. One writer owns each branch.
4. **Verify every patch round.** At the code-ready SHA and after every later patch change, run independent verifiers through **swarm**. Include repository gates, live behavior through **control-cli** or **control-ui**, regression against trunk, and at least two focused diff audits. A clean verdict applies only to the reviewed SHA, unless the patch ID stays unchanged under `playbooks/shipping.md`.
5. **Merge only a verified head.** The owner rebases onto current trunk and reports the new SHA. CI must pass on that SHA. The root checks that the clean verdict still applies. The owner can then merge if the operator granted merge authority. Reserved PRs wait for the operator.
6. **Audit completion events.** OpenCode reports background subagent completion. On each report, re-read this playbook and the objective in `decisions.tsv`. Check commits, pushes, PR state, checks, and evidence. Replace failed work when it is still required. Do not poll active subagents.
7. **Stop on command.** An operator hold means no more writes. Do not merge, push, or dispatch replacement work until the operator releases the hold.

**Reply:** Show each PR owner, state, head SHA, verdict, merge result, open operator gate, and decision-log path.
