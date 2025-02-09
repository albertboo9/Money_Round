require("dotenv").config();
const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");

module.exports = () => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    const token = authHeader.split(" ")[1];

    // Vérification du token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Vérification du token JWT
    /*    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded
    // Vérification du token Firebase
    const firebaseToken = req.headers["firebase-token"];
    if (!firebaseToken) {
      return res.status(401).json({ message: "Token Firebase manquant" });
    }

    const firebaseUser = await admin.auth().verifyIdToken(firebaseToken);
    req.firebaseUser = firebaseUser; */

    next();
  } catch (error) {
    console.error("Erreur d'authentification", error.message);
    return res.status(401).json({ message: "Accès non autorisé" });
  }
};
