"use server";

import { createKindeServerClient, GrantType, type SessionManager } from "@kinde-oss/kinde-typescript-sdk";

const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET,
  redirectURL: process.env.KINDE_REDIRECT_URL!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URL
});


const sessionStore: Record<string, Record<string, any>> = {};


export function sessionManager(sessionId: string) {
  sessionStore[sessionId] = sessionStore[sessionId] || {};

  return {
    async getSessionItem(key: string) {
      return sessionStore[sessionId][key];
    },

    async setSessionItem(key: string, value: any) {
      sessionStore[sessionId][key] = value;
    },

    async removeSessionItem(key: string) {
      delete sessionStore[sessionId][key];
    },

    async destroySession() {
      delete sessionStore[sessionId];
    }
  };
}

export function getKindeClient() {
  return kindeClient;
}

export function extractSessionId(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === 'sessionId') { 
      return value;
    }
  }
  return undefined;
}