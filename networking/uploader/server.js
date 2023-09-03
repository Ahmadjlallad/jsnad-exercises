const net = require("node:net");
const fs = require("fs/promises");
const dd = console.log;
const server = net.createServer();

server.on('connection', async (socket) => {
    dd('connect');
    const fileHandle = await fs.open("./storage/test", "w");
    const fileHandleSteam = fileHandle.createWriteStream();

    fileHandleSteam.on('drain', () => {
        socket.resume();
    });

    socket.on('data', (data) => {
        if (!fileHandleSteam.write(data)) {
            socket.pause();
        }
    });

    socket.on('end', () => {
        fileHandleSteam.close(async () => fileHandle.close());
        dd(`connection closed with ip ${socket.remoteAddress}`)
    });
})
server.listen(3000, '::1', () => {
    dd('waiting for connection')
})
