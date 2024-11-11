import { mightFail } from "might-fail";
import { db } from "./db";
import { teamMembers } from "../../drizzle/schema/TeamMembers";
import { and, eq } from "drizzle-orm";

export function isValidEnumValue<T extends readonly string[]>(
  value: string,
  enumArray: T
): value is T[number] {
  return (enumArray as readonly string[]).includes(value);
}

export async function isMemberOfTeam(userId: number, teamId: number) {
  "use server";
  const [memberError, memberResult] = await mightFail(
    db
      .select()
      .from(teamMembers)
      .where(
        and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId))
      )
  );
  if (memberError || !memberResult.length) {
    return false;
  }
  return true;
}
