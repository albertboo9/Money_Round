const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const db = admin.admin.firestore(); // Initialisation de Firestore
const Joi = require("joi"); // Importation de Joi pour la validation des données
const { FieldValue} = require('firebase-admin/firestore');

const USER_COLLECTION = "users"; // Collection Firestore dédiée aux utilisateurs

// Définition du schéma de validation des utilisateurs avec Joi
const userSchema = Joi.object({
    //uid: Joi.string().required(),  // Id de l'utilisateur
    fullName: Joi.string().min(3).max(50).required(), // Nom de l'utilisateur (3 à 50 caractères, requis)
    email: Joi.string().email().required(), // Email de l'utilisateur (requis)
    //password: Joi.string().required(),
    amount: Joi.number().positive().optional(), // Solde de l'utilisateur (nombre positif requis)
    profilePicture: Joi.string().base64().optional(), // Image de profile encodée en Base64
    phoneNumber: Joi.string().required(),  // Numero de telephone de l'utilisateur
    inscriptionDate: Joi.date().optional(), // Date d'inscription (valeur par défaut: date actuelle)
    updatedAt: Joi.date().optional(), // Date de mise à jour (valeur par défaut: date actuelle)
    isActive: Joi.boolean().optional(),
    isBlocked: Joi.boolean().optional(),
}).strict(); // Empêche l'ajout de champs non définis


class UserModel {

    /**
     * Synchronise les données de l'utilisateur Firebase Authentification avec celles de Firestore.
     * @param {Object} userData - Données de l'utilisateur recupérées dans le JWT de la requete.
     * @returns {Promise<string>} - ID de l'utilisateur.
     */
    static async syncUser(userData) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userData.uid);

            const userDoc = await userRef.get();

            // Si l'utilisateur n'existe pas encore dans Firestore on l'ajoute
            if (!userDoc.exists) {
                await userRef.set({
                    ...userData,
                    profilePicture: null,
                    amount: 0,
                    inscriptionDate: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                    isActive: true,
                    isBlocked: false,
                });
                console.log("Utilisateur ajouté", userRef.id);

            }else {
                // Si l'utilisateur existe déja on met à jour ses informations
                await userRef.update({
                    ...userData,
                    updatedAt: FieldValue.serverTimestamp()
                });
                console.log("Utilisateur mis à jour", userRef.id);
            }

            return userRef.id;
        } catch (error) {
            console.error("Erreur lors de la synchronisation de l'utilisateur :", error.message);
            throw new Error("Impossible de synchroniser l'utilisateur.");
        }
    }
}

module.exports = {UserModel, userSchema};
