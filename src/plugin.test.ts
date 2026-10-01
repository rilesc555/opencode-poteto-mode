import { describe, expect, test } from "bun:test"
import plugin from "./plugin.ts"

interface TestPromptEvent {
  sessionID: string
  prompt: { text: string; skills: Array<{ id: string }> }
  delivery: "steer"
}

describe("plugin registration", () => {
  test("registers skills, commands, tools, and sticky mode behavior", async () => {
    const skills = new Map<string, Record<string, unknown>>()
    const commands: Array<{ name: string; execute(input: unknown): Promise<void> }> = []
    const tools: Array<{ name: string }> = []
    const storage = new Map<string, unknown>()
    const prompts: Array<Record<string, unknown>> = []
    let promptHook: ((event: TestPromptEvent) => Promise<void>) | undefined

    const context = {
      location: { project: { id: "project" } },
      skill: {
        transform: async (register: (editor: Record<string, any>) => void) =>
          register({
            get: (id: string) => skills.get(id),
            add: (skill: Record<string, unknown>) => skills.set(skill.id as string, skill),
            update: (id: string, update: (skill: Record<string, unknown>) => void) => update(skills.get(id)!),
          }),
      },
      command: {
        transform: async (register: (editor: Record<string, any>) => void) =>
          register({ add: (command: (typeof commands)[number]) => commands.push(command) }),
      },
      tool: {
        transform: async (register: (editor: Record<string, any>) => void) =>
          register({ namespace: () => {}, add: (tool: (typeof tools)[number]) => tools.push(tool) }),
      },
      storage: {
        get: async (key: string) => storage.get(key),
        set: async (key: string, value: unknown) => void storage.set(key, value),
        remove: async (key: string) => void storage.delete(key),
        scan: async () => ({ entries: [] }),
      },
      session: {
        prompt: async (input: Record<string, unknown>) => void prompts.push(input),
        get: async ({ sessionID }: { sessionID: string }) => ({
          id: sessionID,
          projectID: "project",
          title: "Test",
          time: { created: 1, updated: 1 },
          location: { directory: "/project" },
        }),
        context: async () => [],
        hook: async (name: string, hook: typeof promptHook) => {
          if (name === "prompt") promptHook = hook
        },
      },
    } as unknown as Parameters<typeof plugin.setup>[0]

    await plugin.setup(context)

    expect(skills.size).toBe(52)
    expect(commands).toHaveLength(52)
    expect(tools.map((tool) => tool.name)).toEqual(["active_sessions", "session_messages", "session_diff", "recent_sessions", "session_context"])
    expect(promptHook).toBeDefined()

    const command = commands.find((candidate) => candidate.name === "poteto-mode")!
    await command.execute({ sessionID: "session", prompt: { text: "do work" }, delivery: "steer" })
    expect(storage.get("mode/session")).toBe(true)
    expect(prompts[0]?.skills).toEqual([{ id: "poteto-mode" }])

    const continued: TestPromptEvent = {
      sessionID: "session",
      prompt: { text: "continue", skills: [] },
      delivery: "steer",
    }
    await promptHook!(continued)
    expect(continued.prompt.skills).toEqual([{ id: "poteto-mode" }])

    const exit: TestPromptEvent = {
      sessionID: "session",
      prompt: { text: "exit poteto mode", skills: [] },
      delivery: "steer",
    }
    await promptHook!(exit)
    expect(storage.has("mode/session")).toBe(false)
    expect(exit.prompt.skills).toEqual([])
  })
})
