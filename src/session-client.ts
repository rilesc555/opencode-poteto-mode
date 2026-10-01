import { OpenCode, type SessionListInput, type SessionsResponse } from "@opencode/client"
import { Service } from "@opencode/client/service"

type ServiceEndpoint = NonNullable<Awaited<ReturnType<typeof Service.discover>>>

interface SessionClient {
  readonly session: {
    list(input: SessionListInput): Promise<SessionsResponse>
  }
}

export interface SessionClientDependencies {
  readonly discover: () => Promise<ServiceEndpoint | undefined>
  readonly connect: (endpoint: ServiceEndpoint) => SessionClient
}

export interface ProjectSessionSummary {
  readonly id: string
  readonly title?: string
  readonly updated: number
  readonly directory: string
  readonly outcome?: "succeeded" | "failed" | "interrupted"
}

const dependencies: SessionClientDependencies = {
  discover: () => Service.discover(),
  connect: (endpoint) =>
    OpenCode.make({
      baseUrl: endpoint.url,
      headers: Service.headers(endpoint),
    }),
}

export async function listProjectSessions(
  input: { readonly projectID: string; readonly limit: number; readonly search?: string },
  clientDependencies: SessionClientDependencies = dependencies,
): Promise<readonly ProjectSessionSummary[]> {
  const endpoint = await clientDependencies.discover()
  if (!endpoint) throw new Error("The OpenCode service could not be discovered")

  const client = clientDependencies.connect(endpoint)
  const response = await client.session.list({
    project: input.projectID,
    parentID: null,
    order: "desc",
    limit: input.limit,
    ...(input.search === undefined ? {} : { search: input.search }),
  })
  return response.data.map((session) => ({
    id: session.id,
    updated: session.time.updated,
    directory: session.location.directory,
    ...(session.title === undefined ? {} : { title: session.title }),
    ...(session.outcome === undefined ? {} : { outcome: session.outcome }),
  }))
}
