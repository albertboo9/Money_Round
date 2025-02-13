const { UserModel, userSchema } = require("../models/user.model");
const { v4: uuid4 } = require("uuid");
const Joi = require("joi");
const jwt = require("jsonwebtoken");


const updateUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().optional(),
    profilePicture: Joi.string().base64().optional()
});

/*exports.syncUser = async (req, res) => {
    try {
        const decodedToken = req.user;
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
};*/

exports.getUserById = async (req, res) => {
    try {
        const decodedToken = req.user;
        // Si l'utilisateur n'existe pas encore dans Firestore on l'ajoute
        await UserModel.syncUser({uid: decodedToken.uid, email: decodedToken.email});

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

// Mise à jour de l'utilisateur
exports.updateUser = async (req, res) => {
    try {
        const decodedToken = req.user;
        // Si l'utilisateur n'existe pas encore dans Firestore on l'ajoute
        await UserModel.syncUser({uid: decodedToken.uid, email: decodedToken.email});

        // Validation des données
        const {error, value} = updateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: `Données invalides : ${error.details[0].message}` });
        }

        const userId = req.params.userId;
        const userDoc = await UserModel.getUserById(userId);
        if (!userDoc) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        const updatedUser = await UserModel.updateUser(userId, value);
        return res.status(200).json({message: "Utilisateur mis à jour", data: updatedUser });
    }catch (err) {
        return res.status(500).json({error: `Échec de la mise à jour de l'utilisateur : ${err.message}`,});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const decodedToken = req.user;
        // Si l'utilisateur n'existe pas encore dans Firestore on l'ajoute
        await UserModel.syncUser({uid: decodedToken.uid, email: decodedToken.email});

        const userId = req.params.userId;
        const deletedUser = await UserModel.deleteUser(userId);
        return res.status(200).json({message: "Utilisateur supprimé", id: deletedUser.id});

    }catch (err) {
        return res.status(500).json({error: `Échec de suppression de l'utilisateur : ${err.message}`,});
    }
};