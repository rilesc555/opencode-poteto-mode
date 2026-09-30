import { describe, expect, test } from "bun:test"
import { isExitPrompt, withSkill } from "./mode.ts"

describe("sticky mode", () => {
  test("recognizes explicit exits", () => {
    expect(isExitPrompt("exit poteto mode")).toBe(true)
    expect(isExitPrompt("Stop poteto.")).toBe(true)
    expect(isExitPrompt("stop this task")).toBe(false)
  })

  test("adds the mode once", () => {
    expect(withSkill(undefined, "poteto-mode")).toEqual([{ id: "poteto-mode" }])
    expect(withSkill([{ id: "poteto-mode" }], "poteto-mode")).toEqual([{ id: "poteto-mode" }])
  })
})
