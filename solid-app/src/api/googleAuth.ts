import { redirect } from "@solidjs/router";
import { googleAuth } from "./server";

export async function GET() {
  const url = await googleAuth();
  return redirect(url);
}
