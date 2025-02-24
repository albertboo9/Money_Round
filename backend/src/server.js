const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const tontineRoutes = require('./routes/tontine.routes'); // Importation des routes
const userRoutes = require('./routes/user.routes'); // Importation des routes
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// utilisation d'un middleware de logging
app.use(requestLogger);

// utilisation d'un middleware de gestion des erreurs
app.use(errorHandler);

// Configuration des options CORS
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(helmet());

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

// Utiliser les routes définies dans tontine.routes.js
app.use('/api/tontines', tontineRoutes);

// Routes de user.routes.js
app.use('/api/users', userRoutes);

// Configuration des en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Démarrer le serveur sur le port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});