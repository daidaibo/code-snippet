const dgram = require('dgram')

const server = dgram.createSocket('udp4')

const port = 8080
const host = '127.0.0.1'

server.on('listening', function () {
  const { address, port } = server.address()
  console.log(`${address}:${port}`)
})

server.on('message', function (msg, rinfo) {
  console.log(`${rinfo.address}:${rinfo.port} ${msg}`)
})

server.bind(port, host)
