import { Router } from "express";
import { getUserByCPF, getUsers, postUser, updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyRole } from "../auth/verifyRole.js";

const router = Router()

router.get("/", authMiddleware, verifyRole(1), getUsers);
router.get("/:cpf", authMiddleware, verifyRole(1), getUserByCPF);
router.post("/", authMiddleware, postUser);
router.put("/:idUser", authMiddleware, updateUser);

export default router;