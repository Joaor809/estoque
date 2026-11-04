import { Router } from "express";
import { deleteCategorys, getCategorys, postCategorys, updateCategorys } from "../controllers/categoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyRole } from "../auth/verifyRole.js";

const router = Router();

router.get("/", authMiddleware, verifyRole("admin", "stock_clerk"), getCategorys);
router.post("/", authMiddleware, verifyRole("admin", "stock_clerk"), postCategorys);
router.put("/:idCategory", authMiddleware, verifyRole("admin", "stock_clerk"), updateCategorys);
router.delete("/:idCategory", authMiddleware, verifyRole("admin", "stock_clerk"), deleteCategorys);

export default router;