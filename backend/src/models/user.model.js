const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const db = admin.admin.firestore(); // Initialisation de Firestore
const Joi = require("joi"); // Importation de Joi pour la validation des données
const { FieldValue} = require('firebase-admin/firestore');

const USER_COLLECTION = "users"; // Collection Firestore dédiée aux utilisateurs

// Définition du schéma de validation des utilisateurs avec Joi
const userSchema = Joi.object({
    uid: Joi.string().required(),  // Id de l'utilisateur
    fullName: Joi.string().min(3).max(50).required(), // Nom de l'utilisateur (3 à 50 caractères, requis)
    email: Joi.string().email().required(), // Email de l'utilisateur (requis)
    //password: Joi.string().required(),
    amount: Joi.number().positive().optional(), // Solde de l'utilisateur (nombre positif requis)
    profilePicture: Joi.string().base64().optional(), // Image de profile encodée en Base64
    phoneNumber: Joi.string().required(),  // Numero de telephone de l'utilisateur
    inscriptionDate: Joi.date().optional(), // Date d'inscription (valeur par défaut: date actuelle)
    updatedAt: Joi.date().optional(), // Date de mise à jour (valeur par défaut: date actuelle)
}).strict(); // Empêche l'ajout de champs non définis


class UserModel {

    /**
     * Crée un nouvel utilisateur et l'ajoute à Firestore.
     * @param {Object} userData - Données de l'utilisateur à créer.
     * @returns {Promise<string>} - ID de l'utilisateur créé.
     */
    static async createUser(userData) {
        try {
            // Ajout de l'utilisateur à Firestore
            const userRef = await db.collection(USER_COLLECTION).doc(userData.uid).set({
                ...userData,
                fullName: null,
                phoneNumber: null,
                profilePicture: null,
                amount: 0,
                inscriptionDate: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            });

            return userRef.id; // Retourne l'Id de l'utilisateur recupéré
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error.message);
            throw new Error("Impossible de créer l'utilisateur.");
        }
    }
}

module.exports = {UserModel, userSchema};
