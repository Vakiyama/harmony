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
    <main class="h-screen overflow-hidden flex flex-col">
      <section class="h-full mt-20">
        <div class="flex flex-row items-center justify-between">
          <h1 class="ml-4 text-2xl">Coming up</h1>
          <p class="mr-4 text-neutral-600">see all</p>
        </div>
        <div>
          <Show when={events()}>
            <>
              {events()?.map((event, index) => {
                return <EventCard event={event}></EventCard>;
              })}
            </>
          </Show>
        </div>
      </section>
      <section>
        <div class="flex flex-col">
          <p class="text-2xl font-semibold mt-8 ml-4">While you were away...</p>
          <LandingContent />
        </div>
      </section>
    </main>
  );
}
