import {
  createEffect,
  createResource,
  createSignal,
  onMount,
  Show,
  useContext,
} from "solid-js";
import { mightFail } from "might-fail";
import type { Event } from "@/schema/Events";
import {
  getAllEvents,
  getCalendarData,
  getCalendarFromTeamId,
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
import { useParams } from "@solidjs/router";
import {
  hideNotification,
  isNotificationVisible,
  notificationMessage,
} from "~/routes/api/notificationStore";
import Notification from "~/components/shared/notification";
import { getJournalsFromTeamId } from "~/api/journal";
import { TeamContext } from "~/components/Layout-Context";

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
  const param = useParams();
  const context = useContext(TeamContext);

  if (!context) {
    return <div>No team data available</div>;
  }

  const { teamListData, refetchTrigger } = context;

  const defaultTeam = () =>
    teamListData()?.find((team) => team.team.defaultTeam === true);

  const teamId = defaultTeam()?.team.id;
  if (!teamId) {
    return <div>No team data available</div>;
  }
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
    const calendar = await getCalendarFromTeamId(teamId);
    await fetchEvents(calendar.id);
    await fetchTeamMembers(teamId);
  });

  const [resource, { mutate, refetch }] = createResource(
    params,
    async (params) => {
      const paramsArray = params.filters
        ? params.filters.toString().split(",")
        : [];
      const selectedUsers = params.selected
        ? params.selected.toString().split(",")
        : [];
      return await getCalendarData({
        teamId,
        selectedUsers,
        filters: {
          uncomplete: paramsArray.includes("uncompleted"),
          event: paramsArray.includes("events"),
          task: paramsArray.includes("tasks"),
          complete: paramsArray.includes("complete"),
        },
      });
    }
  );

  createEffect(() => {
    const currentResource = resource();

    // Check if resource is defined and is an array before setting events
    if (currentResource && Array.isArray(currentResource)) {
      setEvents(currentResource); // Set the events when the resource is loaded and is an array
    }
  });
  const handleRefetch = async () => {
    await refetch();
  };

  const [isSideMenuOpen, setIsSideMenuOpen] = createSignal(false);
  const [isCalendarOpen, setIsCalendarOpen] = createSignal(true);
  const fetchEvents = async (calendarId: number) => {
    console.log(teamId);
    console.log(await getJournalsFromTeamId(teamId));
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
    <>
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
          teamId={teamId}
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
            teamId={teamId}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            events={events}
            currentYear={currentYear}
            setCurrentYear={setCurrentYear}
            isCalendarOpen={isCalendarOpen}
          />
        </Show>
        <Show when={currentView() === "week"}>
          <WeekCalendarView
            teamId={teamId}
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
            teamId={teamId}
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
      {isNotificationVisible() && (
        <Notification
          title={notificationMessage()}
          onClose={hideNotification}
        />
      )}
    </>
  );
}
