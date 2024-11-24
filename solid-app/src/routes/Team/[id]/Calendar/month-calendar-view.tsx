import { Accessor, createSignal, For, Setter, Show } from "solid-js";
import moment from "moment";
import { Event } from "@/schema/Events";
import EventCalendarDisplay from "./event-calendar-display";
import { CalendarJournalType } from ".";

const CalendarView = (props: {
  selectedMonth: Accessor<string>;
  setSelectedMonth: Setter<string>;
  selectedDay: Accessor<number>;
  setSelectedDay: Setter<number>;
  selectedYear: Accessor<number>;
  setSelectedYear: Setter<number>;
  events: Accessor<(Event | CalendarJournalType)[]>;
  isCalendarOpen: Accessor<boolean>;
  currentMonth: Accessor<string>;
  setCurrentMonth: Setter<string>;
  setCurrentYear: Setter<number>;
  currentYear: Accessor<number>;
  teamId: number;
}) => {
  const weekdays = moment.weekdaysMin();
  const months = moment.months();

  const fullYear = Object.fromEntries(
    months.map((monthName, monthIndex) => {
      return [
        monthName,
        new Array(6).fill(1).map((i, rowIndex) => {
          return weekdays.map((dayName, colIndex) => {
            const day = moment()
              .year(props.selectedYear())
              .month(monthIndex)
              .date(rowIndex * 7)
              .weekday(colIndex);
            return day.month() == monthIndex ? day.format("D") : "";
          });
        }),
      ];
    })
  );
  const handleSelectMonth = (monthName: string, change: number) => {
    const month = moment(monthName, "MMMM");

    if (!month.isValid()) {
      throw new Error("Invalid month name");
    }

    const newMonth = month.add(change, "month");
    props.setSelectedMonth(newMonth.format("MMMM"));
  };

  const handleSelectDay = (day: string) => {
    props.setSelectedDay(parseInt(day));
    props.setCurrentMonth(props.selectedMonth());
    props.setCurrentYear(props.selectedYear());
  };

  let startX: number;

  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const endX = event.changedTouches[0].clientX;
    if (startX > endX + 50) {
      // swipe left
      if (props.selectedMonth() === "December") {
        props.setSelectedYear(props.selectedYear() + 1);
      }
      handleSelectMonth(props.selectedMonth(), 1);
    } else if (startX < endX - 50) {
      // swipe right
      if (props.selectedMonth() === "January") {
        props.setSelectedYear(props.selectedYear() - 1);
      }
      handleSelectMonth(props.selectedMonth(), -1);
    }
    props.setCurrentMonth(props.selectedMonth());
    props.setCurrentYear(props.selectedYear());
  };

  const hasEventsOnDay = (day: string) => {
    return props.events().some((event) => {
      if (!event.timeStart) return false;
      const eventDate = moment(event.timeStart);
      const date = moment(
        `${day} ${props.currentMonth()} ${props.currentYear()}`
      );
      return eventDate.isSame(date, "day");
    });
  };
  return (
    <>
      <Show when={props.isCalendarOpen()}>
        <div
          class="bg-[#F2F2F2] pt-4 pb-1"
          ontouchstart={handleTouchStart}
          ontouchend={handleTouchEnd}
        >
          <div>
            <div class="grid grid-cols-7 text-center text-lg font-medium text-[#00000080]  mb-1">
              <For each={weekdays}>
                {(weekDayName) => <div class="py-2">{weekDayName}</div>}
              </For>
            </div>

            <For each={fullYear[props.selectedMonth()]}>
              {(days) => (
                <Show when={days[0] || days[6]}>
                  <div class="grid grid-cols-7">
                    <For each={days}>
                      {(day) => {
                        return (
                          <div class="relative pb-4">
                            <div
                              role="button"
                              onClick={() => handleSelectDay(day)}
                              class={`flex items-center justify-center w-7 h-7 mx-auto cursor-pointer ${
                                parseInt(day) === props.selectedDay() &&
                                props.currentMonth() ===
                                  props.selectedMonth() &&
                                props.currentYear() === props.selectedYear()
                                  ? "bg-[#7859ea] text-white"
                                  : "text-[#5d5d5d]"
                              } rounded-full`}
                            >
                              {day}
                            </div>
                            <Show when={hasEventsOnDay(day)}>
                              <div class="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full aspect-square h-2 bg-[#9b82f3]" />
                            </Show>
                          </div>
                        );
                      }}
                    </For>
                  </div>
                </Show>
              )}
            </For>
          </div>
        </div>
      </Show>
      <div class="flex justify-center pt-4 px-3 bg-white">
        <EventCalendarDisplay events={props.events} teamId={props.teamId} />
      </div>
    </>
  );
};

export default CalendarView;
