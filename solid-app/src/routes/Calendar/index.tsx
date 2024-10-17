import { createSignal, createEffect } from "solid-js";
import { mightFail } from "might-fail";
import type { Calendar } from "@/schema/Calendars";
import type { Event } from "@/schema/Events";
import { getCalendarsFromTeamId, getEvents } from "~/api";

export default function CalendarPage() {
  const [calendars, setCalendars] = createSignal<Calendar[]>([]);
  const [events, setEvents] = createSignal<Event[]>([]);
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
    setEvents(eventResult);
  };

  createEffect(() => {
    fetchCalendars(1);
  });

  const handleCalendarSelect = (id: number) => {
    setSelectedCalendarId(id);
    fetchEvents(id);
  };
  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleString() : "Not specified";
  };
  return (
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-4">Calendars</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {calendars().map((calendar) => (
          <div
            class="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => handleCalendarSelect(calendar.id)}
          >
            <h2 class="text-xl font-semibold">{calendar.name}</h2>
            <p class="text-gray-600">Source: {calendar.source}</p>
          </div>
        ))}
      </div>

      {selectedCalendarId() && (
        <div class="max-w-[vw-50%]">
          <h2 class="text-2xl font-bold mb-2">
            Events for Calendar Name:{" "}
            {calendars().find((c) => c.id === selectedCalendarId())!.name}
          </h2>
          <div class="bg-gray-100 p-4 rounded-lg">
            {events().length > 0 ? (
              <ul class="flex flex-col gap-5">
                {events().map((event) => (
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
                    </li>
                  </div>
                ))}
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
