const Joi = require("joi")

const transactionSchema = Joi.object({
    id: Joi.string().required(), // ID unique de la transaction
    senderWalletId: Joi.string().required(), // Wallet de l'expéditeur
    receiverWalletId: Joi.string().required(), // Wallet du destinataire
    amount: Joi.number().positive().required(), // Montant transféré
    status: Joi.string().valid("pending", "completed", "failed").default("pending"), // Statut de la transaction
    type: Joi.string().valid("contribution", "withdrawal", "deposit").required(), // Type de transaction
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date())
  });