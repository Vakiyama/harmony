import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

let client;

if ((process.env.NODE_ENV || '').trim() !== 'production') {
  client = createClient({
    url: 'http://127.0.0.1:8080',
  });
} else {
  client = createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}
export const db = drizzle(client);
