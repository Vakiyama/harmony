import { createSignal, onMount, For } from "solid-js";
import { createStore } from "solid-js/store";
import { clientSocket as socket } from "~/lib/clientSocket";
import { getUser } from "~/api";

const user = await getUser()

export default function ChatRoom() {
  const [messageInput, setMessageInput] = createSignal("");
  const [messages, setMessages] = createStore<string[]>([]);
  
  onMount(() => { 
    const username = user.username || "unknown"
    socket.emit("new-user", username)

    appendMessage("You joined");
    socket.on("chat-message", (data) => {
      appendMessage(`${data.name}: ${data.message}`);
    });
    socket.on("user-connected", (name) => {
      appendMessage(`${name} connected`);
    });
    socket.on("user-disconnected", (name) => {
      appendMessage(`${name} disconnected`);
    });
  });

  const appendMessage = (message: string) =>
    setMessages(messages.length, message);

  const handleInput = (e: Event) => {
    e.preventDefault();
    const message = messageInput();
    appendMessage(`You: ${message}`);
    socket.emit("send-chat-message", message);
    setMessageInput("");
  };

  return (
    <>
    {JSON.stringify(Response.json)}
      <div id="message-container">
        <For each={messages}>{(msg) => <div>{msg}</div>}</For>
      </div>
      <form id="send-container" onSubmit={handleInput}>
      <input
        placeholder="Send a message..."
        type="text"
        value={messageInput()}
        onChange={(e) => setMessageInput(e.target.value)}
        id="message-input"
        class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-100"
      />
        <button type="submit" id="send-button">
          Send
        </button>
      </form>
    </>
  );
}