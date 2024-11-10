import { action, cache } from "@solidjs/router";
import { getUser as gU, logout as l, loginOrRegister as lOR } from "./server";
// import { callClaude, defaultClaudeSettings } from "~/api/claude/apiCalls";
import { z } from "zod";

export const getUser = cache(gU, "user");
export const loginOrRegister = action(lOR, "loginOrRegister");
export const logout = action(l, "logout");
export const runAI = action(async (formData: FormData) => {
  "use server";
});
