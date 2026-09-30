import { Glob } from "bun"
import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const root = resolve(import.meta.dir, "..")
const glob = new Glob("skills/**/*.md")

const replacements: ReadonlyArray<readonly [RegExp, string]> = [
  [/~\/\.cursor\/rules\/pstack-models\.mdc/g, "~/.config/opencode/pstack-models.md"],
  [/~\/\.cursor\/skills\//g, "~/.config/opencode/skills/"],
  [/~\/\.cursor\/plugins\//g, "~/.config/opencode/plugins/"],
  [/\.cursor\/skills\//g, ".opencode/skills/"],
  [/Cursor's built-in `create-skill` skill/g, "the **create-skill** skill"],
  [/Cursor's built-in `create-skill`/g, "the **create-skill** skill"],
  [/Cursor's built-in babysit skill/g, "any generic babysit workflow"],
  [/`AskQuestion`/g, "the `question` tool"],
  [/AskQuestion/g, "the `question` tool"],
  [/`subagent_type: "poteto-agent"`/g, '`agent: "general"` with instructions to load **poteto-mode** first'],
  [/`subagent_type: generalPurpose`/g, '`agent: "general"`'],
  [/`subagent_type`: `generalPurpose`/g, '`agent`: `general`'],
  [/`subagent_type: "Comment Sicko"`/g, '`agent: "general"` with the **comment-sicko** skill'],
  [/`run_in_background: true`/g, "`background: true`"],
  [/run_in_background: true/g, "background: true"],
  [/Task subagent/g, "OpenCode subagent"],
  [/Task tool/g, "OpenCode `subagent` tool"],
  [/`Task` calls/g, "`subagent` calls"],
  [/`Task` call/g, "`subagent` call"],
  [/Task calls/g, "subagent calls"],
  [/Task call/g, "subagent call"],
  [/Cursor cloud agent/g, "OpenCode background subagent"],
  [/Cursor cloud agents/g, "OpenCode background subagents"],
  [/Cursor's `\/loop` command/g, "OpenCode background execution and completion notifications"],
  [/Cursor's built-in wake mechanism/g, "OpenCode background execution and completion notifications"],
  [/Cursor restart/g, "OpenCode service restart"],
  [/Cursor environment/g, "OpenCode environment"],
  [/Cursor model picker/g, "OpenCode model list"],
  [/Cursor also exposes/g, "OpenCode exposes"],
  [/pstack-models\.mdc/g, "pstack-models.md"],
  [/ from the `cursor-team-kit` plugin/g, " bundled with this plugin"],
  [/ from `cursor-team-kit`/g, " bundled with this plugin"],
  [/`cursor-team-kit` publishes /g, "This plugin bundles "],
  [/ \(default `grok-4\.7-xhigh-fast`\)/g, " when configured, or the parent model"],
  [/default `grok-4\.7-xhigh-fast`/g, "the parent model"],
  [/default `claude-opus-5-5-max`/g, "the parent model"],
  [/`grok-4\.7-xhigh-fast`/g, "`inherit-parent`"],
  [/`claude-opus-5-5-max`/g, "`inherit-parent`"],
  [/`gpt-5\.6-sol-max`/g, "`inherit-parent`"],
  [/under `\/loop`/g, "as background work"],
  [/a real terminal `\/loop`/g, "a background watcher"],
  [/`\/loop` per component/g, "repeat per component"],
  [/"\/loop until X"/g, '"continue until X"'],
  [/`Task` prompts/g, "subagent prompts"],
  [/\.cursor\/worktrees/g, "the configured OpenCode worktree directory"],
]

for (const relative of glob.scanSync({ cwd: root })) {
  const path = resolve(root, relative)
  let content = await readFile(path, "utf8")
  for (const [pattern, replacement] of replacements) content = content.replace(pattern, replacement)
  await writeFile(path, content)
}
