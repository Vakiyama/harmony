import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  Setter,
  Show,
} from "solid-js";
import moment from "moment";
import { Event } from "@/schema/Events";
import EventCalendarDisplay from "./event-calendar-display";
import { CalendarJournalType } from ".";
import { getEventBackground } from "~/utils/getEventBackground";
import { cn } from "~/libs/cn";

const WeekCalendarView = (props: {
  selectedDay: Accessor<number>;
  setSelectedDay: Setter<number>;
  selectedMonth: Accessor<string>;
  setSelectedMonth: Setter<string>;
  selectedYear: Accessor<number>;
  setSelectedYear: Setter<number>;
  currentMonth: Accessor<string>;
  setCurrentMonth: Setter<string>;
  currentYear: Accessor<number>;
  setCurrentYear: Setter<number>;
  events: Accessor<(Event | CalendarJournalType)[]>;
  isCalendarOpen: Accessor<boolean>;
  teamId: number;
}) => {
  const [slideDirection, setSlideDirection] = createSignal<
    "left" | "right" | null
  >(null);
  const weekdays = moment.weekdaysMin();

  const [currentWeekStart, setCurrentWeekStart] = createSignal(
    moment().startOf("week")
  );
  const [weekEvents, setWeekEvents] = createSignal(props.events());

  const [daysWithDates, setDaysWithDates] = createSignal(
    Array.from({ length: 7 }, (_, i) => {
      const date = currentWeekStart().clone().add(i, "days");
      return {
        day: date.format("D"),
        month: date.format("MMMM"),
        year: date.year(),
        fullDate: date,
      };
    })
  );

  const hasEventsOnDay = (dayInfo: { fullDate: moment.Moment }) => {
    const matchingEvents = props.events().filter((event) => {
      if (!event.timeStart) return false;
      const eventDate = moment(event.timeStart);
      return eventDate.isSame(dayInfo.fullDate, "day");
    });

    return {
      hasEvents: matchingEvents.length > 0,
      eventCount: matchingEvents.length,
    };
  };

  function getClosestEvents(events: (Event | CalendarJournalType)[]) {
    const now = moment();

    const sortedEvents = events
      .filter((event) => event.timeStart)
      .map((event) => {
        const timeDiff = moment(event.timeStart).diff(now);
        return { ...event, timeDiff };
      })
      .sort((a, b) => {
        const absDiffA = Math.abs(a.timeDiff);
        const absDiffB = Math.abs(b.timeDiff);

        if (a.timeDiff < 0 && b.timeDiff >= 0) return -1;
        if (a.timeDiff >= 0 && b.timeDiff < 0) return 1;

        return absDiffA - absDiffB;
      })
      .slice(0, 3);

    return sortedEvents.sort((a, b) => a.timeDiff - b.timeDiff);
  }

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

  const handleCurrentWeek = (change: number) => {
    setSlideDirection(change > 0 ? "left" : "right");

    setTimeout(() => {
      const newStart = currentWeekStart().clone().add(change, "week");
      setCurrentWeekStart(newStart);

      const midWeek = newStart.clone().add(3, "days");
      props.setCurrentMonth(midWeek.format("MMMM"));
      props.setCurrentYear(midWeek.year());

      setDaysWithDates(
        Array.from({ length: 7 }, (_, i) => {
          const date = newStart.clone().add(i, "days");
          return {
            day: date.format("D"),
            month: date.format("MMMM"),
            year: date.year(),
            fullDate: date,
          };
        })
      );
      setSlideDirection(null);
    }, 300);
  };

  createEffect(() => {
    const startOfWeek = currentWeekStart();
    const endOfWeek = moment(startOfWeek).endOf("week");

    const filteredEvents = props.events().filter((event) => {
      const eventStartTime = moment(event.timeStart);
      return eventStartTime.isBetween(startOfWeek, endOfWeek, null, "[]");
    });
    setWeekEvents(filteredEvents);
    console.log(filteredEvents);
  }, [currentWeekStart]);

  let startX: number;

  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const endX = event.changedTouches[0].clientX;

    if (startX > endX + 50) {
      handleCurrentWeek(1);
    } else if (startX < endX - 50) {
      handleCurrentWeek(-1);
    }
  };

  return (
    <>
      <Show when={props.isCalendarOpen()}>
        <div
          class="bg-[#F2F2F2]"
          ontouchstart={handleTouchStart}
          ontouchend={handleTouchEnd}
        >
          <div class="grid grid-cols-7 text-center text-lg font-medium text-[#00000080] mb-1 transition-transform duration-300">
            <For each={weekdays}>
              {(weekDayName) => <div class="py-2">{weekDayName}</div>}
            </For>
          </div>
          <div
            class={cn("grid grid-cols-7 pb-3", {
              "animate-fadeLeft": slideDirection() === "left",
              "animate-fadeRight": slideDirection() === "right",
            })}
          >
            <For each={daysWithDates()}>
              {(dayInfo) => {
                return (
                  <div class="relative pb-2">
                    <div
                      role="button"
                      onClick={() => handleSelectDay(dayInfo)}
                      class={`flex items-center justify-center w-7 h-7 mx-auto cursor-pointer ${
                        parseInt(dayInfo.day) === props.selectedDay() &&
                        dayInfo.month === props.selectedMonth() &&
                        dayInfo.year === props.selectedYear()
                          ? "bg-[#7859ea] text-white"
                          : "text-[#5d5d5d]"
                      } rounded-full`}
                    >
                      {dayInfo.day}
                    </div>
                    <Show when={hasEventsOnDay(dayInfo).hasEvents}>
                      <div
                        class={`absolute -bottom-1 h-2 ${
                          hasEventsOnDay(dayInfo).eventCount >= 3
                            ? "left-[calc(50%-8px)]"
                            : hasEventsOnDay(dayInfo).eventCount > 1
                            ? "left-[calc(50%-6px)]"
                            : "left-[calc(50%-4px)]"
                        }`}
                      >
                        <For
                          each={getClosestEvents(
                            props.events().filter((event) => {
                              const eventMoment = moment(event.timeStart);
                              const dayInfoUTC = dayInfo.fullDate.utc();
                              return eventMoment.isSame(dayInfoUTC, "day");
                            })
                          )}
                        >
                          {(event, index) => {
                            const horizontalOffset = index() * 4;
                            return index() <= 2 ? (
                              <div
                                class={cn(
                                  `absolute rounded-full w-[9px] h-[9px] border border-white/85`,
                                  getEventBackground(event, true)
                                )}
                                style={{
                                  transform: `translateX(${horizontalOffset}px)`,
                                }}
                              ></div>
                            ) : null;
                          }}
                        </For>
                      </div>
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </Show>
      <div class="flex justify-center pt-4 px-3 bg-white pb-3 h-full">
        <EventCalendarDisplay events={weekEvents} teamId={props.teamId} />
      </div>
    </>
  );
};

export default WeekCalendarView;
