const net = require("node:net");
const fs = require("fs/promises");
const buffer = require("buffer");

const dd = console.log;
const server = net.createServer();
/**
 *
 * @type {FileHandle}
 */
let fileHandle = null;
let fileHandleSteam = null;
const CONTENT_HEADER = "Tcp-Content";
const FILENAME_HEADER = "Filename";

server.on('connection', (socket) => {
    dd('connect');
    socket.on('data', async (data) => {
        if (!fileHandle) {
            socket.pause();
            const contentHeader = data.indexOf(CONTENT_HEADER);
            const filename = data.subarray(FILENAME_HEADER.length, contentHeader);
            data = data.subarray(contentHeader + CONTENT_HEADER.length);
            fileHandle = await fs.open(`./storage/${filename.toString()}`, "w");
            fileHandleSteam = fileHandle.createWriteStream();

            fileHandleSteam.on('drain', () => {
                socket.resume();
            });
            socket.resume();
        }

        if (!fileHandleSteam.write(data)) {
            socket.pause();
        }
    });

    socket.on('end', async (err) => {
        if (fileHandleSteam !== null) {
            await fileHandleSteam.close();
        }

        if (fileHandle !== null) {
            await fileHandle.close();
        }

        fileHandle = fileHandleSteam = null;
        dd(`connection closed with ip ${socket.remoteAddress}`)
        socket = null;
        // if (global.gc) {global.gc();}
    });
})
server.listen(3000, '::1', () => {
    dd('waiting for connection')
})
