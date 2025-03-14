const tontineCtrl = require("../controllers/tontine.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const express = require("express");
const checkTourStatus = require("../middlewares/checkTourStatus");
const router = express.Router();
const verifyApiKey = require("../config/verifyApikey");

router.use(verifyApiKey);
// Créer une nouvelle tontine
router.post("/create", authMiddleware(), tontineCtrl.createTontine);

// Mettre à jour une tontine existante
router.put("/update/:tontineId", authMiddleware(), tontineCtrl.updateTontine);

// Supprimer une tontine
router.delete(
  "/delete/:tontineId",
  authMiddleware(),
  checkTourStatus,
  tontineCtrl.deleteTontine
);

// Récupérer une tontine par son ID
router.get(
  "/:tontineId",
  authMiddleware(),
  checkTourStatus,
  tontineCtrl.getTontineById
);

// Nommer un administrateur de tontine
router.put(
  "/admin/:tontineId",
  authMiddleware(),
  checkTourStatus,
  tontineCtrl.makeAdmin
);

// Rejoindre une tontine
router.post(
  "/join",
  authMiddleware(),
  checkTourStatus,
  tontineCtrl.joinTontine
);

// Inviter un membre à rejoindre une tontine
router.post(
  "/invite/:tontineId",
  authMiddleware(),
  checkTourStatus,
  tontineCtrl.inviteMember
);

router.post(
  "/createTour/:tontineId",
  authMiddleware(),
  checkTourStatus,
  tontineCtrl.createTour
);
/* router.put(
  "/changeOrder/:tontineId/:tourId",
  authMiddleware(),
  checkTourStatus,
  tourCtrl.changeOrder
); */
router.post(
  "/recordPayment/:tontineId/:tourId/:periodeId",
  authMiddleware(),
  tontineCtrl.recordPayment
);
/* router.put(
  "/updateTourStatus/:tontineId",
  authMiddleware(),
  checkTourStatus,
  tourCtrl.updateTourStatus
); */

module.exports = router;
