import { Router } from "express";
import { deleteLots, getLotByCodLot, getLotByCodProduct, getLots, postLots, updateLots } from "../controllers/lotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyRole } from "../auth/verifyRole.js";


const router = Router();

router.get("/", authMiddleware, verifyRole(1, 3), getLots);
router.get("/:codLot", authMiddleware, verifyRole(1, 3), getLotByCodLot);
router.get("/:codProduct", authMiddleware, verifyRole(1, 3), getLotByCodProduct);
router.post("/", authMiddleware, verifyRole(1, 3), postLots);
router.put("/:codLot", authMiddleware, verifyRole(1, 3), updateLots);
router.delete("/:codLot", authMiddleware, verifyRole(1, 3), deleteLots);
export default router;