import { action } from "@solidjs/router";
import { v4 as uuidv4 } from "uuid";
import { getKindeClient, sessionManager } from "./kinde";

type AuthUrlParams = {
  connection_id: string;
  login_hint?: string;
};

export const emailLogin = action(async (formData: FormData) => {
  "use server";

  const email = formData.get("email")?.toString();

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
  const errors: { [key: string]: string } = {};
  const email = formData.get("email")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const dob = formData.get("date")?.toString();
  const infoObj = JSON.stringify({
    firstName,
    lastName,
    dob,
  });

  if (!email) {
    errors.email = "Missing email";
  }
  if (!firstName) {
    errors.firstName = "Missing first name";
  }
  if (!lastName) {
    errors.lastName = "Missing last name";
  }
  if (!dob) {
    errors.dob = "Missing birth date";
  }

  if (Object.keys(errors).length > 0) {
    throw { errors };
  }

  const authUrlParams: AuthUrlParams = {
    connection_id: process.env.KINDE_EMAIL_CONNECTION_ID!,
    login_hint: email,
  };

  const manager = await sessionManager();
  const state = uuidv4();
  await manager.setSessionItem("auth_state", state);
  const registerUrl = await getKindeClient().register(manager, {
    state,
    authUrlParams,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: registerUrl.toString(),
      "Set-Cookie": `register_obj=${encodeURIComponent(
        infoObj
      )}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; path:"/api/auth"; Secure`,
    },
  });
}, "registerAction");

export type oauthMethods = "" | "google" | "facebook" | "apple";
export type RegisterInfo = {
  firstName: string;
  lastName: string;
  dob: string;
};
