const { UserModel } = require("../models/user.model");
const { v4: uuid4 } = require("uuid");
const Joi = require("joi");


const updateUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().optional(),
    profilePicture: Joi.string().base64().optional()
});

const registerWithEmailPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
        })
});

const signInWithEmailAndPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
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

// Inscription de l'utilisateur par email et mot de passe
exports.registerWithEmailPassword = async (req, res) => {
    try {
        // Validation des données
        const {error, value} = registerWithEmailPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: `Données invalides : ${error.details[0].message}` });
        }
        const registeredUserId = await UserModel.registerWithEmailPassword(value);
        if (!registeredUserId) {
            return res.status(409).json({error: `Échec d'inscription de l'utilisateur : ${err.message}`});
        }

        //await UserModel.sendVerificationEmail(registeredUserId);

        return res.status(200).json({message: "Utilisateur inscrit avec succès", userId: registeredUserId});

    }catch (err) {
        return res.status(409).json({error: `Échec: ${err.message}`});
    }
}

// Connexion de l'utilisateur par email et mot de passe
exports.signInWithEmailAndPassword = async (req, res) => {
    try {
        // Validation des données
        const {error, value} = signInWithEmailAndPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: `Données invalides : ${error.details[0].message}` });
        }
        const idToken = await UserModel.signInWithEmailAndPassword(value);
        if (!idToken) {
            return res.status(401).json({error: `Email ou Mot de passe incorrect: ${err.message}`});
        }

        return res
            .status(200)
            .cookie("session", idToken, {httpOnly: true, secure: true})
            .json({message: "Utilisateur connecté avec succès", token: idToken});

    }catch (err) {
        return res.status(401).json({error: `Email ou Mot de passe incorrect: ${err.message}`});
    }
}

// Déconnexion de l'utilisateur
exports.signOut = async (req, res) => {
    try {
        await UserModel.signOut();
        return res
            .status(200)
            .clearCookie("session")
            .json({message:"Utilisateur déconnecté avec succès"});
    }catch (err) {
        return res.status(500).json({error: `Impossible de déconnecter l'utilisateur: ${err.message}`});
    }
}

// On récupère l'utilisateur par son Id
exports.getUserById = async (req, res) => {
    try {
        //const decodedToken = req.user;
        // Si l'utilisateur n'existe pas encore dans Firestore on l'ajoute
        //await UserModel.syncUser({uid: decodedToken.uid, email: decodedToken.email});

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
        //const decodedToken = req.user;
        // Si l'utilisateur n'existe pas encore dans Firestore on l'ajoute
        //await UserModel.syncUser({uid: decodedToken.uid, email: decodedToken.email});

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

// Suppression de l'utilisateur
exports.deleteUser = async (req, res) => {
    try {
        //const decodedToken = req.user;
        // Si l'utilisateur n'existe pas encore dans Firestore on l'ajoute
        //await UserModel.syncUser({uid: decodedToken.uid, email: decodedToken.email});

        const userId = req.params.userId;
        const deletedUser = await UserModel.deleteUser(userId);
        return res.status(200).json({message: "Utilisateur supprimé", id: deletedUser});

    }catch (err) {
        return res.status(500).json({error: `Échec de suppression de l'utilisateur : ${err.message}`,});
    }
};

exports.getTontinesByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const tontines = await UserModel.getTontinesByUserId(userId);
        return res.status(200).json({message: "Tontines de l'utilisateur", tontines: tontines});

    }catch (error) {
        return res.status(500).json({error: `Impossible de récupérer les tontines de l'utilisateur : ${error.message}`,});
    }
}