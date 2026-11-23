import { Router } from "express";
import { getUsers, postUser, updateUser, whatRole} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyRole } from "../auth/verifyRole.js";

const router = Router()

router.get("/", authMiddleware, verifyRole(1), getUsers);
router.get("/whatRole/:idUser", whatRole);
router.post("/", postUser);
router.put("/:idUser", authMiddleware, updateUser);

export default router;