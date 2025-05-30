const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const db = admin.admin.firestore(); // Initialisation de Firestore


const USER_COLLECTION = "users"; // Collection Firestore dédiée aux utilisateurs
const EVALUATIONS_COLLECTION = "evaluations"; // Collection Firestore dédiée aux evaluations


class TrustSystemModel {

    /**
     * Recuperation des evaluations reçues par un utilisateur
     * @param {string} userId - l'id de l'utilisateur
     * @returns {Promise<Object>} - retourne les evaluations reçues de l'utilisateur
     */
    static async getEvaluationsByUserId(userId) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) throw new Error("Utilisateur introuvable");

            const evaluationsSnapshot = await db.collection(EVALUATIONS_COLLECTION)
                .where('evaluatedMemberId', '==', userId)
                .get();

            const evaluations = [];
            if (evaluationsSnapshot) {
                evaluationsSnapshot.docs.map((doc) => {
                    evaluations.push({ id: doc.id, ...doc.data()});
                });
            }

            return evaluations;

        }catch (error) {
            console.error("Impossible de recuperer les evaluations reçues de l'utilisateur:", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Fonction de mise à jour du score et de la réputation de l'utilisateur
     * @param {string} userId - l'id de l'utilisateur
     * @param {number} newScore - la nouvelle note
     * @param {string} newReputation - la nouvelle réputation
     * @returns {Promise<void>} - ne retourne rien
     */
    static async updateUserScore(userId, newScore, newReputation) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) throw new Error("Utilisateur introuvable");

            // Mise à jour du score et de la réputation dans Firestore
            await userRef.update({
                reputation: newReputation,
                score: newScore,
                updatedAt: new Date()
            });
            console.log("Score et réputation mis à jour avec succès", newScore, newReputation);

        }catch (error) {
            console.error("Impossible de mettre à jour le score et la réputation de l'utilisateur: ", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Noter un membre dans une tontine
     * @param {string} memberId - l'id du membre qui donne la note
     * @param {number} note - la note donnée
     * @param {string} comment - le commentaire
     * @param {string} userId - l'id de l'utilisateur qui reçoit la note
     * @returns {Promise<Object>} - retourne l'id de l'utilisateur et la note reçue
     */
    static async noteMember(memberId, note, comment, userId) {
        try {
            const memberRef = db.collection(USER_COLLECTION).doc(memberId);
            const memberDoc = await memberRef.get();
            if (!memberDoc.exists) throw new Error("Le membre qui doit recevoir la note est introuvable");

            const userRef = db.collection(USER_COLLECTION).doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) throw new Error("L'utilisateur qui essaie d'envoyer la note est introuvable");

            // Ajout de la note dans Firestore
            const evaluationRef = await db.collection(EVALUATIONS_COLLECTION).add({
                userId: userId,
                evaluatedMemberId: memberId,
                note: note,
                comment: comment || "",
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log("Note envoyée: ", {userId: userId, evaluatedMemberId: memberId, note: note, comment: comment});

            return {userId: userId, evaluatedMemberId: memberId, note: note, comment: comment};

        }catch(error) {
            console.error("Impossible de noter le membre:", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Augmanter les points d'experience de l'utilisateur
     * @param {string} userId - l'id de l'utilisateur
     * @param {number} xp - le nombre de xp à ajouter
     * @returns {Promise<void>} - ne retourne rien
     */
    static async increaseUserXP(userId, xp) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) throw new Error("Utilisateur introuvable");
            const currentXP = userDoc.data().xp;

            // Mise à jour du score et de la réputation dans Firestore
            await userRef.update({
                xp: currentXP + xp,
                updatedAt: new Date()
            });
            console.log(`${userId} a gagné ${xp} xp`);

        }catch (error) {
            console.error("Impossible d'augmenter les points d'experience de l'utilisateur: ", error.message);
            throw new Error(error.message);
        }
    }


    /**
     * Mise à jour des badges de l'utilisateur
     * @param {string} userId - l'id de l'utilisateur
     * @param {string} badge - le badge à ajouter
     * @returns {Promise<void>} - ne retourne rien
     */
    static async updateUserBadges(userId, badge) {
        try {
            const userRef = db.collection(USER_COLLECTION).doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) throw new Error("Utilisateur introuvable");
            const userBadges = userDoc.data().badges;

            // Mise à jour des badges
            if (!userBadges.includes(badge)) {
                userBadges.push(badge);
                await userRef.update({
                    badges: userBadges,
                    updatedAt: new Date()
                });
                console.log(`${userId} a obtenu le badge ${badge}`);
            }

        }catch (error) {
            console.error("Impossible de mettre à jour les badges de l'utilisateur: ", error.message);
            throw new Error(error.message);
        }
    }

}


module.exports = {TrustSystemModel};