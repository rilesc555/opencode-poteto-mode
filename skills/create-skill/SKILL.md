---
name: create-skill
description: Create or revise an OpenCode skill with valid frontmatter, concise instructions, references, and a verification pass.
disable-model-invocation: true
---

# Create an OpenCode skill

Create skills under `.opencode/skills/<id>/SKILL.md` for one project or `~/.config/opencode/skills/<id>/SKILL.md` for all projects.

1. State the trigger and expected result.
2. Write YAML frontmatter with `name` and `description`.
3. Put the smallest complete workflow in `SKILL.md`.
4. Put long templates, examples, or references beside it and link them with relative paths.
5. Remove Cursor-only commands and tool names.
6. Check every relative link and command.
7. Load the skill in a fresh OpenCode session and run one representative task.
8. Revise the skill if the agent skips a required step or needs unstated context.

Use the `unslop` skill on the final text.
