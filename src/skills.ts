import { Glob } from "bun"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parse } from "yaml"

export interface BundledSkill {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly autoinvoke?: boolean
  readonly path: string
  readonly content: string
}

interface Frontmatter {
  readonly name?: unknown
  readonly description?: unknown
  readonly autoinvoke?: unknown
  readonly "disable-model-invocation"?: unknown
}

const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const skillsRoot = join(pluginRoot, "skills")

function parseSkill(path: string, source: string): BundledSkill {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error(`Missing YAML frontmatter in ${path}`)

  const metadata = parse(match[1] ?? "") as Frontmatter
  const id = path.split("/").at(-2)
  if (!id) throw new Error(`Cannot derive skill ID from ${path}`)
  if (typeof metadata.name !== "string") throw new Error(`Missing skill name in ${path}`)

  return {
    id,
    name: metadata.name,
    description: typeof metadata.description === "string" ? metadata.description : undefined,
    autoinvoke:
      typeof metadata.autoinvoke === "boolean"
        ? metadata.autoinvoke
        : metadata["disable-model-invocation"] === true
          ? false
          : undefined,
    path,
    content: match[2]?.trim() ?? "",
  }
}

export async function loadBundledSkills(): Promise<readonly BundledSkill[]> {
  const glob = new Glob("*/SKILL.md")
  const paths = Array.from(glob.scanSync({ cwd: skillsRoot, absolute: true })).sort()
  return Promise.all(paths.map(async (path) => parseSkill(path, await readFile(path, "utf8"))))
}
