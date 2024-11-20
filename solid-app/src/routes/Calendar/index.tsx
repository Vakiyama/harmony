import {
  createEffect,
  createResource,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import { mightFail } from "might-fail";
import type { Event } from "@/schema/Events";
import {
  getAllEvents,
  getCalendarData,
  getTeamMembersFromTeamId,
} from "~/api/calendar";
import moment from "moment";
import MonthCalendarView from "./month-calendar-view";
import WeekCalendarView from "./week-calendar-view";
import CalendarSideMenu from "./calendar-side-menu";
import CalendarTopNav from "~/components/calendar/calendar-top-nav";
import { User } from "@/schema/Users";
import { TeamMember } from "@/schema/TeamMembers";
import DayCalendarView from "./day-calendar-view";
import { useSearchParams } from "@solidjs/router";
import { SetSearchParams } from "node_modules/@solidjs/router/dist/types";
moment.locale("en");
moment.updateLocale("en", { weekdaysMin: "S_M_T_W_T_F_S".split("_") });

export type EventFormData = {
  title: string;
  notes: string;
  timeStart: Date | null;
  timeEnd: Date | null;
  location: string;
};
export type CalendarFilterType =
  | "events"
  | "tasks"
  | "medication"
  | "complete"
  | "uncompleted";

export default function CalendarPage() {
  // temp get calendar Id
  const teamId = 1;
  const calendarId = 1;
  const DEFAULT_FILTERS: CalendarFilterType[] = [
    "events",
    "tasks",
    "medication",
    "complete",
    "uncompleted",
  ];
  const [events, setEvents] = createSignal<Event[]>([]);
  const [currentView, setCurrentView] = createSignal<"day" | "week" | "month">(
    "week"
  );
  const [teamMembers, setTeamMembers] = createSignal<
    { users: User; teammembers: TeamMember }[]
  >([]);
  const DEFAULT_TEAMMEMBERS = teamMembers().map((t) => t.users.id.toString());
  const [currentDay, setCurrentDay] = createSignal<number>(moment().date());
  const [currentMonth, setCurrentMonth] = createSignal(moment().format("MMMM"));
  const [currentYear, setCurrentYear] = createSignal<number>(moment().year());
  const [selectedDay, setSelectedDay] = createSignal<number>(moment().date());
  const [selectedMonth, setSelectedMonth] = createSignal(
    moment().format("MMMM")
  );
  const [selectedYear, setSelectedYear] = createSignal<number>(moment().year());
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = createSignal<SetSearchParams>({
    filters: searchParams.filters
      ? searchParams.filters.toString()
      : DEFAULT_FILTERS.join(","),
    select: searchParams.select
      ? searchParams.select.toString()
      : DEFAULT_TEAMMEMBERS.join(","),
  });
  onMount(async () => {
    await fetchEvents(calendarId);
    await fetchTeamMembers(teamId);
  });

  const [resource, { mutate, refetch }] = createResource(params(), async () => {
    const params = searchParams.filters
      ? searchParams.filters.toString().split(",")
      : "";
    return await getCalendarData({
      teamId,
      filters: {
        uncomplete: params.includes("uncompleted"),
        event: params.includes("events"),
        task: params.includes("tasks"),
        complete: params.includes("complete"),
      },
    });
  });
  const handleRefetch = async () => {
    await refetch(); // This will re-fetch the data based on the current `params()`
  };

  // for testing, whenever resources is reloaded (which is refetched based on the params)
  createEffect(async () => {
    console.log(resource(), "hello?");
  }, [resource()]);

  const [isSideMenuOpen, setIsSideMenuOpen] = createSignal(false);
  const [isCalendarOpen, setIsCalendarOpen] = createSignal(true);
  const fetchEvents = async (calendarId: number) => {
    const [eventError, eventResult] = await mightFail(getAllEvents(calendarId));
    if (eventError) {
      return console.error(eventError);
    }
    setEvents(eventResult);
  };
  const fetchTeamMembers = async (teamId: number) => {
    const [eventError, eventResult] = await mightFail(
      getTeamMembersFromTeamId(calendarId)
    );
    if (eventError) {
      return console.error(eventError);
    }
    setTeamMembers(eventResult);
    console.log(teamMembers());
  };

  return (
    <div class="h-full fixed w-full overflow-y-auto">
      <div class={`${isSideMenuOpen() ? "" : "hidden"}`}>
        <CalendarSideMenu
          refetchData={handleRefetch}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          setIsSideMenuOpen={setIsSideMenuOpen}
          teamMembers={teamMembers}
          setCurrentView={setCurrentView}
          params={params}
          setParams={setParams}
        />
      </div>
      <CalendarTopNav
        month={currentMonth}
        setIsSideMenuOpen={setIsSideMenuOpen}
        isSideMenuOpen={isSideMenuOpen}
        setCurrentDay={setCurrentDay}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
        setSelectedDay={setSelectedDay}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        setIsCalendarOpen={setIsCalendarOpen}
        isCalendarOpen={isCalendarOpen}
      />
      <Show when={currentView() === "month"}>
        <MonthCalendarView
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          events={events}
          isCalendarOpen={isCalendarOpen}
        />
      </Show>
      <Show when={currentView() === "week"}>
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
          isCalendarOpen={isCalendarOpen}
        />
      </Show>
      <Show when={currentView() === "day"}>
        <DayCalendarView
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedDay={setSelectedDay}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          setCurrentDay={setCurrentDay}
          currentMonth={currentMonth}
          currentYear={currentYear}
          events={events}
          isCalendarOpen={isCalendarOpen}
        />
      </Show>
    </div>
  );
}
