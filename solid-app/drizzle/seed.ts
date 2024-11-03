// Must make a user first!!!!!!!!!!!!!

import { db } from "~/api/db";
import { Users } from "./schema/Users";
import { Recipients } from "./schema/Recipients";
import { Teams } from "./schema/Teams";
import { TeamMembers } from "./schema/TeamMembers";
import { calendars } from "./schema/Calendars";
import { EventInput, events } from "./schema/Events";
import { alarms } from "./schema/Alarms";
import { medications } from "./schema/Medications";
import { eventParticipants } from "./schema/EventParticipants";
import moment from "moment";

const seedData = async () => {
  const users = await db.select().from(Users);
  if (users.length <= 0) {
    throw new Error("Please create a user first using kinde");
  }
  const grandma = await db
    .insert(Users)
    .values({
      displayName: "grandma",
      email: "grandma@gmail.com",
      firstName: "grandma",
      kindeId: "ajksdlasjdkl",
      lastName: "",
      roleType: "User",
    })
    .returning();
  // Seed Recipients
  await db.delete(eventParticipants);
  await db.delete(events);
  await db.delete(calendars);
  await db.delete(TeamMembers);
  await db.delete(Teams);
  await db.delete(Recipients);

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
  await db.insert(Recipients).values(recipientsData).onConflictDoNothing();

  const recipients = await db.select().from(Recipients);
  console.log(recipients);

  // Seed Teams
  const teamsData = {
    teamName: "Team Alpha",
    recipientId: recipients[0].id, // Adjust based on the recipient ID
    photo:
      "https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg",
  };
  await db.insert(Teams).values(teamsData).onConflictDoNothing();

  const teams = await db.select().from(Teams);
  console.log(teams);

  // Seed TeamMembers
  const teamMembersData = {
    teamId: teams[0].id,
    userId: users[0].id,
    role: "admin",
  };
  await db.insert(TeamMembers).values(teamMembersData).onConflictDoNothing();

  // Seed Calendars
  const calendarsData = [
    {
      teamId: teams[0].id,
      name: "Team Alpha Calendar",
    },
    {
      teamId: teams[0].id,
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
