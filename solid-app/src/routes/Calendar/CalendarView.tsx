import { Accessor, createSignal, For, Setter, Show } from "solid-js";
import moment from "moment";
import { Event } from "@/schema/Events";

const CalendarView = (props: {
  selectedMonth: Accessor<string>;
  setSelectedMonth: Setter<string>;
  selectedDay: Accessor<number>;
  setSelectedDay: Setter<number>;
  selectedYear: Accessor<number>;
  setSelectedYear: Setter<number>;
  events: Accessor<Event[]>;
}) => {
  const weekdays = moment.weekdaysMin();
  const months = moment.months();

  const [currentMonth, setCurrentMonth] = createSignal(props.selectedMonth());
  const [currentYear, setCurrentYear] = createSignal(props.selectedYear());

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
    setCurrentMonth(props.selectedMonth());
    setCurrentYear(props.selectedYear());
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
  };

  return (
    <div
      class="p-4 bg-[#d9d9d9] rounded-lg shadow-md"
      ontouchstart={handleTouchStart}
      ontouchend={handleTouchEnd}
    >
      <div class="mb-6">
        <div class="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-2">
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
                      <div
                        role="button"
                        onClick={() => handleSelectDay(day)}
                        class={`flex items-center justify-center w-10 h-10 mx-auto cursor-pointer ${
                          parseInt(day) === props.selectedDay() &&
                          currentMonth() === props.selectedMonth() &&
                          currentYear() === props.selectedYear()
                            ? "bg-purple-400 text-white"
                            : "text-black"
                        } rounded-full`}
                      >
                        {day}
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
  );
};

export default CalendarView;
