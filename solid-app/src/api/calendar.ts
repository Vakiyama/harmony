import { cache } from "@solidjs/router";
import { AlarmInput, alarms } from "../../drizzle/schema/Alarms";
import { CalendarInput, calendars } from "../../drizzle/schema/Calendars";
import { EventInput, events } from "../../drizzle/schema/Events";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { TeamMember, TeamMembers } from "../../drizzle/schema/TeamMembers";
import { User, Users } from "../../drizzle/schema/Users";

// Alarms
export const getAlarmsByEventId = cache(async (eventId: number) => {
  "use server";
  return await db.select().from(alarms).where(eq(alarms.eventId, eventId));
}, "alarms");

export const getAlarm = cache(async (alarmId: number) => {
  "use server";
  return (await db.select().from(alarms).where(eq(alarms.id, alarmId)))[0];
}, "alarm");

export const createAlarm = async (alarmInput: AlarmInput) => {
  "use server";
  const [newAlarm] = await db.insert(alarms).values(alarmInput).returning();
  return newAlarm;
};

export const updateAlarm = async (
  alarmId: number,
  alarmInput: Partial<AlarmInput>
) => {
  "use server";
  const [updatedAlarm] = await db
    .update(alarms)
    .set(alarmInput)
    .where(eq(alarms.id, alarmId))
    .returning();
  return updatedAlarm;
};

export const deleteAlarm = async (alarmId: number) => {
  "use server";
  const result = await db.delete(alarms).where(eq(alarms.id, alarmId));
  return result;
};

// Calendars
export const getCalendarsFromTeamId = cache(async (teamId: number) => {
  "use server";
  return await db.select().from(calendars).where(eq(calendars.teamId, teamId));
}, "calendars");

export const getCalendar = cache(async (calendarId: number) => {
  "use server";
  return (
    await db.select().from(calendars).where(eq(calendars.id, calendarId))
  )[0];
}, "calendar");

export const createCalendar = async (calendarInput: CalendarInput) => {
  "use server";
  const [newCalendar] = await db
    .insert(calendars)
    .values(calendarInput)
    .returning();
  return newCalendar;
};

export const updateCalendar = async (
  calendarId: number,
  calendarInput: Partial<CalendarInput>
) => {
  "use server";
  const [updatedCalendar] = await db
    .update(calendars)
    .set(calendarInput)
    .where(eq(calendars.id, calendarId))
    .returning();
  return updatedCalendar;
};

export const deleteCalendar = async (calendarId: number) => {
  "use server";
  const result = await db.delete(calendars).where(eq(calendars.id, calendarId));
  return result;
};

// Events
export const getEvents = async (calendarId: number) => {
  "use server";
  return await db
    .select()
    .from(events)
    .where(eq(events.calendarId, calendarId));
};

export const getEvent = cache(async (eventId: number) => {
  "use server";
  return (await db.select().from(events).where(eq(events.id, eventId)))[0];
}, "event");

export const createEvent = async (eventInput: EventInput) => {
  "use server";
  const [newEvent] = await db.insert(events).values(eventInput).returning();
  return newEvent;
};

export const updateEvent = async (
  eventId: number,
  eventInput: Partial<EventInput>
) => {
  "use server";
  const [updatedEvent] = await db
    .update(events)
    .set(eventInput)
    .where(eq(events.id, eventId))
    .returning();
  return updatedEvent;
};

export const deleteEvent = async (eventId: number) => {
  "use server";
  await db.delete(events).where(eq(events.id, eventId));
  return {};
};

export const getTeamMembersFromTeamId = async (teamId: number) => {
  "use server";
  return (await db
    .select()
    .from(TeamMembers)
    .where(eq(TeamMembers.teamId, teamId))
    .leftJoin(Users, eq(TeamMembers.userId, Users.id))) as {
    users: User;
    teammembers: TeamMember;
  }[];
};
