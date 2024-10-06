import { Button } from "~/components/ui/button";
import { createSignal } from "solid-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Switch, SwitchControl, SwitchThumb } from "~/components/ui/switch";
import { For } from "solid-js";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

const CardDemo = () => {
  const [isToggled, setIsToggled] = createSignal(false);
  return (
    <Card class="w-[380px] shadow-lg border border-gray-200 p-6">
      <CardHeader>
        <CardTitle class="text-lg font-bold">Notifications</CardTitle>
        <CardDescription class="text-sm text-gray-600">
          You have {notifications.length} unread messages.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="flex items-center space-x-4 rounded-md border p-4 bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-500"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1"
            />
          </svg>
          <div class="flex-1 space-y-1">
            <p class="text-sm font-medium leading-none">Push Notifications</p>
            <p class="text-sm text-gray-500">Send notifications to device.</p>
          </div>
          <Switch
            checked={isToggled()}
            onChange={() => setIsToggled(!isToggled())}
          >
            <SwitchControl class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <SwitchThumb
                class={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  isToggled() ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </SwitchControl>
          </Switch>
        </div>
        <div>
          <For each={notifications}>
            {(notification) => (
              <div class="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div class="space-y-1">
                  <p class="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p class="text-sm text-gray-500">
                    {notification.description}
                  </p>
                </div>
              </div>
            )}
          </For>
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full bg-blue-600 hover:bg-blue-700 text-white mt-5 px-3 py-2 rounded-md flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m5 12l5 5L20 7"
            />
          </svg>
          Mark all as read
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardDemo;
