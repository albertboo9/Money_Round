const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const {app} = require("../config/firebase"); // Importation du SDK Firebase Client
const db = admin.admin.firestore(); // Initialisation de Firestore
const Joi = require("joi"); // Importation de Joi pour la validation des données
const { FieldValue} = require('firebase-admin/firestore');
//const {getAuth} = require("firebase-admin/auth");
const { getAuth , createUserWithEmailAndPassword} = require('firebase/auth');
const auth = getAuth(app);


const USER_COLLECTION = "users"; // Collection Firestore dédiée aux utilisateurs

// Définition du schéma de validation des utilisateurs avec Joi
const userSchema = Joi.object({
    //uid: Joi.string().required(),  // Id de l'utilisateur
    fullName: Joi.string().min(3).max(50).required(), // Nom de l'utilisateur (3 à 50 caractères, requis)
    email: Joi.string().email().required(), // Email de l'utilisateur (requis)
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
     * @returns {void} - ne retourne rien.
     */
    static async syncUser(userData) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userData.uid);

            const userDoc = await userRef.get();

            // Si l'utilisateur n'existe pas encore dans Firestore on l'ajoute
            if (!userDoc.exists) {
                await userRef.set({
                    uid: userData.uid,
                    email: userData.email,
                    fullName: null,
                    phoneNumber: null,
                    profilePicture: null,
                    amount: 0,
                    inscriptionDate: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                    isActive: true,
                    isBlocked: false,
                });
                console.log("Utilisateur ajouté", userRef.id);

            }/*else {
                // Si l'utilisateur existe déja on met à jour ses informations
                await userRef.update({
                    ...userData,
                    updatedAt: FieldValue.serverTimestamp()
                });
                console.log("Utilisateur mis à jour", userRef.id);
            }*/

            //return userDoc.id;
        } catch (error) {
            console.error("Erreur lors de la synchronisation de l'utilisateur :", error.message);
            throw new Error("Impossible de synchroniser l'utilisateur.");
        }
    }


    /**
     * Inscription de l'utilisateur par email et password
     * @param {Object} registerData - email et password l'utilisateur recupérés dans le body de la requete
     * @returns {Promise<string>} - retourne l'ID de l'utilisateur inscrit.
     */
    static async registerWithEmailPassword(registerData) {
        const { email, password } = registerData;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Utilisateur inscrit avec succès :", user.uid);

            const userRef = db.collection(USER_COLLECTION).doc(user.uid);
            await userRef.set({
                email: user.email,
                fullName: null,
                phoneNumber: null,
                profilePicture: null,
                amount: 0,
                inscriptionDate: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                isActive: true,
                isBlocked: false,
            });
            console.log("Utilisateur ajouté dans Firestore", userRef.id);

            return user.uid; // Retourne l'ID de l'utilisateur inscrit

        }catch(error) {
            console.error("Erreur lors de l'inscription de l'utilisateur:", error.message);
            throw new Error("Impossible d'inscrire l'utilisateur ou email déjà utilisé");
        }
    }

    /**
     * Récupère un utilisateur par son Id
     * @param {string} userId - ID de l'utilisateur à récupérer.
     * @returns {Promise<Object>} - Données de l'utilisateur.
     */
    static async getUserById(userId) {
        try {
            const userDoc = await db
                .collection(USER_COLLECTION)
                .doc(userId)
                .get();
            if (!userDoc.exists) throw new Error("Utilisateur introuvable");

            return {...userDoc.data() }; // Retourne les données de l'utilisateur
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error.message);
            throw new Error("Impossible de récupérer l'utilisateur");
        }
    }


    /**
     * Mets à jour les données de l'utilisateur
     * @param {string} userId - ID de l'utilisateur à récupérer.
     * @returns {Promise<Object>} - Données mises à jour de l'utilisateur.
     */
    static async updateUser(userId, userData) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) throw new Error("Utilisateur introuvable");

            // Mise à jour des données dans Firestore
            await userRef.update({
                ...userData,
                updatedAt: FieldValue.serverTimestamp() // Mise à jour de la date de modification
            });

            // Mise à jour de l'email dans Firebase Authentification
            if (userData.email){
                await admin.admin.auth().updateUser(userId, {
                    email: userData.email,
                    emailVerified: false
                });
                console.log("Mise à jour de l'email dans Firebase Authentification");
            }

            return { id: userDoc.id, ...userData }; // Retourne les données mises à jour de l'utilisateur
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error.message);
            throw new Error("Impossible de mettre à jour les données de l'utilisateur");
        }
    }


    /**
     * Suppression de l'utilisateur
     * @param {string} userId - ID de l'utilisateur à supprimer.
     * @returns {Promise<Object>} - Id de l'utilisateur supprimé.
     */
    static async deleteUser(userId) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) throw new Error("Utilisateur introuvable");

            // Suppression de l'utilisateur dans Firebase Authentification
            await admin.admin.auth().deleteUser(userId);
            console.log(`Utilisateur ${userId} supprmé de Firebase Authentification`);

            // Suppression de l'utilisateur dans Firestore
            await userRef.delete();

            return { id: userDoc.id}; // Retourne l'id de l'utilisateur supprimé
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur:", error.message);
            throw new Error("Impossible de supprimer l'utilisateur");
        }
    }
}

module.exports = {UserModel, userSchema};
