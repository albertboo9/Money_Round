const {json}=require('body-parser')
const bcrypt=require('bcrypt');
const{db,admin}=require('../config/firebase');


//verification de la la cle 
const verifyApiKey= async(req,res,next)=>{
    const apiKey=req.header('apikey');
    const appName=req.header('appname');

    if(!apiKey||!appName){
        return res.status(400).json({message:'apiKey and  appName are reuires'})
    }

    try {
        const snapshot=await db.collection('apiKeys').where('appName','==',appName).get()
        if (snapshot.empty) {
            console.error(`Aucune application trouvée avec le nom ${appName}`);
            return res.status(404).json({ message: 'App not found' });
          }

 const doc = snapshot.docs[0];
    const firebaseApiKey = doc.data().apiKey;

    const isValid = await bcrypt.compare(apiKey, firebaseApiKey);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid API Key' });
    }

    next();


    } catch (error) {
        console.error('Erreur complète:', error);
        return res.status(500).json({ message: 'Internal server error', details: error.message || error });
    }
}

module.exports = verifyApiKey;