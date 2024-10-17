import { action } from "@solidjs/router";
import { v4 as uuidv4 } from "uuid";
import { getKindeClient, sessionManager } from "./kinde";

type authUrlParams = {
  connection_id: string;
  login_hint?: string;
};

export const emailLogin = action(async (formData: FormData) => {
  "use server";

  const email = formData.get("email")?.toString();
  console.log(email);

  if (!email) {
    return { error: "Missing email" };
  }

  const authUrlParams = {
    connection_id: process.env.KINDE_EMAIL_CONNECTION_ID!,
    login_hint: email,
  };

  return await handleLogin(authUrlParams);
}, "emailLogin");

export const oauthLogin = action(async (formData: FormData) => {
  "use server";

  const method = formData.get("method") as oauthMethods;

  if (!method) {
    return { error: "missing oauth method" };
  }

  let connection_id: string;
  switch (method) {
    case "google": {
      connection_id = process.env.KINDE_GOOGLE_CONNECTION_ID!;
      break;
    }
    case "facebook": {
      connection_id = process.env.KINDE_FACEBOOK_CONNECTION_ID!;
      break;
    }
    case "apple": {
      connection_id = process.env.KINDE_APPLE_CONNECTION_ID!;
      break;
    }
    default: {
      connection_id = "";
    }
  }
  if (!connection_id) {
    return { error: "error setting method" };
  }

  const authUrlParams = {
    connection_id,
  };

  return await handleLogin(authUrlParams);
}, "oauthLogin");

const handleLogin = async (authUrlParams: authUrlParams) => {
  const manager = await sessionManager();
  const state = uuidv4();
  await manager.setSessionItem("auth_state", state);

  const loginUrl = await getKindeClient().login(manager, {
    state,
    authUrlParams,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: loginUrl.toString(),
    },
  });
};

export type oauthMethods = "" | "google" | "facebook" | "apple";
