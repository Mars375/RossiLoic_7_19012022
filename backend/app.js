require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/User');
const authRoutes = require('./routes/Auth');
const postRoutes = require('./routes/Posts');
const commentRoutes = require('./routes/Comments');
const pwdresetRoutes = require('./routes/Pwd-reset');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const cors = require('cors');

const {
  checkUser,
  requireAuth
} = require('./middleware/auth');

// Créer le répertoire tmp/uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '..', 'tmp', 'uploads');
if (!fs.existsSync(uploadDir)) {
  console.log(`Creating directory: ${uploadDir}`);
  fs.mkdirSync(uploadDir, { recursive: true });
} else {
  console.log(`Directory already exists: ${uploadDir}`);
}

// Vérifiez les permissions du répertoire
fs.access(uploadDir, fs.constants.R_OK, (err) => {
  console.log(`${uploadDir} ${err ? 'is not readable' : 'is readable'}`);
});
fs.access(uploadDir, fs.constants.W_OK, (err) => {
  console.log(`${uploadDir} ${err ? 'is not writable' : 'is writable'}`);
});

// Configuration CORS pour des origines spécifiques
const allowedOrigins = [
  'http://localhost:8080',
  'https://groupomania-back.onrender.com',
  'https://groupomania-front.onrender.com',
  'https://groupomania-mu.vercel.app'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Middleware pour vérifier les en-têtes de réponse
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Gérer les requêtes pré-vol (OPTIONS)
app.options('*', cors(corsOptions));

// Utilisation de cookie-parser avant les routes
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));
console.log(`Serving static files from: ${uploadDir}`);

// jwt
app.get('/jwtid', checkUser, requireAuth, (req, res) => {
  res.status(200).send(res.locals.user.id.toString());
});

// routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/post', commentRoutes);
app.use('/password-reset', pwdresetRoutes);

// Test de connexion
app.get('/test-connection', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ message: 'Connection has been established successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to connect to the database.', error });
  }
});

module.exports = app;