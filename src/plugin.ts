import { Plugin } from "@opencode/plugin"
import type { Skill } from "@opencode/schema/skill"
import { loadBundledSkills } from "./skills.ts"

const MODE_SKILL_ID = "poteto-mode"
const storageKey = (sessionID: string) => `mode/${sessionID}`
const sessionKey = (sessionID: string) => `session/${sessionID}`

export default Plugin.define({
  id: "poteto.mode",
  async setup(ctx) {
    const skills = await loadBundledSkills()

    await ctx.skill.transform((editor) => {
      for (const skill of skills) {
        const info = {
          id: skill.id,
          name: skill.name,
          path: skill.path,
          content: skill.content,
          ...(skill.description === undefined ? {} : { description: skill.description }),
          ...(skill.autoinvoke === undefined ? {} : { autoinvoke: skill.autoinvoke }),
        } as Skill.Info

        if (editor.get(skill.id)) editor.update(skill.id, (current) => Object.assign(current, info))
        else editor.add(info)
      }
    })

    await ctx.command.transform((editor) => {
      for (const skill of skills) {
        if (skill.id === MODE_SKILL_ID) continue
        editor.add({
          name: skill.id,
          description: skill.description,
          execute: async ({ sessionID, prompt, delivery }) => {
            await ctx.session.prompt({
              ...prompt,
              sessionID,
              skills: [...(prompt.skills ?? []), { id: skill.id as Skill.ID }],
              delivery,
            })
          },
        })
      }

      editor.add({
        name: MODE_SKILL_ID,
        description: "Enable Poteto Mode and run the request through its playbook router",
        execute: async ({ sessionID, prompt, delivery }) => {
          await ctx.storage.set(storageKey(sessionID), true)
          await ctx.session.prompt({
            ...prompt,
            sessionID,
            skills: [...(prompt.skills ?? []), { id: MODE_SKILL_ID as Skill.ID }],
            delivery,
          })
        },
      })
    })

    await ctx.tool.transform((editor) => {
      editor.namespace({
        name: "pstack",
        description: "Read OpenCode session history for pstack recall and reflection workflows",
      })
      editor.add({
        name: "recent_sessions",
        description: "List recent top-level OpenCode sessions for the current project",
        input: {
          type: "object",
          properties: {
            limit: { type: "integer", minimum: 1, maximum: 50, default: 20 },
            search: { type: "string" },
          },
          additionalProperties: false,
        },
        options: { namespace: "pstack", codemode: true },
        execute: async (input) => {
          const value = input as { limit?: number; search?: string }
          const page = await ctx.storage.scan({ prefix: "session/", limit: 500 })
          const search = value.search?.toLowerCase()
          const sessions = page.entries
            .map((entry) => entry.value)
            .filter((entry): entry is { id: string; title?: string; updated: number; directory: string } => {
              if (!entry || typeof entry !== "object") return false
              const candidate = entry as Record<string, unknown>
              return typeof candidate.id === "string" && typeof candidate.updated === "number"
            })
            .filter((session) => !search || `${session.title ?? ""} ${session.id}`.toLowerCase().includes(search))
            .sort((a, b) => b.updated - a.updated)
            .slice(0, value.limit ?? 20)
          return { content: JSON.stringify(sessions, null, 2) }
        },
      })
      editor.add({
        name: "session_context",
        description: "Read one OpenCode session from the current project",
        input: {
          type: "object",
          properties: {
            sessionID: { type: "string", minLength: 1 },
          },
          required: ["sessionID"],
          additionalProperties: false,
        },
        options: { namespace: "pstack", codemode: true },
        execute: async (input) => {
          const { sessionID } = input as { sessionID: string }
          const session = await ctx.session.get({ sessionID })
          if (session.projectID !== ctx.location.project.id) {
            throw new Error("The requested session belongs to another project")
          }
          const messages = await ctx.session.context({ sessionID })
          return { content: JSON.stringify(messages, null, 2) }
        },
      })
    })

    await ctx.session.hook("prompt", async (event) => {
      const session = await ctx.session.get({ sessionID: event.sessionID })
      await ctx.storage.set(sessionKey(event.sessionID), {
        id: session.id,
        updated: Date.now(),
        directory: session.location.directory,
        ...(session.title === undefined ? {} : { title: session.title }),
      })

      const normalized = event.prompt.text.trim().toLowerCase()
      if (/^(exit|disable|leave|stop) poteto(?: mode)?[.!]?$/.test(normalized)) {
        await ctx.storage.remove(storageKey(event.sessionID))
        event.prompt.skills = (event.prompt.skills ?? []).filter((skill) => skill.id !== MODE_SKILL_ID)
        return
      }

      const enabled = await ctx.storage.get(storageKey(event.sessionID))
      if (enabled !== true) return
      if ((event.prompt.skills ?? []).some((skill) => skill.id === MODE_SKILL_ID)) return
      event.prompt.skills = [...(event.prompt.skills ?? []), { id: MODE_SKILL_ID as Skill.ID }]
    })
  },
})
