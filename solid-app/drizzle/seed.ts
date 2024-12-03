// Must make a user first!!!!!!!!!!!!!

import { db } from "~/api/db";
import { users } from "./schema/Users";
import { recipients } from "./schema/Recipients";
import { teams } from "./schema/Teams";
import { teamMembers } from "./schema/TeamMembers";
import { calendars } from "./schema/Calendars";
import { EventInput, events } from "./schema/Events";
import { medications } from "./schema/Medications";
import { eventParticipants } from "./schema/EventParticipants";
import moment from "moment";
import { InferSelectModel } from "drizzle-orm";
import { v4 } from "uuid";

function generateRandomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

export const seedData = async (user?: InferSelectModel<typeof users>) => {
  console.log("Seeding...");
  let usersData = user ? [user] : await db.select().from(users);
  if (usersData.length <= 0) {
    throw new Error("Please create a user first using kinde");
  }
  const mom = await db
    .insert(users)
    .values({
      displayName: "Sandy",
      email: "mom@gmail.com",
      firstName: "Sandy",
      kindeId: v4(),
      lastName: "",
      roleType: "User",
    })
    .returning()
    .onConflictDoNothing();

  const aunt = await db
    .insert(users)
    .values({
      displayName: "Crystal",
      email: "aunt@gmail.com",
      firstName: "Crystal",
      kindeId: v4(),
      lastName: "",
      roleType: "User",
    })
    .returning()
    .onConflictDoNothing();

  if (!user) {
    // Seed Recipients
    await db.delete(eventParticipants);
    await db.delete(events);
    await db.delete(calendars);
    await db.delete(teamMembers);
    await db.delete(teams);
    await db.delete(recipients);
  }

  const recipientsData = [
    {
      firstName: "mom",
      lastName: "Lola",
      email: "mom@example.com",
      phoneNumber: "1234567890",
      recipientType: "user",
      age: "76",
      gender: "female",
      preferredLanguage: "English",
      healthCondition: "",
      livesWith: "Tina",
      // hometown: "Hometown",
      employment: "Unemployed",
      userId: mom[0].id,
    },
    {
      firstName: "Penny",
      lastName: "Smith",
      email: "aunt@example.com",
      phoneNumber: "0987654321",
      recipientType: "user",
      age: "78",
      gender: "female",
      preferredLanguage: "English",
      healthCondition: "",
      livesWith: "Tina",
      // hometown: "Oldtown",
      employment: "Retired",
      allergies: "",
      dietaryRestrictions: "",
      userId: aunt[0].id,
    },
  ];

  await db.insert(recipients).values(recipientsData).onConflictDoNothing();

  const recipientsList = await db.select().from(recipients);
  console.log(recipientsList);

  // Seed Teams
  const teamsData = [
    {
      teamName: "mom",
      recipientId: recipientsList[0].id, // Adjust based on the recipient ID
      inviteCode: generateRandomCode(),
      photo:
        "https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg",
    },
  ];

  for (const data of teamsData) {
    await db.insert(teams).values(data).onConflictDoNothing();
  }

  const teamsList = await db.select().from(teams);
  console.log(teamsList);

  usersData = await db.select().from(users);
  // Seed TeamMembers
  const teamMembersData = [
    {
      teamId: teamsList[0].id,
      userId: usersData[0].id,
      role: "admin",
      defaultTeam: true,
      relationship: "Daughter",
    },
    {
      teamId: teamsList[0].id,
      userId: usersData[0].id,
      role: "member",
      defaultTeam: false,
      relationship: "Aunt",
    },
    {
      teamId: teamsList[0].id,
      userId: usersData[0].id,
      role: "member",
      defaultTeam: false,
      relationship: "Mom",
    },
  ];

  await db.insert(teamMembers).values(teamMembersData).onConflictDoNothing();

  // Seed Calendars
  const calendarsData = [
    {
      teamId: teamsList[0].id,
      name: "mom Calendar",
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
      timeStart: new Date("2024-12-01T10:00:00"),
      timeEnd: new Date("2024-12-03T11:00:00"),
    },
    {
      calendarId: Calendars[0].id,
      title: "Grocery Shopping",
      notes: "Purchase supplies for the week.",
      location: "Supermarket",
      repeat: "never",
      type: "task",
      timeStart: new Date("2024-12-03T14:00:00"),
      timeEnd: new Date("2024-12-03T15:00:00"),
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
      name: "Aricept",
      dosage: "10mg",
      frequency: "1 per day",
      schedule: "Morning",
      teamId: teamsList[0].id,
    },
    {
      name: "Azithromycin",
      dosage: "250mg",
      frequency: "3 times a week",
      schedule: "Morning",
      teamId: teamsList[0].id,
    },
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "1 per day",
      schedule: "Evening",
      teamId: teamsList[0].id,
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
