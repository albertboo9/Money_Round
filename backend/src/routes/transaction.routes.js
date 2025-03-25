const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');

//  Effectuer un paiement
router.post('/pay', authMiddleware(), transactionController.payContribution);

//  Récupérer l'historique des transactions d'un utilisateur
router.get('/user/:userId', authMiddleware(), transactionController.getUserTransactions);

//  Vérifier si un utilisateur a déjà contribué pour une période spécifique
router.get('/check/:tontineId/:tourId/:periodeId/:userId', authMiddleware(), transactionController.checkUserContribution);

module.exports = router;
