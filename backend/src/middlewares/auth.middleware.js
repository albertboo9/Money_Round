require("dotenv").config();
const jwt = require("jsonwebtoken");
const {getAuth} = require("firebase-admin/auth");

module.exports = () => async (req, res, next) => {
  try {
    console.log("Middleware appelé");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(req.user);
    next();

    // Vérification et décodage du JWT
    /*try {
      //req.user = await getAuth().verifyIdToken(token);
      console.log("Id de l'utilisateur", req.user.uid);
      next(); // On retourne au contrôleur si tout est Okay

    } catch (error) {
      console.error("Token invalide ou expiré", error.message);
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }*/

  } catch (error) {
    console.error("Erreur d'authentification", error.message);
    return res.status(401).json({ message: "Accès non autorisé" });
  }
};
