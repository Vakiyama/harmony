import { cache } from "@solidjs/router";
import { AlarmInput, alarms } from "../../drizzle/schema/Alarms";
import { CalendarInput, calendars } from "../../drizzle/schema/Calendars";
import { EventInput, events } from "../../drizzle/schema/Events";
import { db } from "./db";
import { and, eq, or } from "drizzle-orm";
import { TeamMember, teamMembers } from "../../drizzle/schema/TeamMembers";
import { User, users } from "../../drizzle/schema/Users";
import { eventParticipants } from "../../drizzle/schema/EventParticipants";
import { getUserIdFromSession } from "./server";
import { isMemberOfTeam } from "./dbHelper";

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
  alarmInput: Partial<AlarmInput>,
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
  calendarInput: Partial<CalendarInput>,
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
export const getAllEvents = async (calendarId: number, limit?: number) => {
  "use server";
  const query = db
    .select()
    .from(events)
    .where(eq(events.calendarId, calendarId))
    .orderBy(events.timeStart)
    .$dynamic();

  if (limit) {
    query.limit(limit);
  }
  return await query.execute();
};

export const getCalendarData = async (props: {
  teamId: number;
  page?: number;
  pageSize?: number;
  filters?: {
    task?: boolean;
    event?: boolean;
    complete?: boolean;
    uncomplete?: boolean;
  };
}) => {
  "use server";
  const userId = await getUserIdFromSession();
  if (userId === undefined) {
    throw new Error("User is not Authenticated"); // return { error: "Insufficient Permissions" };
  }
  const isMember = await isMemberOfTeam(userId, props.teamId);
  if (!isMember) {
    throw new Error("Insufficient Permissions"); // return { error: "Insufficient Permissions" };
  }
  console.log(props.filters);
  // Set default values
  props.page = props.page ? props.page : 1;
  props.pageSize = props.pageSize ? props.pageSize : 10;
  props.filters = props.filters
    ? props.filters
    : { task: true, event: true, complete: true, uncomplete: true };

  const offset = (props.page - 1) * props.pageSize;
  const conditions: any[] = [];
  // Start with the base query and make it dynamic
  let query = db
    .select({
      event: events,
      users: users,
    })
    .from(events)
    .leftJoin(eventParticipants, eq(eventParticipants.eventId, events.id))
    .leftJoin(users, eq(users.id, eventParticipants.userId))
    .$dynamic();

  // Add type filters dynamically
  if (props.filters.task && props.filters.event) {
    console.log("both");
    conditions.push(or(eq(events.type, "task"), eq(events.type, "event")));
  } else if (props.filters.task) {
    console.log("tasks only");
    conditions.push(eq(events.type, "task"));
  } else if (props.filters.event) {
    console.log("events only");
    conditions.push(eq(events.type, "event"));
  }

  // Add completion status filters dynamically
  if (props.filters.complete && props.filters.uncomplete) {
    conditions.push(or(eq(events.complete, true), eq(events.complete, false)));
  } else if (props.filters.complete) {
    conditions.push(eq(events.complete, true));
  } else if (props.filters.uncomplete) {
    conditions.push(eq(events.complete, false));
  }

  // Apply pagination
  query = query.limit(props.pageSize).offset(offset);

  // Execute the query
  try {
    const result = await query.where(and(...conditions));
    console.log("this", result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEvent = cache(async (eventId: number) => {
  "use server";
  return (await db.select().from(events).where(eq(events.id, eventId)))[0];
}, "event");

export const createEvent = async (
  eventInput: EventInput,
  userIds: number[],
) => {
  "use server";
  const [newEvent] = await db.insert(events).values(eventInput).returning();
  if (newEvent) {
    for (let userId of userIds) {
      await createEventParticipant(newEvent.id, userId);
    }
  }
  return newEvent;
};

export const updateEvent = async (
  eventId: number,
  eventInput: Partial<EventInput>,
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
    .from(teamMembers)
    .where(eq(teamMembers.teamId, teamId))
    .leftJoin(users, eq(teamMembers.userId, users.id))) as {
      users: User;
      teammembers: TeamMember;
    }[];
};

export const getEventParticipants = async (eventId: number, teamId: number) => {
  "use server";
  const result = await db
    .select({
      participant: users,
      status: eventParticipants.status,
      eventParticipantId: eventParticipants.id,
      role: teamMembers.role,
    })
    .from(eventParticipants)
    .where(
      and(
        eq(eventParticipants.eventId, eventId),
        eq(teamMembers.teamId, teamId),
      ),
    )
    .innerJoin(users, eq(eventParticipants.userId, users.id))
    .innerJoin(teamMembers, eq(eventParticipants.userId, teamMembers.userId));
  return result;
};

export const createEventParticipant = async (
  eventId: number,
  userId: number,
) => {
  "use server";
  const newEventParticipant = await db
    .insert(eventParticipants)
    .values({ eventId, userId })
    .returning();
  console.log(newEventParticipant);
  return newEventParticipant;
};

export const deleteEventParticipant = async (
  userId: number,
  eventId: number,
) => {
  "use server";
  await db
    .delete(eventParticipants)
    .where(
      and(
        eq(eventParticipants.userId, userId),
        eq(eventParticipants.eventId, eventId),
      ),
    )
    .execute();
};

export const getEventsWithUserId = async (
  userId: number,
  calendarId: number,
) => {
  "use server";
  const result = await db
    .select()
    .from(events)
    .innerJoin(eventParticipants, eq(events.id, eventParticipants.eventId))
    .where(
      and(
        eq(eventParticipants.userId, userId),
        eq(events.calendarId, calendarId),
      ),
    );
  return result;
};
