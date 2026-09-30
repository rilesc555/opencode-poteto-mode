import { describe, expect, test } from "bun:test"
import { loadBundledSkills } from "./skills.ts"

describe("bundled skills", () => {
  test("loads every skill with unique IDs", async () => {
    const skills = await loadBundledSkills()
    const ids = skills.map((skill) => skill.id)

    expect(skills.length).toBe(52)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain("poteto-mode")
    expect(ids).toContain("unslop")
    expect(ids).toContain("deslop")
    expect(ids).toContain("control-cli")
    expect(ids).toContain("control-ui")
  })

  test("maps Cursor's invocation flag", async () => {
    const skills = await loadBundledSkills()
    expect(skills.find((skill) => skill.id === "unslop")?.autoinvoke).toBe(false)
  })

  test("contains no Cursor runtime instructions", async () => {
    const skills = await loadBundledSkills()
    const forbidden = [
      "~/.cursor",
      ".cursor/skills",
      "cursor-team-kit",
      "subagent_type",
      "run_in_background",
      "pstack-models.mdc",
      "grok-4.7",
      "claude-opus-5-5",
      "gpt-5.6-sol-max",
    ]

    for (const skill of skills) {
      for (const marker of forbidden) expect(skill.content).not.toContain(marker)
    }
  })
})
