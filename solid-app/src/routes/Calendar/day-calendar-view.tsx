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
interface NestedEvent extends Event {
  nestedEvents?: Event[];
}
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
  const getEventsForSelectedDay = (): NestedEvent[] => {
    const filteredEvents = props.events().filter((event) => {
      if (!event.timeStart || !event.timeEnd) return false;
      const eventDate = moment(event.timeStart);
      return (
        eventDate.date() === props.selectedDay() &&
        eventDate.month() === moment().month(props.selectedMonth()).month() &&
        eventDate.year() === props.selectedYear()
      );
    });

    filteredEvents.sort((a, b) =>
      moment(a.timeStart).isBefore(moment(b.timeStart)) ? -1 : 1
    );

    const nestedEventsSet = new Set<number>();
    const mappedEvents: Event[] = filteredEvents.map((event, index) => {
      const nestedEvents: Event[] = filteredEvents
        .slice(index + 1)
        .filter((potentialNestedEvent) => {
          return (
            moment(potentialNestedEvent.timeStart).isAfter(
              moment(event.timeStart)
            ) &&
            moment(potentialNestedEvent.timeEnd).isBefore(moment(event.timeEnd))
          );
        });

      nestedEvents.forEach((nestedEvent) => {
        nestedEventsSet.add(nestedEvent.id);
      });

      return {
        ...event,
        nestedEvents: nestedEvents.length > 0 ? nestedEvents : undefined,
      };
    });

    const finalEvents = mappedEvents.filter(
      (event) => !nestedEventsSet.has(event.id)
    );
    console.log(finalEvents);
    return finalEvents;
  };
  const calculateEventPosition = (
    event: Event,
    parentStartMinutes: number = 0
  ) => {
    const start = moment(event.timeStart);
    const end = moment(event.timeEnd);

    const startMinutes =
      start.hours() * 60 + start.minutes() - parentStartMinutes;
    const endMinutes = end.hours() * 60 + end.minutes() - parentStartMinutes;

    const top = 10 + (startMinutes / 60) * 96;
    let height = ((endMinutes - startMinutes) / 60) * 96;
    if (height < 48) {
      height = 48;
    }

    return { top: `${top}px`, height: `${height}px` };
  };

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
    <div class="flex flex-col p-4 h-full">
      <div
        class="text-lg font-medium text-black fixed w-full bg-[#F2F2F2] border-y-1 border-black15 -ml-5 -mt-5 flex flex-col align-center z-10"
        ontouchstart={handleTouchStart}
        ontouchend={handleTouchEnd}
      >
        <h2 class="p-2 text-h4 px-4">{getFormattedDate()}</h2>
      </div>
      <div class="w-full h-full pt-10 pb-32">
        <div class="relative w-full h-full">
          <For each={Array.from({ length: 24 }, (_, hour) => hour)}>
            {(hour) => (
              <div
                class="absolute w-full flex items-center text-sm text-gray-500"
                style={{
                  top: `${hour * 96}px`,
                }}
              >
                <div class="w-16 text-right pr-2">
                  {moment({ hour }).format("h A")}
                </div>
                <div class="bg-gray-300 w-full h-px" />
              </div>
            )}
          </For>
          <For each={getEventsForSelectedDay()}>
            {(event) => {
              const { top, height } = calculateEventPosition(event);
              return (
                <div
                  class="absolute flex-col inline-flex justify-between items-start w-[calc(100%-0.5rem)]"
                  style={{
                    top,
                    height,
                  }}
                >
                  <EventCard
                    event={event}
                    class="ml-[66px] h-full rounded-lg px-4 py-2 shadow-md"
                  />
                  {event.nestedEvents && event.nestedEvents.length > 0 && (
                    <For each={event.nestedEvents}>
                      {(nestedEvent: Event) => {
                        const parentStartMinutes =
                          moment(event.timeStart).hours() * 60 +
                          moment(event.timeStart).minutes() +
                          6;

                        const { top, height } = calculateEventPosition(
                          nestedEvent,
                          parentStartMinutes
                        );

                        return (
                          <div
                            class="absolute left-24 w-[calc(100%-4rem)] flex flex-col justify-between items-start"
                            style={{
                              top,
                              height,
                            }}
                          >
                            <EventCard
                              event={nestedEvent}
                              class="w-[calc(100%-2rem)] rounded-lg px-4 py-2 shadow-md relative z-[1] border-2 border-white"
                            />
                          </div>
                        );
                      }}
                    </For>
                  )}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default DayCalendarView;
