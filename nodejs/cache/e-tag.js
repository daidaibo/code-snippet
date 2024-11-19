const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const crypto = require('crypto')

http.createServer(function (req, res) {
  let { pathname } = url.parse(req.url, true)
  let filepath = path.join(__dirname, pathname)

  fs.stat(filepath, function (err, stat) {
    if (err) {
      return sendError(req, res)
    } else {
      let IfNoneMatch = req.headers['if-none-match']

      // let ETag = `${stat.ctime}-${stat.size}`

      let out = fs.createReadStream(filepath)
      let md5 = crypto.createHash('md5')
      out.on('data', function (data) {
        md5.update(data)
      })
      out.on('end', function () {
        let ETag = md5.update('salt').digest('hex')
        if (IfNoneMatch === ETag) {
          res.writeHead(304)
          res.end()
        } else {
          send(req, res, filepath, ETag)
        }
      })
    }
  })
}).listen(8080)

function sendError(req, res) {
  res.writeHead(404)
  res.end('Not Found')
}

function send(req, res, filepath, ETag) {
  res.setHeader('Content-Type', mime.getType(filepath))

  res.setHeader('ETag', ETag)

  fs.createReadStream(filepath).pipe(res)
}
