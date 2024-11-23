import { createAsync, useParams } from "@solidjs/router";
import { createMemo, Show } from "solid-js";
import { getTeamFromTeamId } from "~/api/team";
import ProfileTeamContent from "~/components/profile/profile-team-content";
import ProfileUserName from "~/components/profile/profile-user-name";
import TopNav from "~/components/shared/TopNav";

export default function SpecificTeamInfo() {
  const params = useParams();
  const teamId = parseInt(params.id);
  const team = createAsync(async () => await getTeamFromTeamId(teamId), {
    deferStream: true,
  });

  const teamData = createMemo(() => team());
  if (team()) {
    console.log(team());
  }
  return (
    <div class="m-2 h-full">
      {/* header */}
      <Show when={teamData()}>
        <div>
          <TopNav
            leftNavigation="Back"
            name={teamData()?.data.teams.teamName}
          />
        </div>
        <div class="flex flex-col gap-3">
          <div class="flex">
            <ProfileUserName
              photoUrl={teamData()?.data.recipients?.photo || ""}
              firstName={teamData()?.data.recipients?.firstName || ""}
              lastName={teamData()?.data.recipients?.lastName || ""}
              inviteCode={teamData()?.data.teams.inviteCode}
            />
          </div>
          <div class="flex">
            <ProfileTeamContent data={teamData()} />
          </div>
        </div>
      </Show>
    </div>
  );
}
