import { Index, createSignal, onMount, onCleanup } from "solid-js";
import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerInput,
  DatePickerRangeText,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
} from "~/components/ui/date-picker";
import { Portal } from "solid-js/web";

const DatePickerDemo = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  // reference to the DatePickerInput for triggering focus
  let inputRef: HTMLInputElement | undefined;

  const toggleCalendar = () => {
    const newValue = !isOpen();
    console.log("Calendar toggled:", newValue);
    setIsOpen(newValue);
  };

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen() && !target.closest(".date-picker-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });
  return (
    <div class="date-picker-container">
      <DatePicker>
        <div class="relative flex items-center mb-4">
          <DatePickerInput
            ref={inputRef}
            placeholder="Pick a date"
            class="border rounded-md p-2 w-64"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute right-2 h-5 w-5 text-gray-500 cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            onClick={toggleCalendar}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        {isOpen() && (
          <Portal mount={document.body}>
            <DatePickerContent class="bg-white shadow-lg rounded-lg p-4 absolute z-50 top-full left-0 mt-1">
              {/* Day View */}
              <DatePickerView view="day">
                <DatePickerContext>
                  {(api) => (
                    <>
                      <DatePickerViewControl class="mb-2">
                        <DatePickerViewTrigger class="flex justify-between items-center">
                          <DatePickerRangeText />
                        </DatePickerViewTrigger>
                      </DatePickerViewControl>
                      <DatePickerTable class="w-full">
                        <DatePickerTableHead>
                          <DatePickerTableRow class="text-center">
                            <Index each={api().weekDays}>
                              {(weekDay) => (
                                <DatePickerTableHeader class="px-2 py-1">
                                  {weekDay().short}
                                </DatePickerTableHeader>
                              )}
                            </Index>
                          </DatePickerTableRow>
                        </DatePickerTableHead>
                        <DatePickerTableBody>
                          <Index each={api().weeks}>
                            {(week) => (
                              <DatePickerTableRow>
                                <Index each={week()}>
                                  {(day) => (
                                    <DatePickerTableCell value={day()}>
                                      <DatePickerTableCellTrigger class="cursor-pointer text-center hover:bg-gray-200 rounded-md p-2">
                                        {day().day}
                                      </DatePickerTableCellTrigger>
                                    </DatePickerTableCell>
                                  )}
                                </Index>
                              </DatePickerTableRow>
                            )}
                          </Index>
                        </DatePickerTableBody>
                      </DatePickerTable>
                    </>
                  )}
                </DatePickerContext>
              </DatePickerView>
              {/* Month View */}
              <DatePickerView
                view="month"
                class="w-[calc(var(--reference-width)-(0.75rem*2))]"
              >
                <DatePickerContext>
                  {(api) => (
                    <>
                      <DatePickerViewControl class="mb-2">
                        <DatePickerViewTrigger class="flex justify-between items-center">
                          <DatePickerRangeText />
                        </DatePickerViewTrigger>
                      </DatePickerViewControl>
                      <DatePickerTable>
                        <DatePickerTableBody>
                          <Index
                            each={api().getMonthsGrid({
                              columns: 4,
                              format: "short",
                            })}
                          >
                            {(months) => (
                              <DatePickerTableRow>
                                <Index each={months()}>
                                  {(month) => (
                                    <DatePickerTableCell value={month().value}>
                                      <DatePickerTableCellTrigger class="cursor-pointer text-center hover:bg-gray-200 rounded-md p-2">
                                        {month().label}
                                      </DatePickerTableCellTrigger>
                                    </DatePickerTableCell>
                                  )}
                                </Index>
                              </DatePickerTableRow>
                            )}
                          </Index>
                        </DatePickerTableBody>
                      </DatePickerTable>
                    </>
                  )}
                </DatePickerContext>
              </DatePickerView>
              {/* Year View */}
              <DatePickerView
                view="year"
                class="w-[calc(var(--reference-width)-(0.75rem*2))]"
              >
                <DatePickerContext>
                  {(api) => (
                    <>
                      <DatePickerViewControl class="mb-2">
                        <DatePickerViewTrigger class="flex justify-between items-center">
                          <DatePickerRangeText />
                        </DatePickerViewTrigger>
                      </DatePickerViewControl>
                      <DatePickerTable>
                        <DatePickerTableBody>
                          <Index
                            each={api().getYearsGrid({
                              columns: 4,
                            })}
                          >
                            {(years) => (
                              <DatePickerTableRow>
                                <Index each={years()}>
                                  {(year) => (
                                    <DatePickerTableCell value={year().value}>
                                      <DatePickerTableCellTrigger class="cursor-pointer text-center hover:bg-gray-200 rounded-md p-2">
                                        {year().label}
                                      </DatePickerTableCellTrigger>
                                    </DatePickerTableCell>
                                  )}
                                </Index>
                              </DatePickerTableRow>
                            )}
                          </Index>
                        </DatePickerTableBody>
                      </DatePickerTable>
                    </>
                  )}
                </DatePickerContext>
              </DatePickerView>
            </DatePickerContent>
          </Portal>
        )}
      </DatePicker>
    </div>
  );
};

export default DatePickerDemo;
