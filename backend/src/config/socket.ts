import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http"

let io: Server | undefined; // armazena a instância socket.io

export function initializeSocket(server: HTTPServer) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL
        }
    });
}

export function getIO(): Server {
    if (!io) {
        throw new Error("Socket.IO não foi inicializado!")
    }

    return io;
}