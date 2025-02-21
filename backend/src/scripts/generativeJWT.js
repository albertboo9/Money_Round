require("dotenv").config();

const jwt = require('jsonwebtoken');

const payload = {
  uid: 'mNRQib0ZaEQ7VPphMLX1tp6V7vi2',
  fullName: 'Doe',
  email: 'example@gmail.com',
  phoneNumber: +2376899444,
  // Ajoutez d'autres informations nécessaires
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log(token);