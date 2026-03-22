import express from "express";
import { sendCryptoController } from "../controllers/sendCryptoController.js";

const router = express.Router();

router.post("/send", sendCryptoController);
router.get("/history", getTransactionHistory);

export default router;
