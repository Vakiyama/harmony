import { useLocation, useParams } from "@solidjs/router";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  Suspense,
} from "solid-js";
import HarmonyIcon from "~/components/icon/harmony-icon";
import NavBarItem from "./nav-bar-item";
import HomeIcon from "~/components/icon/home-icon";
import CalendarIcon from "~/components/icon/calendar-nav-icon";
import JournalIcon from "~/components/icon/journal-icon";
import ProfileIcon from "~/components/icon/profile-icon";
import { twMerge } from "tailwind-merge";
import { TeamWithDefault } from "../../../drizzle/schema/Teams";
import { getUser } from "~/api/server";
import { users } from "@/schema/Users";
import { InferSelectModel } from "drizzle-orm";

export default function NavBar(props: {
  teamData: { team: TeamWithDefault }[] | undefined;
}) {
  const location = useLocation();
  const currentPath = createMemo(() => location.pathname);
  const params = useParams();
  const [teamId, setTeamId] = createSignal<number | undefined>();
  const [user, setUser] = createSignal<Awaited<ReturnType<typeof getUser>>>();

  onMount(async () => {
    setUser(await getUser());
  });

  createEffect(() => {
    const defaultTeam = props.teamData?.find(
      (team) => team.team.defaultTeam === true
    );
    setTeamId(defaultTeam?.team.id || undefined);
  });

  const routes = createMemo(() => {
    return [
      { icon: <HomeIcon />, label: "Home", href: "/" },
      { icon: <CalendarIcon />, label: "Calendar", href: "/calendar" },
      {
        icon: <HarmonyIcon />,
        label: "Harmony",
        href:
          user() &&
          (user() as InferSelectModel<typeof users>).aiPreference === "Voice"
            ? "/harmony-ai/voice"
            : "/harmony-ai/chat",
      },
      {
        icon: <JournalIcon />,
        label: "Journal",
        href:
          teamId() === undefined ? `/team/create` : `/team/${teamId()}/journal`,
      },
      { icon: <ProfileIcon />, label: "Profile", href: "/profile" },
    ];
  });

  return (
    <nav
      class={twMerge(
        "fixed w-full bottom-0 bg-white border-t border-gray-200 shadow-md",
        currentPath().includes("/harmony-ai/") ||
          currentPath().includes(`/team/${params.id}/journal/`) ||
          currentPath().includes(`/calendar/create`)
          ? "hidden"
          : ""
      )}
    >
      <div class="max-w-screen-lg mx-auto">
        <div class="flex justify-between items-center pt-2 pb-5 mx-3">
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
  );
}
