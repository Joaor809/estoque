import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Product from "./routes/Products.js";
import Categorys from "./routes/Categorys.js";
import Lots from "./routes/Lots.js";
import Sale from "./routes/Sale.js";
import Users from "./routes/Users.js";
import Auth from "./auth/authController.js"
import path from "node:path";
import { createServer } from "node:http";
import { initializeSocket } from "./config/socket.js";


dotenv.config()

const server = express();
server.use("/upload", express.static(path.resolve("upload")));

server.use(express.json());
server.use(cors());

server.use("/products", Product);
server.use("/categorys", Categorys);
server.use("/lots", Lots);
server.use("/sales", Sale);
server.use("/users", Users);
server.use("/login", Auth);

const port: number = Number(process.env.PORT);

// cria um servidor HTTP utilizando o express
// Esse servidor será utilizado tanto pelo express quanto pelo Socket.IO
const httpServer = createServer(server);

// Inicializa o Socket.IO e associa sua comunicação ao servidor HTTP
initializeSocket(httpServer);

// inicia o servidor na porta configurada
httpServer.listen(port, "0.0.0.0", () => {
    console.log("Servidor rodando");
});