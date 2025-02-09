const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const express = require('express');
const router = express.Router();
const verifyApiKey=require('../config/verifyApikey')

router.use(verifyApiKey)

// Créer un nouvel utilisateur
router.post('/', authMiddleware, userController.createUser);

// Récupérer un utilisateur par son Id
router.get('/:userId', authMiddleware, userController.getUserById);

// Mise à jour d'un utilisateur
router.put('/:userId', authMiddleware, userController.updateUser);

// Suppression d'un utilisateur
router.delete('/:userId', authMiddleware, userController.deleteUser);


module.exports = router;