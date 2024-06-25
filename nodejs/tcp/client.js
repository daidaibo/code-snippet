const net = require('net')

const client = net.Socket()

client.connect(8080, '127.0.0.1', function () {
  console.log('connect server success')

  client.write('the message send to server')

  client.on('data', function (data) {
    console.log(data.toString())
  })

})

client.on('end', function () {
  console.log('client end')
})
