const fs = require('fs')
const path = require('path')

// fs.readFile(path.resolve(__dirname, './a'), 'utf-8', function (err, data) {
//   fs.writeFile(path.resolve(__dirname, './b'), data, function () {
//     console.log('success')
//   })
// })

let buf = Buffer.alloc(1)
fs.open(path.resolve(__dirname, './a'), 'r', function (err, rfd) {
  fs.read(rfd, buf, 0, 1, 0, function (err, bytesRead) {
    console.log(buf)

    fs.open(path.resolve(__dirname, './b'), 'w', 0o666, function (err, wfd) {
      fs.write(wfd, buf, 0, 1, 0, function (err, written) {
        console.log('success')
      })
    })
  })
})