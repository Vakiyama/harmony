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
import { Index } from "solid-js";
import { Portal } from "solid-js/web";

const DatePickerComponent = () => {
  return (
    <DatePicker>
      <DatePickerInput id="date" name="date" placeholder="Pick a date" />
      <Portal>
        <DatePickerContent>
          <DatePickerView view="day">
            <DatePickerContext>
              {(api) => (
                <>
                  <DatePickerViewControl>
                    <DatePickerViewTrigger>
                      <DatePickerRangeText />
                    </DatePickerViewTrigger>
                  </DatePickerViewControl>
                  <DatePickerTable>
                    <DatePickerTableHead>
                      <DatePickerTableRow>
                        <Index each={api().weekDays}>
                          {(weekDay) => (
                            <DatePickerTableHeader>
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
                                  <DatePickerTableCellTrigger>
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
          <DatePickerView
            view="month"
            class="w-[calc(var(--reference-width)-(0.75rem*2))]"
          >
            <DatePickerContext>
              {(api) => (
                <>
                  <DatePickerViewControl>
                    <DatePickerViewTrigger>
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
                                  <DatePickerTableCellTrigger>
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
          <DatePickerView
            view="year"
            class="w-[calc(var(--reference-width)-(0.75rem*2))]"
          >
            <DatePickerContext>
              {(api) => (
                <>
                  <DatePickerViewControl>
                    <DatePickerViewTrigger>
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
                                  <DatePickerTableCellTrigger>
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
    </DatePicker>
  );
};

export default DatePickerComponent;
