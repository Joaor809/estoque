import { Router } from "express";
import { deleteProducts, getProducts, getProductsByCategory, postProducts, searchProducts, updateProducts } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verify } from "node:crypto";
import { verifyRole } from "../auth/verifyRole.js";

const router = Router();

router.get("/", authMiddleware, getProducts);
router.get("/search", authMiddleware, searchProducts);
router.get("/category/:idCategory", authMiddleware, getProductsByCategory);
router.post("/", authMiddleware, verifyRole("admin", "stock_clerk"), postProducts);
router.delete("/:codProduct", authMiddleware, verifyRole("admin", "stock_clerk"), deleteProducts);
router.put("/:codProduct", authMiddleware, verifyRole("admin", "stock_clerk"), updateProducts)

export default router;