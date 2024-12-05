import { clientSocket as socket } from "~/lib/clientSocket";
import { createResource, onCleanup, onMount } from "solid-js";
import {
  hideNotification,
  isNotificationVisible,
  notificationMessage,
  showNotification,
} from "~/routes/api/notificationStore";
import Notification from "../shared/notification";
import { getUserIdFromSession } from "~/api/server";

export default function SocketNotification() {
  const [userId, { mutate, refetch }] = createResource(
    async () => await getUserIdFromSession()
  );
  onMount(() => {
    if (userId()) {
      socket.emit("new-user", userId()!.toString());
    }

    socket.on("journal-entry-created", (entryType) => {
      appendMessage(`A new ${entryType} entry created`);
    });

    socket.on("journal-entry-edited", (entryType) => {
      appendMessage(`A ${entryType} entry has been updated`);
    });

    socket.on("journal-entry-deleted", (entryType) => {
      appendMessage(`A ${entryType} entry has been deleted`);
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
      socket.off("journal-entry-created");
      socket.off("journal-entry-edited");
      socket.off("journal-entry-deleted");
      socket.off("calendar-event-created");
      socket.off("calendar-event-edited");
      socket.off("calendar-event-deleted");
      socket.off("calendar-task-completed");
      socket.off("status-calendar-event-updated");
    });
  });

  const appendMessage = (message: string) => showNotification(message);
  return (
    <>
      {isNotificationVisible() && (
        <Notification
          title={notificationMessage()}
          onClose={hideNotification}
        />
      )}
    </>
  );
}
