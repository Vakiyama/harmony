"use server";
import { calendars } from "../../drizzle/schema/Calendars";
import { events } from "../../drizzle/schema/Events";
import { db } from "./db";
import { eq } from "drizzle-orm";

export const getCalendarsFromTeamId = async (teamId: number) =>
  await db.select().from(calendars).where(eq(calendars.teamId, teamId));

export const getCalendar = async (calendarId: number) =>
  (await db.select().from(calendars).where(eq(calendars.id, calendarId)))[0];

export const getEvents = async (calendarId: number) =>
  await db.select().from(events).where(eq(events.calendarId, calendarId));

export const getEvent = async (eventId: number) =>
  (await db.select().from(events).where(eq(events.id, eventId)))[0];
