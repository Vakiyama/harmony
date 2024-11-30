import { createEffect, createSignal, JSX, Setter, Show } from "solid-js";
import { A, useAction, useLocation, useParams } from "@solidjs/router";
import { twMerge } from "tailwind-merge";
import ChevronLeft from "../icon/chevron-left";
import { FaSolidAngleDown } from "solid-icons/fa";
import { TeamWithDefault } from "../../../drizzle/schema/Teams";
import { updateDefaultTeam } from "~/api/team";
import { useTeam } from "~/context/team-context";

export default function TopNav(props: {
  name?: JSX.Element;
  leftNavigation?: JSX.Element;
  rightNavigation?: JSX.Element;
  class?: string;
  forTeamSetting?: {
    teamData: { team: TeamWithDefault }[] | undefined;
    defaultSetter: Setter<{ team: TeamWithDefault }[] | undefined>;
  };
}) {
  const location = useLocation();
  const params = useParams();
  const [teamName, setTeamName] = createSignal<string | undefined>();
  const [dropdownVisible, setDropdownVisible] = createSignal<boolean>(false);
  const updateDefaultAction = useAction(updateDefaultTeam);
  const team = useTeam();
  createEffect(() => {
    const defaultTeam = props.forTeamSetting?.teamData?.find(
      (team) => team.team.defaultTeam === true
    );
    setTeamName(defaultTeam?.team.name || undefined);
    team.updateTeamId(defaultTeam?.team.id!);
  });
  const toggleDropdown = () => {
    if (!props.forTeamSetting?.teamData?.length) {
      return;
    }
    setDropdownVisible(!dropdownVisible());
  };
  const setDefaultTeam = async (selectedTeam: TeamWithDefault) => {
    const updatedOrUndefined = await updateDefaultAction(selectedTeam.id);
    props.forTeamSetting?.defaultSetter!(updatedOrUndefined);
    setTeamName(selectedTeam.name || undefined);
    team.updateTeamId(selectedTeam.id);

    setDropdownVisible(false);
  };

  let backLocation;

  if (location.pathname.startsWith(`/team/${params.id}/journal`)) {
    backLocation = `/team/${params.id}/journal`;
  }

  if (location.pathname.includes("/harmony-ai/chat")) {
    backLocation = "/";
  }

  if (location.pathname.includes("/harmony-ai/voice")) {
    backLocation = "/harmony-ai/chat";
  }

  if (
    location.pathname.includes("/profile/") ||
    location.pathname.endsWith(`/team/${params.id}`)
  ) {
    backLocation = "/profile";
  }

  if (location.pathname.startsWith(`/team/${params.id}/calendar/create`)) {
    backLocation = `/team/${params.id}/calendar`;
  }

  return (
    <div
      class={twMerge(
        "w-full flex flex-row min-h-[95px] bg-white fixed top-0 items-center",
        props.class ? props.class : ""
      )}
    >
      <div class="w-full flex flex-row px-2 h-full items-center justify-start gap-3">
        {/* Left column */}
        <div class="flex-1 flex items-center">
          {backLocation && props.leftNavigation ? (
            <A href={backLocation} class="flex items-center">
              <div class="flex justify-center items-center gap-1">
                <ChevronLeft />
                <p class="text-h4">{props.leftNavigation}</p>
              </div>
            </A>
          ) : null}
        </div>

        {/* Center column */}
        <div class="flex-1 flex items-center justify-center">
          {location.pathname.startsWith(`/team/${params.id}/journal`) ? (
            <div class="flex flex-row items-center">
              <Show when={teamName()}>
                <h1 class="text-h4 font-medium flex items-center">
                  <span class="truncate overflow-hidden max-w-[120px]">
                    {teamName()}
                  </span>
                  <span class="whitespace-nowrap">'s Care Team</span>
                </h1>
                <FaSolidAngleDown
                  class="ml-2 flex-shrink-0"
                  onClick={() => toggleDropdown()}
                />
                {dropdownVisible() && (
                  <div class="absolute left-0 top-2/3 rounded-b-lg bg-white shadow-lg p-2 w-full">
                    <ul class="list-none">
                      {props.forTeamSetting?.teamData?.map((item) => (
                        <li
                          class="p-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => setDefaultTeam(item.team)}
                        >
                          {item.team.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Show>
            </div>
          ) : props.name ? (
            <div class="flex flex-row items-center">
              <h1 class="text-h4 font-medium flex items-center">
                <span class="truncate overflow-hidden max-w-[120px]">
                  {props.name}
                </span>
                <span class="whitespace-nowrap">'s Care Team</span>
              </h1>
            </div>
          ) : null}
        </div>

        {/* Right column */}
        <div class="flex-1 flex justify-end items-center">
          {location.pathname.startsWith(`/team/${params.id}/journal`) ? (
            //Not Implemented - search & filters for journal
            <div class="flex gap-x-3">
              {/* <svg
                fill="none"
                stroke-width="2"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
                height="24px"
                width="24px"
                style="overflow: visible; color: currentcolor;"
              >
                <path d="M11 3A8 8 0 1 0 11 19 8 8 0 1 0 11 3z"></path>
                <path d="M21 21 16.65 16.65"></path>
              </svg>
              <svg
                fill="none"
                stroke-width="0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="24px"
                width="24px"
                style="overflow: visible; color: currentcolor;"
              >
                <path
                  fill="currentColor"
                  d="M4 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1ZM4 18a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1ZM11 11a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-8Z"
                ></path>
              </svg> */}
            </div>
          ) : props.rightNavigation ? (
            <A href="/" class="text-md">
              {props.rightNavigation}
            </A>
          ) : null}
        </div>
      </div>
    </div>
  );
}
