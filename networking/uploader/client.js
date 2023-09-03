'use strict';
const net = require("node:net");
const fs = require("node:fs/promises");
const dd = console.log;
const {performance} = require("node:perf_hooks");

const testSubjects = {
    "10GB": "./test_subjects/10GB.bin",
    "5GB": "./test_subjects/5GB.bin",
    "1GB": "./test_subjects/1GB.bin",
    "gif": "./test_subjects/test.gif"
}
const fileName = testSubjects["10GB"];
const socket = net.createConnection({host: "::1", port: 3000, family: 6}, async () => {
    try {
        const fileHandle = await fs.open(fileName, "r");
        const fileReadStream = fileHandle.createReadStream();

        fileReadStream.on('data', (data) => {
            socket.write(data);
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
            dd(`error ${err.message}`, err);
            process.exit(0);
        });
    } catch (e) {
        if (e.code === 'ENOENT') {
            dd(`error: ${e.code}, make sure you have the file in test_subjects.`);
        } else {
            console.error(e);
        }
    } finally {
        socket.end();
    }
});


