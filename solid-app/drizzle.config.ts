import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations/',
  driver: 'turso',
  dbCredentials: {
    url:
      (process.env.NODE_ENV || '').trim() === 'production'
        ? process.env.TURSO_CONNECTION_URL!
        : 'file:/./drizzle/local.db',
    authToken:
      (process.env.NODE_ENV || '').trim() === 'production'
        ? process.env.TURSO_AUTH_TOKEN
        : '',
  },
});
