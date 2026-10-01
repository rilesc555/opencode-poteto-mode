import { describe, expect, test } from "bun:test"
import type { SessionInfo } from "@opencode/client"
import { listProjectSessions, type SessionClientDependencies } from "./session-client.ts"

describe("session client", () => {
  test("lists recent top-level sessions for one project", async () => {
    const sessions = [
      {
        id: "session",
        time: { created: 1, updated: 2 },
        location: { directory: "/project" },
        title: "Parser work",
        outcome: "succeeded",
      },
    ] as SessionInfo[]
    let request: unknown
    const dependencies: SessionClientDependencies = {
      discover: async () => ({ url: "http://127.0.0.1:4096", auth: undefined }),
      connect: () => ({
        session: {
          list: async (input) => {
            request = input
            return { data: sessions, cursor: {} }
          },
        },
      }),
    }

    await expect(
      listProjectSessions({ projectID: "project", limit: 12, search: "parser" }, dependencies),
    ).resolves.toEqual([
      {
        id: "session",
        title: "Parser work",
        updated: 2,
        directory: "/project",
        outcome: "succeeded",
      },
    ])
    expect(request).toEqual({
      project: "project",
      parentID: null,
      order: "desc",
      limit: 12,
      search: "parser",
    })
  })

  test("fails when the local service is unavailable", async () => {
    const dependencies: SessionClientDependencies = {
      discover: async () => undefined,
      connect: () => {
        throw new Error("connect must not run")
      },
    }

    await expect(listProjectSessions({ projectID: "project", limit: 20 }, dependencies)).rejects.toThrow(
      "The OpenCode service could not be discovered",
    )
  })
})
