import { useLocation, useParams } from "@solidjs/router";
import { Component, createEffect, createSignal, JSXElement } from "solid-js";
import TopNav from "~/components/shared/TopNav";
import { LandingHeader } from "./landing/LandingHeader";
import { getListOfTeams } from "~/api/team";
import { TeamWithDefault } from "@/schema/Teams";
import NavBar from "./shared/nav-bar";
import { TeamContext, TeamContextType } from "./Layout-Context";

const Layout: Component<{ children: JSXElement }> = (props) => {
  const location = useLocation();
  const params = useParams();
  const [teamListData, setTeamListData] = createSignal<
    { team: TeamWithDefault }[] | undefined
  >(undefined);

  const [refetchTrigger, setRefetchTrigger] = createSignal(0);
  createEffect(async () => {
    const teamData = await getListOfTeams();
    setTeamListData(teamData);
    setRefetchTrigger((prev) => prev + 1);
    console.log(teamListData());
  });

  const contextValue: TeamContextType = {
    teamListData,
    refetchTrigger,
    setRefetchTrigger,
  };
  const renderTopNav = () => {
    if (location.pathname.startsWith(`/team/${params.id}/journal/`)) {
      return (
        <TopNav
          name=""
          leftNavigation={<div>Back</div>}
          rightNavigation={
            <div class="flex items-center justify-center aspect-square bg-black rounded-full w-[30px] h-[30px]">
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.60125 1.97374L8.1875 2.50441C8.075 2.54581 8 2.65495 8 2.77539C8 2.89582 8.075 3.00496 8.1875 3.04636L9.60125 3.57703L10.13 4.99589C10.1713 5.1088 10.28 5.18407 10.4 5.18407C10.52 5.18407 10.6288 5.1088 10.67 4.99589L11.1988 3.57703L12.6125 3.04636C12.725 3.00496 12.8 2.89582 12.8 2.77539C12.8 2.65495 12.725 2.54581 12.6125 2.50441L11.1988 1.97374L10.67 0.554878C10.6288 0.441971 10.52 0.366699 10.4 0.366699C10.28 0.366699 10.1713 0.441971 10.13 0.554878L9.60125 1.97374ZM2.52875 15.2479C1.8275 15.9517 1.8275 17.0958 2.52875 17.8033L3.82625 19.1055C4.5275 19.8093 5.6675 19.8093 6.3725 19.1055L20.6713 4.75126C21.3725 4.04747 21.3725 2.90335 20.6713 2.1958L19.3738 0.897363C18.6725 0.193575 17.5325 0.193575 16.8275 0.897363L2.52875 15.2479ZM18.9725 3.47541L15.035 7.42716L14.1613 6.55025L18.0988 2.5985L18.9725 3.47541ZM1.08125 4.77761C0.912503 4.84159 0.800003 5.00342 0.800003 5.18407C0.800003 5.36472 0.912503 5.52656 1.08125 5.59054L3.2 6.38841L3.995 8.51483C4.05875 8.68419 4.22 8.7971 4.4 8.7971C4.58 8.7971 4.74125 8.68419 4.805 8.51483L5.6 6.38841L7.71875 5.59054C7.8875 5.52656 8 5.36472 8 5.18407C8 5.00342 7.8875 4.84159 7.71875 4.77761L5.6 3.97973L4.805 1.85331C4.74125 1.68395 4.58 1.57104 4.4 1.57104C4.22 1.57104 4.05875 1.68395 3.995 1.85331L3.2 3.97973L1.08125 4.77761ZM14.2813 14.4124C14.1125 14.4763 14 14.6382 14 14.8188C14 14.9995 14.1125 15.1613 14.2813 15.2253L16.4 16.0232L17.195 18.1496C17.2588 18.3189 17.42 18.4318 17.6 18.4318C17.78 18.4318 17.9413 18.3189 18.005 18.1496L18.8 16.0232L20.9188 15.2253C21.0875 15.1613 21.2 14.9995 21.2 14.8188C21.2 14.6382 21.0875 14.4763 20.9188 14.4124L18.8 13.6145L18.005 11.4881C17.9413 11.3187 17.78 11.2058 17.6 11.2058C17.42 11.2058 17.2588 11.3187 17.195 11.4881L16.4 13.6145L14.2813 14.4124Z"
                  fill="#FCFCFC"
                />
              </svg>
            </div>
          }
        />
      );
    } else if (
      location.pathname.startsWith("/landing") ||
      location.pathname.startsWith(`/team/${params.id}/journal`)
    ) {
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
      <div class="h-full">
        {renderTopNav()}
        <div class="h-full">{props.children}</div>
        {location.pathname.startsWith("/api") ||
        location.pathname.startsWith("/harmony-ai") ||
        location.pathname.startsWith("/team/create") ? null : (
          <NavBar teamData={teamListData()} />
        )}
      </div>
    </TeamContext.Provider>
  );
};

export default Layout;
