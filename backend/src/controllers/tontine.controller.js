/**
 * @fileoverview controllers pour la gestion des tontines de MoneyRound
 */
const NotificationService = require("../services/notification.service");

const { TontineModel, tontineSchema } = require("../models/tontine.model");
const { v4: uuid4 } = require("uuid");
const Joi = require("joi");

// schema de validation des données provenant de la requête
const createTontineSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().max(255).optional(),
  amount: Joi.number().positive().required(),
  userId: Joi.string().required(),
  frequency: Joi.string()
    .valid("quotidien", "hebdomadaire", "mensuel", "annuel")
    .required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(),
});

exports.createTontine = async (req, res) => {
  try {
    // validation des données de la requête
    const { error } = createTontineSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: `Données invalide : ${error.details[0].message}` });
    }

    // Vérification de l'utilisateur
    // if (!req.user || !req.user.userId) {
    //  return res.status(401).json({ error: "Utilisateur non authentifié" });
    //  }

    let date = new Date(); // date actuelle
    let date1 = new Date();
    date1 = req.body.startDate; // date actuelle
    console.log(date1);
    let date2 = new Date(); // date actuelle
    const code = uuid4(); // code d'invitation unique

    console.log(req.body.startDate);
    console.log(date);
    // données de la tontine
    const tontineData = {
      name: req.body.name,
      description: req.body.description,
      creatorId: req.body.userId,
      codeInvitation: code,
      membersId: [req.body.userId],
      adminId: [req.body.userId],
      inviteId: [],
      amount: req.body.amount,
      frequency: req.body.frequency,
      startDate: new Date(req.body.startDate), // Conversion en objet Date
      endDate: req.body.endDate ? new Date(req.body.endDate) : null, // Conversion en objet Date si endDate est fourni
      status: "active",
    };

    // validation des données de créationd de la tontine
    const { err } = tontineSchema.validate(tontineData);

    if (err) {
      return res
        .status(400)
        .json({ error: err.message, message: "tontineShema invalide" });
    }

    //création de la tontine
    await TontineModel.createTontine(tontineData);

    await NotificationService.sendNotification(
      //userid ....
      //firebase token
      "Nouvelle Tontine Créée",
      `Votre tontine "${tontineData.name}" a été créée avec succès.`
    );

    res
      .status(201)
      .json({ message: "Tontine créée avec succès", codeInvitation: code });
  } catch (err) {
    res.status(500).json({
      error: ` échec de la création de la tontine ${err.message}`,
    });
  }
};
exports.updateTontine = async (req, res) => {};
exports.deleteTontine = async (req, res) => {};
exports.getTontineById = async (req, res) => {};
exports.makeAdmin = async (req, res) => {};
exports.joinTontine = async (req, res) => {};
exports.inviteMember = async (req, res) => {};
