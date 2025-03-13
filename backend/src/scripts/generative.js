const crypto=require('crypto');
const bcrypt=require('bcrypt');
const {db,admin}=require('../config/firebase')

function generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
}

// Fonction pour hasher la clé API
async function hashApiKey(apiKey) {
    const saltRounds = 10;
    return await bcrypt.hash(apiKey, saltRounds);
  }

  async function createApiKeyAndAppName(){
try{
    const apiKey = generateApiKey();
    const appName = 'MOneyRound-' + Date.now(); // Exemple simple pour un nom unique

    // Hachage de la clé API
    const hashedApiKey = await hashApiKey(apiKey);

    // Stockage dans Firebase Firestore
    const apiKeysRef = db.collection('apiKeys');
    const docRef = await apiKeysRef.add({
      apiKey: hashedApiKey,
      appName: appName,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('API Key and App Name created successfully:');
    console.log('API Key:', apiKey);
    console.log('App Name:', appName);
    console.log('Firebase Document ID:', docRef.id);
}catch(error){
    console.error('Error creating API Key and App Name:', error);
}
  }
  createApiKeyAndAppName();