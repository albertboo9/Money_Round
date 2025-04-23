const chatController = require('../controllers/chats.controller');

const express = require('express');
const router = express.Router();
const verifyApiKey=require('../config/verifyApikey')

router.use(verifyApiKey)
//creation d'un chat
 router.post('/createChat',chatController.createChat);

// Envoyer un message dans un chat
router.post('/MessageSend', chatController.sendMessage);

// Récupérer les messages d'un chat
router.get('/:chatId', chatController.getMessages);

module.exports =router;
