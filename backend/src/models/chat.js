const db = require("../config/firebase.js");

class ChatModel {
  constructor() {
    this.chatsRef = db.db.collection("chats");
  }
  /**
   * creation d'un chat
   * @param {*} chatId 
   * @param {*} name 
   * @returns 
   */
  async createChata(chatId,name){
    const chatData={
        name,
        createdAt:new Date().toISOString()
    }
    await this.chatsRef.doc(chatId).set(chatData);
    return {id:chatId,...chatData};
  }

  
  // recuperer les memebres de la tontine du chat en question
  /**
   *
   * @param {*} tontineId qui est encore le chatId lors de la creation du chat
   * @returns tableau d'id des membres
   */
  async getTontineMembers(tontineId) {
    const TabMembers = await this.chatsRef.doc(tontineId).get();

    if (!TabMembers.exists) {
      return [];
    }
    const data = TabMembers.data();
    return data.membersId || []; // Renvoie un tableau vide si membersIds n'existe pas
  }

  /**
   * Sauvegarder un message dans Firestore
   * @param {string} chatId
   * @param {string} senderId
   * @param {string} content
   */

  async addMessage(chatId, senderId, content) {
    const message = {
      senderId,
      content,
      timestamp: new Date().toISOString(),
    };
    console.log("Message sauvegardé :", message); // Ajout du log
    return await this.chatsRef.doc(chatId).collection("messages").add(message);
  }

  /**
   * Récupérer les messages d'un chat
   * @param {string} chatId
   * @returns {Promise<Array>} - Liste des messages du chat
   */
  async getMessages(chatId) {
    const snapshot = await this.chatsRef
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .get();
    if (snapshot.empty) {
      console.log("Aucun message trouvé pour le chat :", chatId); // Log si aucun message
      return [];
    }
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Messages récupérés :", messages); // Ajout du log
    return messages;
  }
}

module.exports = new ChatModel();
