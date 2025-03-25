/**
 * @fileoverview Service de gestion des transactions pour MoneyRound.
 */

const admin = require("../config/firebase"); // Importation du SDK Firebase Admin
const db = admin.admin.firestore(); // Initialisation de Firestore
const Joi = require("joi"); // Importation de Joi pour la validation des données
const { FieldValue } = require("firebase-admin/firestore");

// Schéma de validation pour les transactions
const transactionSchema = Joi.object({
  payerId: Joi.string().required(),
  tontineId: Joi.string().required(),
  tourId: Joi.string().required(),
  periodeId: Joi.string().required(),
  montant: Joi.number().positive().required(),
  userWalletId: Joi.string().required(),
});

// Processus sécurisé d'exécution d'une transaction
const processTransaction = async (
  payerId,
  tontineId,
  tourId,
  periodeId,
  montant,
  userWalletId
) => {
  // Valider les données d'entrée
  const { error } = transactionSchema.validate({
    payerId,
    tontineId,
    tourId,
    periodeId,
    montant,
    userWalletId
  });
  if (error) throw new Error(`Validation échouée : ${error.message}`);

  // Références Firestore
  const transactionRef = db.collection("transactions");
  const walletRef = db.collection("wallets").doc(userWalletId);
  const tontineRef = db.collection("tontines").doc(tontineId);
  const contributionsRef = db.collection("contributions");

  return db.runTransaction(async (t) => {
    try {
      // Étape 1 : Vérifier l'existence de la tontine, du tour et de la période
      const tontineDoc = await t.get(tontineRef);
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      const tontineData = tontineDoc.data();
      const tour = tontineData.tours.find((t) => t.id === tourId);
      if (!tour || tour.statut !== "en cours") throw new Error("Tour inactif");

      const periode = tour.periodeCotisation.find((p) => p.id === periodeId);
      if (!periode || periode.statut !== "en cours")
        throw new Error("Période fermée");

      // Étape 2 : Vérifier si l'utilisateur appartient à la tontine
      /* const isUserMember = tontineData.membersId.some((membre) => membre.id === payerId);
      if (!isUserMember) throw new Error("Utilisateur non membre de la tontine"); */

      // Étape 3 : Vérifier si le paiement existe déjà pour cette période
      const paiementExistant = periode.contributions.some(
        (c) => c.userId === payerId
      );
      if (paiementExistant)
        throw new Error("Paiement déjà effectué pour cette période");

      // Étape 4 : Vérifier le solde du portefeuille de l'utilisateur
      const walletDoc = await t.get(walletRef);
      if (!walletDoc.exists) throw new Error("Portefeuille utilisateur introuvable");

      const walletData = walletDoc.data();
      if (walletData.balance < montant) throw new Error("Fonds insuffisants");

      // Étape 5 : Vérifier si la tontine a un wallet
      const tontineWalletId = tontineData.walletId;
      const tontineWalletRef = db.collection("wallets").doc(tontineWalletId);
      const tontineWalletDoc = await t.get(tontineWalletRef);
      if (!tontineWalletDoc.exists) throw new Error("Portefeuille de la tontine introuvable");

      const tontineWalletData = tontineWalletDoc.data();

      // Étape 6 : Créer l'entrée de contribution
      const contributionId = contributionsRef.doc().id;
      const newContribution = {
        id: contributionId,
        userId: payerId,
        tontineId,
        tourId,
        periodeId,
        montant,
        date: new Date(),
        statut: "validé",
      };

      // Étape 7 : Créer l'entrée de transaction
      const transactionId = transactionRef.doc().id;
      const newTransaction = {
        id: transactionId,
        contributionId,
        payerId,
        montant,
        statut: "terminé",
        date: new Date(),
      };

      // Étape 8 : Débiter le portefeuille de l'utilisateur
      t.update(walletRef, {
        balance: walletData.balance - montant,
        transactions: FieldValue.arrayUnion(transactionId),
        updatedAt: new Date(),
      });

      // Étape 9 : Créditer le portefeuille de la tontine
      t.update(tontineWalletRef, {
        balance: tontineWalletData.balance + montant,
        transactions: FieldValue.arrayUnion(transactionId),
        updatedAt: new Date(),
      });

      // Étape 10 : Mettre à jour la tontine avec la nouvelle contribution
      t.update(tontineRef, {
        tours: tontineData.tours.map((t) => {
          if (t.id === tourId) {
            return {
              ...t,
              periodeCotisation: t.periodeCotisation.map((p) => {
                if (p.id === periodeId) {
                  return {
                    ...p,
                    contributions: [
                      ...p.contributions,
                      { userId: payerId, contributionId },
                    ],
                  };
                }
                return p;
              }),
            };
          }
          return t;
        }),
        updatedAt: new Date(),
      });

      // Étape 11 : Enregistrer les nouvelles entrées
      t.set(contributionsRef.doc(contributionId), newContribution);
      t.set(transactionRef.doc(transactionId), newTransaction);

      return { success: true, message: "Transaction réussie" };
    } catch (error) {
      console.error(
        "Erreur lors de l'exécution de la transaction :",
        error.message
      );
      throw new Error("Échec de la transaction.");
    }
  });
};

module.exports = { processTransaction };
