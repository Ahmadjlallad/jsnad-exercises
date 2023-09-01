import net from 'node:net'


const socket = net.createConnection({port: 3000, host: 'localhost'}, function () {
    socket.write(Buffer.from('hello'))
})
