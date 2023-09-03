'use strict';
const net = require("node:net");
const fs = require("node:fs/promises");
const dd = console.log;
const {performance} = require("node:perf_hooks");
const {basename, dirname} = require('node:path');

const CONTENT_HEADER = "Tcp-Content";
const FILENAME_HEADER = "Filename";
const filePath = process.argv[2];

// validate file exist
if (!filePath) {
    const error = new Error();
    error.message = "missing file name arg";
    error.code = 1;
    error.cause = "missing file name arg";
    throw error;
}

const socket = net.createConnection({host: "::1", port: 3000, family: 6}, async () => {
    let [fileHandle, err] = await buildFileHandler(filePath);

    if (err !== null) {
        socket.end();
        throw err;
    }

    let fileReadStream = fileHandle.createReadStream();
    const fileSize = (await fileHandle.stat()).size;
    let uploadPercentage = 0;
    let bytesUploaded = 0;
    newLine();
    newLine();
    socket.write(`${FILENAME_HEADER}${basename(filePath)}${CONTENT_HEADER}`);
    fileReadStream.on('data', async (data) => {
        if (!socket.write(data)) {
            fileReadStream.pause();
        }

        bytesUploaded += data.length;
        const pres = Math.floor((bytesUploaded / fileSize * 100))

        if (pres % 5 === 0 && pres !== uploadPercentage) {
            uploadPercentage = pres;
            await showPercentage(pres)
        }
    });

    socket.on('drain', () => {
        fileReadStream.resume();
    });

    fileReadStream.on('end', () => {
        fileHandle.close();
        socket.end();
        dd(`upload finished in ${performance.now() * 1e-3}s`);
        process.exit(0);
    });

    socket.on('error', (err) => {
        fileHandle.close();
        socket.end();
        console.error(`error ${err.message}`, err);
        process.exit(0);
    });
});

function clearLine() {
    return new Promise((resolve) => {
        process.stdout.clearLine(0, () => {
            resolve()
        });
    })
}

function moveCursor(dx, dy) {
    return new Promise((resolve) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve()
        });
    })
}

function newLine() {
    dd()
}

async function showPercentage(pres) {
    await clearLine()
    await moveCursor(0, -1)
    await clearLine()
    await moveCursor(0, -1)
    dd(pres + '%');
    dd(''.padEnd((pres) * (process.stdout.columns / 100), '-'));
}

async function buildFileHandler(filePath) {
    try {
        const fd = await fs.open(filePath, "r");
        return [fd, null];
    } catch (e) {
        if (e.code === 'ENOENT') {
            e.message = `${e.code}, Could not read file ${basename(filePath)} in ${dirname(filePath)} directory.`;
        } else {
            console.error(e);
        }
        return [null, e];
    }
}
