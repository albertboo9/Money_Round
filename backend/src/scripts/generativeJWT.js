require("dotenv").config();

const jwt = require('jsonwebtoken');

const payload = {
  uid: '13NaNtEesnOghHZBcx3kehotMEr2 ',
  fullName: 'test',
  email: 'test@gmail.com',
  phoneNumber: +2376899444,
  // Ajoutez d'autres informations nécessaires
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
console.log(token);