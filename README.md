# Poteto Mode for OpenCode

This is an OpenCode V2 adaptation of Lauren Tan's pstack plugin for Cursor.

## Use it

Run `/poteto-mode <task>` for rigorous work. The mode stays active in that session. Send `exit poteto mode` to stop it.

Every bundled skill also has a slash command. Examples include `/how`, `/why`, `/arena`, `/swarm`, `/interrogate`, `/unslop`, and `/deslop`.

Run `/setup-pstack` only if you want explicit models for selected roles. The default is to inherit the active session model.

Read the [adapted pstack guide](./docs/guide/README.md) for setup, prompts, playbooks, verification, and autonomous work.

## OpenCode adaptations

- The plugin registers 52 skills with the OpenCode skill registry.
- It registers slash commands for every skill.
- A prompt hook keeps Poteto Mode active for one session.
- Five tools provide project-scoped session lists, running sessions, paginated messages, session context, and session diffs. They include sessions from before plugin installation. See [session tools](./docs/session-tools.md).
- OpenCode background subagents replace Cursor Task and cloud-agent instructions.
- `~/.config/opencode/pstack-models.md` replaces Cursor model rules.
- The plugin bundles adapted `deslop`, `control-cli`, and `control-ui` skills.
- The plugin includes OpenCode-native `create-skill` and `comment-sicko` skills.

## Develop it

```sh
bun install
bun run check
```

OpenCode loads this directory automatically from `~/.config/opencode/plugins/`.

## Install it globally

1. Copy or clone this repository to `~/.config/opencode/plugins/poteto-mode`.
2. Run `bun install` in that directory.
3. Run `bun run check`.
4. Restart OpenCode with `opencode service restart`, or touch `index.ts` while OpenCode is running.
5. Start a new session and run `/poteto-mode <task>`.

## Upstream

The source material comes from `cursor/plugins`, pstack version 0.15.5, commit `2eb7ed4613cfc8f098dfe464a23680ea44d84c5e`.

See `UPSTREAM.md` and `LICENSE.upstream`.
