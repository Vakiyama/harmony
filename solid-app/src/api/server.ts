"use server";
import { redirect } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { getKindeClient, sessionManager } from "./kinde";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { Users } from "../../drizzle/schema/Users";

type UserTypeExtended = UserType & {
  dob?: string;
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

async function login(kindeUser: UserTypeExtended) {
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.kindeId, kindeUser.id))
    .get();
  return user;
}

async function register(kindeUser: UserTypeExtended) {
  const existingUser = await db
    .select()
    .from(Users)
    .where(eq(Users.kindeId, kindeUser.id))
    .get();
  if (existingUser) throw new Error("User already exists");
  return await db
    .insert(Users)
    .values({
      kindeId: kindeUser.id,
      displayName: kindeUser.given_name,
      firstName: kindeUser.given_name,
      lastName: kindeUser.family_name,
      ...(kindeUser.picture ? { photo: kindeUser.picture } : {}),
      email: kindeUser.email,
      roleType: "other",
      ...(kindeUser.dob ? { birthDate: new Date(kindeUser.dob) } : {}),
    })
    .returning()
    .get();
}

export async function loginOrRegister(kindeUser: UserTypeExtended) {
  try {
    // console.log(kindeUser);
    let user = await login(kindeUser);
    if (!user) {
      user = await register(kindeUser);
    }
    const session = (await sessionManager()).getSession();
    await session.update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    // console.log(err);
    return err as Error;
  }
}

export async function logout() {
  const manager = await sessionManager();
  const logoutUrl = await getKindeClient().logout(manager);
  throw redirect(logoutUrl.toString());
}

export async function getUser() {
  const sessionManager = await checkAuthenticated();
  const session = await sessionManager.getSession();
  const userId = session.data.userId;

  try {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.id, userId))
      .get();
    if (!user) throw redirect("/api/auth/landing");
    return { id: user.id, displayName: user.displayName };
  } catch {
    throw logout();
  }
}

export async function checkAuthenticated() {
  const manager = await sessionManager();
  const isAuthenticated = await getKindeClient().isAuthenticated(manager);

  if (!isAuthenticated) {
    throw redirect("/api/auth/landing");
  }

  return manager;
}
