import { expect, test } from "bun:test"
import { activeProjectSessions, projectSessionMessages, projectSessionDiff, type InspectionClient } from "./session-inspection.ts"

function fixture() {
  const calls: unknown[] = []
  const client = {
    session: {
      active: async () => ({ mine: { type: "running" }, child: { type: "running" }, other: { type: "running" } }),
      get: async ({ sessionID }: { sessionID: string }) => ({
        id: sessionID, projectID: sessionID === "other" ? "other-project" : "project",
        parentID: sessionID === "child" ? "mine" : undefined,
        location: { directory: "/worktree" },
      }),
      diff: async (input: unknown) => { calls.push(input); return [] },
    },
    message: {
      list: async (input: unknown) => { calls.push(input); return { data: [], cursor: { next: "next-page" } } },
    },
  } as unknown as InspectionClient
  return { client, calls }
}

test("active sessions include workers and exclude other projects", async () => {
  const { client } = fixture()
  expect((await activeProjectSessions(client, "project")).map((session) => session.id)).toEqual(["mine", "child"])
})

test("messages preserve pagination and filters", async () => {
  const { client, calls } = fixture()
  const input = { sessionID: "mine", cursor: "previous-page", type: "user" as const, limit: 2, order: "asc" as const }
  expect(await projectSessionMessages(client, "project", input)).toEqual({ data: [], cursor: { next: "next-page" } })
  expect(calls).toEqual([{ sessionID: "mine", cursor: "previous-page", type: "user", limit: 2 }])
})

test("messages default to a bounded newest-first page", async () => {
  const { client, calls } = fixture()
  await projectSessionMessages(client, "project", { sessionID: "mine" })
  expect(calls).toEqual([{ sessionID: "mine", limit: 20, order: "desc" }])
})

test("diff preserves turn boundaries", async () => {
  const { client, calls } = fixture()
  const input = { sessionID: "mine", from: "msg-start", to: "msg-end", context: 3 }
  expect(await projectSessionDiff(client, "project", input)).toEqual([])
  expect(calls).toEqual([input])
})

test("foreign sessions are rejected before messages or diffs are read", async () => {
  const { client, calls } = fixture()
  await expect(projectSessionMessages(client, "project", { sessionID: "other" })).rejects.toThrow("another project")
  await expect(projectSessionDiff(client, "project", { sessionID: "other" })).rejects.toThrow("another project")
  expect(calls).toEqual([])
})
