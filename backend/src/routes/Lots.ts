import { Router } from "express";
import { deleteLots, getInvalidLots, getLotByCodLot, getLotByCodProduct, getLots, getValidLots, postLots, updateAvailableLots } from "../controllers/lotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyRole } from "../auth/verifyRole.js";


const router = Router();

router.get("/", authMiddleware, verifyRole(1, 3), getLots);
router.get("/valid", authMiddleware, verifyRole(1, 3), getValidLots);
router.get("/invalid", authMiddleware, verifyRole(1, 3), getInvalidLots);
router.get("/:codLot", authMiddleware, verifyRole(1, 3), getLotByCodLot);
router.get("/:codProduct", authMiddleware, verifyRole(1, 3), getLotByCodProduct);
router.post("/", authMiddleware, verifyRole(1, 3), postLots);
router.put("/:codLot/availability", authMiddleware, verifyRole(1, 3), updateAvailableLots);
router.delete("/:codLot", authMiddleware, verifyRole(1, 3), deleteLots);

export default router;