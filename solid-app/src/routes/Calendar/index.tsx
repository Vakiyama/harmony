import { createSignal, For, onMount, Show } from "solid-js";
import { mightFail } from "might-fail";
import type { Event } from "@/schema/Events";
import {
  getCalendarsFromTeamId,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getEventsWithUserId,
} from "~/api/calendar";
import UpdateModal from "./updateModal";
import DeleteModal from "./deleteModal";
import CalendarView from "./CalendarView";
import moment from "moment";
import EventCard from "~/components/ui/eventCard";
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
  const [currentEvent, setCurrentEvent] = createSignal<Event | null>(null);
  const [formData, setFormData] = createSignal<EventFormData>({
    title: "",
    notes: "",
    location: "",
    timeStart: null,
    timeEnd: null,
  });

  const [selectedMonth, setSelectedMonth] = createSignal(
    moment().format("MMMM")
  );
  const [selectedDay, setSelectedDay] = createSignal<number>(moment().date());
  const [selectedYear, setSelectedYear] = createSignal<number>(moment().year());
  onMount(async () => {
    // temp get teamId
    await fetchCalendars(1);
    // temp get calendar Id
    await fetchEvents(1);
  });
  const calendarId = 1; // temp get calendar Id

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

  const openModal = (type: "update" | "delete", event: Event | null = null) => {
    setCurrentEvent(event);
    if (event && type === "update") {
      setFormData({
        title: event.title,
        notes: event.notes,
        timeStart: event.timeStart,
        timeEnd: event.timeEnd,
        location: event.location,
      });
    }
  };

  const closeModal = () => {
    setCurrentEvent(null);
  };

  const handleUpdateEvent = async () => {
    if (currentEvent()) {
      const [error, result] = await mightFail(
        updateEvent(currentEvent()!.id, formData()) // do some client validation here pls
      );
      if (error) {
        return console.error(error);
      }
      await fetchEvents(calendarId);
    }
    closeModal();
  };

  const handleDeleteEvent = async () => {
    if (currentEvent()) {
      const [error] = await mightFail(deleteEvent(currentEvent()!.id));
      if (error) {
        return console.error(error);
      }
      await fetchEvents(calendarId);
    }
    closeModal();
  };

  return (
    <div class="p-6">
      <div class="max-w-[vw-50%]">
        <div class="text-[#1e1e1e] text-[28px] font-medium font-['ES Rebond Grotesque TRIAL'] leading-[33.60px]">
          {selectedMonth()}
        </div>
        <CalendarView
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          events={events}
        />
        <div class="bg-gray-100 p-4 rounded-lg">
          <Show
            when={events().length > 0}
            fallback={<p>No events available for this calendar.</p>}
          >
            <ul class="flex flex-col gap-5">
              <For each={events()} fallback={<div>loading...</div>}>
                {(event) => (
                  <>
                    <EventCard event={event}></EventCard>
                    {/* <div
                      class="bg-gray-300 p-4 rounded-lg border"
                      onClick={() => {
                        navigate(`/calendar/event/${event.id}`);
                      }}
                    >
                      <li class="mb-2 p-4">
                        <div class="font-semibold">{event.title}</div>
                        <p class="text-gray-500">{event.notes}</p>
                        <p class="text-sm text-gray-400">
                          Start: {formatDateToLocaleString(event.timeStart)} -
                          End: {formatDateToLocaleString(event.timeEnd)}
                        </p>
                        {event.location && (
                          <p class="text-sm text-gray-500">
                            Location: {event.location}
                          </p>
                        )}
                        <UpdateModal
                          onClick={() => openModal("update", event)}
                          closeModal={closeModal}
                          handleUpdateEvent={handleUpdateEvent}
                          formData={formData}
                          setFormData={setFormData}
                        />
                        <DeleteModal
                          onClick={() => openModal("delete", event)}
                          closeModal={closeModal}
                          handleDeleteEvent={handleDeleteEvent}
                          currentEvent={currentEvent}
                        />
                      </li>
                    </div> */}
                  </>
                )}
              </For>
            </ul>
          </Show>
        </div>
      </div>
      <a href="/calendar/create">go create one bro</a>
    </div>
  );
}
