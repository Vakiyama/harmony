import { createSignal, createEffect, For } from "solid-js";
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

export type EventFormData = {
  name: string;
  notes: string;
  timeStart: Date | null;
  timeEnd: Date | null;
  location: string | null;
};

export default function CalendarPage() {
  const [calendars, setCalendars] = createSignal<Calendar[]>([]);
  const [events, setEvents] = createSignal<Event[]>([]);
  const [currentEvent, setCurrentEvent] = createSignal<Event | null>(null);
  const [formData, setFormData] = createSignal<EventFormData>({
    name: "",
    notes: "",
    timeStart: null,
    timeEnd: null,
    location: null,
  });
  const [selectedCalendarId, setSelectedCalendarId] = createSignal<
    number | null
  >(null);

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
    console.log(eventResult);
    setEvents(eventResult);
  };

  createEffect(() => {
    fetchCalendars(1);
  });

  const handleCalendarSelect = (id: number) => {
    setSelectedCalendarId(id);
    fetchEvents(id);
  };

  const openModal = (type: "update" | "delete", event: Event | null = null) => {
    setCurrentEvent(event);
    if (event && type === "update") {
      setFormData({
        name: event.name,
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
      fetchEvents(selectedCalendarId()!);
      console.log(result, events());
    }
    closeModal();
  };

  const handleDeleteEvent = async () => {
    if (currentEvent()) {
      const [error] = await mightFail(deleteEvent(currentEvent()!.id));
      if (error) {
        return console.error(error);
      }
      fetchEvents(selectedCalendarId()!);
    }
    closeModal();
  };

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleString() : "Not specified";
  };

  return (
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-4">Calendars</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {calendars().length > 0 ? (
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
        ) : (
          <p>No calendars available.</p>
        )}
      </div>

      {selectedCalendarId() && (
        <div class="max-w-[vw-50%]">
          <h2 class="text-2xl font-bold mb-2">
            Events for Calendar:{" "}
            {calendars().find((c) => c.id === selectedCalendarId())!.name}
          </h2>
          <div class="bg-gray-100 p-4 rounded-lg">
            {events().length > 0 ? (
              <ul class="flex flex-col gap-5">
                {events().map((event) => (
                  <div class="bg-gray-300 p-4 rounded-lg border">
                    <li class="mb-2 p-4">
                      <div class="font-semibold">{event.name}</div>
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
                ))}
                {/* <For each={events()} fallback={<div>loading...</div>}>
                  {(event) => (
                    <div class="bg-gray-300 p-4 rounded-lg border">
                      <li class="mb-2 p-4">
                        <div class="font-semibold">{event.name}</div>
                        <p class="text-gray-500">{event.description}</p>
                        <p class="text-sm text-gray-400">
                          Start: {formatDate(event.timeStart)} - End:{" "}
                          {formatDate(event.timeEnd)}
                        </p>
                        {event.location && (
                          <p class="text-sm text-gray-500">
                            Location: {event.location}
                          </p>
                        )}
                        {selectedCalendarId() && (
                          <>
                            <UpdateModal
                              onClick={() => openModal("update", event)}
                              closeModal={closeModal}
                              handleUpdateEvent={handleUpdateEvent}
                              formData={formData}
                              setFormData={setFormData}
                            />
                            <DeleteModal
                              closeModal={closeModal}
                              currentEvent={currentEvent}
                              handleDeleteEvent={handleDeleteEvent}
                              onClick={() => openModal("delete", event)}
                            />
                          </>
                        )}
                      </li>
                    </div>
                  )}
                </For> */}
              </ul>
            ) : (
              <p>No events available for this calendar.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
