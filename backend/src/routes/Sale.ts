import { Router } from "express";
import { getItemsSale, getSales, getSalesAboveValue, shopping } from "../controllers/saleController.js";

const router = Router();

router.get("/", getSales);
router.get("/items/:idSale", getItemsSale);
router.get("/:minValue", getSalesAboveValue);
router.post("/", shopping);

export default router;