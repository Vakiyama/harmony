import { createAsync, useParams } from "@solidjs/router";
import { createMemo, Show } from "solid-js";
import { getTeamFromTeamId } from "~/api/team";
import GeneralInfo from "~/components/profile/general-info";
import ProfileTeamContent from "~/components/profile/profile-team-content";
import ProfileTeamTab from "~/components/profile/profile-team-content";
import ProfileUserName from "~/components/profile/profile-user-name";
import TeamHeader from "~/components/profile/team-header";
import TeamTab from "~/components/profile/team-tab";
import TeamMenuBar from "~/components/profile/team-tab";
import TeamNav from "~/components/profile/team-tab";
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
    <div class="w-full mt-28">
      {/* header */}
      <Show when={teamData()}>
        <div>
          <TopNav
            leftNavigation="Back"
            name={teamData()?.data.teams.teamName}
          />
        </div>
        <div class="">
          <div class="mt-4 mx-4">
            <ProfileUserName
              photoUrl={teamData()?.data.recipients?.photo || ""}
              firstName={teamData()?.data.recipients?.firstName || ""}
              lastName={teamData()?.data.recipients?.lastName || ""}
            />
          </div>
          <div class="mt-4">
            <ProfileTeamContent data={teamData()} />
          </div>
        </div>
      </Show>
    </div>
  );
}
