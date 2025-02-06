const jwt = require("jsonwebtoken")

module.exports = ()=> {
    const authHeader = red.headers.auhorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({message:"accès non autorisé"})
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        console.error("Erreur d'authentification", error.message);
        return res.status(401).json({message:"Accès non autorisé"})
    }
}