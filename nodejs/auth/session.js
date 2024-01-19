const http = require('http')

const session = {}

http.createServer((req, res) => {
  const sessionKey = 'sid'
  if (res.url === '/favicon.ico') return
  const cookie = req.headers.cookie
  if (cookie && ~cookie.indexOf(sessionKey)) {
    const sid = (Math.random() * 9999999).toFixed()
    res.setHeader('Set-Cookie', `${sessionKey}=${sid}`)
    session[sid] = { name: 'Bobo' }
  }
  res.end()
})

http.listen(8080)
