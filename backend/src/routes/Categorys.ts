import { Router } from "express";
import { deleteCategorys, getCategorys, postCategorys, updateCategorys } from "../controllers/categoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyRole } from "../auth/verifyRole.js";

const router = Router();

router.get("/", authMiddleware, verifyRole(1, 3), getCategorys);
router.post("/", authMiddleware, verifyRole(1, 3), postCategorys);
router.put("/:idCategory", authMiddleware, verifyRole(1, 3), updateCategorys);
router.delete("/:idCategory", authMiddleware, verifyRole(1, 3), deleteCategorys);

export default router;