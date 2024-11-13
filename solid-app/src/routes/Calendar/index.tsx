import { createSignal, onMount, Show } from "solid-js";
import { mightFail } from "might-fail";
import type { Event } from "@/schema/Events";
import { getAllEvents, getTeamMembersFromTeamId } from "~/api/calendar";
import moment from "moment";
import MonthCalendarView from "./month-calendar-view";
import WeekCalendarView from "./week-calendar-view";
import CalendarSideMenu from "./calendar-side-menu";
import EventCalendarDisplay from "./event-calendar-display";
import CalendarTopNav from "~/components/calendar/calendar-top-nav";
import { User } from "@/schema/Users";
import { TeamMember } from "@/schema/TeamMembers";
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
  // temp get calendar Id
  const teamId = 1;
  const calendarId = 1;
  const [events, setEvents] = createSignal<Event[]>([]);
  const [teamMembers, setTeamMembers] = createSignal<
    { users: User; teammembers: TeamMember }[]
  >([]);
  const [currentdDay, setCurrentDay] = createSignal<number>(moment().date());
  const [currentMonth, setCurrentMonth] = createSignal(moment().format("MMMM"));
  const [currentYear, setCurrentYear] = createSignal<number>(moment().year());
  const [selectedDay, setSelectedDay] = createSignal<number>(moment().date());
  const [selectedMonth, setSelectedMonth] = createSignal(
    moment().format("MMMM")
  );
  const [selectedYear, setSelectedYear] = createSignal<number>(moment().year());
  onMount(async () => {
    await fetchEvents(calendarId);
    await fetchTeamMembers(teamId);
  });
  const [isSideMenuOpen, setIsSideMenuOpen] = createSignal(false);

  const fetchEvents = async (calendarId: number) => {
    const [eventError, eventResult] = await mightFail(getAllEvents(calendarId));
    if (eventError) {
      return console.error(eventError);
    }
    setEvents(eventResult);
  };

  const fetchTeamMembers = async (teamId: number) => {
    const [eventError, eventResult] = await mightFail(
      getTeamMembersFromTeamId(teamId)
    );
    if (eventError) {
      return console.error(eventError);
    }
    setTeamMembers(eventResult);
  };

  return (
    <div class="relative h-full">
      <div class={`${isSideMenuOpen() ? "" : "hidden"}`}>
        <CalendarSideMenu
          setIsSideMenuOpen={setIsSideMenuOpen}
          teamMembers={teamMembers}
        />
      </div>
      <CalendarTopNav
        month={currentMonth}
        setIsSideMenuOpen={setIsSideMenuOpen}
        isSideMenuOpen={isSideMenuOpen}
      />
      <div class="flex flex-col">
        {/* <MonthCalendarView
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
        <div class="flex justify-center pt-4 px-3">
          <EventCalendarDisplay
            events={events}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            setSelectedYear={setSelectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedDay={setSelectedDay}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
          />
        </div>
      </div>
    </div>
  );
}
