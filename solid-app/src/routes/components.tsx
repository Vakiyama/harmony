import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getUser, logout } from "~/api";
import Tabs from "~/components/radix/Tabs";

export const route = {
  preload() {
    getUser(); // Preload user data
  },
} satisfies RouteDefinition;

export default function Components() {
  const user = createAsync(async () => getUser(), { deferStream: true });

  return (
    <main class="w-full p-4 space-y-2">
      <h1>Components</h1>
      <Tabs />
    </main>
  );
}
