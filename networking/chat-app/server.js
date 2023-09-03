import net from "node:net"

const server = net.createServer();

const clients = [];
server.on('connection', (socket) => {
    const id = clients.length + 1;
    clients.push({id, socket})

    socket.write(`id-${id}`)

    socket.on('data', (data) => {
        const dataString = data.toString();
        const id = dataString.replace(/-message-.*/gm, '').replace('id-', '');
        const message = dataString.replace(/id-\d-message-/gm, '')
        console.log('message', message, 'id', id)
        clients.forEach(({socket}) => {
            socket.write(`> User ${id}: ${message}`)
        })
    })

    socket.on('close', () => {
        console.log('close')
    })
})

server.listen(3000, '127.0.0.1', function () {
    console.log('listening at', server.address())
})
