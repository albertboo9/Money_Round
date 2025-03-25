/**
 * @fileoverview Service de gestion des transactions pour MoneyRound.
 */

const { db } = require("../config/firebaseConfig");
const Joi = require("joi");
const admin = require("firebase-admin");

// Schéma de validation pour les transactions
const transactionSchema = Joi.object({
  payerId: Joi.string().required(),
  tontineId: Joi.string().required(),
  tourId: Joi.string().required(),
  periodeId: Joi.string().required(),
  montant: Joi.number().positive().required(),
});

//  Processus sécurisé d'exécution d'une transaction
const processTransaction = async (
  payerId,
  tontineId,
  tourId,
  periodeId,
  montant
) => {
  // Valider les données d'entrée
  const { error } = transactionSchema.validate({
    payerId,
    tontineId,
    tourId,
    periodeId,
    montant,
  });
  if (error) throw new Error(`Validation échouée : ${error.message}`);

  // Références Firestore
  const transactionRef = db.collection("transactions");
  const walletRef = db.collection("wallets").doc(payerId);
  const tontineRef = db.collection("tontines").doc(tontineId);
  const contributionsRef = db.collection("contributions");

  return db.runTransaction(async (t) => {
    try {
      //  Étape 1 : Vérifier l'existence de la tontine, du tour et de la période
      const tontineDoc = await t.get(tontineRef);
      if (!tontineDoc.exists) throw new Error("Tontine introuvable");

      const tontineData = tontineDoc.data();
      const tour = tontineData.tours.find((t) => t.id === tourId);
      if (!tour || tour.statut !== "actif") throw new Error("Tour inactif");

      const periode = tour.periodeCotisations.find((p) => p.id === periodeId);
      if (!periode || periode.statut !== "ouverte")
        throw new Error("Période fermée");

      //  Étape 2 : Vérifier si le paiement existe déjà
      const paiementExistant = periode.contributions.some(
        (c) => c.userId === payerId
      );
      if (paiementExistant)
        throw new Error("Paiement déjà effectué pour cette période");

      //  Étape 3 : Vérifier le solde du portefeuille
      const walletDoc = await t.get(walletRef);
      if (!walletDoc.exists) throw new Error("Portefeuille introuvable");

      const walletData = walletDoc.data();
      if (walletData.balance < montant) throw new Error("Fonds insuffisants");

      //  Étape 4 : Créer l'entrée de contribution
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

      //  Étape 5 : Créer l'entrée de transaction
      const transactionId = transactionRef.doc().id;
      const newTransaction = {
        id: transactionId,
        contributionId,
        payerId,
        montant,
        statut: "terminé",
        date: new Date(),
      };

      //  Étape 6 : Débiter le portefeuille du payeur
      t.update(walletRef, {
        balance: walletData.balance - montant,
        transactions: admin.firestore.FieldValue.arrayUnion(transactionId),
        updatedAt: new Date(),
      });

      //  Étape 7 : Mettre à jour la tontine avec la nouvelle contribution
      t.update(tontineRef, {
        tours: tontineData.tours.map((t) => {
          if (t.id === tourId) {
            return {
              ...t,
              periodeCotisations: t.periodeCotisations.map((p) => {
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

      //  Étape 8 : Enregistrer les nouvelles entrées
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
