const admin = require("../config/firebase");
const db = admin.admin.firestore();

const checkTourStatus = async (req, res, next) => {
  try {
    const tontineId = req.params.tontineId;
    console.log(`Vérification de l'état des tours pour la tontine: ${tontineId}`);

    const tontineDoc = await db.collection("tontines").doc(tontineId).get();
    if (!tontineDoc.exists) {
      console.log("Tontine introuvable");
      return res.status(404).json({ error: "Tontine introuvable" });
    }

    const tontineData = tontineDoc.data();
    console.log("Tontine trouvée:", tontineData);

    // Vérifier s'il y a un tour en cours
    if (!Array.isArray(tontineData.tours)) {
      console.log("Aucun champ 'tours' trouvé dans la tontine ou 'tours' n'est pas un tableau");
      return res.status(400).json({ error: "Aucun champ 'tours' trouvé dans la tontine ou 'tours' n'est pas un tableau" });
    }

    const ongoingTour = tontineData.tours.some(tour => tour.statut === "en cours");
    if (ongoingTour) {
      console.log("Un tour est en cours:", ongoingTour);
      return res.status(400).json({ error: "Un tour est en cours, modification non autorisée" });
    }

    console.log("Aucun tour en cours, passage au middleware suivant");
    next();
  } catch (err) {
    console.error("Erreur lors de la vérification du tour:", err.message);
    res.status(500).json({ error: `Erreur lors de la vérification du tour: ${err.message}` });
  }
};

module.exports = checkTourStatus;