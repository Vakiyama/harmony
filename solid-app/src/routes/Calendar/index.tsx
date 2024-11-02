import { createSignal, onMount } from "solid-js";
import { mightFail } from "might-fail";
import type { Event } from "@/schema/Events";
import { getAllEvents } from "~/api/calendar";
import moment from "moment";
import CalendarView from "./CalendarView";
import WeekCalendarView from "./week-calendar-view";
import CalendarSideMenu from "./CalendarSideMenu";
import EventCalendarDisplay from "./EventCalendarDisplay";
import CalendarTopNav from "~/components/calendar/calendar-top-nav";
moment.locale("en");
moment.updateLocale("en", { weekdaysMin: "S_M_T_W_T_F_S".split("_") });

export type EventFormData = {
  title: string;
  notes: string;
  timeStart: Date | null;
  timeEnd: Date | null;
  location: string;
};

export default function CalendarPage() {
  const [events, setEvents] = createSignal<Event[]>([]);
  const [currentdDay, setCurrentDay] = createSignal<number>(moment().date());
  const [currentMonth, setCurrentMonth] = createSignal(moment().format("MMMM"));
  const [currentYear, setCurrentYear] = createSignal<number>(moment().year());
  const [selectedDay, setSelectedDay] = createSignal<number>(moment().date());
  const [selectedMonth, setSelectedMonth] = createSignal(
    moment().format("MMMM")
  );
  const [selectedYear, setSelectedYear] = createSignal<number>(moment().year());
  onMount(async () => {
    // temp get calendar Id
    await fetchEvents(1);
  });

  const fetchEvents = async (calendarId: number) => {
    const [eventError, eventResult] = await mightFail(getAllEvents(calendarId));
    if (eventError) {
      return console.error(eventError);
    }
    setEvents(eventResult);
  };

  return (
    <div class="relative">
      <CalendarTopNav month={currentMonth} />
      {/* <CalendarSideMenu /> */}
      <div class="max-w-[vw-50%] flex flex-col ">
        {/* <CalendarView
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          events={events}
        /> */}
        <WeekCalendarView
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          events={events}
        />
        <div class="flex justify-center pt-4">
          <EventCalendarDisplay events={events} />
        </div>
      </div>
    </div>
  );
}
