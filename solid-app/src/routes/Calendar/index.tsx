import { createSignal, For, onMount, Show } from "solid-js";
import { mightFail } from "might-fail";
import type { Event } from "@/schema/Events";
import {
  getCalendarsFromTeamId,
  getAllEvents,
  updateEvent,
  deleteEvent,
} from "~/api/calendar";
import UpdateModal from "./Event/[id]/updateModal";
import DeleteModal from "./Event/[id]/deleteModal";
import CalendarView from "./CalendarView";
import moment from "moment";
import EventCard from "~/components/ui/eventCard";
import WeekCalendarView from "./WeekCalendarView";
import CalendarSideMenu from "./CalendarSideMenu";
import EventCalendarDisplay from "./EventCalendarDisplay";
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
  const [selectedDay, setSelectedDay] = createSignal<number>(moment().date());
  const [selectedMonth, setSelectedMonth] = createSignal(
    moment().format("MMMM")
  );
  const [selectedYear, setSelectedYear] = createSignal<number>(moment().year());
  onMount(async () => {
    // temp get teamId
    await fetchCalendars(1);
    // temp get calendar Id
    await fetchEvents(1);
  });

  const fetchCalendars = async (teamId: number) => {
    const [calendarError, calendarResult] = await mightFail(
      getCalendarsFromTeamId(teamId)
    );
    if (calendarError) {
      return console.error(calendarError);
    }
  };

  const fetchEvents = async (calendarId: number) => {
    const [eventError, eventResult] = await mightFail(getAllEvents(calendarId));
    if (eventError) {
      return console.error(eventError);
    }
    setEvents(eventResult);
  };

  return (
    <div class="p-6 relative">
      <CalendarSideMenu />
      <div class="max-w-[vw-50%]">
        <div class="text-[#1e1e1e] text-[28px] font-medium font-['ES Rebond Grotesque TRIAL'] leading-[33.60px]">
          {selectedMonth()}
        </div>
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
          events={events}
        />

        <EventCalendarDisplay events={events()} />
        <a href="/calendar/create">go create one bro</a>
      </div>
    </div>
  );
}
