const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const express = require('express');
const router = express.Router();
const verifyApiKey=require('../config/verifyApikey')

//router.use(verifyApiKey);

// Inscription de l'utilisateur par email et password
router.post('/register', userController.registerWithEmailPassword);

// Connexion de l'utilisateur par email et password
router.post('/login', userController.signInWithEmailAndPassword);

// Déconnexion de l'utilisateur
router.post('/logout', authMiddleware(), userController.signOut);

// Récupérer un utilisateur par son Id
router.get('/:userId', authMiddleware(), userController.getUserById);

// Mise à jour des données de l'utilisateur
router.patch('/:userId', authMiddleware(), userController.updateUser);

// Suppression d'un utilisateur
router.delete('/:userId', authMiddleware(), userController.deleteUser);

// Récupérer toutes les tontines d'un utilisateur
router.get('/:userId/tontines', authMiddleware(), userController.getTontinesByUserId);

// Récupérer toutes les notifications d'un utilisateur
router.get('/:userId/notifications', authMiddleware(), userController.getNotificationsByUserId);

// Réinitialiser le mot de passe d'un utilisateur via un lien par mail
router.post('/resetPassword', userController.resetPassword);

// Mettre a jour le mot de passe d'un utilisateur
router.post('/updatePassword', userController.updatePassword);


module.exports = router;