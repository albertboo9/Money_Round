const tontineCtrl = require('../controllers/tontine.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const express = require('express');
const router = express.Router();
const verifyApiKey=require('../config/verifyApikey')

router.use(verifyApiKey)
// Créer une nouvelle tontine
router.post('/create',  tontineCtrl.createTontine);

// Mettre à jour une tontine existante
router.put('/update/:tontineId', tontineCtrl.updateTontine);

// Supprimer une tontine
router.delete('/delete/:tontineId',  tontineCtrl.deleteTontine);

// Récupérer une tontine par son ID
router.get('/:tontineId', tontineCtrl.getTontineById);

// Nommer un administrateur de tontine
router.put('/admin/:tontineId', authMiddleware, tontineCtrl.makeAdmin);

// Rejoindre une tontine
router.post('/join/:tontineId', authMiddleware, tontineCtrl.joinTontine);

// Inviter un membre à rejoindre une tontine
router.post('/invite/:tontineId', authMiddleware, tontineCtrl.inviteMember);

module.exports = router;