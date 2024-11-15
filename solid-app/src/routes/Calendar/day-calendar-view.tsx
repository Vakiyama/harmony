import {
  Accessor,
  createMemo,
  createSignal,
  For,
  Setter,
  Show,
} from "solid-js";
import moment from "moment";
import type { Event } from "@/schema/Events";
import EventCard from "~/components/ui/event-card";

const DayCalendarView = (props: {
  selectedDay: Accessor<number>;
  setSelectedDay: Setter<number>;
  selectedMonth: Accessor<string>;
  setSelectedMonth: Setter<string>;
  selectedYear: Accessor<number>;
  setSelectedYear: Setter<number>;
  setCurrentMonth: Setter<string>;
  setCurrentYear: Setter<number>;
  setCurrentDay: Setter<number>;
  currentMonth: Accessor<string>;
  currentYear: Accessor<number>;
  events: Accessor<Event[]>;
}) => {
  const [startX, setStartX] = createSignal(0);
  const getFormattedDate = () => {
    return moment(
      `${props.selectedYear()}-${props.selectedMonth()}-${props.selectedDay()}`,
      "YYYY-MMMM-D"
    ).format("dddd D, YYYY");
  };

  const getEventsForSelectedDay = (): Event[] => {
    return props.events().filter((event) => {
      if (!event.timeStart) return false;
      const eventDate = moment(event.timeStart);
      return (
        eventDate.date() === props.selectedDay() &&
        eventDate.month() === moment().month(props.selectedMonth()).month() &&
        eventDate.year() === props.selectedYear()
      );
    });
  };
  const getEventsByHour = () => {
    const eventsByHour = Array(24)
      .fill(null)
      .map(() => [] as Event[]);

    getEventsForSelectedDay().forEach((event) => {
      if (!event.timeStart) return;
      const eventStartHour = moment(event.timeStart).hour();
      eventsByHour[eventStartHour].push(event);
    });

    return eventsByHour;
  };

  const eventsByHour = createMemo(() => {
    const eventsByHour = Array(24)
      .fill(null)
      .map(() => [] as Event[]);

    getEventsForSelectedDay().forEach((event) => {
      if (!event.timeStart) return;
      const eventStartHour = moment(event.timeStart).hour();
      eventsByHour[eventStartHour].push(event);
    });

    return eventsByHour;
  });
  const handleNavigateDay = (direction: number) => {
    const currentMoment = moment(
      `${props.selectedYear()}-${props.selectedMonth()}-${props.selectedDay()}`,
      "YYYY-MMMM-D"
    );
    const newMoment = currentMoment.add(direction, "day");

    props.setSelectedDay(newMoment.date());
    props.setSelectedMonth(newMoment.format("MMMM"));
    props.setSelectedYear(newMoment.year());

    props.setCurrentDay(newMoment.date());
    if (props.currentMonth() !== newMoment.format("MMMM")) {
      props.setCurrentMonth(newMoment.format("MMMM"));
    }
    if (props.currentYear() !== newMoment.year()) {
      props.setCurrentYear(newMoment.year());
    }

    getEventsForSelectedDay();
  };

  const handleTouchStart = (event: TouchEvent) => {
    setStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const endX = event.changedTouches[0].clientX;
    const delta = endX - startX();

    if (delta < -50) {
      handleNavigateDay(1);
    } else if (delta > 50) {
      handleNavigateDay(-1);
    }
  };
  return (
    <div class="flex flex-col p-4 bg-white rounded shadow pb-20">
      <div
        class="text-lg font-medium text-black fixed w-full bg-[#F2F2F2] border-y-1 border-black15 -ml-5 -mt-5 flex flex-col align-center"
        ontouchstart={handleTouchStart}
        ontouchend={handleTouchEnd}
      >
        <h2 class="p-2 text-h4 px-4">{getFormattedDate()}</h2>
      </div>
      <div class="flex flex-col h-full pt-10">
        <For each={Array.from({ length: 24 }, (_, hour) => hour)}>
          {(hour) => (
            <>
              <div class="flex items-center">
                <div class="w-16 text-right pr-2 text-sm text-gray-500">
                  {moment({ hour }).format("h A")}
                </div>
                <div class=" bg-gray-300 w-full h-[0.1px]" />
              </div>
              <div class="flex items-start gap-2 py-2">
                <div class="flex-1">
                  <Show when={eventsByHour()[hour].length > 0} fallback={<></>}>
                    <div class="w-full flex-col justify-start items-end gap-5 inline-flex max-h-screen">
                      <For each={eventsByHour()[hour]}>
                        {(event) => {
                          return (
                            <div class="w-full flex">
                              <div class="w-full flex-col inline-flex ml-16 mr-2">
                                <EventCard event={event} />
                              </div>
                            </div>
                          );
                        }}
                      </For>
                    </div>
                  </Show>
                </div>
              </div>
            </>
          )}
        </For>
      </div>
    </div>
  );
};

export default DayCalendarView;
