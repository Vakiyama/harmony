import { action } from "@solidjs/router";
import { v4 as uuidv4 } from "uuid";
import { getKindeClient, sessionManager } from "./kinde";

type AuthUrlParams = {
  connection_id: string;
  login_hint?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
};

export const emailLogin = action(async (formData: FormData) => {
  "use server";

  const email = formData.get("email")?.toString();
  console.log(email);

  if (!email) {
    return { error: "Missing email" };
  }

  const authUrlParams: AuthUrlParams = {
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

const handleLogin = async (authUrlParams: AuthUrlParams) => {
  "use server";
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

export const emailRegistration = action(async (formData: FormData) => {
  "use server";
  const email = formData.get("email")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("firstName")?.toString();
  const dob = formData.get("date")?.toString();

  if (!email) {
    return { error: "Missing email" };
  }
  if (!firstName) {
    return { error: "Missing first name" };
  }
  if (!lastName) {
    return { error: "Missing last name" };
  }
  if (!dob) {
    return { error: "Missing birth date" };
  }
  const authUrlParams: AuthUrlParams = {
    connection_id: process.env.KINDE_EMAIL_CONNECTION_ID!,
    login_hint: email,
    email,
    firstName,
    lastName,
    dob,
  };

  const manager = await sessionManager();
  const state = uuidv4();
  await manager.setSessionItem("auth_state", state);
  const registerUrl = await getKindeClient().register(manager, {
    state,
    authUrlParams,
  });
  console.log(registerUrl);
  return new Response(null, {
    status: 302,
    headers: {
      Location: registerUrl.toString(),
    },
  });
});

export type oauthMethods = "" | "google" | "facebook" | "apple";
