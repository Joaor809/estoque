import { Router } from "express";
import { deleteProduct, getProducts, postProducts, searchProduct, updateProduct } from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/search", searchProduct);
router.post("/", postProducts);
router.delete("/:codProduct", deleteProduct);
router.put("/:codProduct", updateProduct)

export default router;