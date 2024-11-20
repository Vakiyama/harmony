import LandingContent from "~/components/landing/LandingContent";
import { getAllEvents } from "~/api/calendar";
import { createResource, Show, useContext } from "solid-js";
import EventCard from "~/components/calendar/EventCard";
import { TeamContext } from "~/components/Layout-Context";

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
          <p class="text-black">See all</p>
        </div>
        <div class="flex flex-col gap-2">
          <Show when={events()}>
            <>
              {events()?.map((event, index) => {
                return <EventCard event={event}></EventCard>;
              })}
            </>
          </Show>
        </div>
      </section>
      <section class="">
        <div class="h-full flex flex-col">
          <p class="text-h3 font-medium">While you were away...</p>
          <LandingContent />
        </div>
      </section>
    </main>
  );
}
