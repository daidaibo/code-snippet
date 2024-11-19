const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime')

http.createServer(function (req, res) {
  let { pathname } = url.parse(req.url, true)
  let filepath = path.join(__dirname, pathname)

  fs.stat(filepath, function (err, stat) {
    if (err) {
      return sendError(req, res)
    } else {
      send(req, res, filepath)
    }
  })
}).listen(8080)

function sendError(req, res) {
  res.writeHead(404)
  res.end('Not Found')
}

function send(req, res, filepath) {
  res.setHeader('Content-Type', mime.getType(filepath))

  res.setHeader('Expires', new Date(Date.now() + 30 * 1000).toUTCString())
  res.setHeader('Cache-Control', 'max-age=30')

  fs.createReadStream(filepath).pipe(res)
}
