# Set up pstack

This page installs the OpenCode plugin, explains optional model choices, and starts your first task.

## Install the plugin

Clone it into OpenCode's global plugin directory and install its dependencies:

```sh
git clone https://github.com/rilesc555/opencode-poteto-mode.git \
  ~/.config/opencode/plugins/poteto-mode
cd ~/.config/opencode/plugins/poteto-mode
bun install
bun run check
opencode service restart
```

OpenCode also reloads the plugin when `index.ts` changes. After installation, start a new OpenCode session.

## Pick your models, or keep the default

You do not need model setup. By default, every pstack subagent inherits the model from the parent session.

Run this command only when you want explicit models for selected roles:

```text
/setup-pstack
```

[`/setup-pstack`](../../skills/setup-pstack/SKILL.md) reads OpenCode's available model list and writes `~/.config/opencode/pstack-models.md`. It does not change OpenCode's default model.

You only set the roles you want to control. An absent role, `inherit-parent`, or `auto` tells pstack to omit the subagent `model` field. For a panel role, a comma-separated list starts one subagent per entry. Use only model IDs that OpenCode reports as available.

## Accept the verification offer, or do it later

At the end of setup, `/setup-pstack` looks for a way to prove app behavior. If the project has no verification skill or harness, it offers to run [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md).

If you accept, it writes `.opencode/skills/verify-<app>/`. This project-local skill teaches agents how to launch, drive, inspect, and stop the app. You can decline and run `/create-verification-skill` later. [Verify and ship](./06-verify-and-ship.md#create-a-project-verification-skill) explains when it is useful.

## Run your first task

Pick a real but small task:

```text
/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

Poteto Mode selects a playbook and makes its work visible. If it skips a step, it records the reason.

You can type normal follow-ups after the first command. Poteto Mode stays active for that session. To stop it, send:

```text
exit poteto mode
```

Next: [Route work through `/poteto-mode`](./02-poteto-mode.md).
