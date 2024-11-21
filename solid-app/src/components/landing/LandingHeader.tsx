import { createAsync, RouteDefinition, useAction } from "@solidjs/router";
import { TeamWithDefault } from "../../../drizzle/schema/Teams";
import { BiSolidBell } from "solid-icons/bi";
import { FaSolidAngleDown } from "solid-icons/fa";
import {
  createEffect,
  createSignal,
  onMount,
  Setter,
  Suspense,
} from "solid-js";
import { updateDefaultTeam } from "~/api/team";
import { getUser } from "~/api";
import { useTeam } from "~/context/team-context";
export const route = {
  preload() {
    getUser();
  },
} satisfies RouteDefinition;

export function LandingHeader(props: {
  teamData: { team: TeamWithDefault }[] | undefined;
  defaultSetter: Setter<{ team: TeamWithDefault }[] | undefined>;
}) {
  const user = createAsync(async () => await getUser(), { deferStream: true });
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const updateDefaultAction = useAction(updateDefaultTeam);
  const [teamName, setTeamName] = createSignal<string | undefined>();
  const [dropdownVisible, setDropdownVisible] = createSignal<boolean>(false);
  const team = useTeam();

  createEffect(() => {
    const defaultTeam = props.teamData?.find(
      (team) => team.team.defaultTeam === true,
    );
    setTeamName(defaultTeam?.team.name || undefined);
    team.updateTeamId(defaultTeam?.team.id!);
  });

  const toggleDropdown = () => {
    if (!props.teamData?.length) {
      return;
    }
    setDropdownVisible(!dropdownVisible());
  };

  const setDefaultTeam = async (selectedTeam: TeamWithDefault) => {
    const updatedOrUndefined = await updateDefaultAction(selectedTeam.id);
    props.defaultSetter(updatedOrUndefined);

    setTeamName(selectedTeam.name || undefined);
    team.updateTeamId(selectedTeam.id);

    setDropdownVisible(false);
  };

  return (
    <div class="flex justify-between items-center p-4 bg-white w-full fixed top-0">
      <div class="flex flex-col">
        <div class="flex flex-row items-center gap-2" onClick={toggleDropdown}>
          <Suspense fallback={<div>Loading team...</div>}>
            <h1 class="text-h1 font-medium">
              {teamName() !== undefined
                ? teamName()
                : `Hello ${user()?.firstName || ""} ${
                    user()?.lastName || ""
                  }`.trim() || "Team"}
            </h1>
          </Suspense>
          <div class="flex-none">
            <svg
              width="15"
              height="9"
              viewBox="0 0 15 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.61753 8.5082C7.10562 8.99629 7.89828 8.99629 8.38637 8.5082L14.6339 2.26064C15.122 1.77255 15.122 0.979891 14.6339 0.4918C14.1458 0.00370978 13.3532 0.00370978 12.8651 0.4918L7.5 5.85689L2.13491 0.495705C1.64682 0.00761415 0.854158 0.00761415 0.366068 0.495705C-0.122023 0.983795 -0.122023 1.77645 0.366068 2.26454L6.61363 8.5121L6.61753 8.5082Z"
                fill="#1E1E1E"
              />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-500">{currentDate}</p>

        {dropdownVisible() && (
          <div class="absolute bg-white border rounded-lg shadow-lg mt-2 p-2 w-48">
            <ul class="list-none">
              {props.teamData?.map((item) => (
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
      </div>

      <div class="flex flex-col items-end">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 30C15.9216 30.0012 16.8207 29.7129 17.5722 29.1752C18.3237 28.6376 18.8904 27.8773 19.1935 27H10.8066C11.1097 27.8773 11.6763 28.6376 12.4279 29.1752C13.1794 29.7129 14.0785 30.0012 15 30ZM25.4167 18.879V12C25.4167 7.1745 22.1652 3.1095 17.7605 1.887C17.3244 0.78 16.259 0 15 0C13.7411 0 12.6756 0.78 12.2396 1.887C7.83486 3.111 4.58337 7.1745 4.58337 12V18.879L2.04319 21.4395C1.90473 21.5786 1.79493 21.7438 1.7201 21.9258C1.64527 22.1079 1.6069 22.303 1.60718 22.5V24C1.60718 24.3978 1.76396 24.7794 2.04303 25.0607C2.3221 25.342 2.70061 25.5 3.09527 25.5H26.9048C27.2995 25.5 27.678 25.342 27.957 25.0607C28.2361 24.7794 28.3929 24.3978 28.3929 24V22.5C28.3932 22.303 28.3548 22.1079 28.28 21.9258C28.2051 21.7438 28.0953 21.5786 27.9569 21.4395L25.4167 18.879Z"
            fill="#1E1E1E"
          />
        </svg>
      </div>
    </div>
  );
}
