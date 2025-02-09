// filepath: /home/albert/Money_Round/backend/src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err.stack); // Affiche l'erreur dans la console
    res.status(500).json({ error: 'Something went wrong!' }); // Renvoie une réponse générique
  }
  
  module.exports = errorHandler;