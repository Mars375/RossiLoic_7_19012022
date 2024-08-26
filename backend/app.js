require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const userRoutes = require('./routes/User')
const authRoutes = require('./routes/Auth')
const postRoutes = require('./routes/Posts')
const commentRoutes = require('./routes/Comments')
const pwdresetRoutes = require('./routes/Pwd-reset')
const cookieParser = require('cookie-parser')
const { sequelize } = require('./models');

const {
  checkUser,
  requireAuth
} = require('./middleware/auth')

app.use((req, res, next) => {
  const allowedOrigins = ['http://192.168.1.3:8080', 'http://localhost:8080', 'http://localhost:8081', 'http://192.168.1.3:8081', 'http://10.93.169.224:8080/'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin))
    res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.get('/test-connection', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ message: 'Connection has been established successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to connect to the database.', error });
  }
});

app.use(express.json())
app.use(cookieParser())
app.use('/pictures', express.static(path.join(__dirname, 'pictures')))
// jwt
app.get('/jwtid', checkUser, requireAuth, (req, res) => {
  res.status(200).send(res.locals.user.id.toString())
})

// routes
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/post', postRoutes)
app.use('/post', commentRoutes)
app.use('/password-reset', pwdresetRoutes)


module.exports = app