import {
  createRecurringPayment,
  getRecurringPayments,
  cancelRecurringPayment
} from "../services/recurringService.js";

export const createRecurringController = (req, res) => {
  const { amount, address, frequency } = req.body;

  const result = createRecurringPayment(amount, address, frequency);

  if (result.success) {
    return res.status(201).json(result);
  }

  return res.status(400).json(result);
};

export const getRecurringController = (req, res) => {
  return res.json({
    success: true,
    recurringPayments: getRecurringPayments()
  });
};

export const cancelRecurringController = (req, res) => {
  const { id } = req.params;
  const result = cancelRecurringPayment(id);

  if (result.success) {
    return res.json(result);
  }

  return res.status(404).json(result);
};
