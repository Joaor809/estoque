import { Router } from "express";
import { deleteCategorys, getCategorys, postCategorys } from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategorys);
router.post("/", postCategorys);
router.delete("/:idCategory", deleteCategorys);

export default router;