import net from 'node:net'
import readline from "readline/promises";

let id;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const socket = net.createConnection({port: 3000, host: 'localhost'}, async () => {
    await ask();
})

socket.on('data', async (data) => {
    const message = data.toString();
    console.log()
    await moveCursor(0, -1);
    await clearLine();

    if (/^(id-)/g.test(message)) {
        id = message.replace('id-', '');
        console.log('your id is ', id);
    } else {
        console.log(message)
        await ask()
    }
})

socket.on('end', () => {
    console.log('Connection was ended')
})

async function ask() {
    const message = await rl.question("enter a message >");
    await moveCursor(0, -1);
    await clearLine();
    await moveCursor(0, -1);
    await clearLine();
    socket.write(`id-${id}-message-${message}`)
}

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
