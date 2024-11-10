import { useLocation, useParams } from "@solidjs/router";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Suspense,
} from "solid-js";
import HarmonyIcon from "~/components/icon/harmony-icon";
import NavBarItem from "./nav-bar-item";
import HomeIcon from "~/components/icon/home-icon";
import CalendarIcon from "~/components/icon/calendar-icon";
import JournalIcon from "~/components/icon/journal-icon";
import ProfileIcon from "~/components/icon/profile-icon";
import { twMerge } from "tailwind-merge";
import { TeamWithDefault } from "../../../drizzle/schema/Teams";

export default function NavBar(props: {
  teamData: { team: TeamWithDefault }[] | undefined;
}) {
  const location = useLocation();
  const currentPath = createMemo(() => location.pathname);
  const params = useParams();
  const [teamId, setTeamId] = createSignal<number | undefined>();
  createEffect(() => {
    const defaultTeam = props.teamData?.find(
      (team) => team.team.defaultTeam === true
    );
    setTeamId(defaultTeam?.team.id || undefined);
    console.log("here", teamId());
  });

  const routes = createMemo(() => {
    if (teamId() === undefined) {
      return;
    }

    return [
      { icon: <HomeIcon />, label: "Home", href: "/landing" },
      { icon: <CalendarIcon />, label: "Calendar", href: "/calendar" },
      { icon: <HarmonyIcon />, label: "Harmony", href: "/harmony-ai/chat" },
      {
        icon: <JournalIcon />,
        label: "Journal",
        href: `/team/${teamId()}/journal`,
      },
      { icon: <ProfileIcon />, label: "Profile", href: "/profile" },
    ];
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <nav
        class={twMerge(
          "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50",
          currentPath().includes("/harmony-ai/") ||
            currentPath().includes(`/team/${params.id}/journal/`) ||
            currentPath().includes(`/calendar/create`)
            ? "hidden"
            : ""
        )}
      >
        <div class="max-w-screen-lg mx-auto px-4">
          <div class="flex justify-between items-center py-2">
            <For each={routes()}>
              {(route) => (
                <NavBarItem
                  icon={route.icon}
                  label={route.label}
                  href={route.href}
                  active={currentPath() === route.href}
                />
              )}
            </For>
          </div>
        </div>
      </nav>
    </Suspense>
  );
}
