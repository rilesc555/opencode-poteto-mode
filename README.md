# Poteto Mode for OpenCode

This is an OpenCode V2 adaptation of Lauren Tan's pstack plugin for Cursor.

## Use it

Run `/poteto-mode <task>` for rigorous work. The mode stays active in that session. Send `exit poteto mode` to stop it.

Every bundled skill also has a slash command. Examples include `/how`, `/why`, `/arena`, `/swarm`, `/interrogate`, `/unslop`, and `/deslop`.

Run `/setup-pstack` only if you want explicit models for selected roles. The default is to inherit the active session model.

## OpenCode adaptations

- The plugin registers 52 skills with the OpenCode skill registry.
- It registers slash commands for every skill.
- A prompt hook keeps Poteto Mode active for one session.
- Two tools provide project-scoped OpenCode session history for `recall`, `reflect`, and session pickup. The session index starts when the plugin is installed.
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

## Upstream

The source material comes from `cursor/plugins`, pstack version 0.15.5, commit `2eb7ed4613cfc8f098dfe464a23680ea44d84c5e`.

See `UPSTREAM.md` and `LICENSE.upstream`.
