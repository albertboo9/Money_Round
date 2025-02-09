const { UserModel, userSchema } = require("../models/user.model");
const { v4: uuid4 } = require("uuid");
const Joi = require("joi");


// schema de validation des données provenant de la requête
const createUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
});


exports.createUser = async (req, res) => {
    try {
        // validation des données de la requête
        const { error } = createUserSchema.validate(req.body);
        if (error) {
            return res
                .status(400)
                .json({ error: `Données invalides : ${error.details[0].message}` });
        }

        // données de la tontine
        const userData = {
            fullName: req.body.fullName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        };

        res
            .status(201)
            .json({ message: "Utilisateur créé avec succès"});
    } catch (err) {
        res.status(500).json({
            error: ` échec de création de l'utilisateur ${err.message}`,
        });
    }
};

exports.getUserById = async (req, res) => {};

exports.updateUser = async (req, res) => {};

exports.deleteUser = async (req, res) => {};