import { Accessor, createSignal, For, Setter } from "solid-js";
import moment from "moment";
import { Event } from "@/schema/Events";

const WeekCalendarView = (props: {
  setSelectedMonth: Setter<string>;
  selectedMonth: Accessor<string>;
  selectedDay: Accessor<number>;
  setSelectedDay: Setter<number>;
  selectedYear: Accessor<number>;
  setSelectedYear: Setter<number>;
  events: Accessor<Event[]>;
}) => {
  const weekdays = moment.weekdaysMin();

  const [currentWeekStart, setCurrentWeekStart] = createSignal(
    moment().startOf("week")
  );
  const [daysInWeek, setDaysInWeek] = createSignal(
    Array.from({ length: 7 }, (_, i) =>
      currentWeekStart().clone().add(i, "days").format("D")
    )
  );
  const handleSelectDay = (day: string) => {
    props.setSelectedDay(parseInt(day));
  };

  const handleSelectWeek = (change: number) => {
    const newStart = currentWeekStart().add(change, "week");
    setCurrentWeekStart(newStart);
    setDaysInWeek(
      Array.from({ length: 7 }, (_, i) =>
        currentWeekStart().clone().add(i, "days").format("D")
      )
    );
    // temp fix me
    // props.setSelectedMonth(newStart.format("MMMM"));
    // props.setSelectedYear(newStart.year());
  };

  let startX: number;

  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const endX = event.changedTouches[0].clientX;
    console.log(daysInWeek());

    if (startX > endX + 50) {
      // swipe left
      handleSelectWeek(1);
    } else if (startX < endX - 50) {
      // swipe right
      handleSelectWeek(-1);
    }
  };

  return (
    <div
      class="bg-[#d9d9d9] pt-4 pb-1"
      ontouchstart={handleTouchStart}
      ontouchend={handleTouchEnd}
    >
      <div class="mb-6">
        <div class="grid grid-cols-7 text-center text-lg font-medium text-[#00000080] mb-1">
          <For each={weekdays}>
            {(weekDayName) => <div class="py-2">{weekDayName}</div>}
          </For>
        </div>
        <div class="grid grid-cols-7">
          <For each={daysInWeek()}>
            {(day) => {
              return (
                <div
                  role="button"
                  onClick={() => handleSelectDay(day)}
                  class={`flex items-center justify-center w-10 h-10 mx-auto cursor-pointer ${
                    parseInt(day) === props.selectedDay() &&
                    currentWeekStart().isSame(moment(), "week")
                      ? "bg-purple-400 text-white"
                      : "text-[#5d5d5d]"
                  } rounded-full`}
                >
                  {day}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default WeekCalendarView;
