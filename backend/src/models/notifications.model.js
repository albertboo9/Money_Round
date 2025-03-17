const admins = require("../config/firebase");

const db = admins.admin.firestore();
const NOTIFICATIONS_COLLECTION = "notifications";

class NotificationModel {
  /**
   * Sauvegarder une notification dans Firestore
   * @param {Object} notificationData
   */
  async createNotification(notificationData) {
    try {
      const docRef = db.collection(NOTIFICATIONS_COLLECTION).doc();
      await docRef.set({ id: docRef.id, ...notificationData });
      return docRef.id;
    } catch (error) {
      console.error("Erreur lors de la création de la notification :", error);
      throw error;
    }
  }
}

module.exports = new NotificationModel();