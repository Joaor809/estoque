import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import jwt from "jsonwebtoken";
import Product from "./routes/Products.js";
import Categorys from "./routes/Categorys.js";

dotenv.config()

const server = express();

server.use(express.json())
server.use(cors())

server.use("/products", Product)
server.use("/categorys", Categorys)

const port: number = Number(process.env.PORT);

server.listen(port, "0.0.0.0", () => {
    console.log("Servidor Rodando")
})