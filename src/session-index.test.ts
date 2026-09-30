import { describe, expect, test } from "bun:test"
import { listIndexedSessions, type SessionStorage } from "./session-index.ts"

describe("session index", () => {
  test("paginates and keeps top-level sessions from one project", async () => {
    const pages = [
      {
        entries: [
          { key: "session/a", value: { id: "a", projectID: "one", updated: 1, directory: "/one" } },
          {
            key: "session/child",
            value: { id: "child", parentID: "a", projectID: "one", updated: 3, directory: "/one" },
          },
        ],
        next: "page-2",
      },
      {
        entries: [
          { key: "session/b", value: { id: "b", projectID: "one", title: "Target", updated: 2, directory: "/one" } },
          { key: "session/c", value: { id: "c", projectID: "two", updated: 4, directory: "/two" } },
        ],
      },
    ]
    const storage: SessionStorage = {
      scan: async ({ after }) => pages[after === undefined ? 0 : 1]!,
    }

    expect(await listIndexedSessions(storage, { projectID: "one", limit: 10 })).toEqual([
      { id: "b", projectID: "one", title: "Target", updated: 2, directory: "/one" },
      { id: "a", projectID: "one", updated: 1, directory: "/one" },
    ])
    expect(await listIndexedSessions(storage, { projectID: "one", limit: 10, search: "target" })).toHaveLength(1)
  })
})
