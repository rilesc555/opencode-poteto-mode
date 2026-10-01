import { OpenCode, type MessageListInput, type SessionDiffInput } from "@opencode/client"
import { Service } from "@opencode/client/service"

export type InspectionClient = Pick<ReturnType<typeof OpenCode.make>, "session" | "message">

export async function connectSessionClient(): Promise<InspectionClient> {
  const endpoint = await Service.discover()
  if (!endpoint) throw new Error("The OpenCode service could not be discovered")
  return OpenCode.make({ baseUrl: endpoint.url, headers: Service.headers(endpoint) })
}

async function assertProject(client: InspectionClient, projectID: string, sessionID: string, signal?: AbortSignal) {
  const session = await client.session.get({ sessionID }, { signal })
  if (session.projectID !== projectID) throw new Error("The requested session belongs to another project")
}

export async function activeProjectSessions(client: InspectionClient, projectID: string, signal?: AbortSignal) {
  const active = await client.session.active({ signal })
  const sessions = await Promise.all(
    Object.keys(active).map((sessionID) => client.session.get({ sessionID }, { signal })),
  )
  return sessions.filter((session) => session.projectID === projectID).map((session) => ({
    id: session.id,
    title: session.title,
    parentID: session.parentID,
    directory: session.location.directory,
    status: "running",
  }))
}

export async function projectSessionMessages(
  client: InspectionClient,
  projectID: string,
  input: MessageListInput,
  signal?: AbortSignal,
) {
  await assertProject(client, projectID, input.sessionID, signal)
  const { order, ...page } = input
  return client.message.list({
    ...page,
    limit: input.limit ?? 20,
    ...(input.cursor ? {} : { order: order ?? "desc" }),
  }, { signal })
}

export async function projectSessionDiff(
  client: InspectionClient,
  projectID: string,
  input: SessionDiffInput,
  signal?: AbortSignal,
) {
  await assertProject(client, projectID, input.sessionID, signal)
  return client.session.diff(input, { signal })
}
