import { APIEvent } from "solid-start";
import { getCalendarData } from "./server";
import { Credentials } from "google-auth-library";

export async function GET({ request }: APIEvent) {
  const events = await getCalendarData();
  return new Response(JSON.stringify(events));
}
