// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createResource, onCleanup, Suspense, useContext } from "solid-js";
import "./app.css";
import "./input.css";
import Layout from "./components/Layout";
import { MetaProvider } from "@solidjs/meta";
import { TeamProvider } from "./context/team-context";
import { createEffect, onMount } from "solid-js";
import { clientSocket as socket } from "~/lib/clientSocket";
import {
  hideNotification,
  isNotificationVisible,
  notificationMessage,
  showNotification,
} from "./routes/api/notificationStore";
import Notification from "./components/shared/notification";
import { getUserIdFromSession } from "./api/server";

export default function App() {
  const [userId, { mutate, refetch }] = createResource(
    async () => await getUserIdFromSession()
  );
  onMount(() => {
    if (userId()) {
      socket.emit("new-user", userId()!.toString());
    }
    socket.on("chat-message", (message) => {
      appendMessage(`${message.message}`);
    });
    
    socket.on("journal-entry-created", (entry) => {
      appendMessage(`New journal entry created: ${entry}`);
    });

    socket.on("journal-entry-edited", (entry) => {
      appendMessage(`Journal entry updated: ${entry}`);
    });

    socket.on("journal-entry-deleted", (entryId) => {
      appendMessage(`Journal entry deleted (ID: ${entryId})`);
    });

    socket.on("calendar-event-created", (eventTitle) => {
      appendMessage(`New event created: ${eventTitle}`);
    });

    socket.on("calendar-event-edited", (event) => {
      appendMessage(`Event updated: ${event}`);
    });

    socket.on("calendar-event-deleted", (eventTitle) => {
      appendMessage(`Event: ${eventTitle} deleted`);
    });
    socket.on("status-calendar-event-updated", (eventData) => {
      appendMessage(
        `${eventData.user} updated their status: ${eventData.status} under ${eventData.title}`
      );
    });
    socket.on("calendar-task-completed", (eventData) => {
      appendMessage(`Event: ${eventData} has been ${eventData.complete}ed`);
    });

    // Clean up socket listeners on component unmount
    onCleanup(() => {
      socket.off("chat-message");
      socket.off("journal-entry-created");
      socket.off("journal-entry-edited");
      socket.off("journal-entry-deleted");
      socket.off("calendar-event-created");
      socket.off("calendar-event-edited");
      socket.off("calendar-event-deleted");
    });
  });

  const appendMessage = (message: string) => showNotification(message);

  createEffect(() => {
    console.log(notificationMessage(), "waaaaaa");
  });
  return (
    <TeamProvider>
      <Router
        root={(props) => (
          <MetaProvider>
            <Suspense>
              <Layout>
                {props.children}
                {isNotificationVisible() && (
                  <Notification
                    title={notificationMessage()}
                    onClose={hideNotification}
                  />
                )}
              </Layout>
            </Suspense>
          </MetaProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </TeamProvider>
  );
}
