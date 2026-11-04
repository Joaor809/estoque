import { Router } from "express";
import { getUserByCPF, getUsers, postUser, updateUser } from "../controllers/userController.js";

const router = Router()

router.get("/", getUsers);
router.get("/:cpf", getUserByCPF);
router.post("/", postUser);
router.put("/:idUser", updateUser);

export default router;