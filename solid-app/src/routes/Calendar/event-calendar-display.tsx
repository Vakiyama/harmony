import { Accessor, For } from "solid-js";
import type { Event } from "@/schema/Events";
import EventCard from "~/components/ui/event-card";
import moment from "moment";

const EventCalendarDisplay = (props: { events: Accessor<Event[]> }) => {
  const getDayName = (date: string) => {
    return moment.weekdaysShort()[moment(date).day()].toUpperCase();
  };
  const getDayNumber = (date: string) => {
    return moment(date).date();
  };
  const getGroupedEvents = () => {
    return props.events().reduce((acc, event) => {
      const date = moment(event.timeStart!).format("YYYY-MM-DD");
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
    <div class="w-full flex-col justify-start items-end gap-5 inline-flex overflow-scroll max-h-screen">
      <For each={getDates()}>
        {(date) => (
          <div class="self-stretch justify-between items-start inline-flex space-x-5">
            <div class="w-8 flex-col justify-start items-center gap-0.5 inline-flex">
              <div class="self-stretch text-center text-[#5d5d5d]/75 text-[11px] font-normal font-['SF Pro'] leading-[13.20px]">
                {getDayName(date)}
              </div>
              <div class="self-stretch text-center text-[#5d5d5d] text-base font-['SF Pro'] leading-tight">
                {getDayNumber(date)}
              </div>
            </div>
            <div class="w-full flex-col justify-start items-end gap-1 inline-flex">
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
