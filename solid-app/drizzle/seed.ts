// Must make a user first!!!!!!!!!!!!!

import { db } from "~/api/db";
import { users } from "./schema/Users";
import { recipients } from "./schema/Recipients";
import { teams } from "./schema/Teams";
import { teamMembers } from "./schema/TeamMembers";
import { calendars } from "./schema/Calendars";
import { EventInput, events } from "./schema/Events";
import { alarms } from "./schema/Alarms";
import { medications } from "./schema/Medications";
import { eventParticipants } from "./schema/EventParticipants";
import moment from "moment";

const seedData = async () => {
  const usersData = await db.select().from(users);
  if (usersData.length <= 0) {
    throw new Error("Please create a user first using kinde");
  }
  const grandma = await db
    .insert(users)
    .values({
      displayName: "grandma",
      email: "grandma@gmail.com",
      firstName: "grandma",
      kindeId: "ajksdlasjdkl",
      lastName: "",
      // roleType: "User",
    })
    .returning();
  // Seed Recipients
  await db.delete(eventParticipants);
  await db.delete(events);
  await db.delete(calendars);
  await db.delete(teamMembers);
  await db.delete(teams);
  await db.delete(recipients);

  const recipientsData = {
    firstName: "Grandma",
    lastName: "Lola",
    email: "grandma@example.com",
    phoneNumber: "1234567890",
    recipientType: "user",
    gender: "female",
    preferredLanguage: "English",
    livesWith: "Tina",
    hometown: "Hometown",
    employment: "Unemployed",
    userId: grandma[0].id,
  };
  await db.insert(recipients).values(recipientsData).onConflictDoNothing();

  const recipientsData2 = await db.select().from(recipients);
  console.log(recipients);

  // Seed Teams
  const teamsData = {
    teamName: "Team Alpha",
    recipientId: recipientsData[0].id, // Adjust based on the recipient ID
  };
  await db.insert(teams).values(teamsData).onConflictDoNothing();

  const teamsData = await db.select().from(teams);
  console.log(teams);

  // Seed TeamMembers
  const teamMembersData = {
    teamId: teamsData[0].id,
    userId: usersData[0].id,
    role: "admin",
  };
  await db.insert(teamMembers).values(teamMembersData).onConflictDoNothing();

  // Seed Calendars
  const calendarsData = [
    {
      teamId: teamsData[0].id,
      name: "Team Alpha Calendar",
    },
    {
      teamId: teamsData[0].id,
      name: "Team Beta Calendar",
    },
  ];

  for await (const data of calendarsData) {
    await db
      .insert(calendars)
      .values({ name: data.name, teamId: data.teamId })
      .onConflictDoNothing();
  }
  const Calendars = await db.select().from(calendars);
  console.log(Calendars);

  // Seed Events
  const eventsData: EventInput[] = [
    {
      calendarId: Calendars[0].id,
      title: "Medication Reminder",
      notes: "Administer morning medications.",
      location: "Home",
      repeat: "never",
      type: "task",
      timeStart: new Date("2024-10-30T08:00:00"),
      timeEnd: new Date("2024-10-30T08:30:00"),
    },
    {
      calendarId: Calendars[0].id,
      title: "Doctor's Appointment",
      notes: "Accompany to check-up.",
      location: "Local Clinic",
      repeat: "never",
      type: "event",
      timeStart: new Date("2024-11-01T10:00:00"),
      timeEnd: new Date("2024-11-01T11:00:00"),
    },
    {
      calendarId: Calendars[0].id,
      title: "Grocery Shopping",
      notes: "Purchase supplies for the week.",
      location: "Supermarket",
      repeat: "never",
      type: "task",
      timeStart: new Date("2024-11-03T14:00:00"),
      timeEnd: new Date("2024-11-03T15:00:00"),
    },
    {
      calendarId: Calendars[0].id,
      title: "Physical Therapy Session",
      notes: "Attend session with client.",
      location: "Rehabilitation Center",
      repeat: "never",
      type: "event",
      timeStart: new Date("2024-10-31T09:00:00"),
      timeEnd: new Date("2024-10-31T10:00:00"),
    },
    {
      calendarId: Calendars[0].id,
      title: "Weekly Check-in",
      notes: "Discuss care plan and progress.",
      location: "Home",
      repeat: "weekly",
      type: "event",
      timeStart: new Date("2024-11-02T16:00:00"),
      timeEnd: new Date("2024-11-02T17:00:00"),
    },
    {
      calendarId: Calendars[0].id,
      title: "Monthly Health Check-up",
      notes: "Check blood pressure and vitals",
      timeStart: new Date(
        moment().add(1, "month").set({ date: 29, hour: 10, minute: 0 }).format()
      ), // 29th of next month at 10 AM
      timeEnd: new Date(
        moment().add(1, "month").set({ date: 29, hour: 11, minute: 0 }).format()
      ),
      location: "Health Clinic",
      repeat: "never",
      type: "event",
    },
  ];
  for await (const data of eventsData) {
    await db
      .insert(events)
      .values({
        notes: data.notes,
        title: data.title,
        calendarId: data.calendarId,
        repeat: data.repeat,
        location: data.location,
        timeEnd: data.timeEnd,
        timeStart: data.timeStart,
        type: data.type,
      })
      .onConflictDoNothing();
  }

  // Seed EventsParticipants
  const Events = await db.select().from(events);
  for await (const event of Events) {
    await db
      .insert(eventParticipants)
      .values({
        eventId: event.id,
        userId: 1,
        status: "maybe",
      })
      .onConflictDoNothing();
  }

  //   // Seed Alarms
  //   const alarmsData = [
  //     {
  //       eventId: 1, // Adjust based on the event ID
  //       relativeOffset: -15, // 15 minutes before
  //     },
  //   ];
  //   await db.insert(alarms).values(alarmsData);

  //Seed Medications
  const medicationsData = [
    {
      name: "Omeprazole",
      dosage: "10mg",
      frequency: "1 per day",
      schedule: "Morning",
      teamId: 1,
    },
    {
      name: "Azithromycin",
      dosage: "250mg",
      frequency: "3 times a week",
      schedule: "Morning",
      teamId: 1,
    },
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "1 per day",
      schedule: "Evening",
      teamId: 1,
    },
  ];
  for await (const data of medicationsData) {
    await db.insert(medications).values(data).onConflictDoNothing();
  }

  console.log("Database seeded successfully!");
};

seedData().catch((err) => {
  console.error("Error seeding database:", err);
});
