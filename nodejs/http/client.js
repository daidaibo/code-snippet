const http = require('http')

let options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',
  method: 'get',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const req = http.request(options)

req.on('response', function (res) {
  res.on('data', function (chunk) {
    console.log(chunk.toString())
  })
})

req.end()
