require("dotenv").config();

const jwt = require('jsonwebtoken');

const payload = {
  uid: 'msfJTGJAqohfveQ0pDiqH2Z9n4g1',
  fullName: 'Doe',
  email: 'doe@example.com',
  phoneNumber: +2376899444,
  // Ajoutez d'autres informations nécessaires
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
console.log(token);