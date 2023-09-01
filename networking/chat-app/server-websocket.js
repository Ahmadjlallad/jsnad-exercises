import net from "node:net"
import crypto from "node:crypto";

const server = net.createServer();
const webSocketSecHeader = new RegExp(/(Sec-WebSocket-Key:\s)(.*)/);

server.on('connection', (socket) => {
    socket.on('data', (data) => {
        const message = data.toString();
        if (webSocketSecHeader.test(message)) {
            const matches = message.match(webSocketSecHeader)[2];
            const hash = crypto.createHash('sha1')
                .update(matches).digest('base64');
            console.log(hash)
            socket.write(Buffer.from(
                `HTTP/1.1 101 Switching Protocols
                           upgrade: websocket
                           connection: upgrade
                           Sec-WebSocket-Accept: ${hash}
                `).toString()
            )
        }

    })

    socket.write(Buffer.from(`tt`).toString('binary'))

    socket.on('close', (socket) => {
        console.log('close')
    })
})

server.listen(3000, 'localhost', function () {
    console.log('listening at', server.address())
})
