import { Accessor, For, Setter, Show } from "solid-js";
import type { Event } from "@/schema/Events";
import EventCard from "~/components/ui/event-card";
import moment from "moment";

const EventCalendarDisplay = (props: {
  events: Accessor<Event[]>;
  selectedDay: Accessor<number>;
  selectedMonth: Accessor<string>;
  selectedYear: Accessor<number>;
  setSelectedDay: Setter<number>;
  setSelectedMonth: Setter<string>;
  setSelectedYear: Setter<number>;
  setCurrentMonth: Setter<string>;
  setCurrentYear: Setter<number>;
}) => {
  const getDayName = (date: string) => {
    return moment.weekdaysShort()[moment(date).day()].toUpperCase();
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
    const groupedEvents = getGroupedEvents();
    return Object.keys(groupedEvents)
      .sort()
      .map((dateStr) => {
        const date = moment(dateStr);
        return {
          day: date.format("D"),
          month: date.format("MMMM"),
          year: date.year(),
          fullDate: date,
          formattedDate: dateStr,
        };
      });
  };

  const handleSelectDay = (dayInfo: {
    day: string;
    month: string;
    year: number;
  }) => {
    props.setSelectedDay(parseInt(dayInfo.day));
    props.setSelectedMonth(dayInfo.month);
    props.setSelectedYear(dayInfo.year);
    props.setCurrentMonth(dayInfo.month);
    props.setCurrentYear(dayInfo.year);
  };
  return (
    <div class="w-full flex-col justify-start items-end gap-5 inline-flex overflow-scroll max-h-screen">
      <For each={getDates()}>
        {(dayInfo) => (
          <div class="self-stretch justify-between items-start inline-flex space-x-5">
            <div class="w-8 flex-col justify-start items-center gap-0.5 inline-flex">
              <div class="self-stretch text-center text-[#5d5d5d]/75 text-[11px] font-normal font-sf-pro leading-[13.20px]">
                {getDayName(dayInfo.formattedDate)}
              </div>
              <div
                role="button"
                // temp unsure if we should let it handle select
                onClick={() => handleSelectDay(dayInfo)}
                class={`flex items-center justify-center w-8 h-8 mx-auto cursor-pointer self-stretch text-center text-[#5d5d5d] text-base font-sf-pro relative leading-tight  ${
                  parseInt(dayInfo.day) === props.selectedDay() &&
                  dayInfo.month === props.selectedMonth() &&
                  dayInfo.year === props.selectedYear()
                    ? "bg-[#7859ea] text-white"
                    : "text-[#5d5d5d]"
                } rounded-full`}
              >
                {dayInfo.day}
              </div>
            </div>
            <div class="w-full flex-col justify-start items-end gap-1 inline-flex">
              <For each={getGroupedEvents()[dayInfo.formattedDate]}>
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
