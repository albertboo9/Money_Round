require("dotenv").config();

const jwt = require('jsonwebtoken');

const payload = {
  uid: 'user123',
  fullName: 'Doe',
  email: 'doe@example.com',
  phoneNumber: +2376899444,
  // Ajoutez d'autres informations nécessaires
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4m' });
console.log(token);