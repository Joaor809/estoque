import { Router } from "express";
import { getUserByCPF, getUsers, postUser, updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyRole } from "../auth/verifyRole.js";

const router = Router()

router.get("/", getUsers);
router.get("/:cpf", getUserByCPF);
router.post("/", postUser);
router.put("/:idUser", updateUser);

export default router;