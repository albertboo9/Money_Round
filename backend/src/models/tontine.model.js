/**
 * @fileoverview Modèle de données pour les tontines utilisant Firestore et Joi pour la validation.
 */

const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const { TontineWallet } = require("../models/wallet.model");
const db = admin.admin.firestore(); // Initialisation de Firestore
const Joi = require("joi"); // Importation de Joi pour la validation des données
const { FieldValue } = require("firebase-admin/firestore");
const { v4: uuid4 } = require("uuid");
const TONTINE_COLLECTION = "tontines"; // Nom de la collection Firestore dédiée aux tontines
const USERS_COLLECTION = "users"; // Nom de la collection Firestore dédiée aux tontines

const contributionSchema = Joi.object({
  transactionId: Joi.string().required(),
  userId: Joi.string().required(),
  montant: Joi.number().positive().required(),
  date: Joi.date().iso().required(),
  typeTransaction: Joi.string().valid("contribution", "retrait").required(),
  methodePaiement: Joi.string()
    .valid("carte de crédit", "MoMo", "OM", "Virement bancaire")
    .required(),
  statutTransaction: Joi.string()
    .valid("réussie", "échouée", "en attente")
    .required(),
});

const periodeCotisationSchema = Joi.object({
  id: Joi.string().required(),
  beneficiaire: Joi.string().required(),
  date_debut: Joi.date().iso().required(),
  date_fin: Joi.date().iso().greater(Joi.ref("date_debut")).required(),
  contributions: Joi.object()
    .pattern(Joi.string(), Joi.array().items(contributionSchema))
    .default({}),
  statut: Joi.string().valid("en cours", "à venir", "terminé").required(),
  amount: Joi.number().positive().required(),
});

const tourSchema = Joi.object({
  tourId: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
  amount: Joi.number().positive().required(),
  status: Joi.string().valid("en cours", "terminée", "annulée").required(),
  participantNotYetReceived: Joi.array().items(Joi.string()).default([]),
  participantReceived: Joi.array().items(Joi.string()).default([]),
  periodeCotisation: Joi.array().items(periodeCotisationSchema).required(),
});

// Définition du schéma de validation des tontines avec Joi
const tontineSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(), // Nom de la tontine (3 à 50 caractères, requis)
  walletId: Joi.string().optional(), // ID du portefeuille associé (requis)
  description: Joi.string().max(255).optional(), // Description (max 255 caractères, optionnelle)
  creatorId: Joi.string().required(), // ID du créateur (requis)
  codeInvitation: Joi.string().required(), // Code d'invitation (requis)
  amount: Joi.number().required(), // montant économisé par la tontine
  membersId: Joi.array().items(Joi.string()).default([]), // Liste des membres (par défaut vide)
  adminId: Joi.array().items(Joi.string()).default([]), // Liste des admins (par défaut vide)
  inviteId: Joi.array().items(Joi.string()).default([]), // Liste des utilisateurs invités à réjoindre la tontine (par défaut vide)
  startDate: Joi.date().iso().required(), // Date de début (format ISO, requise)
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(), // Date de fin (optionnelle, doit être après startDate)
  status: Joi.string().valid("active", "terminée", "annulée").default("active"), // Statut de la tontine (valeurs prédéfinies, défaut: active)
  createdAt: Joi.date().optional(), // Date de création (valeur par défaut: date actuelle)
  updatedAt: Joi.date().optional(), // Date de mise à jour (valeur par défaut: date actuelle)
  tours: Joi.array().items(tourSchema).optional(),
}).strict(); // Empêche l'ajout de champs non définis

const tourOptionsSchema = Joi.object({
  order: Joi.string().valid("admin", "random").required(),
  frequencyType: Joi.string()
    .valid(
      "daily",
      "weekly",
      "monthly",
      "specificDay",
      "lastSunday",
      "biweekly",
      "firstMonday"
    )
    .required(),
  frequencyValue: Joi.number().positive().required(),
  amount: Joi.number().positive().required(),
  membresRestants: Joi.array().items(Joi.string()).optional(),
});

const updateTontineSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().max(255).optional(),
  creatorId: Joi.string().optional(),
  codeInvitation: Joi.string().optional(),
  amount: Joi.number().optional(), // montant économisé par la tontine
  membersId: Joi.array().items(Joi.string()).optional(),
  adminId: Joi.array().items(Joi.string()).optional(),
  inviteId: Joi.array().items(Joi.string()).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(),
  status: Joi.string().valid("active", "terminée", "annulée").optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  tours: Joi.array()
    .items(
      Joi.object({
        tourId: Joi.string().required(),
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(),
        amount: Joi.number().positive().optional(), // Montant de participation (nombre positif requis)
        status: Joi.string()
          .valid("en cours", "terminée", "annulée")
          .optional(),
        participantNotYetReceived: Joi.array().items(Joi.string()).default([]),
        participantReceived: Joi.array().items(Joi.string()).default([]),
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
      const creatorDoc = await db
        .collection(USERS_COLLECTION)
        .doc(tontineData.creatorId)
        .get();
      console.log(creatorDoc);
      if (!creatorDoc.exists) {
        throw new Error("Veuillez vous identifier avant de créer une tontine");
      }

      // Ajout de la tontine à Firestore avec timestamp
      const tontineRef = await db.collection(TONTINE_COLLECTION).add({
        ...value,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      const wallet = new TontineWallet(tontineRef.id, "tontine", null)
      const walletId = await wallet.save()

      /* tRef = db.collection(TONTINE_COLLECTION).doc(tontineRef.id); */
      await tontineRef.update({
        walletId: walletId,
      })
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
   * Récupère une tontine par son code d'invitation.
   * @param {string} codeInvitation - Code d'invitation de la tontine.
   * @returns {Promise<Object>} - Données de la tontine.
   */
  static async getTontineByCode(codeInvitation) {
    try {
      const tontineQuery = await db
        .collection(TONTINE_COLLECTION)
        .where("codeInvitation", "==", codeInvitation)
        .get();

      if (tontineQuery.empty) throw new Error("Tontine introuvable");

      const tontineDoc = tontineQuery.docs[0];
      return { id: tontineDoc.id, ...tontineDoc.data() }; // Retourne les données de la tontine
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la tontine par code d'invitation:",
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
   * @param {string} codeInvitation - Code d'invitation de la tontine.
   * @param {string} userId - ID de l'utilisateur à inviter.
   * @returns {Promise<void>}
   */
  static async inviteMember(codeInvitation, userId) {
    try {
      const tontineData = await this.getTontineByCode(codeInvitation);
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineData.id);

      // on vérifie si le userID correspond à un id présent dans la firestore et valide
      const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
      if (!userDoc.exists) {
        throw new Error(
          "utilisateur introuvable, veuillez entrer un id valide"
        );
      }

      // Ajouter l'utilisateur à la liste des invités
      await tontineRef.update({
        inviteId: FieldValue.arrayUnion(userId),
        updatedAt: FieldValue.serverTimestamp(),
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
   * Faire passer un simple utilisateur au rôle d'admin dans une tontine donnée
   * @param {string} tontineId - ID de la tontine.
   * @param {string} userId - ID de l'utilisateur qui passera admin
   * @returns {Promise<void>}
   */

  static async makeAdmin(tontineId, userId) {
    try {
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineId);
      const tontineDoc = await tontineRef.get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      // on vérifie si le userID correspond à un id présent dans la firestore et valide
      const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
      if (!userDoc.exists) {
        throw new Error(
          "utilisateur introuvable, veuillez entrer un id valide"
        );
      }
      const tontineData = tontineDoc.data();
      if (!tontineData.membersId.includes(userId)) {
        throw new Error("L'utilisateur n'est pas membre de la tontine");
      }

      // Ajouter l'utilisateur à la liste des admins
      await tontineRef.update({
        adminId: FieldValue.arrayUnion(userId),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error(
        "Erreur lors de la nomination de l'administrateur de la tontine:",
        error.message
      );
      throw new Error("Impossible de nommer l'administrateur de la tontine.");
    }
  }

  /**
   * Ajoute un utilisateur à la liste des membres d'une tontine et le retire de la liste des invités.
   * @param {string} codeInvitation - Code d'invitation de la tontine.
   * @param {string} userId - ID de l'utilisateur à ajouter.
   * @returns {Promise<void>}
   */
  static async joinTontine(codeInvitation, userId) {
    try {
      const tontineData = await this.getTontineByCode(codeInvitation);
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineData.id);

      // on vérifie si le userID correspond à un id présent dans la firestore et valide
      const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
      if (!userDoc.exists) {
        throw new Error(
          "utilisateur introuvable, veuillez entrer un id valide"
        );
      }
      if (!tontineData.inviteId.includes(userId)) {
        throw new Error(
          "L'utilisateur n'est pas invité à rejoindre la tontine"
        );
      }

      // Ajouter l'utilisateur à la liste des membres et le retirer de la liste des invités
      await tontineRef.update({
        membersId: FieldValue.arrayUnion(userId),
        inviteId: FieldValue.arrayRemove(userId),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de l'utilisateur à la tontine:",
        error.message
      );
      throw new Error("Impossible d'ajouter l'utilisateur à la tontine.");
    }
  }

  /**
   * Met à jour le statut des tours et des périodes de cotisation.
   * @param {string} tontineId - ID de la tontine.
   * @returns {Promise<void>}
   */
  static async updateTourStatus(tontineId) {
    try {
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineId);
      const tontineDoc = await tontineRef.get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      const tontineData = tontineDoc.data();
      const currentDate = new Date();

      tontineData.tours.forEach((tour) => {
        if (tour.statut === "en cours") {
          const currentPeriode = tour.periodeCotisation.find(
            (periode) => periode.statut === "en cours"
          );
          if (
            currentPeriode &&
            currentDate > new Date(currentPeriode.date_fin)
          ) {
            currentPeriode.statut = "terminé";
            tour.membres_servis.push({
              userId: currentPeriode.beneficiaire,
              date_bouffee: new Date(),
            });
            tour.membres_restants = tour.membres_restants.filter(
              (m) => m.userId !== currentPeriode.beneficiaire
            );

            if (tour.membres_restants.length > 0) {
              const nextBeneficiary = tour.membres_restants[0];
              tour.periodeCotisation.push({
                id: uuid4(),
                beneficiaire: nextBeneficiary.userId,
                date_debut: new Date(),
                date_fin: new Date(
                  new Date().setMonth(new Date().getMonth() + 1)
                ),
                contributions: {},
                statut: "en cours",
              });
            } else {
              tour.statut = "terminé";
            }
          }
        }
      });

      // Mettre à jour les données dans Firestore
      await tontineRef.update({
        tours: tontineData.tours,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut des tours:",
        error.message
      );
      throw new Error("Impossible de mettre à jour le statut des tours.");
    }
  }

  /**
   * Crée un tour pour une tontine et génère automatiquement les périodes de cotisation.
   * @param {string} tontineId - ID de la tontine.
   * @param {Object} options - Options pour la création du tour.
   * @returns {Promise<void>}
   */
  static async createTour(tontineId, options) {
    try {
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineId);
      const tontineDoc = await tontineRef.get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      const tontineData = tontineDoc.data();
      const members = tontineData.membersId;
      const tours = tontineData.tours || [];

      // Générer les périodes de cotisation pour le tour
      let order = members;
      if (options.order === "random") {
        order = members.sort(() => Math.random() - 0.5);
      } else if (options.order === "admin" && options.membresRestants) {
        order = options.membresRestants;
      }

      const startDate = new Date();
      const tour = {
        id: uuid4(),
        statut: "en cours",
        membres_restants: order.map((userId, index) => ({
          userId,
          date_prevue: this.calculateNextDate(
            startDate,
            options.frequencyType,
            options.frequencyValue,
            index
          ),
        })),
        membres_servis: [],
        periodeCotisation: order.map((userId, index) => ({
          id: uuid4(),
          beneficiaire: userId,
          date_debut: this.calculateNextDate(
            startDate,
            options.frequencyType,
            options.frequencyValue,
            index
          ),
          date_fin: this.calculateNextDate(
            startDate,
            options.frequencyType,
            options.frequencyValue,
            index + 1
          ),
          contributions: {},
          statut: index === 0 ? "en cours" : "à venir",
          amount: options.amount,
        })),
      };

      tours.push(tour);

      // Ajouter le tour à la tontine
      await tontineRef.update({
        tours,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error("Erreur lors de la création du tour:", error.message);
      throw new Error("Impossible de créer le tour.");
    }
  }

  /**
   * Calcule la prochaine date en fonction du type et de la valeur de la fréquence.
   * @param {Date} startDate - Date de début.
   * @param {string} frequencyType - Type de fréquence ("daily", "weekly", "monthly", "specificDay", "lastSunday", "biweekly", "firstMonday").
   * @param {number} frequencyValue - Valeur de la fréquence.
   * @param {number} index - Index de la période.
   * @returns {Date} - Prochaine date calculée.
   */
  static calculateNextDate(startDate, frequencyType, frequencyValue, index) {
    const nextDate = new Date(startDate);
    switch (frequencyType) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + frequencyValue * index);
        break;
      case "weekly":
        nextDate.setDate(nextDate.getDate() + (frequencyValue + 7 * index));
        break;
      case "biweekly":
        nextDate.setDate(nextDate.getDate() + 14 * index);
        break;
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + index);
        nextDate.setDate(frequencyValue);
        break;
      case "specificDay":
        nextDate.setMonth(nextDate.getMonth() + index);
        nextDate.setDate(frequencyValue);
        break;
      case "lastSunday":
        nextDate.setMonth(nextDate.getMonth() + index);
        nextDate.setDate(1);
        const lastDay = new Date(
          nextDate.getFullYear(),
          nextDate.getMonth() + 1,
          0
        );
        const lastSunday = lastDay.getDate() - lastDay.getDay();
        nextDate.setDate(lastSunday);
        break;
      case "firstMonday":
        nextDate.setMonth(nextDate.getMonth() + index);
        nextDate.setDate(1);
        while (nextDate.getDay() !== 1) {
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
      default:
        throw new Error("Type de fréquence non valide");
    }
    return nextDate;
  }

  /**
   * Met à jour les dates des périodes de cotisation d'un tour.
   * @param {string} tontineId - ID de la tontine.
   * @param {string} tourId - ID du tour.
   * @param {Array<Object>} updatedPeriods - Liste des périodes de cotisation mises à jour.
   * @returns {Promise<void>}
   */
  static async updateCotisationPeriods(tontineId, tourId, updatedPeriods) {
    try {
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineId);
      const tontineDoc = await tontineRef.get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      const tontineData = tontineDoc.data();
      const tourIndex = tontineData.tours.findIndex(
        (tour) => tour.id === tourId
      );
      if (tourIndex === -1) throw new Error("Tour introuvable");

      // Mettre à jour les périodes de cotisation
      tontineData.tours[tourIndex].periodeCotisation = updatedPeriods;

      // Mettre à jour les données dans Firestore
      await tontineRef.update({
        tours: tontineData.tours,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des périodes de cotisation:",
        error.message
      );
      throw new Error(
        "Impossible de mettre à jour les périodes de cotisation."
      );
    }
  }

  /**
   * Enregistre un paiement pour une période de cotisation.
   * @param {string} tontineId - ID de la tontine.
   * @param {string} tourId - ID du tour.
   * @param {string} periodeId - ID de la période de cotisation.
   * @param {string} userId - ID de l'utilisateur qui effectue le paiement.
   * @param {number} montant - Montant du paiement.
   * @param {string} typeTransaction - Type de transaction (par exemple, "contribution", "retrait").
   * @param {string} methodePaiement - Méthode de paiement utilisée (par exemple, "carte de crédit", "virement bancaire").
   * @param {string} statutTransaction - Statut de la transaction (par exemple, "réussie", "échouée", "en attente").
   * @returns {Promise<void>}
   */
  static async recordPayment(
    tontineId,
    tourId,
    periodeId,
    userId,
    montant,
    typeTransaction,
    methodePaiement,
    statutTransaction
  ) {
    try {
      const tontineRef = db.collection(TONTINE_COLLECTION).doc(tontineId);
      const tontineDoc = await tontineRef.get();
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      const tontineData = tontineDoc.data();
      const tourIndex = tontineData.tours.findIndex(
        (tour) => tour.id === tourId
      );
      if (tourIndex === -1) throw new Error("Tour introuvable");

      const periodeIndex = tontineData.tours[
        tourIndex
      ].periodeCotisation.findIndex((periode) => periode.id === periodeId);
      if (periodeIndex === -1)
        throw new Error("Période de cotisation introuvable");

      // Enregistrer le paiement
      const periode =
        tontineData.tours[tourIndex].periodeCotisation[periodeIndex];
      if (!periode.contributions) periode.contributions = [];

      const transaction = {
        transactionId: uuid4(),
        userId,
        montant,
        date: new Date(),
        typeTransaction,
        methodePaiement,
        statutTransaction,
      };

      periode.contributions.push(transaction);

      // Mettre à jour le montant total de la tontine
      tontineData.amount += montant;

      // Mettre à jour les données dans Firestore
      await tontineRef.update({
        tours: tontineData.tours,
        amount: tontineData.amount,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement du paiement:",
        error.message
      );
      throw new Error("Impossible d'enregistrer le paiement.");
    }
  }

}

module.exports = {
  TontineModel,
  tontineSchema,
  tourOptionsSchema,
  contributionSchema,
  periodeCotisationSchema,
}; // Exportation du modèle pour utilisation externe
