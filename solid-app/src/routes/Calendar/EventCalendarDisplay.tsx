import { createSignal, For } from "solid-js";
import type { Event } from "@/schema/Events";
import EventCard from "~/components/ui/eventCard";

const EventCalendarDisplay = (props: { events: Event[] }) => {
  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  };

  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  const getGroupedEvents = () => {
    return props.events.reduce((acc, event) => {
      const date = new Date(event.timeStart!).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, Event[]>);
  };

  const getDates = () => {
    return Object.keys(getGroupedEvents()).sort();
  };

  return (
    <div class="w-[366px] flex-col justify-start items-end gap-5 inline-flex">
      <For each={getDates()}>
        {(date) => (
          <div class="self-stretch justify-between items-start inline-flex">
            <div class="w-8 flex-col justify-start items-center gap-0.5 inline-flex">
              <div class="self-stretch text-center text-[#5d5d5d]/75 text-[11px] font-normal font-['SF Pro'] leading-[13.20px]">
                {getDayName(new Date(date))}
              </div>
              <div class="self-stretch text-center text-[#5d5d5d] text-base font-['SF Pro'] leading-tight">
                {getDayNumber(new Date(date))}
              </div>
            </div>
            <div class="w-[315px] flex-col justify-start items-end gap-1 inline-flex">
              <For each={getGroupedEvents()[date]}>
                {(event) => <EventCard event={event} />}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default EventCalendarDisplay;
