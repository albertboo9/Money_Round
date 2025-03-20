const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const db = admin.admin.firestore(); // Initialisation de Firestore
const Joi = require("joi"); // Importation de Joi pour la validation des données
const { FieldValue} = require('firebase-admin/firestore');
//const {getAuth} = require("firebase-admin/auth");
const { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification} = require('firebase/auth');
const auth = getAuth();


const USER_COLLECTION = "users"; // Collection Firestore dédiée aux utilisateurs
const TONTINE_COLLECTION = "tontines"; // Collection Firestore dédiée aux tontines
const NOTIFICATION_COLLECTION = "notifications"; // Collection Firestore dédiée aux notifications

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
    /*tontines: Joi.array().items(
        Joi.object({
            tontineId: Joi.string().required(),
            status: Joi.string()              // Le statut de la tontine ('Exclus' pour le cas où l'utilisateur a été expulsé de la tontine)
                .valid("En Cours", "Reussie", "Exclus").required()
        })
    ).optional(),*/
    score: Joi.number().min(1).max(5).required(),     // Représente la moyenne des évaluations reçues des autres membres
    evaluations: Joi.object({
        evaluation: Joi.array().items(
            Joi.object({
                memberId: Joi.string().required(),
                note: Joi.number().min(1).max(5).required(), // Note entre 1 et 5 (requis)
                comment: Joi.string().optional(),    // Commentaire (optionel)
                date: Joi.date().required()
            })
        ),
        average: Joi.number().min(1).max(5).required()
    }).optional(),
    reputation: Joi.string()
        .valid("Membre Neutre", "Membre Risqué", "Membre Fiable", "Membre Premium").required(),     // Représente la réputation de l'utilisateur
    xp: Joi.number().integer(),   // Les points d'experience de l'utilisateur
    badges: Joi.array().items(Joi.string()
        .valid("Membre d’Or", "Super Parrain", "Élite de MoneyRound")).default([]),  // les badges de l'utilisateur
    isActive: Joi.boolean().optional(),
    isBlocked: Joi.boolean().optional(),
}).strict();   // Empêche l'ajout de champs non définis



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

    static async sendVerificationEmail(uid) {
        try {
            const user = await admin.admin.auth().getUser(uid);
            const email = user.email;

            const actionCodeSettings = {
                url: `https://moneyround-aa7a9.firebaseapp.com/verify-email?uid=${uid}`,
                handleCodeInApp: false, // True si vérification depuis une app mobile
            };

            const link = await admin.admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

            // Envoyer l'email via un service (ex: Nodemailer, SendGrid...)
            console.log(`Lien de vérification envoyé : ${link}`);

            return { message: "E-mail de vérification envoyé", link };
        } catch (error) {
            console.error("Erreur lors de l'envoi du lien de vérification:", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Inscription de l'utilisateur par email et password
     * @param {Object} registerData - email et password l'utilisateur recupérés dans le body de la requete
     * @returns {Promise<string>} - retourne l'ID de l'utilisateur inscrit.
     */
    static async registerWithEmailPassword(registerData) {
        const { fullName, phoneNumber, email, password } = registerData;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Utilisateur inscrit avec succès :", user.uid);

            const userRef = db.collection(USER_COLLECTION).doc(user.uid);
            await userRef.set({
                email: user.email,
                fullName: fullName,
                phoneNumber: phoneNumber,
                profilePicture: null,
                amount: 0,
                inscriptionDate: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                score: 3,
                evaluations: {
                    evaluation: [],
                    average: 3
                },
                reputation: "Membre Neutre",
                xp: 0,
                badges: [],
                isActive: true,
                isBlocked: false,
            });
            console.log("Utilisateur ajouté dans Firestore", userRef.id);

            // Configure ActionCodeSettings for email verification
            const actionCodeSettings = {
                url: 'https://moneyround-aa7a9.firebaseapp.com', // URL de redirection de l'utilisateur apres la vérification
                handleCodeInApp: false
            };

            // Envoie de l'email de vérification
            await sendEmailVerification(user, actionCodeSettings);
            console.log("Email de vérification envoyé à l'utilisateur");

            return user.uid; // Retourne l'ID de l'utilisateur inscrit

        }catch(error) {
            console.error("Erreur lors de l'inscription de l'utilisateur:", error.message);
            throw new Error("Impossible d'inscrire l'utilisateur ou email déjà utilisé");
        }
    }


    /**
     * Connexion de l'utilisateur par email et password
     * @param {Object} loginData - email et password l'utilisateur recupérés dans le body de la requete
     * @returns {Promise<string>} - retourne le token d'authentification de l'utilisateur inscrit.
     */
    static async signInWithEmailAndPassword(loginData) {
        const { email, password } = loginData;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            console.log("Utilisateur connecté avec succès :", idToken);


            return idToken; // Retourne le token de l'utilisateur connecté

        }catch(error) {
            console.error("Email ou Mot de passe incorrect:", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Déconnexion de l'utilisateur
     * @param {void} -
     * @returns {Promise<void>} -  ne retourne rien
     */
    static async signOut() {
        signOut(auth).then(() => {
            console.log("Utilisateur déconnecté.");
        })
            .catch((err) => {
                console.error(err.message);
            });
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
     * @param {Object} userData - Les nouvelles données de l'utilisateur
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
     * @returns {Promise<string>} - Id de l'utilisateur supprimé.
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
            console.log(`Utilisateur ${userId} supprmé de Firestore`);

            return userDoc.id; // Retourne l'id de l'utilisateur supprimé
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur:", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Récupération de toutes les tontines d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} - Un objet contenant les données des tontines de l'utilisateur
     */
    static async getTontinesByUserId(userId) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) throw new Error("Utilisateur introuvable");

            const querySnapshot = await db.collection(TONTINE_COLLECTION).where('membersId', 'array-contains', userId).get();
            const tontines = [];
            if (querySnapshot) {
                querySnapshot.forEach(doc => {
                    tontines.push({ id: doc.id, ...doc.data() });
                });
            }

            return tontines; // Retourne les tontines de l'utilisateur
        } catch (error) {
            console.error("Erreur lors de la récuperation des tontines de l'utilisateur:", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Récupération de toutes les notifications d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} - Un objet contenant les notifications de l'utilisateur
     */
    static async getNotificationsByUserId(userId) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) throw new Error("Utilisateur introuvable");

            const querySnapshot = await db.collection(NOTIFICATION_COLLECTION).where('usersId', 'array-contains', userId).get();
            const notifications = [];
            if (querySnapshot) {
                querySnapshot.forEach(doc => {
                    notifications.push({ id: doc.id, ...doc.data() });
                });
            }

            return notifications; // Retourne les notifications de l'utilisateur
        } catch (error) {
            console.error("Erreur lors de la récuperation des notifications de l'utilisateur:", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Reinitialisation du mot de passe d'un utilisateur
     * @param {string} email - l'email de l'utilisateur
     * @returns {Promise<void>} - Ne retourne rien
     */
    static async resetPassword(email) {
        try {
            const auth = admin.admin.auth();
            // Send password reset email
            await auth.generatePasswordResetLink(email, {
                url: 'https://moneyround-aa7a9.firebaseapp.com', // URL de redirection
            });
            console.log('Email de réinitialisation envoyé');

        }catch(error) {
            console.error("Erreur lors de la réinitialisation du mot passe de l'utilisateur:", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Mise à jour du mot de passe d'un utilisateur
     * @param {string} oobCode - le code oob qui se trouve dans l'url de réinitialisation du mot de passe
     * @param {string} newPassword - le nouveau mot de passe de l'utilisateur
     * @returns {Promise<string>} - retourne l'id de l'utilisateur
     */
    static async updatePassword(oobCode, newPassword) {
        try {
            const auth = admin.admin.auth();
            const user = await auth.confirmPasswordReset(oobCode, newPassword);
            console.log('Mot de passe mis à jour', user.uid);
            return user.uid;

        }catch(error) {
            console.error("Erreur lors de la mise à jour du mot passe de l'utilisateur:", error.message);
            throw new Error(error.message);
        }
    }


}

module.exports = {UserModel, userSchema};
