import express from "express";
import upload from "../utils/multer.js";

const router = express.Router();

import TransactionController from "../controllers/transaction.js";
import { authenticateToken } from "../middlewares/verifyToken.js";

router.post(
  "/buy-course/:courseId",
  upload.single("picture"),
  authenticateToken,
  TransactionController.paidEnrollment
);

router.get(
  "/get-transaction-by-user",
  authenticateToken,
  TransactionController.getTransactionByUserId
);

router.get("/", authenticateToken, TransactionController.getAllTransaction);

router.post(
  "/confirm-payment/:transactionId",
  authenticateToken,
  TransactionController.confirmPayment
);

export default router;
