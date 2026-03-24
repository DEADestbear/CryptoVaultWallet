import { getBalance, addTransaction } from "../transaction/transactionService.js";

let recurringPayments = [];

const VALID_FREQUENCIES = ["daily", "weekly", "monthly"];

const calculateNextExecution = (frequency) => {
  const nextDate = new Date();

  if (frequency === "daily") {
    nextDate.setDate(nextDate.getDate() + 1);
  } else if (frequency === "weekly") {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (frequency === "monthly") {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }

  return nextDate.toLocaleString();
};

const logRecurringTransaction = (type, payment) => {
  addTransaction({
    id: "rec-" + Math.random().toString(16).substring(2, 10),
    type,
    amount: payment.amount,
    address: payment.address,
    frequency: payment.frequency,
    status: payment.status,
    timestamp: new Date().toLocaleString()
  });
};

export const createRecurringPayment = (amount, address, frequency) => {
  if (!address || address.trim().length < 5) {
    return { success: false, message: "Invalid wallet address" };
  }

  if (isNaN(amount) || amount <= 0) {
    return { success: false, message: "Amount must be greater than 0" };
  }

  if (!frequency) {
    return { success: false, message: "Frequency required" };
  }

  if (!VALID_FREQUENCIES.includes(frequency)) {
    return { success: false, message: "Invalid frequency" };
  }

  if (amount > getBalance()) {
    return { success: false, message: "Insufficient funds" };
  }

  const createdAt = new Date().toLocaleString();

  const recurring = {
    id: Math.random().toString(16).substring(2, 10),
    type: "recurring",
    amount,
    address: address.trim(),
    frequency,
    status: "active",
    createdAt,
    nextExecution: calculateNextExecution(frequency)
  };

  recurringPayments.push(recurring);

  logRecurringTransaction("recurring-created", recurring);

  return {
    success: true,
    recurring
  };
};

export const getRecurringPayments = () => {
  return recurringPayments;
};

export const cancelRecurringPayment = (id) => {
  const payment = recurringPayments.find((p) => p.id === id);

  if (!payment) {
    return { success: false, message: "Not found" };
  }

  if (payment.status === "cancelled") {
    return { success: false, message: "Recurring payment already cancelled" };
  }

  payment.status = "cancelled";
  payment.cancelledAt = new Date().toLocaleString();

  logRecurringTransaction("recurring-cancelled", payment);

  return { success: true, payment };
};
