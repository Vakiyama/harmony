import { action, cache } from "@solidjs/router";
import { getUser as gU, logout as l, loginOrRegister as lOR } from "./server";
import { runApp } from "./langgraph";
import {
  getCalendar as gC,
  getEvents as gE,
  getCalendarsFromTeamId as gCFT,
} from "./calendar";

export const getUser = cache(gU, "user");
export const loginOrRegister = action(lOR, "loginOrRegister");
export const logout = action(l, "logout");
export const runAI = action(async (formData: FormData) => {
  "use server";
  const result = await runApp(formData);
  return result;
}, "runAI");
export const getCalendarsFromTeamId = cache(gCFT, "calenders");
export const getCalendar = cache(gC, "calender");
export const getEvents = cache(gE, "events");
