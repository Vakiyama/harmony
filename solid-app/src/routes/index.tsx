import LandingContent from "~/components/landing/LandingContent";
import { getAllEvents } from "~/api/calendar";
import { createResource, Show, useContext } from "solid-js";
import EventCard from "~/components/calendar/EventCard";
import { TeamContext } from "~/components/Layout-Context";
import CalendarIconSVG from "./assets/FaSolidCalendar.svg";
import { A } from "@solidjs/router";

export default function Index() {
  const context = useContext(TeamContext);

  if (!context) {
    return <div>No team data available</div>;
  }

  const { teamListData, refetchTrigger } = context;

  const defaultTeam = () =>
    teamListData()?.find((team) => team.team.defaultTeam === true);

  const [events] = createResource(
    () => {
      const teamId = defaultTeam()?.team.id;
      const refetch = refetchTrigger();
      return teamId ? { teamId, refetch } : undefined;
    },
    async ({ teamId }) => await getAllEvents(teamId, 3)
  );
  return (
    <main class="flex flex-col m-2 gap-4">
      <section class="h-full flex flex-col gap-2">
        <div class="flex flex-row items-center justify-between">
          <h2 class="text-h3 font-medium">Coming up</h2>
          <Show when={defaultTeam()}>
            <A href={`/team/${defaultTeam()?.team.id}/calendar`}>
              <button>
                <p class="text-black">See all</p>
              </button>
            </A>
          </Show>
        </div>
        <div class="flex flex-col gap-2">
          <Show when={events()}>
            <>
              {events()?.map((event) => {
                return <EventCard event={event}></EventCard>;
              })}
            </>
          </Show>
          <Show when={!events() || events()?.length === 0}>
            <div class="border rounded-xl flex flex-row p-4 items-center justify-center gap-3 mx-2 py-3">
              <img src={CalendarIconSVG} class="h-7" />
              <p class="text-xs text-[#1E1E1E]/75 leading-4 py-2 ">
                New upcoming events, tasks, and reminders for the care team will
                appear here.
              </p>
            </div>
          </Show>
        </div>
      </section>
      <section class="">
        <div class="h-full flex flex-col">
          <p class="text-h3 font-medium mb-2">While you were away...</p>
          <LandingContent />
        </div>
      </section>
    </main>
  );
}
