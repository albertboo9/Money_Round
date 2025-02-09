require("dotenv").config();

const jwt = require('jsonwebtoken');

const payload = {
  userId: 'user123',
  // Ajoutez d'autres informations nécessaires
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });
console.log(token);