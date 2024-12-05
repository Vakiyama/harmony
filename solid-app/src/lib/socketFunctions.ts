import { mightFail } from "might-fail";
import { getTeamMembersFromTeamId } from "~/api/calendar";
import { clientSocket as socket } from "./clientSocket";
import { ClientToServerEvents } from "~/types/socket";

export const sendJournalMessage = async (
  socketMessage: keyof ClientToServerEvents,
  teamId: number,
  type: string
) => {
  const [getTeamMemberError, getTeamMemberResult] = await mightFail(
    getTeamMembersFromTeamId(teamId)
  );
  if (getTeamMemberError) {
    console.error("Error getting team members from id", getTeamMemberError);
    return { error: "Failed to get team members" };
  }
  const userIds = getTeamMemberResult.map(
    (members) => members.teammembers.userId
  );
  for (const userId of userIds) {
    socket.emit(socketMessage, {
      type,
      userId: userId.toString(),
    });
  }
};
