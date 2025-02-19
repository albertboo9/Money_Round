/**
 * @fileoverview Modèle de données pour les tontines utilisant Firestore et Joi pour la validation.
 */

const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const db = admin.admin.firestore(); // Initialisation de Firestore
const Joi = require("joi"); // Importation de Joi pour la validation des données
const { FieldValue } = require("firebase-admin/firestore");

const TONTINE_COLLECTION = "tontines"; // Nom de la collection Firestore dédiée aux tontines

// Définition du schéma de validation des tontines avec Joi
const tontineSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(), // Nom de la tontine (3 à 50 caractères, requis)
  description: Joi.string().max(255).optional(), // Description (max 255 caractères, optionnelle)
  creatorId: Joi.string().required(), // ID du créateur (requis)
  codeInvitation: Joi.string().required(), // Code d'invitation (requis)
  amount: Joi.number().positive().required().default(O), // montant économisé par la tontine
  membersId: Joi.array().items(Joi.string()).default([]), // Liste des membres (par défaut vide)
  adminId: Joi.array().items(Joi.string()).default([]), // Liste des admins (par défaut vide)
  inviteId: Joi.array().items(Joi.string()).default([]), // Liste des utilisateurs invités à réjoindre la tontine (par défaut vide)
  frequency: Joi.string()
    .valid("quotidien", "hebdomadaire", "mensuel", "annuel")
    .required(), // Fréquence des paiements (valeurs prédéfinies, requis)
  startDate: Joi.date().iso().required(), // Date de début (format ISO, requise)
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(), // Date de fin (optionnelle, doit être après startDate)
  status: Joi.string().valid("active", "terminée", "annulée").default("active"), // Statut de la tontine (valeurs prédéfinies, défaut: active)
  createdAt: Joi.date().optional(), // Date de création (valeur par défaut: date actuelle)
  updatedAt: Joi.date().optional(), // Date de mise à jour (valeur par défaut: date actuelle)
  tours: joi
    .array()
    .items(
      joi.object({
        tourId: joi.string().required(),
        startDate: joi.date().iso().required(),
        endDate: joi.date().iso().greater(joi.ref("startDate")).required(),
        amount: Joi.number().positive().required(), // Montant de participation (nombre positif requis)
        status: joi
          .string()
          .valid("en cours", "terminée", "annulée")
          .required(),
        participantNotYetReceived: joi.array().items(joi.string()).default([]),
        participantReceived: joi.array().items(joi.string()).default([]),
      })
    )
    .optional(),
}).strict(); // Empêche l'ajout de champs non définis

const updateTontineSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().max(255).optional(),
  creatorId: Joi.string().optional(),
  codeInvitation: Joi.string().optional(),
  amount: Joi.number().positive().optional(), // montant économisé par la tontine
  membersId: Joi.array().items(Joi.string()).optional(),
  adminId: Joi.array().items(Joi.string()).optional(),
  inviteId: Joi.array().items(Joi.string()).optional(),
  frequency: Joi.string()
    .valid("quotidien", "hebdomadaire", "mensuel", "annuel")
    .optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(),
  status: Joi.string().valid("active", "terminée", "annulée").optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  tours: joi
    .array()
    .items(
      joi.object({
        tourId: joi.string().required(),
        startDate: joi.date().iso().optional(),
        endDate: joi.date().iso().greater(joi.ref("startDate")).optional(),
        amount: Joi.number().positive().optional(), // Montant de participation (nombre positif requis)
        status: joi
          .string()
          .valid("en cours", "terminée", "annulée")
          .optional(),
        participantNotYetReceived: joi.array().items(joi.string()).default([]),
        participantReceived: joi.array().items(joi.string()).default([]),
      })
    )
    .optional(),
}).strict();

//let date = new Date();

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
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
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

      // Validation des données mises à jour avec Joi
      const { error, value } = updateTontineSchema.validate(tontineData, {
        allowUnknown: false, // Empêche l'ajout de champs non définis
        presence: "optional", // Rend tous les champs optionnels
      });
      if (error) throw new Error(`Validation échouée: ${error.message}`);

      // Mise à jour des données dans Firestore
      await tontineRef.update({
        ...value,
        updatedAt: FieldValue.serverTimestamp(), // Mise à jour de la date
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

  /**
   * Ajoute un utilisateur à la liste des invités d'une tontine.
   * @param {string} tontineId - ID de la tontine.
   * @param {string} userId - ID de l'utilisateur à inviter.
   * @returns {Promise<void>}
   */
  static async inviteMember(tontineId, userId) {
    try {
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineId);
      const tontineDoc = await tontineRef.get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      // Ajouter l'utilisateur à la liste des invités
      await tontineRef.update({
        inviteId: admin.firestore.FieldValue.arrayUnion(userId),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'invitation de l'utilisateur:",
        error.message
      );
      throw new Error("Impossible d'inviter l'utilisateur.");
    }
  }

  /**
   * Ajoute un utilisateur à la liste des membres d'une tontine et le retire de la liste des invités.
   * @param {string} tontineId - ID de la tontine.
   * @param {string} userId - ID de l'utilisateur à ajouter.
   * @returns {Promise<void>}
   */
  static async joinTontine(tontineId, userId) {
    try {
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineId);
      const tontineDoc = await tontineRef.get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      const tontineData = tontineDoc.data();
      if (!tontineData.inviteId.includes(userId)) {
        throw new Error(
          "L'utilisateur n'est pas invité à rejoindre la tontine"
        );
      }

      // Ajouter l'utilisateur à la liste des membres et le retirer de la liste des invités
      await tontineRef.update({
        membersId: admin.firestore.FieldValue.arrayUnion(userId),
        inviteId: admin.firestore.FieldValue.arrayRemove(userId),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de l'utilisateur à la tontine:",
        error.message
      );
      throw new Error("Impossible d'ajouter l'utilisateur à la tontine.");
    }
  }
}

module.exports = { TontineModel, tontineSchema }; // Exportation du modèle pour utilisation externe
