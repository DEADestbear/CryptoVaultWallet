import crypto from "crypto";
import cron from "node-cron";
import { getBalance, addTransaction } from "../transaction/transactionService.js";

let recurringPayments = [];

const VALID_FREQUENCIES = ["daily", "weekly", "monthly"];

const calculateNextExecution = (frequency, fromDate = new Date()) => {
  const nextDate = new Date(fromDate);

  switch (frequency) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return null;
  }

  return nextDate.toISOString();
};

const logRecurringTransaction = (type, payment, status, extra = {}) => {
  addTransaction({
    id: crypto.randomUUID(),
    type,
    amount: payment.amount,
    address: payment.address,
    frequency: payment.frequency,
    recurringPaymentId: payment.id,
    status,
    timestamp: new Date().toISOString(),
    ...extra
  });
};

export const createRecurringPayment = (amount, address, frequency) => {
  const parsedAmount = Number(amount);
  const trimmedAddress = address?.trim();
  const normalizedFrequency = frequency?.trim().toLowerCase();

  if (!trimmedAddress || trimmedAddress.length < 5) {
    return { success: false, message: "Invalid wallet address" };
  }

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return { success: false, message: "Amount must be greater than 0" };
  }

  if (!VALID_FREQUENCIES.includes(normalizedFrequency)) {
    return { success: false, message: "Invalid or missing frequency" };
  }

  if (parsedAmount > getBalance()) {
    return { success: false, message: "Insufficient funds" };
  }

  const recurring = {
    id: crypto.randomUUID(),
    type: "recurring",
    amount: parsedAmount,
    address: trimmedAddress,
    frequency: normalizedFrequency,
    status: "active",
    createdAt: new Date().toISOString(),
    nextExecution: calculateNextExecution(normalizedFrequency)
  };

  recurringPayments.push(recurring);
  logRecurringTransaction("recurring-created", recurring, "scheduled");

  return { success: true, recurring };
};

export const getRecurringPayments = () => {
  return recurringPayments;
};

export const cancelRecurringPayment = (id) => {
  const payment = recurringPayments.find((p) => p.id === id);

  if (!payment) {
    return { success: false, message: "Recurring payment not found" };
  }

  if (payment.status === "cancelled") {
    return { success: false, message: "Recurring payment already cancelled" };
  }

  payment.status = "cancelled";
  logRecurringTransaction("recurring-cancelled", payment, "cancelled");

  return { success: true, payment };
};

cron.schedule("* * * * *", () => {
  const now = new Date();

  for (const payment of recurringPayments) {
    if (payment.status !== "active") continue;

    const nextExecutionDate = new Date(payment.nextExecution);

    if (nextExecutionDate > now) continue;

    if (payment.amount <= getBalance()) {
      logRecurringTransaction("recurring-execution", payment, "success");
      payment.nextExecution = calculateNextExecution(payment.frequency, now);
      console.log(`Recurring payment executed: ${payment.id}`);
    } else {
      logRecurringTransaction("recurring-execution", payment, "failed", {
        reason: "Insufficient funds"
      });
      payment.nextExecution = calculateNextExecution(payment.frequency, now);
      console.log(`Recurring payment failed due to insufficient funds: ${payment.id}`);
    }
  }
});
