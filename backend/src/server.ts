import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import jwt from "jsonwebtoken";
import Product from "./routes/Products.js";
import Categorys from "./routes/Categorys.js";
import Lots from "./routes/Lots.js";
import Sale from "./routes/Sale.js";
import Users from "./routes/Users.js";
import Auth from "./routes/Auth.js"

dotenv.config()

const server = express();

server.use(express.json());
server.use(cors());

server.use("/products", Product);
server.use("/categorys", Categorys);
server.use("/lots", Lots);
server.use("/sales", Sale);
server.use("/users", Users);
server.use("/login", Auth);

const port: number = Number(process.env.PORT);

server.listen(port, "0.0.0.0", () => {
    console.log("Servidor Rodando")
})