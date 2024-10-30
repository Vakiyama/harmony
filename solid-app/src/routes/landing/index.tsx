import { MetaProvider } from "@solidjs/meta";
import { LandingHeader } from "~/components/landing/LandingHeader";
import LandingContent from "~/components/landing/LandingContent";
import { TaskName } from "~/components/landing/TaskName";
import Member from "~/components/landing/Member";
import { getAllEvents } from "~/api/calendar";
import { createAsync } from "@solidjs/router";
import { Show } from "solid-js";
import EventCard from "~/components/calendar/EventCard";

export default function Index() {
  const events = createAsync(async () => await getAllEvents(1, 3), {
    deferStream: true,
  });

  return (
    // <MetaProvider>
    <div class="mt-4">
      {/* <LandingHeader /> */}
      <div class="flex flex-row items-center justify-between">
        <h1 class="mt-8 ml-4 text-2xl">Coming up</h1>
        <p class="mt-8 mr-4 text-neutral-600">see all</p>
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
      <p class="text-2xl font-semibold mt-8 ml-4">While you were away...</p>
      <LandingContent />
      <div class="h-[88px]"></div> {/* temporary  */}
    </div>
    // </MetaProvider>
  );
}

// export default Index;
