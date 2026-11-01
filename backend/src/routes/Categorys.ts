import { Router } from "express";
import { deleteCategorys, getCategorys, postCategorys, updateCategorys } from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategorys);
router.post("/", postCategorys);
router.put("/:idCategory", updateCategorys);
router.delete("/:idCategory", deleteCategorys);

export default router;