const { db } = require("../config/firebase"); // Connexion à Firestore

/**
 * Middleware pour vérifier si une tontine a un tour en cours avant modification.
 * Empêche les modifications si un tour est actif.
 */
const checkTourStatus = async (req, res, next) => {
  try {
    const { tontineId } = req.params; // Récupérer l'ID de la tontine depuis l'URL

    // Récupération du document Firestore
    const tontineRef = db.collection("tontines").doc(tontineId);
    const tontineDoc = await tontineRef.get();

    // Vérifier si la tontine existe
    if (!tontineDoc.exists) {
      return res.status(404).json({ error: "Tontine introuvable" });
    }

    const tontineData = tontineDoc.data(); // Récupérer les données de la tontine

    // Vérifier s'il y a un tour en cours
    const hasOngoingTour = tontineData.tours?.some((tour) => tour.status === "en cours");

    if (hasOngoingTour) {
      return res.status(400).json({
        error: "Un tour est en cours, modification non autorisée",
      });
    }

    next(); // Passer au middleware suivant si tout est OK
  } catch (err) {
    res.status(500).json({
      error: `Erreur lors de la vérification du tour: ${err.message}`,
    });
  }
};

module.exports = checkTourStatus;
