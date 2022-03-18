require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const userRoutes = require('./routes/User')
const authRoutes = require('./routes/Auth')
const postRoutes = require('./routes/Posts')
const commentRoutes = require('./routes/Comments')
const cookieParser = require('cookie-parser')

const {
  checkUser,
  requireAuth
} = require('./middleware/auth')

app.use((req, res, next) => {
  const allowedOrigins = ['http://192.168.1.3:8080', 'http://localhost:8080', 'http://192.168.1.3:8081'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin))
    res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

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


module.exports = app