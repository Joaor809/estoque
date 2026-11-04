import { Router } from "express";
import { login } from "../auth/authController.js";

const route = Router();

route.post("/", login);

export default route;