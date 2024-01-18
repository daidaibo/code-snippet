const http = require('http')

const server = http.createServer()

server.on('request', function (req, res) {
  res.write('ok')
  res.end()
})

server.on('connection', function (socket) {
  console.log('connection succeeded')
})

server.listen(8080)
