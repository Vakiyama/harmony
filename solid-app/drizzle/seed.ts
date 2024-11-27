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
import { eq, InferSelectModel } from "drizzle-orm";
import { v4 } from "uuid";
import { qualityEnum, sleeps, timeFrameEnumSleeps } from "./schema/Sleeps";
import { journals, journalType } from "./schema/Journals";
import { categoryEnumMeals, consumptionEnum, meals } from "./schema/Meals";

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

  //override current user details with chelsea for demo
  await db
    .update(users)
    .set({
      firstName: "Chelsea",
      lastName: "Woo",
      photo:
        "https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg",
    })
    .where(eq(users.id, 1));

  let usersData = user ? [user] : await db.select().from(users);
  if (usersData.length <= 0) {
    throw new Error("Please create a user first using kinde");
  }
  const mom = await db
    .insert(users)
    .values({
      displayName: "Sandy",
      email: "sandy@gmail.com",
      firstName: "Sandy",
      kindeId: v4(),
      lastName: "",
      roleType: "User",
      photo:
        "https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg",
    })
    .returning()
    .onConflictDoNothing();

  const aunt = await db
    .insert(users)
    .values({
      displayName: "Crystal",
      email: "crystal@gmail.com",
      firstName: "Crystal",
      kindeId: v4(),
      lastName: "",
      roleType: "User",
      photo:
        "https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg",
    })
    .returning()
    .onConflictDoNothing();

  const grandma = await db
    .insert(users)
    .values({
      displayName: "Lola",
      email: "lola@outlook.com",
      firstName: "Lola",
      kindeId: v4(),
      lastName: "",
      roleType: "User",
      photo:
        "https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg",
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
      firstName: "Lola",
      lastName: "",
      email: "lola@outlook.com",
      phoneNumber: "604-123-4567",
      recipientType: "user",
      age: "76",
      gender: "Female",
      preferredLanguage: "Cantonese",
      healthCondition: "Alzheimers",
      livesWith: "Sandy",
      // hometown: "Hometown",
      employment: "Unemployed",
      userId: grandma[0].id,
      photo:
        "https://res.cloudinary.com/daobc6dfz/image/upload/v1724046745/pexels-conojeghuo-375889_iij9gb.jpg",
    },
    // {
    //   firstName: "Penny",
    //   lastName: "Smith",
    //   email: "aunt@example.com",
    //   phoneNumber: "0987654321",
    //   recipientType: "user",
    //   age: "78",
    //   gender: "female",
    //   preferredLanguage: "English",
    //   healthCondition: "",
    //   livesWith: "Tina",
    //   // hometown: "Oldtown",
    //   employment: "Retired",
    //   allergies: "",
    //   dietaryRestrictions: "",
    //   userId: aunt[0].id,
    // },
  ];

  await db.insert(recipients).values(recipientsData).onConflictDoNothing();

  const recipientsList = await db.select().from(recipients);
  console.log(recipientsList);

  // Seed Teams
  const teamsData = [
    {
      teamName: "Lola",
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
      userId: usersData[1].id,
      role: "member",
      defaultTeam: false,
      relationship: "Mom",
    },
    {
      teamId: teamsList[0].id,
      userId: usersData[2].id,
      role: "member",
      defaultTeam: false,
      relationship: "Aunt",
    },
  ];

  await db.insert(teamMembers).values(teamMembersData).onConflictDoNothing();

  // Seed Calendars
  const calendarsData = [
    {
      teamId: teamsList[0].id,
      name: "Lola's Calendar",
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
      title: "Pick Up Medications",
      notes: "Remember to bring prescription paper.",
      location: "Local Clinic",
      repeat: "never",
      type: "event",
      timeStart: new Date("2024-11-27T15:00:00"),
      timeEnd: new Date("2024-11-27T15:30:00"),
    },
    {
      calendarId: Calendars[0].id,
      title: "Grocery Shopping",
      notes: "Purchase supplies for the week.",
      location: "Supermarket",
      repeat: "never",
      type: "event",
      timeStart: new Date("2024-11-27T14:00:00"),
      timeEnd: new Date("2024-11-27T16:00:00"),
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

  //Seed Journals
  const sleepEntry = await db
    .insert(sleeps)
    .values({
      quality: qualityEnum[3],
      timeFrame: timeFrameEnumSleeps[1],
      troubleSleeping: false,
      duration: 8,
      date: new Date(1732680000 * 1000),
      teamId: teamsList[0].id,
      userId: usersData[1].id,
      createdAt: new Date(1732722300 * 1000),
    })
    .returning()
    .onConflictDoNothing()
    .then((res) => res[0]);

  const nutritionEntry = await db
    .insert(meals)
    .values({
      category: categoryEnumMeals[0],
      foodName: "Oatmeal",
      consumption: consumptionEnum[3],
      date: new Date(1732728900 * 1000),
      teamId: teamsList[0].id,
      userId: usersData[1].id,
      createdAt: new Date(1732728900 * 1000),
    })
    .returning()
    .onConflictDoNothing()
    .then((res) => res[0]);

  await db.insert(journals).values([
    {
      type: journalType[3],
      entryId: sleepEntry.id,
      createdAt: new Date(1732722300 * 1000),
    },
    {
      type: journalType[4],
      entryId: nutritionEntry.id,
      createdAt: new Date(1732728900 * 1000),
    },
  ]);

  console.log("Database seeded successfully!");
};

seedData().catch((err) => {
  console.error("Error seeding database:", err);
});
