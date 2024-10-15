"use server";

import { createKindeServerClient, GrantType } from "@kinde-oss/kinde-typescript-sdk";
import { clearSession, type SessionConfig, useSession } from "vinxi/http";

const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URL!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URL!
});

const sessionConfig: SessionConfig = {
  password:
    process.env.SESSION_SECRET!,
}

export async function sessionManager() {
    const session = await useSession(sessionConfig)

  return {
    getSession() {
      return session;
    },

    async getSessionItem(key: string) {
      return session.data[key];
    },

    async setSessionItem(key: string, value: any) {
      await session.update({ [key] : value });
    },

    async removeSessionItem(key: string) {
      const currentData = { ...session.data }
      delete currentData[key]
      await session.update(currentData);
    },

    async destroySession() {
      await clearSession(sessionConfig);
    }
  };
}

export function getKindeClient() {
  return kindeClient;
}