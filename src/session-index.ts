export interface IndexedSession {
  readonly id: string
  readonly projectID: string
  readonly parentID?: string
  readonly title?: string
  readonly updated: number
  readonly directory: string
}

interface StoragePage {
  readonly entries: readonly { readonly key: string; readonly value: unknown }[]
  readonly next?: string
}

export interface SessionStorage {
  scan(options: { prefix: string; after?: string; limit: number }): Promise<StoragePage>
}

function isIndexedSession(value: unknown): value is IndexedSession {
  if (!value || typeof value !== "object") return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === "string" &&
    typeof candidate.projectID === "string" &&
    typeof candidate.updated === "number" &&
    typeof candidate.directory === "string" &&
    (candidate.parentID === undefined || typeof candidate.parentID === "string") &&
    (candidate.title === undefined || typeof candidate.title === "string")
  )
}

export async function listIndexedSessions(
  storage: SessionStorage,
  options: { projectID: string; limit: number; search?: string },
): Promise<readonly IndexedSession[]> {
  const entries: Array<{ readonly key: string; readonly value: unknown }> = []
  let after: string | undefined

  do {
    const page = await storage.scan({ prefix: "session/", after, limit: 500 })
    entries.push(...page.entries)
    after = page.next
  } while (after !== undefined)

  const search = options.search?.toLowerCase()
  return entries
    .map((entry) => entry.value)
    .filter(isIndexedSession)
    .filter((session) => session.projectID === options.projectID && session.parentID === undefined)
    .filter((session) => !search || `${session.title ?? ""} ${session.id}`.toLowerCase().includes(search))
    .sort((a, b) => b.updated - a.updated)
    .slice(0, options.limit)
}
