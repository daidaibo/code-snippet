const dgram = require('dgram')

const client = dgram.createSocket('udp4')

const msg = Buffer.from('broadcast-msg')
const port = 8080
const host = '127.0.0.1'

client.send(msg, port, host, function () {
  client.close()
})
