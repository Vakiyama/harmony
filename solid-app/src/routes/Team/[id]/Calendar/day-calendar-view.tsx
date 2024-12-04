import { Accessor, createSignal, For, Setter, Show } from "solid-js";
import moment from "moment";
import EventCard from "~/components/ui/event-card";
import { CalendarEventType, CalendarJournalType } from ".";
interface NestedEvent extends CalendarEventType {
  nestedEvents?: (CalendarEventType | CalendarJournalType)[];
}
interface NestedJournal extends CalendarJournalType {
  nestedEvents?: (CalendarEventType | CalendarJournalType)[];
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
  events: Accessor<(CalendarEventType | CalendarJournalType)[]>;
  isCalendarOpen: Accessor<boolean>;
  teamId: number;
}) => {
  const [startX, setStartX] = createSignal(0);

  const getFormattedDate = () => {
    return moment(
      `${props.selectedYear()}-${props.selectedMonth()}-${props.selectedDay()}`,
      "YYYY-MMMM-D"
    ).format("dddd D, YYYY");
  };
  const getEventsForSelectedDay = (): (NestedEvent | NestedJournal)[] => {
    const filteredEvents = props.events().filter((event) => {
      if (!event.timeStart) return false;
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

    const findNestedEvents = (
      parentEvent: CalendarEventType | CalendarJournalType,
      remainingEvents: (CalendarEventType | CalendarJournalType)[]
    ): (CalendarEventType | CalendarJournalType)[] => {
      const directNestedEvents = remainingEvents.filter(
        (potentialNestedEvent) => {
          let backUpPotentialEndTime = new Date(
            potentialNestedEvent.timeStart!
          );
          backUpPotentialEndTime?.setMinutes(
            backUpPotentialEndTime.getMinutes() + 50
          );

          let backUpParentEndTime = new Date(parentEvent.timeStart!);
          backUpParentEndTime?.setMinutes(
            backUpParentEndTime.getMinutes() + 50
          );

          let timeStart = new Date(potentialNestedEvent.timeStart!);

          return (
            moment(
              potentialNestedEvent.timeEnd ?? backUpPotentialEndTime
            ).isBefore(moment(parentEvent.timeEnd ?? backUpParentEndTime)) &&
            moment(potentialNestedEvent.timeStart).isAfter(
              moment(parentEvent.timeStart)
            )
          );
        }
      );

      // Process each direct nested event recursively
      return directNestedEvents.map((nestedEvent) => {
        const furtherNestedEvents = findNestedEvents(
          nestedEvent,
          remainingEvents.filter((e) => e.index !== nestedEvent.index)
        );

        // Add all nested events to the set
        nestedEventsSet.add(nestedEvent.index);
        furtherNestedEvents.forEach((e) => nestedEventsSet.add(e.index));

        return {
          ...nestedEvent,
          nestedEvents:
            furtherNestedEvents.length > 0 ? furtherNestedEvents : undefined,
        };
      });
    };

    const mappedEvents: (CalendarEventType | CalendarJournalType)[] =
      filteredEvents.map((event) => {
        const nestedEvents = findNestedEvents(
          event,
          filteredEvents.filter((e) => e.index !== event.index)
        );

        return {
          ...event,
          nestedEvents: nestedEvents.length > 0 ? nestedEvents : undefined,
        };
      });
    const finalEvents = mappedEvents.filter(
      (event) => !nestedEventsSet.has(event.index)
    );

    return finalEvents;
  };

  function getNestedLevel(event: NestedEvent | NestedJournal) {
    if (!event.nestedEvents || event.nestedEvents.length === 0) {
      return 0;
    }
    let maxNestedLevel = 0;
    event.nestedEvents.forEach((nestedEvent) => {
      maxNestedLevel = Math.max(maxNestedLevel, getNestedLevel(nestedEvent));
    });
    return maxNestedLevel + 1;
  }

  function findEventDepth(
    eventToFind: NestedEvent | NestedJournal,
    events: (NestedEvent | NestedJournal)[],
    currentDepth: number = 0
  ): number {
    let maxDepth = -1;

    events.forEach((event) => {
      if (event.index === eventToFind.index) {
        maxDepth = Math.max(maxDepth, currentDepth);
      }

      if (event.nestedEvents && event.nestedEvents.length > 0) {
        const nestedDepth = findEventDepth(
          eventToFind,
          event.nestedEvents,
          currentDepth + 1
        );
        maxDepth = Math.max(maxDepth, nestedDepth);
      }
    });

    return maxDepth;
  }

  const calculateEventPosition = (
    allEvents: (NestedEvent | NestedJournal)[],
    event: NestedEvent | NestedJournal,
    parentStartMinutes: number = 0
  ) => {
    const start = moment(event.timeStart);
    let journalEndTime = new Date(event.timeStart!);
    journalEndTime?.setMinutes(journalEndTime.getMinutes() + 30);

    const end = moment(event.timeEnd ?? journalEndTime);
    const startMinutes =
      start.hours() * 60 + start.minutes() - parentStartMinutes;
    const endMinutes = end.hours() * 60 + end.minutes() - parentStartMinutes;

    const top = 10 + (startMinutes / 60) * 96;
    let height = ((endMinutes - startMinutes) / 60) * 96;
    let left = findEventDepth(event, allEvents) * 7;

    if (height < 48) {
      height = 48;
    }

    return {
      top: `${top}px`,
      height: `${height}px`,
      left: `calc(${left}% + 65px)`,
    };
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
    <>
      <div class="flex flex-col p-4 h-full w-full ">
        <Show when={props.isCalendarOpen()}>
          <div
            class="text-lg font-medium z-[2] text-black fixed top-[130px] w-full bg-[#F2F2F2] border-y-1 border-black15 -ml-5 -mt-5 flex flex-col align-center"
            ontouchstart={handleTouchStart}
            ontouchend={handleTouchEnd}
          >
            <h2 class="p-2 text-h4 px-4">{getFormattedDate()}</h2>
          </div>
        </Show>
        <div class="w-full h-full">
          <div class="relative w-full h-full overflow-scroll overflow-x-hidden">
            <div class="sticky left-0">
              <For each={Array.from({ length: 25 }, (_, hour) => hour)}>
                {(hour) => (
                  <div
                    class="absolute w-full flex items-center text-sm text-gray-500"
                    style={{
                      top: `${hour * 96}px`,
                    }}
                  >
                    <div class="w-16 text-right pr-2   right-0" id="this">
                      {moment({ hour }).format("h A")}
                    </div>
                    <div class="bg-gray-300 w-dvw h-px" />
                  </div>
                )}
              </For>
            </div>
            <For each={getEventsForSelectedDay()}>
              {(event) => {
                const { top, height } = calculateEventPosition(
                  getEventsForSelectedDay(),
                  event
                );
                return (
                  <div
                    class="absolute flex-col inline-flex justify-between items-start w-[calc(100%-0.5rem)]"
                    style={{
                      top,
                      height,
                      width: "97%",
                      left: "1vw",
                      "z-index": getNestedLevel(event),
                    }}
                  >
                    <EventCard
                      teamId={props.teamId}
                      event={event}
                      class={`ml-[66px] h-full rounded-lg px-4 py-2 ${
                        event.type === "event" ? "items-start" : ""
                      }`}
                    />
                    {event.nestedEvents && event.nestedEvents.length > 0 && (
                      <For each={event.nestedEvents}>
                        {(
                          nestedEvent: CalendarEventType | CalendarJournalType
                        ) => {
                          const parentStartMinutes =
                            moment(event.timeStart).hours() * 60 +
                            moment(event.timeStart).minutes() +
                            6;

                          const { top, height, left } = calculateEventPosition(
                            getEventsForSelectedDay(),
                            nestedEvent,
                            parentStartMinutes
                          );
                          return (
                            <div
                              class={`absolute w-[calc(100%-3rem)]`}
                              style={{
                                top,
                                height,
                                left,
                                width: `calc(97vw - ${left} + 1px)`,
                                "z-index": getNestedLevel(event),
                              }}
                            >
                              <EventCard
                                teamId={props.teamId}
                                event={nestedEvent}
                                class={`w-[calc(100%-2rem)] rounded-lg px-4 py-2 relative z-[1] border-2 border-white h-full ${
                                  event.type === "event" ? "items-start" : ""
                                } `}
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
    </>
  );
};

export default DayCalendarView;
