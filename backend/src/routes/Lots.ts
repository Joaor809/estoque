import { Router } from "express";
import { deleteLots, getLotByCodLot, getLotByCodProduct, getLots, postLots, updateLots } from "../controllers/lotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyRole } from "../auth/verifyRole.js";


const router = Router();

router.get("/", authMiddleware, getLots);
router.get("/:codLot", authMiddleware, getLotByCodLot);
router.get("/products/:codProduct", authMiddleware, getLotByCodProduct);
router.post("/", authMiddleware, verifyRole("admin", "stock_clerk"), postLots);
router.put("/:codLot", authMiddleware, verifyRole("admin", "stock_clerk"), updateLots);
router.delete("/:codLot", authMiddleware, verifyRole("admin", "stock_clerk"), deleteLots);

export default router;