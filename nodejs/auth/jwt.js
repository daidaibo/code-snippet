const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname + '/public')))

const jwtKey = 'Bobo_secret_key'
const jwtExpirySeconds = 24 * 60 * 60

const user = {
  user1: 'password1',
  user2: 'password2'
}

app.post('login', function (req, res) {
  const { username, password } = req.body
  if (!username || !password || users[username] !== password) {
    return res.status(401).end()
  }
  const token = jwt.sign({ username }, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds
  })

  res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
  res.end()
})

app.get('verify', function (req, res) {
  const token = req.cookies.token
  if (!token) return res.status(401).end()

  let payload
  try {
    payload = jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end()
    }
    return res.status(400).end()
  }
  res.send(`Welcome ${payload.username}`)
})

app.post('refesh', function (req, res) {
  const token = req.cookies.token
  if (!token) return res.status(401).end()

  let payload
  try {
    payload = jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end()
    }
    return res.status(400).end()
  }

  // 有效期小于 1 分钟 Refresh
  if (payload.exp - Math.round(Number(new Date()) / 1000) > 60) {
    return res.status(400).end()
  }

  const newToken = jwt.sign({ username: payload.username }, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds
  })

  res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000 })
  res.end()
})

app.listen(8080)
