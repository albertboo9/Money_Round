require('dotenv').config()

const admin = require('firebase-admin')
const credentials =require('./serviceAccountKey.json');

//configuration de firebase
module.exports =  admin.initializeApp({
    credential: admin.credential.cert(credentials)
})