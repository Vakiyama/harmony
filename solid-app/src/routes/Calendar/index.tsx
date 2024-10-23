import { createSignal, createEffect, For, onMount, Show } from "solid-js";
import { mightFail } from "might-fail";
import type { Calendar } from "@/schema/Calendars";
import type { Event } from "@/schema/Events";
import {
  getCalendarsFromTeamId,
  getEvents,
  updateEvent,
  deleteEvent,
} from "~/api/calendar";
import UpdateModal from "./updateModal";
import DeleteModal from "./deleteModal";
import CalendarView from "./CalendarView";
import moment from "moment";
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
  const [calendars, setCalendars] = createSignal<Calendar[]>([]);
  const [events, setEvents] = createSignal<Event[]>([]);
  const [currentEvent, setCurrentEvent] = createSignal<Event | null>(null);
  const [formData, setFormData] = createSignal<EventFormData>({
    title: "",
    notes: "",
    location: "",
    timeStart: null,
    timeEnd: null,
  });
  const [selectedCalendarId, setSelectedCalendarId] = createSignal<
    number | null
  >(null);

  const [selectedMonth, setSelectedMonth] = createSignal(
    moment().format("MMMM")
  );
  const [selectedDay, setSelectedDay] = createSignal<number>(moment().date());
  const [selectedYear, setSelectedYear] = createSignal<number>(moment().year());
  console.log(selectedYear(), selectedMonth(), selectedDay());
  onMount(async () => {
    // get teamId
    await fetchCalendars(1);
    setSelectedCalendarId(1);
  });

  const fetchCalendars = async (teamId: number) => {
    const [calendarError, calendarResult] = await mightFail(
      getCalendarsFromTeamId(teamId)
    );
    if (calendarError) {
      return console.error(calendarError);
    }
    setCalendars(calendarResult);
  };

  const fetchEvents = async (calendarId: number) => {
    const [eventError, eventResult] = await mightFail(getEvents(calendarId));
    if (eventError) {
      return console.error(eventError);
    }
    setEvents(eventResult);
  };

  const handleCalendarSelect = (id: number) => {
    setSelectedCalendarId(id);
    fetchEvents(id);
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
      await fetchEvents(selectedCalendarId()!);
    }
    closeModal();
  };

  const handleDeleteEvent = async () => {
    if (currentEvent()) {
      const [error] = await mightFail(deleteEvent(currentEvent()!.id));
      if (error) {
        return console.error(error);
      }
      await fetchEvents(selectedCalendarId()!);
    }
    closeModal();
  };

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleString() : "Not specified";
  };

  return (
    <div class="p-6">
      {/* <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Show
          when={calendars().length > 0}
          fallback={<p>No calendars available.</p>}
        >
          <For each={calendars()} fallback={<div>loading...</div>}>
            {(calendar) => (
              <div
                class="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
                onClick={() => handleCalendarSelect(calendar.id)}
              >
                <h2 class="text-xl font-semibold">{calendar.name}</h2>
                <p class="text-gray-600">Source: {calendar.source}</p>
              </div>
            )}
          </For>
        </Show>
      </div> */}

      <Show when={selectedCalendarId()}>
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
          {/* <h2 class="text-2xl font-bold mb-2">
            Events for Calendar:{" "}
            {calendars().find((c) => c.id === selectedCalendarId())!.name}
          </h2> */}
          <div class="bg-gray-100 p-4 rounded-lg">
            <Show
              when={events().length > 0}
              fallback={<p>No events available for this calendar.</p>}
            >
              <ul class="flex flex-col gap-5">
                <For each={events()} fallback={<div>loading...</div>}>
                  {(event) => (
                    <div class="bg-gray-300 p-4 rounded-lg border">
                      <li class="mb-2 p-4">
                        <div class="font-semibold">{event.title}</div>
                        <p class="text-gray-500">{event.notes}</p>
                        <p class="text-sm text-gray-400">
                          Start: {formatDate(event.timeStart)} - End:{" "}
                          {formatDate(event.timeEnd)}
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
                    </div>
                  )}
                </For>
              </ul>
            </Show>
          </div>
        </div>
      </Show>
      <a href="/calendar/create">go create one bro</a>
    </div>
  );
}
