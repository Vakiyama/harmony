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

  return (
    <div>
      <h1>Calendars</h1>
      <ul>
        {calendars().map((calendar) => (
          <li onClick={() => handleCalendarSelect(calendar.id)}>
            {calendar.name}
          </li>
        ))}
      </ul>

      {selectedCalendarId() && (
        <div>
          <h2>Events for Calendar ID: {selectedCalendarId()}</h2>
          <ul>
            {events().map((event) => (
              <li>{event.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
