import { createAsync, RouteDefinition, useAction } from "@solidjs/router";
import { TeamWithDefault } from "../../../drizzle/schema/Teams";
import { Title } from "@solidjs/meta";
import { BiSolidBell } from "solid-icons/bi";
import { FaSolidAngleDown } from "solid-icons/fa";
import { createEffect, createSignal, Setter, Suspense } from "solid-js";
import { updateDefaultTeam } from "~/api/team";
import { getUser } from "~/api";
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

  createEffect(() => {
    const defaultTeam = props.teamData?.find(
      (team) => team.team.defaultTeam === true
    );
    setTeamName(defaultTeam?.team.name || undefined);
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

    setDropdownVisible(false);
  };

  return (
    <div class="flex justify-between items-center p-4 bg-white w-full top-0 fixed">
      <div class="flex items-center">
        <div class="flex flex-col">
          <Suspense fallback={<div>Loading team...</div>}>
            <h1 class="text-2xl mr-2">
              {teamName() !== undefined
                ? teamName()
                : `Hello ${user()?.firstName || ""} ${
                    user()?.lastName || ""
                  }`.trim() || "Team"}
            </h1>
          </Suspense>

          <p class="text-sm text-gray-500">{currentDate}</p>
        </div>

        <div class="p-2" onClick={toggleDropdown}>
          <FaSolidAngleDown class="text-gray-600 cursor-pointer" size={20} />
        </div>

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
        <BiSolidBell class="text-black-600 text-xl mb-2" size={27} />
      </div>
    </div>
  );
}
