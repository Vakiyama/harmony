import { A } from "@solidjs/router";
import { createResource } from "solid-js";
import { getCalendarData, googleAuth } from "~/api/server";

export default function Calendar() {
  const [url] = createResource(async () => {
    "use server";
    return await googleAuth();
  });
  const [events] = createResource(async () => {
    "use server";
    return await getCalendarData();
  });
  return (
    <main>
      <A href={url() ? url()! : "/"}>google me</A>
      <h1>Calendar</h1>
      <ul>
        {events() ? events()!.map((event) => <li>{event.summary}</li>) : ""}
      </ul>
    </main>
  );
}
