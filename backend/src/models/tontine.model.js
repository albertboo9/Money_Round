/**
 * @fileoverview Modèle de données pour les tontines utilisant Firestore et Joi pour la validation.
 */

const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const db = admin.firestore(); // Initialisation de Firestore
const Joi = require("joi"); // Importation de Joi pour la validation des données

const TONTINE_COLLECTION = "tontines"; // Nom de la collection Firestore dédiée aux tontines

// Définition du schéma de validation des tontines avec Joi
const tontineSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(), // Nom de la tontine (3 à 50 caractères, requis)
  description: Joi.string().max(255).optional(), // Description (max 255 caractères, optionnelle)
  creatorId: Joi.string().required(), // ID du créateur (requis)
  codeInvitation: Joi.string().required(), // Code d'invitation (requis)
  membersId: Joi.array().items(Joi.string()).default([]), // Liste des membres (par défaut vide)
  adminId: Joi.array().items(Joi.string()).default([]), // Liste des admins (par défaut vide)
  inviteId: Joi.array().items(Joi.string()).default([]), // Liste des utilisateurs invités à réjoindre la tontine (par défaut vide)
  amount: Joi.number().positive().required(), // Montant de participation (nombre positif requis)
  frequency: Joi.string()
    .valid("quotidien", "hebdomadaire", "mensuel", "annuel")
    .required(), // Fréquence des paiements (valeurs prédéfinies, requis)
  startDate: Joi.date().iso().required(), // Date de début (format ISO, requise)
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(), // Date de fin (optionnelle, doit être après startDate)
  status: Joi.string().valid("active", "terminée", "annulée").default("active"), // Statut de la tontine (valeurs prédéfinies, défaut: active)
  createdAt: Joi.date().required(), // Date de création (valeur par défaut: date actuelle)
  updatedAt: Joi.date().required(), // Date de mise à jour (valeur par défaut: date actuelle)
}).strict(); // Empêche l'ajout de champs non définis

class TontineModel {
  /**
   * Crée une nouvelle tontine et l'ajoute à Firestore.
   * @param {Object} tontineData - Données de la tontine à créer.
   * @returns {Promise<string>} - ID de la tontine créée.
   */
  static async createTontine(tontineData) {
    try {
      // Validation des données avec Joi
      const { error, value } = tontineSchema.validate(tontineData);
      if (error) throw new Error(`Validation échouée: ${error.message}`);

      // Ajout de la tontine à Firestore avec timestamp
      const tontineRef = await db.collection(TONTINE_COLLECTION).add({
        ...value,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return tontineRef.id; // Retourne l'ID de la tontine créée
    } catch (error) {
      console.error("Erreur lors de la création de la tontine:", error.message);
      throw new Error("Impossible de créer la tontine.");
    }
  }

  /**
   * Récupère une tontine par son ID.
   * @param {string} tontineId - ID de la tontine à récupérer.
   * @returns {Promise<Object>} - Données de la tontine.
   */
  static async getTontineById(tontineId) {
    try {
      const tontineDoc = await db
        .collection(TONTINE_COLLECTION)
        .doc(tontineId)
        .get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      return { id: tontineDoc.id, ...tontineDoc.data() }; // Retourne les données de la tontine
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la tontine:",
        error.message
      );
      throw new Error("Impossible de récupérer la tontine.");
    }
  }

  /**
   * Met à jour une tontine existante.
   * @param {string} tontineId - ID de la tontine à mettre à jour.
   * @param {Object} tontineData - Nouvelles données de la tontine.
   * @returns {Promise<Object>} - Données mises à jour de la tontine.
   */
  static async updateTontine(tontineId, tontineData) {
    try {
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineId);
      const tontineDoc = await tontineRef.get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      // Validation des données mises à jour
      const { error, value } = tontineSchema.validate(tontineData, {
        allowUnknown: false, // Empêche l'ajout de champs non définis
        presence: "optional", // Rend tous les champs optionnels
      });
      if (error) throw new Error(`Validation échouée: ${error.message}`);

      // Mise à jour des données dans Firestore
      await tontineRef.update({
        ...value,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Mise à jour de la date
      });

      return { id: tontineId, ...value }; // Retourne les nouvelles données de la tontine
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la tontine:",
        error.message
      );
      throw new Error("Impossible de mettre à jour la tontine.");
    }
  }

  /**
   * Supprime une tontine de Firestore.
   * @param {string} tontineId - ID de la tontine à supprimer.
   * @returns {Promise<Object>} - Message de confirmation.
   */
  static async deleteTontine(tontineId) {
    try {
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineId);
      const tontineDoc = await tontineRef.get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      await tontineRef.delete(); // Suppression de la tontine
      return { message: "Tontine supprimée avec succès" }; // Confirmation de suppression
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la tontine:",
        error.message
      );
      throw new Error("Impossible de supprimer la tontine.");
    }
  }
}

module.exports = TontineModel; // Exportation du modèle pour utilisation externe
