import { getBalance } from "../transaction/transactionService.js";

let recurringPayments = [];

export const createRecurringPayment = (amount, address, frequency) => {

  if (!address || address.length < 5) {
    return { success:false, message:"Invalid wallet address" };
  }

  if (amount <= 0) {
    return { success:false, message:"Amount must be greater than 0" };
  }

  if (!frequency) {
    return { success:false, message:"Frequency required" };
  }

  // NEW CHECK
  if (amount > getBalance()) {
    return { success:false, message:"Insufficient funds" };
  }

  const recurring = {

    id: Math.random().toString(16).substring(2,10),

    type:"recurring",

    amount,

    address,

    frequency,

    status:"active",

    nextExecution:new Date().toLocaleString()

  };

  recurringPayments.push(recurring);

  return {

    success:true,

    recurring

  };

};

export const getRecurringPayments = () => {

  return recurringPayments;

};

export const cancelRecurringPayment = (id) => {

  const payment = recurringPayments.find(p => p.id === id);

  if(!payment){
    return {success:false, message:"Not found"};
  }

  payment.status="cancelled";

  return {success:true, payment};

};
