### Autopilot-stack

**Build and verify one linear PR stack. Do not land it.**

1. **Hold operator gates.** State the plan and wait for explicit approval. Record the objective, PR order, and done condition in `decisions.tsv`.
2. **Assign owners.** Use one general background subagent per PR. Give every owner a separate branch or worktree. Each owner builds, opens its PR, proves behavior, runs CI, applies **deslop** and **no-comments**, and reports a code-ready head SHA.
3. **Verify each patch round.** Use Autopilot-full step 4. Nothing enters the stack without a clean independent verdict on the applicable patch.
4. **Keep one topology writer.** Owners push only their branches. The root rebases and retargets PRs to form one linear chain. Before a force push, compare the remote ref and use `--force-with-lease`. Only the root PR targets trunk.
5. **Absorb trunk drift.** Rebase from the bottom to the top. Re-run mergeability and CI after every rewritten push. Re-run verifier lanes when the patch ID changes.
6. **Audit completion events.** OpenCode reports background subagent completion. Check durable side effects and evidence when each report arrives. Do not poll active subagents.
7. **Deliver without merging.** Return one verified PR chain for the operator to review and land. Do not enable auto-merge or close a PR.

**Reply:** Give the stack root, stack tip, one verdict per PR, and every excluded item with its reason.
