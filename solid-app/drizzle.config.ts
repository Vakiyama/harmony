import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './drizzle/schema/*',
  out: './drizzle/migrations/',
  driver: 'turso',
  dbCredentials: {
    url:
      (process.env.NODE_ENV || '').trim() === 'production'
        ? process.env.TURSO_CONNECTION_URL!
        : 'http://127.0.0.1:8080',
    ...(process.env.NODE_ENV || '').trim() === 'production' && {
        authToken : process.env.TURSO_AUTH_TOKEN
      },
  },
});
