import { Router } from "express";
import { deleteLots, getLotByCodLot, getLotByCodProduct, getLots, postLots, updateLots } from "../controllers/lotController.js";


const router = Router();

router.get("/", getLots);
router.get("/:codLot", getLotByCodLot);
router.get("/product/:codProduct", getLotByCodProduct);
router.post("/", postLots);
router.put("/:codLot", updateLots);
router.delete("/:codLot", deleteLots);

export default router;