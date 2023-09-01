import net from "node:net"

const server = net.createServer();

const clients = [];
server.on('connection', (socket) => {
    console.log('')
    clients.push(socket)

    socket.on('data', (data) => {
        clients.forEach((client) => client.write(data))
    })

    socket.on('close', (socket) => {
        console.log('close')
    })
})

server.listen(3000, 'localhost', function () {
    console.log('listening at', server.address())
})
