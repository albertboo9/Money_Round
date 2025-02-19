const { tontineModel } = require("../models/tontine.model");

const checkTourStatus = async (req, res, next) => {
  try {
    const tontineId = req.params.tontineId;
    const tontineDoc = await tontineModel.getTontineById(tontineId);
    if (!tontineDoc) {
      return res.status(404).json({ error: "Tontine introuvable" });
    }

    // Vérifier s'il y a une tontine en cours
    const ongoingTour = tontineDoc.tours.find(
      (tour) => tour.status === "en cours"
    );
    if (ongoingTour) {
      return res
        .status(400)
        .json({ error: "Un tour est en cours, modification non autorisée" });
    }

    next();
  } catch (err) {
    res
      .status(500)
      .json({
        error: `Erreur lors de la vérification du tour: ${err.message}`
      });
  }
};

exports = checkTourStatus;
