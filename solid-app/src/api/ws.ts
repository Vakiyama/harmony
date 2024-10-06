import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on("connection", (socket) => {
    console.log("User connected")

    socket.on("disconnect", () => {
        console.log("User disconnected")
    })

    socket.on("message", (msg: string) => {
        console.log("Message received: " + msg)
        socket.emit('message', msg);
        socket.broadcast.emit('message', msg);
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})