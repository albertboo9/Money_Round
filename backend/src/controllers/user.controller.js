const { UserModel, userSchema } = require("../models/user.model");
const { v4: uuid4 } = require("uuid");
const Joi = require("joi");
const {getAuth} = require("firebase-admin/auth");


exports.syncUser = async (req, res) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Accès non autorisé" });
        }

        const token = authHeader.split(" ")[1];
        let decodedToken;

        // Vérification et décodage du JWT
        try {
            decodedToken = await getAuth().verifyIdToken(token);
            console.log("Id de l'utilisateur", decodedToken.uid);
        } catch (error) {
            console.error("Token invalide ou expiré", error.message);
            return res.status(401).json({ message: "Token invalide ou expiré" });
        }

        //const user = req.user;
        //console.log(user);
        const userData = {
            uid: decodedToken.uid,
            email: decodedToken.email,
        };
        await UserModel.createUser(userData);

        return  res.status(200).json({ message: `Utilisateur récupéré avec succès`, id: decodedToken.uid});
    } catch (err) {
        return  res.status(500).json({error: ` échec de recupération de l'utilisateur ${err.message}`});
    }
};

exports.getUserById = async (req, res) => {};

exports.updateUser = async (req, res) => {};

exports.deleteUser = async (req, res) => {};