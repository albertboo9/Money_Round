const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const db = admin.admin.firestore(); // Initialisation de Firestore
const Joi = require("joi"); // Importation de Joi pour la validation des données
const { FieldValue} = require('firebase-admin/firestore');
const functions = require('firebase-functions');
const {createUser} = require("../controllers/user.controller");

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

    static async syncNewUserToFirestore(user) {
        try {
            const { uid, email } = user;
            const userData = {
                uid: uid,
                email: email,
                fullName: null,
                phoneNumber: null,
                profilePicture: null,
                amount: 0,
                inscriptionDate: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            };

            const userRef = await db.collection("users").doc(uid).set(userData);

            console.log(`Utilisateur ${userRef.id} crée avec succès !`)
        }catch(err) {
            console.error("Erreur lors de la synchronisation de l'utilisateur avec Firestore:", err.message);
            throw new Error("Impossible de synchroniser l'utilisateur");
        }
    }

    /**
     * Crée un nouvel utilisateur et l'ajoute à Firestore.
     * @param {Object} userData - Données de l'utilisateur à créer.
     * @returns {Promise<string>} - ID de l'utilisateur créé.
     */
    static async createUser(userData) {
        try {
            // Validation des données avec Joi
            const { error, value } = userSchema.validate(userData);
            if (error) throw new Error(`Validation échouée: ${error.message}`);

            // Ajout de l'utilisateur à Firestore
            const userRef = await db.collection(USER_COLLECTION).add({
                ...value,
                amount: 0,
                inscriptionDate: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });

            return userRef.id; // Retourne l'Id de l'utilisateur créé
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error.message);
            throw new Error("Impossible de créer l'utilisateur.");
        }
    }
}

module.exports = {UserModel, userSchema};

// Appel de la fonction de synchronisation de l'utilisateur Firebase Authentification avec Firestore
exports.createUser = functions.auth.user().onCreate((user) => {
    return UserModel.syncNewUserToFirestore(user);
});