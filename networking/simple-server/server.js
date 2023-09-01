import net from "node:net"

const server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        console.log(data)
    })
})

server.listen(3000, function () {
    console.log('listening at', server.address())
})
