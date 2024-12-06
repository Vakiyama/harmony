export default function parseTeamMembersToIds(
  teamMembers: { value: number; label: string }[]
) {
  return teamMembers.map((member) => member.value);
}
