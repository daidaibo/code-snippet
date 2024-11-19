const http = require('http')
const io = require('socket.io')

const server = http.createServer((req, res) => { })

server.listen(8080)

const ws = io.listen(server)

ws.on('connection', socket => {
  socket.emit('msg', '服务器向客户端发送第一条数据', '服务器向客户端发送第二条数据')

  socket.on('msg', (...msgs) => {
    console.log(msgs)
  })

  setInterval(() => {
    socket.emit('timer', new Date().getTime())
  }, 2000)
})
