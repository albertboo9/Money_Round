const admin = require("../config/firebase");
const NotificationModel = require("../models/notifications.model");
const joi = require("joi");
const nodeMailler = require("nodemailer");
require('dotenv').config()
class NotificationService {
  /**
   * Envoyer une notification Firebase et la sauvegarder dans Firestore
   */
  async sendNotification(
    notifId,
    // userid  les utilisateurs qui doivent recevoir la notif
    //type,
    //firebase token
    title,
    body
  ) {
    try {
      const message = {
        notification: {
          title: joi.string().min(3).max(255).required(),
          type: joi.string().min(3).max(100).required(),
          body: joi.string().min(3).max(255).required(),
        },
        topic: "testtopic", //token firebase de l'utilisateur recuper au front
      };

      // Envoyer la notification
      await admin.admin.messaging().send(message);

      // Sauvegarder la notification dans Firestore
      await NotificationModel.createNotification({
        //userid,
        notifId: joi.string().required(),
        title: joi.string().min(3).max(255).required(),
        type: joi.string().min(3).max(40).required(),
        body: joi.string().min(3).max(255).required(),
        timestamp: admin.admin.firestore.Timestamp.now(),
        read: false,
      });

      console.log("Notification envoyée et enregistrée avec succès.");
    } catch (err) {
      console.error("Erreur lors de l'envoi de la notification :", err);
    }
  }

  /**
   * Envoyer une notification mail pour l'instant c'est juste avec mon mail feukengbrunel555@gmail.com
   */

  async sendEmailnotification(to, subject, text) {
    try {
      //configuration de l'element pour SMTP
      const transporter = nodeMailler.createTransport({
        service: "gmail", // SMTP nodeMailer reconnais directement service gmail comme etant host:smtp.gmail.com port:587 secure:false  (465 pour ssl)
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
      });

      //message

      const messageOption = {
        from: "moneyround237@gmail.com",
        to: to,
        subject: subject,
        text: text,
      };

      // Envoi de l'email
      const info = await transporter.sendMail(messageOption);
      console.log(`Email envoyé : ${info.response}`);
    } catch (err) {
      console.error(`Erreur lors de l'envoi de l'email : ${err.message}`);
    }
  }
}

module.exports = new NotificationService();
