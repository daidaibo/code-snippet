const dgram = require('dgram')

const server = dgram.createSocket('udp4')

const port = 8080

server.on('message', function (msg, rinfo) {
  console.log(`${rinfo.address}:${rinfo.port} ${msg}`)
})

server.bind(port)
