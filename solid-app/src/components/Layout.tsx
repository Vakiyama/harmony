import { useLocation, useParams } from "@solidjs/router";
import {
  Component,
  createEffect,
  createSignal,
  JSXElement,
  onMount,
} from "solid-js";
import TopNav from "~/components/shared/TopNav";
import { LandingHeader } from "./landing/LandingHeader";
import { getListOfTeams } from "~/api/team";
import { TeamWithDefault } from "@/schema/Teams";
import NavBar from "./shared/nav-bar";
import { TeamContext, TeamContextType } from "./Layout-Context";
import { useTeam } from "~/context/team-context";

const Layout: Component<{ children: JSXElement }> = (props) => {
  const location = useLocation();
  const params = useParams();
  const team = useTeam();
  const [teamListData, setTeamListData] = createSignal<
    { team: TeamWithDefault }[] | undefined
  >(undefined);

  const [refetchTrigger, setRefetchTrigger] = createSignal(0);
  createEffect(async () => {
    const teamData = await getListOfTeams();
    setTeamListData(teamData);
    setRefetchTrigger((prev) => prev + 1);
  });

  onMount(async () => {
    const teamData = await getListOfTeams();
    const defaultTeam = teamData.find((team) => team.team.defaultTeam);
    if (defaultTeam && team.state.id === -1) {
      team.updateTeamId(defaultTeam.team.id);
    } else if (!defaultTeam && team.state.id === -1) {
      if (teamData.length > 0) {
        team.updateTeamId(teamData[0].team.id);
      }
    }
  });

  const contextValue: TeamContextType = {
    teamListData,
    refetchTrigger,
    setRefetchTrigger,
  };
  const renderTopNav = () => {
    if (location.pathname.startsWith(`/team/${params.id}/journal/`)) {
      return <TopNav name="" leftNavigation="Journal" />;
    } else if (location.pathname === "/") {
      return (
        <LandingHeader
          teamData={teamListData()}
          defaultSetter={setTeamListData}
        />
      );
    }
    return null;
  };

  return (
    <TeamContext.Provider value={contextValue}>
      <div class="flex flex-col h-[100dvh] w-screen overflow-hidden">
        <div
          class={`flex-none ${
            location.pathname.startsWith("/harmony-ai/voice") ||
            location.pathname.includes("/calendar/create") ||
            location.pathname.includes("/calendar/event/")
              ? ""
              : "h-[104px]"
          }`}
        >
          {renderTopNav()}
        </div>
        <div
          class={`flex-grow overflow-y-auto ${
            location.pathname.startsWith(`/team/${params.id}/journal/`) ||
            location.pathname.startsWith(`/harmony-ai`) ||
            location.pathname.startsWith(`/team/create`) ||
            location.pathname.startsWith(`/api/auth`)
              ? ""
              : location.pathname.startsWith(`/team/${params.id}/calendar`)
              ? "pb-[150px]"
              : "pb-[100px]"
          }`}
        >
          {props.children}
        </div>

        <div class="flex-none max-h-[77px] bg-transparent">
          {location.pathname.startsWith("/api") ||
          location.pathname.startsWith("/harmony-ai") ||
          location.pathname.startsWith("/team/create") ||
          location.pathname.startsWith(
            `/team/${params.id}/calendar/`
          ) ? null : (
            <NavBar teamData={teamListData()} />
          )}
        </div>
      </div>
    </TeamContext.Provider>
  );
};

export default Layout;
