import { createSignal } from "solid-js";

const [notificationMessage, setNotificationMessage] = createSignal("");
const [isNotificationVisible, setNotificationVisible] = createSignal(false);

export function showNotification(message: string) {
  setNotificationMessage(message);
  setNotificationVisible(true);
}

export function hideNotification() {
  setNotificationVisible(false);
}

export { notificationMessage, isNotificationVisible };
