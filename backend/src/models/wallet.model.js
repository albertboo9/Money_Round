/**
 * @fileoverview Modèle de données pour les portefeuilles utilisant Firestore et Joi pour la validation.
 */

const { db } = require("../config/firebase"); // Importation de Firestore
const { v4: uuidv4 } = require("uuid"); // Importation de uuid pour générer des identifiants uniques
const bcrypt = require("bcrypt"); // Importation de bcrypt pour le hachage des mots de passe
const Joi = require("joi"); // Importation de Joi pour la validation des données

// Schéma de validation pour les transactions
const transactionSchema = Joi.object({
  type: Joi.string()
    .valid(
      "deposit",
      "withdraw",
      "contribution",
      "received_contribution",
      "pay_winner",
      "received_tontine_funds",
      "unlocked_wallet"
    )
    .required(),
  amount: Joi.number().positive().required(),
  date: Joi.date().iso().required(),
  tontineId: Joi.string().optional(),
  userId: Joi.string().optional(),
});

// models/wallet.js
const walletSchema = Joi.object({
  ownerId: Joi.string().required(), // ID du propriétaire (utilisateur ou tontine)
  type: Joi.string().valid("user", "tontine").required(), // Type de wallet
  balance: Joi.number().min(0).default(0), // Solde du wallet
  contributions: Joi.array().items(Joi.string()).default([]), // IDs des contributions
  transactionHistory: Joi.array().items(Joi.string()).default([]), // Historique des transactions
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
});

class BaseWallet {
  constructor(ownerId, type, password) {
    this.ownerId = ownerId; // Identifiant du propriétaire du portefeuille
    this.type = type; // Type de portefeuille ("user", "tontine", "locked")
    this.balance = 0; // Solde initial du portefeuille
    this.transactionHistory = []; // Liste des transactions du portefeuille
    this.createdAt = new Date(); // Date de création du portefeuille
    this.updatedAt = new Date(); // Date de dernière mise à jour du portefeuille
  }

  // Vérifie si le mot de passe fourni correspond au mot de passe haché
  verifyPassword(password) {
    if (!this.passwordHash) throw new Error("Ce wallet n'a pas de mot de passe.");
    return bcrypt.compareSync(password, this.passwordHash);
  }

  // Vérifie si le mot de passe fourni correspond au mot de passe haché
  verifyPassword(password) {
    if (!this.passwordHash) throw new Error("Ce wallet n'a pas de mot de passe.");
    return bcrypt.compareSync(password, this.passwordHash);
  }

  // Sauvegarde le portefeuille dans Firestore
  async save() {
    const { error } = walletSchema.validate(this);
    if (error) throw new Error(`Validation échouée: ${error.message}`);

    const walletRef = db.collection("wallets").doc(); // Crée un nouveau document avec un ID généré automatiquement
    await walletRef.set(JSON.parse(JSON.stringify(this))); // Sauvegarde les données dans Firestore
    this.walletId = walletRef.id; // Associe l'ID généré par Firestore au wallet
    return this.walletId; // Retourne l'ID du wallet
  }

  // Trouve un portefeuille par son identifiant
  static async findById(walletId) {
    const walletRef = await db.collection("wallets").doc(walletId).get();
    if (!walletRef.exists) return null;
    return Object.assign(new BaseWallet(), walletRef.data());
  }

  // Crée un wallet pour un utilisateur ou une tontine
  static async createWallet(ownerId, type, password = null) {
    const wallet = new BaseWallet(ownerId, type, password);
    const walletId = await wallet.save();
    return walletId; // Retourne l'ID du wallet
  }
}

class UserWallet extends BaseWallet {
  constructor(ownerId, password) {
    super(ownerId, "user", password);
  }

  // Dépose un montant dans le portefeuille
  async deposit(amount, password) {
    if (!this.verifyPassword(password))
      throw new Error("Mot de passe incorrect.");
    if (amount <= 0) throw new Error("Montant invalide.");

    this.balance += amount;
    this.transactions.push({ type: "deposit", amount, date: new Date() });
    this.updatedAt = new Date();
    await this.save();
  }

  // Retire un montant du portefeuille
  async withdraw(amount, password) {
    if (!this.verifyPassword(password))
      throw new Error("Mot de passe incorrect.");
    if (amount <= 0 || amount > this.balance)
      throw new Error("Fonds insuffisants.");

    this.balance -= amount;
    this.transactions.push({ type: "withdraw", amount, date: new Date() });
    this.updatedAt = new Date();
    await this.save();
  }

  // Paye une contribution à une tontine
  async payContribution(tontineWallet, amount, password) {
    if (!this.verifyPassword(password))
      throw new Error("Mot de passe incorrect.");
    if (amount <= 0 || amount > this.balance)
      throw new Error("Fonds insuffisants.");
    if (!(tontineWallet instanceof TontineWallet))
      throw new Error("Cible invalide.");

    this.balance -= amount;
    tontineWallet.balance += amount;

    this.transactions.push({
      type: "contribution",
      amount,
      tontineId: tontineWallet.ownerId,
      date: new Date(),
    });
    tontineWallet.transactions.push({
      type: "received_contribution",
      amount,
      userId: this.ownerId,
      date: new Date(),
    });

    this.updatedAt = new Date();
    tontineWallet.updatedAt = new Date();
    await this.save();
    await tontineWallet.save();
  }
}

class TontineWallet extends BaseWallet {
  constructor(ownerId, password) {
    super(ownerId, "tontine", password);
  }

  // Paye un gagnant de la tontine
  async payWinner(userWallet, amount, password) {
    if (!this.verifyPassword(password))
      throw new Error("Mot de passe incorrect.");
    if (amount <= 0 || amount > this.balance)
      throw new Error("Fonds insuffisants.");
    if (!(userWallet instanceof UserWallet))
      throw new Error("Le bénéficiaire doit être un utilisateur.");

    this.balance -= amount;
    userWallet.balance += amount;

    this.transactions.push({
      type: "pay_winner",
      amount,
      userId: userWallet.ownerId,
      date: new Date(),
    });
    userWallet.transactions.push({
      type: "received_tontine_funds",
      amount,
      tontineId: this.ownerId,
      date: new Date(),
    });

    this.updatedAt = new Date();
    userWallet.updatedAt = new Date();
    await this.save();
    await userWallet.save();
  }
}

class LockedWallet extends BaseWallet {
  constructor(ownerId, password) {
    super(ownerId, "locked", password);
  }

  // Déverrouille le portefeuille
  async unlockWallet(password) {
    if (!this.verifyPassword(password))
      throw new Error("Mot de passe incorrect.");
    this.type = "user";

    this.transactions.push({ type: "unlocked_wallet", date: new Date() });
    this.updatedAt = new Date();
    await this.save();
  }
}

module.exports = {
  BaseWallet,
  UserWallet,
  TontineWallet,
  LockedWallet,
};
