import { Router } from "express";
import { deleteProducts, getProducts, getProductsByCategory, postProducts, searchProducts, updateProducts } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verify } from "node:crypto";
import { verifyRole } from "../auth/verifyRole.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/", authMiddleware, upload.single("image"), postProducts);
router.get("/", authMiddleware, getProducts);
router.get("/search", authMiddleware, searchProducts);
router.get("/category/:idCategory", authMiddleware, getProductsByCategory);
router.delete("/:codProduct", authMiddleware, verifyRole(1, 3), deleteProducts);
router.put("/:codProduct", authMiddleware, verifyRole(1, 3), updateProducts)

export default router;