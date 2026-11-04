import { Router } from "express";
import { getUserByCPF, getUsers, postUser, updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyRole } from "../auth/verifyRole.js";

const router = Router()

router.get("/", authMiddleware, verifyRole("admin"), getUsers);
router.get("/:cpf", authMiddleware, verifyRole("admin"), getUserByCPF);
router.post("/", authMiddleware, verifyRole("admin"), postUser);
router.put("/:idUser", authMiddleware, verifyRole("admin"), updateUser);

export default router;