const admin = require("../config/firebase");
const NotificationModel = require("../models/notifications.model");

class NotificationService {
  /**
   * Envoyer une notification Firebase et la sauvegarder dans Firestore
   */
  async sendNotification(
    //userid
    //firebase token
    title,
    body
  ) {
    try {
      const message = {
        notification: { title, body },
        topic: "testtopic", //token firebase de l'utilisateur
      };

      // Envoyer la notification
      await admin.admin.messaging().send(message);

      // Sauvegarder la notification dans Firestore
      await NotificationModel.createNotification({
        //userId a ajouter peut etre
        title,
        body,
        timestamp: admin.admin.firestore.Timestamp.now(),
        read: false,
      });

      console.log("Notification envoyée et enregistrée avec succès.");
    } catch (err) {
      console.error("Erreur lors de l'envoi de la notification :", err);
    }
  }
}

module.exports = new NotificationService();
