import {
  createEffect,
  createResource,
  createSignal,
  onMount,
  Show,
  useContext,
} from "solid-js";
import HarmonyMascot from "../../../harmony-ai/voice/harmony-mascot-animated.webp";
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
import { A, useSearchParams } from "@solidjs/router";
import { SetSearchParams } from "node_modules/@solidjs/router/dist/types";
import { Image } from "~/components/ui/image";
import { useParams } from "@solidjs/router";
import {
  hideNotification,
  isNotificationVisible,
  notificationMessage,
} from "~/routes/api/notificationStore";
import Notification from "~/components/shared/notification";
import { getJournalsFromTeamId, getNoteById } from "~/api/journal";
import { TeamContext } from "~/components/Layout-Context";
import TeamModal from "~/components/profile/team-modal";
import { BottomModal } from "~/routes/harmony-ai/chat/components/bottom-modal";
import { useTeam } from "~/context/team-context";
import { useHarmonyChat } from "~/routes/harmony-ai/chat/harmony-chat";
import { getUser } from "~/api/server";
import SolidMarkdown from "@zentered/solid-markdown";
import { ImageRoot } from "~/components/ui/image";
import { getListOfTeams } from "~/api/team";
import { TeamWithDefault } from "@/schema/Teams";
import { clientSocket as socket } from "~/lib/clientSocket";

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

type Journal = {
  timeStart: Date;
  timeEnd?: Date;
  type: "medication" | "note" | "mood" | "sleep" | "meal";
  data: any;
  id: number;
  title: string;
  notes: string;
};

export interface CalendarJournalType extends Journal {
  index: number;
}

export interface CalendarEventType extends Event {
  index: number;
}

export type JournalReturnType = {
  id: number;
  type: "note" | "mood" | "medication" | "sleep" | "meal";
  entryId: number;
  data: any;
  createdAt: Date;
};
export default function CalendarPage() {
  const param = useParams();
  const context = useContext(TeamContext);
  const teams = useTeam();

  if (!context) {
    return <div>No team data available</div>;
  }

  const [teamId, setTeamId] = createSignal<number | undefined>();
  const [teamListData, setTeamListData] = createSignal<
    { team: TeamWithDefault }[] | undefined
  >(undefined);
  const teamContext = useTeam();
  createEffect(async () => {
    teamListData();
    const teamData = await getListOfTeams();
    handleRefetch();
    console.log(events());
  });
  onMount(async () => {
    socket.on("journal-entry-created", (entryType) => refetch());
    socket.on("journal-entry-edited", (entryType) => refetch());
    socket.on("journal-entry-deleted", (entryType) => refetch());
    socket.on("calendar-event-created", (eventTitle) => refetch());
    socket.on("calendar-event-edited", (event) => refetch());
    socket.on("calendar-event-deleted", (eventTitle) => refetch());
    socket.on("status-calendar-event-updated", (eventData) => refetch());
    socket.on("calendar-task-completed", (eventData) => refetch());
    const teamData = await getListOfTeams();
    setTeamListData(teamData);
    const defaultTeam = teamData.find((team) => team.team.defaultTeam);
    setTeamId(defaultTeam?.team.id);
    if (defaultTeam && teamContext.state.id === -1) {
      teamContext.updateTeamId(defaultTeam.team.id);
    }
    setCurrentView(
      localStorage.getItem("calendarViewMode")
        ? (localStorage.getItem("calendarViewMode") as "week" | "day" | "month")
        : "week"
    );
    const calendar = await getCalendarFromTeamId(teamId()!);
    await fetchEvents(calendar.id);
    await fetchTeamMembers(teamId()!);
    await fetchTeamMembers(teamId()!);
    setUser(await getUser());
    handleGetAISummary();
  });

  const [isTeamModalOpen, setIsTeamModalOpen] = createSignal(false);

  const openTeamModal = () => {
    setIsTeamModalOpen(true);
  };

  const closeModal = () => {
    setIsTeamModalOpen(false);
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const defaultTeam = () =>
    teamListData()?.find((team) => team.team.defaultTeam === true);
  const defaultTeamId = defaultTeam()?.team.id ?? parseInt(param.id);
  if (!teamId) {
    return (
      <>
        <div class="flex flex-col gap-5 h-full px-2">
          <div class="mt-4 text-center text-gray-600 border rounded-xl flex flex-col p-4 items-center justify-center gap-3 flex-grow min-h-[100px] h-[calc(100dvh_-_410px)]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1.62359V3.10594H3.75C2.50781 3.10594 1.5 4.1019 1.5 5.32947V7.553H22.5V5.32947C22.5 4.1019 21.4922 3.10594 20.25 3.10594H18V1.62359C18 0.803662 17.3297 0.141235 16.5 0.141235C15.6703 0.141235 15 0.803662 15 1.62359V3.10594H9V1.62359C9 0.803662 8.32969 0.141235 7.5 0.141235C6.67031 0.141235 6 0.803662 6 1.62359ZM22.5 9.03535H1.5V21.6354C1.5 22.8629 2.50781 23.8589 3.75 23.8589H20.25C21.4922 23.8589 22.5 22.8629 22.5 21.6354V9.03535Z"
                fill="#937AEE"
              />
            </svg>

            <p class="text-lg">
              Please create or join a team to view your calendar.
            </p>
          </div>
          <button
            onClick={openTeamModal}
            class="h-[48px] font-medium bg-primary-purple-500 rounded-[100px] text-white"
          >
            Create / Join Team
          </button>
        </div>
        {isTeamModalOpen() && (
          <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
            onClick={handleBackdropClick}
          >
            <TeamModal onClose={closeModal} />
          </div>
        )}
      </>
    );
  }
  const DEFAULT_FILTERS: CalendarFilterType[] = [
    "events",
    "tasks",
    "medication",
    "complete",
    "uncompleted",
  ];
  const [events, setEvents] = createSignal<
    (CalendarEventType | CalendarJournalType)[]
  >([]);
  const [currentView, setCurrentView] = createSignal<
    "day" | "week" | "month" | undefined
  >(undefined);
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

  createEffect(() => {
    localStorage.setItem("calendarViewMode", currentView() ?? "week");
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
      const calendar = await getCalendarFromTeamId(teamId()!);

      return await getCalendarData({
        calendarId: calendar.id,
        teamId: teamId()!,
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

  createEffect(async () => {
    const currentResource = resource();
    const [journalEntriesError, journalEntriesResult] = await mightFail(
      getJournalsFromTeamId(teamId()!)
    );
    console.log("GG");
    if (journalEntriesError) {
      return console.error(journalEntriesError);
    }
    const formattedJournalEntries = await formatJournalEntries(
      journalEntriesResult ?? []
    );
    const sortedItems = sortCalendarItems([
      ...formattedJournalEntries,
      ...resource()!,
    ]);

    // Check if resource is defined and is an array before setting events
    if (currentResource && Array.isArray(currentResource)) {
      setEvents(sortedItems); // Set the events when the resource is loaded and is an array
    }
  });
  const handleRefetch = async () => {
    await refetch();
  };

  const [isSideMenuVisible, setIsSideMenuVisible] = createSignal(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = createSignal(false);
  const [isCalendarOpen, setIsCalendarOpen] = createSignal(true);

  const toggleSideMenu = () => {
    if (isSideMenuOpen()) {
      setIsSideMenuVisible(false);
      setTimeout(() => setIsSideMenuOpen(false), 300);
    } else {
      setIsSideMenuOpen(true);
      setIsSideMenuVisible(true);
    }
  };

  const fetchEvents = async (calendarId: number) => {
    const [journalEntriesError, journalEntriesResult] = await mightFail(
      getJournalsFromTeamId(teamId()!)
    );
    if (journalEntriesError) {
      return console.error(journalEntriesError);
    }
    const [eventError, eventResult] = await mightFail(getAllEvents(calendarId));
    if (eventError) {
      return console.error(eventError);
    }

    const formattedJournalEntries = await formatJournalEntries(
      journalEntriesResult ?? []
    );
    const sortedItems = sortCalendarItems([
      ...eventResult,
      ...formattedJournalEntries,
    ]);
    setEvents(sortedItems);
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

  const formatJournalEntries = async (
    journalEntries: JournalReturnType[]
  ): Promise<Journal[]> => {
    return Promise.all(
      journalEntries.map(async (entry) => {
        let title, notes, timeStart;
        switch (entry.type) {
          case "meal":
            timeStart = new Date(entry.data.date.toISOString());
            title = entry.data.category;
            notes = entry.data.consumption;
            break;
          case "medication":
            timeStart = new Date(entry.data.date.toISOString());
            title = entry.data.medications.name;
            const note = await getNoteById(entry.data.noteId);
            notes = note?.note;
            break;
          case "mood":
            timeStart = new Date(entry.data.date.toISOString());
            title = "Mood";
            notes = entry.data.wellBeing.toLowerCase();
            break;
          case "note":
            title = "Notes";
            notes = entry.data.note;
            break;
          case "sleep":
            timeStart = new Date(entry.data.date.toISOString());
            title = "Sleep";
            notes = entry.data.quality.toLowerCase();
            break;
        }
        return {
          timeStart: timeStart ?? entry.createdAt,
          type: entry.type,
          data: entry.data,
          id: entry.id,
          notes,
          title,
        };
      })
    );
  };

  const [fetchingSummary, setFetchingSummary] = createSignal(true);
  const [showAISummary, setShowAiSummary] = createSignal(false);
  const [AISummary, setAISummary] = createSignal("");
  const [user, setUser] = createSignal<Awaited<ReturnType<typeof getUser>>>();
  // @ts-ignore
  const { messages, setMessages, handleConversation } = useHarmonyChat(user);

  async function handleGetAISummary() {
    setFetchingSummary(true);
    setMessages([]);
    await handleConversation(
      [
        {
          role: "user",
          content: `Although you are normally in assistant mode, this is a special case.
      The user needs a summary of the current calendar view. Use the getCalendarTool to get the information you need.
      When you get your info, give a summary. The user cannot reply, so do not incite more conversation
      in your answer.

      Your answer should be AS CONCISE AS POSSIBLE.
      The screen the reader will see is SMALL and will cause eye strain
      if there's a lot of text!

      To help keep things organized and concise, use markdown titles to separate information.

      The type of summary is: ${currentView()}

      The relevant dates are:
      ${
        currentView() === "day"
          ? `${currentDay()} of month ${currentMonth()}`
          : currentView() === "week"
          ? `The week of ${currentDay()} of month ${currentMonth()}`
          : `The month ${currentMonth()}`
      }
      of the year ${currentYear()}

      Do not give super detailed breakdown of the calendar! Your summary should
      give a general overview to the feel of a month or week.

      If it's a day view, then you can give more detailed info about what's coming up.

      Your text will be displayed underneath a header that says: Weekly/Monthly/Daily Summary.
      Don't reinclude a "summary" title. You can feel free to include the date range however.
      `,
        },
      ],
      teamId()!
    );
  }

  createEffect(() => {
    const lastMessage = messages().at(-1);
    if (
      lastMessage &&
      typeof lastMessage.content === "string" &&
      lastMessage.role === "assistant"
    ) {
      setAISummary(lastMessage.content as string);
      setFetchingSummary(false);
    }
  });

  createEffect(() => {
    const view = currentView(); // subscribes to effect
    handleGetAISummary();
  });

  const sortCalendarItems = (items: (Event | Journal)[]) => {
    const sortedItem = items.toSorted(
      (a, b) => a.timeStart?.getTime()! - b.timeStart?.getTime()!
    );
    return sortedItem.map((i, index) => {
      return { ...i, index };
    });
  };
  return (
    <>
      {isSideMenuOpen() && (
        <>
          <div class="absolute top-0 left-0 z-40 w-full h-full bg-black opacity-50" />
          <div
            class={`absolute top-0 left-0 z-50 w-full h-full duration-300 ${
              isSideMenuVisible() ? "animate-fadeRight" : "animate-fadeLeft"
            }`}
          >
            <CalendarSideMenu
              refetchData={handleRefetch}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              setIsSideMenuOpen={setIsSideMenuOpen}
              teamMembers={teamMembers}
              setCurrentView={setCurrentView}
              params={params}
              setParams={setParams}
              forTeamSetting={{
                teamData: teamListData(),
                defaultSetter: setTeamListData,
              }}
              setTeamId={setTeamId}
            />
          </div>
        </>
      )}
      <Show when={currentView() !== undefined || currentView() !== null}>
        <div
          class={`w-full overflow-x-clip ${
            currentView() === "day" ? "h-full" : ""
          }`}
        >
          <CalendarTopNav
            teamId={teamId()!}
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
            triggerAiSummary={() => setShowAiSummary(true)}
          />

          <Show when={currentView() === "month"}>
            <MonthCalendarView
              teamId={teamId()!}
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
              teamId={teamId()!}
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
              teamId={teamId()!}
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
      </Show>
      {isNotificationVisible() && (
        <Notification
          title={notificationMessage()}
          onClose={hideNotification}
        />
      )}
      <Show when={showAISummary()}>
        <BottomModal close={() => setShowAiSummary(false)}>
          <Show
            when={AISummary() && !fetchingSummary()}
            fallback={
              <div class="pt-4 px-8 flex flex-col items-center">
                <ImageRoot class="mt-0 ml-4 h-[280px] w-[280px]">
                  <Image class="w-full" src={HarmonyMascot} />
                </ImageRoot>
                <div class="flex flex-row  items-center gap-4">
                  <div class="animate-spin w-8 h-8">
                    <svg
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_5890_5010)">
                        <path
                          d="M9.50004 17.4167C13.8723 17.4167 17.4167 13.8723 17.4167 9.50004C17.4167 5.12779 13.8723 1.58337 9.50004 1.58337C5.12779 1.58337 1.58337 5.12779 1.58337 9.50004C1.58337 13.8723 5.12779 17.4167 9.50004 17.4167Z"
                          stroke="#F2F2F2"
                          stroke-width="3.16667"
                        />
                        <path
                          d="M3.16667 9.5C3.16667 7.8203 3.83393 6.20939 5.02166 5.02166C6.20939 3.83393 7.8203 3.16667 9.5 3.16667V0C4.25363 0 0 4.25363 0 9.5H3.16667ZM4.75 13.6887C3.72734 12.5333 3.16398 11.043 3.16667 9.5H0C0 11.9083 0.898542 14.1107 2.375 15.7843L4.75 13.6887Z"
                          fill="#7859EA"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_5890_5010">
                          <rect width="19" height="19" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p>Harmony is creating your summary...</p>
                </div>
              </div>
            }
          >
            <div class="pt-4 px-8 items-center">
              <h1 class="text-3xl">
                {currentView() === "day"
                  ? "Daily"
                  : currentView() === "week"
                  ? "Weekly"
                  : "Monthly"}{" "}
                Summary
              </h1>
              <div class="flex flex-row items-center gap-1 pb-4">
                <h2 class="text-black/50">Powered by Harmony AI</h2>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_1981_6798)">
                    <path
                      d="M10.8178 0.825342C10.7846 0.668861 10.6961 0.528176 10.5671 0.427126C10.4381 0.326076 10.2767 0.270874 10.1101 0.270874C9.94354 0.270874 9.78209 0.326076 9.65312 0.427126C9.52415 0.528176 9.43558 0.668861 9.40244 0.825342L9.22913 1.65046C9.20126 1.7845 9.13263 1.90762 9.03188 2.00432C8.93113 2.10102 8.80278 2.16697 8.66299 2.19385L7.80223 2.3586C7.63821 2.3897 7.49052 2.47439 7.38438 2.59823C7.27824 2.72208 7.22022 2.87739 7.22022 3.03767C7.22022 3.19795 7.27824 3.35326 7.38438 3.4771C7.49052 3.60094 7.63821 3.68564 7.80223 3.71673L8.66299 3.88148C8.80291 3.90824 8.93142 3.97414 9.03231 4.07085C9.13319 4.16756 9.20193 4.29075 9.22985 4.42487L9.40171 5.24999C9.43415 5.40723 9.5225 5.5488 9.65169 5.65055C9.78088 5.7523 9.9429 5.80792 10.1101 5.80792C10.2773 5.80792 10.4393 5.7523 10.5685 5.65055C10.6977 5.5488 10.7861 5.40723 10.8185 5.24999L10.9904 4.42487C11.0183 4.29075 11.087 4.16756 11.1879 4.07085C11.2888 3.97414 11.4173 3.90824 11.5572 3.88148L12.418 3.71673C12.582 3.68564 12.7297 3.60094 12.8358 3.4771C12.942 3.35326 13 3.19795 13 3.03767C13 2.87739 12.942 2.72208 12.8358 2.59823C12.7297 2.47439 12.582 2.3897 12.418 2.3586L11.5572 2.19385C11.4173 2.16709 11.2888 2.1012 11.1879 2.00449C11.087 1.90778 11.0183 1.78459 10.9904 1.65046L10.8178 0.825342ZM4.29637 3.51114C4.24855 3.37316 4.15662 3.25311 4.03361 3.16803C3.9106 3.08295 3.76277 3.03717 3.61109 3.03717C3.45941 3.03717 3.31157 3.08295 3.18857 3.16803C3.06556 3.25311 2.97362 3.37316 2.9258 3.51114L2.4326 4.93088C2.39716 5.03294 2.3374 5.12568 2.25806 5.20174C2.17871 5.2778 2.08197 5.33508 1.9755 5.36905L0.494448 5.84184C0.350501 5.88768 0.225268 5.97581 0.136516 6.09372C0.0477642 6.21164 0 6.35335 0 6.49875C0 6.64416 0.0477642 6.78587 0.136516 6.90378C0.225268 7.0217 0.350501 7.10983 0.494448 7.15567L1.9755 7.62914C2.08189 7.66304 2.17858 7.72023 2.25792 7.79616C2.33726 7.87209 2.39707 7.96469 2.4326 8.06663L2.9258 9.48636C2.97362 9.62435 3.06556 9.7444 3.18857 9.82948C3.31157 9.91455 3.45941 9.96034 3.61109 9.96034C3.76277 9.96034 3.9106 9.91455 4.03361 9.82948C4.15662 9.7444 4.24855 9.62435 4.29637 9.48636L4.78958 8.06663C4.82502 7.96457 4.88478 7.87183 4.96412 7.79577C5.04347 7.71971 5.14021 7.66242 5.24668 7.62845L6.72773 7.15567C6.87168 7.10983 6.99691 7.0217 7.08566 6.90378C7.17441 6.78587 7.22218 6.64416 7.22218 6.49875C7.22218 6.35335 7.17441 6.21164 7.08566 6.09372C6.99691 5.97581 6.87168 5.88768 6.72773 5.84184L5.24668 5.36905C5.14021 5.33508 5.04347 5.2778 4.96412 5.20174C4.88478 5.12568 4.82502 5.03294 4.78958 4.93088L4.29637 3.51114ZM9.35117 9.04888C9.30334 8.91089 9.21141 8.79084 9.0884 8.70577C8.96539 8.62069 8.81756 8.5749 8.66588 8.5749C8.5142 8.5749 8.36637 8.62069 8.24336 8.70577C8.12035 8.79084 8.02842 8.91089 7.98059 9.04888L7.84773 9.43029C7.81236 9.53228 7.75271 9.62497 7.6735 9.70102C7.59428 9.77707 7.49768 9.8344 7.39135 9.86847L6.99347 9.99514C6.84952 10.041 6.72429 10.1291 6.63553 10.247C6.54678 10.3649 6.49902 10.5067 6.49902 10.6521C6.49902 10.7975 6.54678 10.9392 6.63553 11.0571C6.72429 11.175 6.84952 11.2631 6.99347 11.309L7.39135 11.4356C7.49782 11.4696 7.59456 11.5269 7.6739 11.603C7.75325 11.679 7.81301 11.7718 7.84845 11.8738L7.98059 12.2552C8.02842 12.3932 8.12035 12.5133 8.24336 12.5983C8.36637 12.6834 8.5142 12.7292 8.66588 12.7292C8.81756 12.7292 8.96539 12.6834 9.0884 12.5983C9.21141 12.5133 9.30334 12.3932 9.35117 12.2552L9.48403 11.8738C9.5194 11.7718 9.57905 11.6791 9.65827 11.6031C9.73748 11.527 9.83408 11.4697 9.94041 11.4356L10.3383 11.309C10.4822 11.2631 10.6075 11.175 10.6962 11.0571C10.785 10.9392 10.8327 10.7975 10.8327 10.6521C10.8327 10.5067 10.785 10.3649 10.6962 10.247C10.6075 10.1291 10.4822 10.041 10.3383 9.99514L9.94041 9.86777C9.83402 9.83387 9.73733 9.77669 9.65799 9.70076C9.57865 9.62482 9.51885 9.53222 9.48331 9.43029L9.35117 9.04888Z"
                      fill="#AE9BF2"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1981_6798">
                      <rect width="13" height="13" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <SolidMarkdown class="markdown">{AISummary()}</SolidMarkdown>
            </div>
          </Show>
        </BottomModal>
      </Show>
      <A href={`/team/${teamId()}/calendar/create`}>
        <button class="absolute bottom-[90px] right-3 rounded-full w-[65px] h-[65px] bg-primary-purple-500 flex flex-col justify-center items-center shadow-[4px_4px_4px_rgba(0,0,0,0.25)]">
          <svg
            fill="#FCFCFC"
            stroke-width="0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            height="38px"
            width="38px"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
          </svg>
        </button>
      </A>
    </>
  );
}
