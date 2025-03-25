require("dotenv").config();

const jwt = require('jsonwebtoken');

const payload = {
  userId: 'Mpv8Adp2FngUQ4q5rgAtCnSBv2D2',
  fullName: 'Doe',
  email: 'test@gmail.com',
  phoneNumber: +2376899444,
  walletId:"Oyd62hOQPc74ajsgIoDl"
  // Ajoutez d'autres informations nécessaires
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log(token);