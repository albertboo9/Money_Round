/**
 * @fileoverview controllers pour la gestion des chats de MoneyRound
 */
const express = require('express');
const dotenv = require('dotenv');
const ChatService = require('../services/chat.service');
const chatService = require('../services/chat.service');

dotenv.config();

exports.createChat= async(req,res)=>{
    const {chatId,name}=req.body

    try{
        const newChat= await chatService.createChat(chatId,name)

        res.status(201).json({succes:true, chat:newChat});
    }catch(err){
        res.status(400).json({
            succes:false, error:err.message
        })
    }
}

exports.sendMessage = async (req, res) => {
    const { chatId, senderId, content } = req.body;
    console.log("Données reçues :", { chatId, senderId, content }); // Ajout du log
    try {
        if (!chatId || !senderId || !content) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }
        const message = await ChatService.sendMessage(chatId, senderId, content);
        res.status(200).json({ success: true, message: "Message envoyé avec succès.", data: message }); // Correction ici
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(400).json({ error: 'Failed to send message', message: error.message });
    }
}

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    const {userId}=req.query; //utilisateur connecté
    try {
        if(!userId){
            return res.status(400).json({success:false,error:"userId reauis"});
        }
        const isMember= await chatService.isUserInTontine(chatId,userId);
        if(!isMember){
            return res.status(403).json({succes:false, error:"acces refuse : non memebre de la tontine "})
        }
        const messages = await ChatService.fetchMessages(chatId);
        if (messages.length === 0) {
            return res.status(200).json({ success: true, messages: [], message: "Aucun message trouvé." });
        }
        console.log("Messages renvoyés au client :", messages); // Ajout du log
        res.status(200).json({ success: true, messages: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(400).json({ error: 'Failed to fetch messages', message: error.message });
    }
}