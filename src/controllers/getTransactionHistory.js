import { getTransactions } from "../transaction/transactionService.js";

export const getTransactionHistory = (req, res) => {
  return res.json({
    success: true,
    transactions: getTransactions()
  });
};
