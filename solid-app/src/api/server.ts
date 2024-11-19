"use server";
import { redirect } from "@solidjs/router";
import { InferInsertModel, eq } from "drizzle-orm";
import { db } from "./db";
import { getKindeClient, sessionManager } from "./kinde";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { users } from "../../drizzle/schema/Users";
import { mightFail } from "might-fail";

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
    .from(users)
    .where(eq(users.kindeId, kindeUser.id))
    .get();
  return user;
}

async function register(kindeUser: UserTypeExtended) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.kindeId, kindeUser.id))
    .get();
  if (existingUser) throw new Error("User already exists");
  return await db
    .insert(users)
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
  return redirect(logoutUrl.toString());
}

export async function getUser() {
  const sessionManager = await checkAuthenticated();
  const session = sessionManager?.getSession();
  const userId = session?.data.userId;
  if (!session || !session.data?.userId) {
    return redirect("/api/auth/landing");
  }
  const [error, user] = await mightFail(
    db.select().from(users).where(eq(users.id, userId)).get(),
  );
  if (error) {
    console.error(error);
    return logout();
  }
  if (!user) return redirect("/api/auth/landing");
  return {
    type: "user",
    ...user,
  };
}

class UpdateUserError {
  readonly _tag = "UpdateUserError";
}

export async function updateUser(
  user: Partial<InferInsertModel<typeof users>>,
) {
  const userId = await getUserIdFromSession();
  if (!userId) return;

  const [error, result] = await mightFail(
    db.update(users).set(user).where(eq(users.id, userId)),
  );

  if (error) {
    console.error(error);
    return new UpdateUserError();
  }

  return { _tag: "success" } as const;
}

export async function checkAuthenticated() {
  const manager = await sessionManager();
  const isAuthenticated = await getKindeClient().isAuthenticated(manager);

  if (!isAuthenticated) {
    return;
  }

  return manager;
}

export async function getUserIdFromSession() {
  const manager = await sessionManager();
  const session = manager.getSession();
  const userId: number | undefined = session.data.userId;
  return userId;
}
