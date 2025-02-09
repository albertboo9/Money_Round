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
        const user = req.user;
        console.log("Données de l'utilisateur extraites du jwt: " + user);
        const uid = user.user_id;
        const email = user.email;

        const userData = {
            uid: uid,
            email: email
        };
        await UserModel.createUser(userData);

        res
            .status(200)
            .json({ message: `Utilisateur récupéré avec succès`, data: user});
    } catch (err) {
        res.status(500).json({
            error: ` échec de recupération de l'utilisateur ${err.message}`,
        });
    }
};

exports.getUserById = async (req, res) => {};

exports.updateUser = async (req, res) => {};

exports.deleteUser = async (req, res) => {};