// filepath: /home/albert/Money_Round/backend/src/middlewares/requestLogger.js
const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}

module.exports = requestLogger;