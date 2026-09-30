---
name: setup-pstack
description: Configure optional OpenCode model choices for pstack roles. Use for /setup-pstack, "configure pstack models", or changing pstack model choices.
---

# Set up pstack models

Write `~/.config/opencode/pstack-models.md`. Other pstack skills read this file when they delegate work.

## Steps

1. Use the OpenCode models tool to list available models. Do not guess model IDs.
2. Read the current file if it exists.
3. Ask whether the user wants all roles to inherit the parent model or wants explicit models for selected roles.
4. Use the `question` tool for model choices. A configured model is an explicit user choice and can be passed to the OpenCode `subagent` tool.
5. Validate every configured value against the model list.
6. Write the file in this form:

```markdown
# pstack model configuration

Delete a line to inherit the parent model. Values use `provider/model` or `provider/model#variant`.

feature, refactoring: inherit-parent
bug-fix: inherit-parent
perf-issue: inherit-parent
hillclimb: inherit-parent
judgment and prose: inherit-parent
hardest tasks: inherit-parent
how explorer: inherit-parent
how explainer: inherit-parent
why investigators: inherit-parent
why synthesizer: inherit-parent
reflect tooling: inherit-parent
reflect judgment, divergent, synthesizer: inherit-parent
arena runners: inherit-parent
arena cross-judge pool: inherit-parent
swarm workers: inherit-parent
architect runners: inherit-parent
interrogate reviewers: inherit-parent
```

Panel roles accept comma-separated model IDs. The number of entries sets the worker count. `inherit-parent` means that the subagent call omits its `model` field.

7. Confirm the path and the roles that use explicit models.
8. If the project has no real behavior verification workflow, offer the **create-verification-skill** skill once.

Do not edit `opencode.json(c)` for role choices. This file belongs to pstack and does not change OpenCode's default model.
