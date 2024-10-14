'use server';
import { redirect } from '@solidjs/router';
import { useSession } from 'vinxi/http';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { Users } from '../../drizzle/schema';
import { type User } from '@/schema';
import { google } from "googleapis";
import { Credentials } from "google-auth-library";

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

async function login(username: string, password: string) {
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.username, username))
    .get();
  if (!user || password !== user.password) throw new Error('Invalid login');
  return user;
}

async function register(username: string, password: string) {
  const existingUser = await db
    .select()
    .from(Users)
    .where(eq(Users.username, username))
    .get();
  if (existingUser) throw new Error('User already exists');
  return db.insert(Users).values({ username, password }).returning().get();
}

export function getSession() {
  return useSession({
    password:
      process.env.SESSION_SECRET ?? 'areallylongsecretthatyoushouldreplace',
  });
}

export async function loginOrRegister(formData: FormData) {
  const username = String(formData.get('username'));
  const password = String(formData.get('password'));
  const loginType = String(formData.get('loginType'));
  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);

  try {
    const user = await (loginType !== 'login'
      ? register(username, password)
      : login(username, password));
    const session = await getSession();
    await session.update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect('/');
}

export async function logout() {
  const session = await getSession();
  await session.update((d) => (d.userId = undefined));
  throw redirect('/login');
}

export async function getUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect('/login');

  try {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.id, userId))
      .get();
    if (!user) throw redirect('/login');
    return { id: user.id, username: user.username };
  } catch {
    throw logout();
  }
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

export const googleAuth = async () => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  return url;
};

export const authCallback = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

export const getCalendarData = async () => {
  const session = await useSession({
    password:
      process.env.SESSION_SECRET ??
      "areallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplaceareallylongsecretthatyoushouldreplace",
  });
  const tokens = session.data.googleTokens;
  if (!tokens) {
    return; // some error
  }
  oauth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const events = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  return events.data.items;
};
