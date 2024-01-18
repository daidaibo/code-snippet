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
      let IfModifiedSince = req.headers['if-modified-since']
      let LastModified = stat.ctime.toGMTString()
      if (IfModifiedSince === LastModified) {
        res.writeHead(304)
        res.end()
      } else {
        send(req, res, filepath, stat)
      }
    }
  })
}).listen(8080)

function sendError(req, res) {
  res.writeHead(404)
  res.end('Not Found')
}

function send(req, res, filepath) {
  res.setHeader('Content-Type', mime.getType(filepath))

  res.setHeader('Last-Modified', stat.ctime.toGMTString())

  fs.createReadStream(filepath).pipe(res)
}
