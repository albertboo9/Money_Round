const transactionService = require("../services/transaction.service");

// Effectuer un paiement
const payContribution = async (req, res) => {
  try {
    const { tontineId, tourId, periodeId, amount } = req.body;
    const userId = req.user.userId;
    const userWalletId = req.user.walletId;

    const transaction = await transactionService.processTransaction(
      userId,
      tontineId,
      tourId,
      periodeId,
      amount,
      userWalletId
    );
    res.status(201).json({ message: "Paiement effectué avec succès", transaction });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Récupérer les transactions d'un utilisateur
const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await transactionService.getUserTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vérifier si un utilisateur a déjà contribué à une période donnée
const checkUserContribution = async (req, res) => {
  try {
    const { userId, tontineId, tourId, periodeId } = req.query;
    const hasPaid = await transactionService.checkUserContribution(
      userId,
      tontineId,
      tourId,
      periodeId
    );
    res.status(200).json({ hasPaid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { payContribution, getUserTransactions, checkUserContribution };
