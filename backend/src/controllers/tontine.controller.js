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

const updateTontineSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().max(255).optional(),
  amount: Joi.number().positive().optional(),
  frequency: Joi.string()
    .valid("quotidien", "hebdomadaire", "mensuel", "annuel")
    .optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(),
  status: Joi.string().valid("active", "terminée", "annulée").optional(),
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
    //app notification
    await NotificationService.sendNotification(
      "notif_" + uuid4(),
      //userid ....
      "creation Tontine",
      //firebase token
      "Nouvelle Tontine Créée",
      `Votre tontine "${tontineData.name}" a été créée avec succès.`
    );
    //email notification
   await NotificationService.sendEmailnotification(
      "feukengbrunel555@gmail.com",
      "Bienvenue à MoneyRound",
      "tontine creer avec succee"
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

exports.updateTontine = async (req, res) => {
  try {
    // Validation des données de la requête
    const { error } = updateTontineSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: `Données invalides : ${error.details[0].message}` });
    }

    const tontineId = req.params.tontineId;
    console.log("l'Id de la tontine est " + tontineId);

    // Vérification de l'existence de la tontine
    const tontineDoc = await TontineModel.getTontineById(tontineId);
    if (!tontineDoc) {
      return res.status(404).json({ error: "Tontine introuvable" });
    }

    // Préparation des données à mettre à jour
    const tontineData = {
      ...req.body,
      updatedAt: new Date(), // Mise à jour de la date
    };

    // Mise à jour de la tontine
    const updatedTontine = await TontineModel.updateTontine(
      tontineId,
      tontineData
    );

    //email d'update
    await NotificationService.sendEmailnotification(
      "feukengbrunel555@gmail.com",
      "MoneyRound tontine update",
      `parametre de la tontine "${tontineData.name}" modifier avec succees`
    );
    res
      .status(200)
      .json({
        message: "Tontine mise à jour avec succès",
        tontine: updatedTontine,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        error: `Échec de la mise à jour de la tontine : ${err.message}`,
      });
  }
};

exports.deleteTontine = async (req, res) => {
  try {
    const tontineId = req.params.tontineId;
    console.log("L'ID de la tontine à supprimer est " + tontineId);

    // Vérification de l'existence de la tontine
    const tontineDoc = await TontineModel.getTontineById(tontineId);
    if (!tontineDoc) {
      return res.status(404).json({ error: "Tontine introuvable" });
    }

    // Suppression de la tontine
    await TontineModel.deleteTontine(tontineId);
    //suppresion de la tontine

    await NotificationService.sendEmailnotification(
      "feukengbrunel555@gmail.com",
      "MoneyRound tontine delete",
      ` la tontine "${tontineData.name}" a ete supprimer avec succe`
    );
    res.status(200).json({ message: "Tontine supprimée avec succès" });
  } catch (err) {
    res
      .status(500)
      .json({
        error: `Échec de la suppression de la tontine : ${err.message}`,
      });
  }
};

exports.getTontineById = async (req, res) => {
  try {
    const tontineId = req.params.tontineId;
    console.log("L'ID de la tontine à récupérer est " + tontineId);

    // Vérification de l'existence de la tontine
    const tontineDoc = await TontineModel.getTontineById(tontineId);
    if (!tontineDoc) {
      return res.status(404).json({ error: "Tontine introuvable" });
    }

    // Renvoyer les données de la tontine
    res.status(200).json(tontineDoc);
  } catch (err) {
    res
      .status(500)
      .json({
        error: `Échec de la récupération de la tontine : ${err.message}`,
      });
  }
};

exports.makeAdmin = async (req, res) => {
  try {
    const tontineId = req.params.tontineId;
    const userIdToPromote = req.body.userId; // ID de l'utilisateur à promouvoir
    const requestingUserId = req.user.userId; // ID de l'utilisateur qui effectue la requête
    console.log("L'ID de la tontine est " + tontineId);
    console.log("L'ID de l'utilisateur à promouvoir est " + userIdToPromote);
    console.log(
      "L'ID de l'utilisateur qui effectue la requête est " + requestingUserId
    );

    // Vérification de l'existence de la tontine
    const tontineDoc = await TontineModel.getTontineById(tontineId);
    if (!tontineDoc) {
      return res.status(404).json({ error: "Tontine introuvable" });
    }

    // Vérification si l'utilisateur qui effectue la requête est un administrateur
    if (!tontineDoc.adminId.includes(requestingUserId)) {
      return res
        .status(403)
        .json({
          error:
            "Accès refusé : Vous devez être administrateur pour promouvoir un membre",
        });
    }

    // Promotion de l'utilisateur en administrateur
    await TontineModel.makeAdmin(tontineId, userIdToPromote);
    res
      .status(200)
      .json({ message: "Utilisateur promu en administrateur avec succès" });
  } catch (err) {
    res
      .status(500)
      .json({
        error: `Échec de la promotion de l'utilisateur en administrateur : ${err.message}`,
      });
  }
};

exports.joinTontine = async (req, res) => {
  try {
    const tontineId = req.params.tontineId;
    const userId = req.user.userId; // ID de l'utilisateur qui effectue la requête
    console.log("L'ID de la tontine est " + tontineId);
    console.log("L'ID de l'utilisateur qui rejoint est " + userId);

    // Vérification de l'existence de la tontine
    const tontineDoc = await TontineModel.getTontineById(tontineId);
    if (!tontineDoc) {
      return res.status(404).json({ error: "Tontine introuvable" });
    }

    // Vérification si l'utilisateur est invité
    if (!tontineDoc.inviteId.includes(userId)) {
      return res
        .status(403)
        .json({
          error:
            "Accès refusé : Vous devez être invité pour rejoindre cette tontine",
        });
    }

    // Ajout de l'utilisateur à la tontine
    await TontineModel.joinTontine(tontineId, userId);
    res
      .status(200)
      .json({ message: "Utilisateur ajouté à la tontine avec succès" });
  } catch (err) {
    res
      .status(500)
      .json({
        error: `Échec de l'ajout de l'utilisateur à la tontine : ${err.message}`,
      });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const tontineId = req.params.tontineId;
    const userIdToInvite = req.body.userId; // ID de l'utilisateur à inviter
    const requestingUserId = req.user.userId; // ID de l'utilisateur qui effectue la requête
    console.log("L'ID de la tontine est " + tontineId);
    console.log("L'ID de l'utilisateur à inviter est " + userIdToInvite);
    console.log(
      "L'ID de l'utilisateur qui effectue la requête est " + requestingUserId
    );

    // Vérification de l'existence de la tontine
    const tontineDoc = await TontineModel.getTontineById(tontineId);
    if (!tontineDoc) {
      return res.status(404).json({ error: "Tontine introuvable" });
    }

    // Vérification si l'utilisateur qui effectue la requête est un administrateur
    if (!tontineDoc.adminId.includes(requestingUserId)) {
      return res
        .status(403)
        .json({
          error:
            "Accès refusé : Vous devez être administrateur pour inviter un membre",
        });
    }

    // Invitation de l'utilisateur
    await TontineModel.inviteMember(tontineId, userIdToInvite);
    res.status(200).json({ message: "Utilisateur invité avec succès" });
  } catch (err) {
    res
      .status(500)
      .json({
        error: `Échec de l'invitation de l'utilisateur : ${err.message}`,
      });
  }
};
