import { Router } from "express";
import { deleteProducts, getProducts, postProducts, searchProducts, updateProducts } from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/search", searchProducts);
router.post("/", postProducts);
router.delete("/:codProduct", deleteProducts);
router.put("/:codProduct", updateProducts)

export default router;