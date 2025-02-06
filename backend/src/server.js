require("dotenv").config(); // Pour charger les variables d'environnement
const express = require('express');
const helmet = require('helmet'); // Pour sécuriser les en-têtes HTTP
const cors = require('cors'); // Pour activer CORS
const morgan = require('morgan'); // Pour journaliser les requêtes HTTP
const rateLimit = require('express-rate-limit'); // Pour limiter le taux de requêtes
const bodyParser = require('body-parser'); // Pour analyser les corps des requêtes


// Initialiser l'application express
const app = express();

// Utiliser Helmet pour sécuriser les en-têtes HTTP
app.use(helmet());

// Configurer CORS pour des routes spécifiques
const corsOptions = {
    origin: 'http://localhost:3000', // Remplacer par le domaine autorisé
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
};
app.use('/api/tontines', cors(corsOptions));

// Utiliser Morgan pour journaliser les requêtes HTTP
app.use(morgan('combined'));

// Limiter les requêtes répétées aux API publiques
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limiter chaque IP à 100 requêtes par fenêtre de temps
});
app.use(limiter);

// Analyser les corps des requêtes entrantes avant les gestionnaires
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Définir une route simple pour tester
app.get('/', (req, res) => {
    res.send(`bonjour monsieur ${req.body.name}`);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  });

// Définir une route pour tester tous les endpoints des contrôleurs des tontines
app.all('/api/tontines/test', (req, res) => {
    res.send(`Requête ${req.method} reçue`);
});

// Démarrer le serveur sur le port 3000
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Le serveur fonctionne sur le port ${PORT}`);
});