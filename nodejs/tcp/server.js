const net = require('net')

const server = new net.Server()

server.on('connection', function (socket) {
  console.log('connection succeeded')

  const message = JSON.stringify(server.address())
  socket.write(message, function () {
    const size = socket.bytesWritten
    console.log(message, size)
  })

  socket.on('data', function (data) {
    const size = socket.bytesRead
    console.log(data.toString(), size)
  })
})

server.listen(8080)

server.on('listening', function () {
  const { port, address, family } = server.address()
  console.log(port, address, family)
})

server.on('close', function () {
  console.log('server closed')
})
