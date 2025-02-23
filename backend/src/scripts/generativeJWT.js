require("dotenv").config();

const jwt = require('jsonwebtoken');

const payload = {
  userId: 'Bs5SFyjncxZEcscyuqGDE7xGTyv2',
  fullName: 'Doe',
  email: 'test@gmail.com',
  phoneNumber: +2376899444,
  // Ajoutez d'autres informations nécessaires
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log(token);