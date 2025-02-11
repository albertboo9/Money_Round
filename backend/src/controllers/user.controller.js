const { UserModel, userSchema } = require("../models/user.model");
const { v4: uuid4 } = require("uuid");
const Joi = require("joi");
const jwt = require("jsonwebtoken");


exports.syncUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Accès non autorisé" });
        }
        const token = authHeader.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        }catch(err) {
            return  res.status(401).json({ message: "Erreur d'authentification: token invalide ou expiré"});
        }

        // Vérification et décodage du JWT
        /*try {
            decodedToken = await getAuth().verifyIdToken(token);
            console.log("Id de l'utilisateur", decodedToken.uid);
        } catch (error) {
            console.error("Token invalide ou expiré", error.message);
            return res.status(401).json({ message: "Token invalide ou expiré" });
        }*/

        //const user = req.user;
        //console.log(user);
        const userData = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            fullName: decodedToken.fullName,
            phoneNumber: decodedToken.phoneNumber
        };
        await UserModel.syncUser(userData);

        return  res.status(200).json({ message: `Utilisateur synchronisé avec succès`, id: decodedToken.uid});
    } catch (err) {
        return  res.status(500).json({error: ` échec de synchronisation de l'utilisateur ${err.message}`});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Accès non autorisé" });
        }
        const token = authHeader.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        }catch(err) {
            return res.status(401).json({ message: "Erreur d'authentification: token invalide ou expiré"});
        }

        const userId = req.params.userId;

        const userData = await UserModel.getUserById(userId);
        if (!userData) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        // Renvoyer les données de l'utilisateur
        res.status(200).json(userData);
    } catch (err) {
        res
            .status(500)
            .json({error: `Échec de la récupération de l'Utilisateur : ${err.message}`,});
    }
};

//exports.updateUser = async (req, res) => {};

exports.deleteUser = async (req, res) => {};