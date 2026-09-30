# Upstream record

- Repository: https://github.com/cursor/plugins
- Plugin: `pstack`
- Version: `0.15.5`
- Commit: `2eb7ed4613cfc8f098dfe464a23680ea44d84c5e`
- License: MIT. See `LICENSE.upstream`.

The plugin also adapts `deslop`, `control-cli`, and `control-ui` from `cursor-team-kit` at the same commit.

## Update process

1. Fetch the new upstream commit into a temporary directory.
2. Compare `pstack/skills/` with this plugin's `skills/` directory.
3. Merge upstream content changes without replacing OpenCode-specific sections.
4. Run `bun run scripts/adapt-upstream.ts` to remove simple Cursor names.
5. Search for Cursor-only paths, model IDs, Task fields, cloud-agent fields, `/loop`, and transcript paths.
6. Run `bun run check`.
7. Load `/poteto-mode` in a fresh OpenCode session and verify that its base directory points into this plugin.
