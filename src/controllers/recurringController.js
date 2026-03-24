export const createRecurringController = (req, res) => {

  const { amount, address, frequency } = req.body;

  if (!amount) {
    return res.status(400).json({
      success:false,
      message:"Amount required"
    });
  }

  const numericAmount = Number(amount);

  const result = createRecurringPayment(
    numericAmount,
    address,
    frequency
  );

  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
};
