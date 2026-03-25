import crypto from "crypto";

let balance = 500;
let transactions = [];

export const updateBalance = (amount) => {
  balance -= amount;
};

export const addTransaction = (tx) => {
  if (
    tx.status === "success" &&
    (tx.type === "send" || tx.type === "recurring-execution")
  ) {
    balance -= tx.amount;
  }

  transactions.push(tx);
};

export const sendCrypto = (amount, address) => {
  const parsedAmount = Number(amount);
  const trimmedAddress = address?.trim();

  if (!trimmedAddress || trimmedAddress.length < 5) {
    return { success: false, message: "Invalid wallet address" };
  }

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return { success: false, message: "Amount must be greater than 0" };
  }

  if (parsedAmount > balance) {
    return { success: false, message: "Insufficient funds" };
  }

  const tx = {
    id: crypto.randomUUID(),
    type: "send",
    amount: parsedAmount,
    address: trimmedAddress,
    status: "success",
    timestamp: new Date().toISOString()
  };

  addTransaction(tx);

  return {
    success: true,
    ...tx,
    newBalance: balance
  };
};

export const getTransactions = () => {
  return transactions;
};

export const getBalance = () => balance;
