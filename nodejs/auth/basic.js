/*
  HTTP Basic Authentication

  http1.1 支持
  Base64 不安全
 */
const express = require('express')

const app = express()

app.use(express.static(path.resolve(__dirname + '/public')))

app.get('basic', function (req, res) {
  if (!req.headers.authorization) {
    res.set({
      'WWW-Authenticate': 'Basic realm="Bobo"'
    })
    res.status(401).end()
  } else {
    let base64 = req.headers.authorization.split(' ')[1]
    // Authorization: Basic base64(account:password) 
    let { user, password } = Buffer.from(base64, 'base64').toString().split(':')
    if (user === 'Bobo' && password) {
      res.end('ok')
    } else {
      res.status(403).end()
    }
  }
})

app.listen(8080)
