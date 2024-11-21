import { Accessor, createSignal, For, Setter, Show } from "solid-js";
import moment from "moment";
import { Event } from "@/schema/Events";
import EventCalendarDisplay from "./event-calendar-display";

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
  events: Accessor<Event[]>;
  isCalendarOpen: Accessor<boolean>;
  teamId: number;
}) => {
  const weekdays = moment.weekdaysMin();

  const [currentWeekStart, setCurrentWeekStart] = createSignal(
    moment().startOf("week")
  );

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
    return props.events().some((event) => {
      if (!event.timeStart) return false;
      const eventDate = moment(event.timeStart);
      return eventDate.isSame(dayInfo.fullDate, "day");
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

  const handleCurrentWeek = (change: number) => {
    const newStart = currentWeekStart().add(change, "week");
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
  };

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
          <div class="grid grid-cols-7 text-center text-lg font-medium text-[#00000080] mb-1">
            <For each={weekdays}>
              {(weekDayName) => <div class="py-2">{weekDayName}</div>}
            </For>
          </div>
          <div class="grid grid-cols-7 pb-3">
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
                    <Show when={hasEventsOnDay(dayInfo)}>
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full aspect-square h-2 bg-[#9b82f3]" />
                    </Show>
                  </div>
                );
              }}
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

export default WeekCalendarView;
