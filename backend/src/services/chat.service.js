const chat = require("../models/chat");
const ChatModel = require("../models/chat");

class ChatService {
  constructor() {
    this.chatModel = ChatModel;
  }

  async createChat(chatId,name){
    if(!chatId,!name){
        throw new Error("chatId,name requis");
    }

    return await this.chatModel.createChata(chatId,name);
  }

  async isUserInTontine(chatId, userId) {
    const members = await this.chatModel.getTontineMembers(chatId); //chatId c'est encore l'Id de la tontine 
    return members.includes(userId); // Vérifie si l'utilisateur est dans la tontine
  }

  async sendMessage(chatId, senderId, content) {
    console.log("Données envoyées au modèle :", { chatId, senderId, content }); // Ajout du log
    if (!chatId || !senderId || !content) {
      throw new Error("chatId, senderId and content are required ok?");
    }

    const members = await this.chatModel.getTontineMembers(chatId); // Récupérer les membres de la tontine
    if (!members.includes(senderId)) {
      throw new Error("Sender is not a member of the chat");
    }
    const result = await this.chatModel.addMessage(chatId, senderId, content);
    return { id: result.id, ...result }; // Assurez-vous de renvoyer un objet clair
  }

  async fetchMessages(chatId) {
    if (!chatId) {
      throw new Error("chatId is required");
    }
    const messages = await this.chatModel.getMessages(chatId);
    if (messages.length === 0) {
      console.log("Aucun message trouvé pour le chat :", chatId); // Log si aucun message
    }
    console.log("Messages renvoyés par le modèle :", messages); // Ajout du log
    return messages;
  }
}

module.exports = new ChatService();
