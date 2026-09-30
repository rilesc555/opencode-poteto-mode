interface SkillSelection {
  readonly id: string
}

export function isExitPrompt(text: string): boolean {
  return /^(exit|disable|leave|stop) poteto(?: mode)?[.!]?$/.test(text.trim().toLowerCase())
}

export function withSkill(skills: readonly SkillSelection[] | undefined, id: string): readonly SkillSelection[] {
  if (skills?.some((skill) => skill.id === id)) return skills
  return [...(skills ?? []), { id }]
}
