import { db } from "~/api/db";
import { Users } from "./schema/Users";
import { Recipients } from "./schema/Recipients";
import { Teams } from "./schema/Teams";
import { TeamMembers } from "./schema/TeamMembers";
import { calendars } from "./schema/Calendars";
import { events } from "./schema/Events";
import { alarms } from "./schema/Alarms";

const seedData = async () => {
  const users = await db.select().from(Users);
  console.log(users);
  // Seed Recipients
  await db.delete(Recipients);
  await db.delete(Teams);
  await db.delete(TeamMembers);
  await db.delete(calendars);
  await db.delete(events);

  const recipientsData = {
    firstName: "Max",
    lastName: "Test",
    email: "max@example.com",
    phoneNumber: "1234567890",
    recipientType: "user",
    gender: "male",
    preferredLanguage: "English",
    livesWith: "John Doe",
    hometown: "Hometown",
    employment: "Unemployed",
    userId: users[0].id,
  };
  await db.insert(Recipients).values(recipientsData).onConflictDoNothing();

  const recipients = await db.select().from(Recipients);
  console.log(recipients);

  // Seed Teams
  const teamsData = {
    teamName: "Team Alpha",
    recipientId: recipients[0].id, // Adjust based on the recipient ID
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
  const eventsData = [
    {
      calendarId: Calendars[0].id, // Adjust based on the calendar ID
      name: "Pick up a dish washing",
      description: "help",
      // timeStart: Math.floor(new Date().getTime() / 1000),
      // timeEnd: Math.floor(new Date().getTime() / 1000),
      allDay: false,
      location: "Langley",
      type: "event",
    },
    {
      calendarId: Calendars[0].id, // Adjust based on the calendar ID
      name: "Feed Meemaw",
      description: "Broccoli",
      //timeStart: Math.floor(new Date().getTime() / 1000),
      //timeEnd: Math.floor(new Date().getTime() / 1000),
      allDay: false,
      location: "meemaw house",
      frequency: "daily",
      type: "task",
    },
    {
      calendarId: Calendars[1].id, // Adjust based on the calendar ID
      name: "Grandma birthday",
      description: "Celebrate!",
      //timeStart: Math.floor(new Date().getTime() / 1000),
      //timeEnd: Math.floor(new Date().getTime() / 1000),
      allDay: true,
      location: "help",
      type: "event",
    },
  ];
  for await (const data of eventsData) {
    await db
      .insert(events)
      .values({
        //@ts-ignore
        description: data.description,
        name: data.name,
        allDay: data.allDay,
        calendarId: data.calendarId,
        frequency: data.frequency,
        location: data.location,
        // timeEnd: data.timeEnd,
        // timeStart: data.timeStart,
        type: data.type,
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

  console.log("Database seeded successfully!");
};

seedData().catch((err) => {
  console.error("Error seeding database:", err);
});
