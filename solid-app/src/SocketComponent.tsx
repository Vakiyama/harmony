import { createSignal, onCleanup } from "solid-js"
import { io, Socket } from "socket.io-client"

const SOCKET_URL = "http://localhost:3000"

const SocketComponent = () => {
    const [messages, setMessage] = createSignal<string[]>([])

    const socket: Socket = io(SOCKET_URL)

    socket.on("message", (msg: string) => {
        setMessage((prev) => [...prev, msg])
    })

    onCleanup(() => {
        socket.disconnect()
    })

    const sendMessage = () => {
        const msg = "Hello"
        socket.emit("message", msg)
    }

    return (
        <div>
            <h1>SocketIO Test</h1>
            <button onClick={sendMessage}>Send Message</button>
            <ul>
                {messages().map((msg, index) => (
                    <li>{msg}</li>
                ))}
            </ul>
        </div>
    )
}

export default SocketComponent