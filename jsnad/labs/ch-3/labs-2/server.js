const http = require('node:http');
const PORT = process.env.PORT ?? 3000;

const server = http.createServer((req, res) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end(http.STATUS_CODES[res.statusCode]);
        return;
    }

    if (req.url !== '/') {
        res.statusCode = 404;
        res.end(http.STATUS_CODES[res.statusCode]);
        return;
    }

    res.end('hi')
})

server.listen(PORT, () => {
    console.log(`running on http://127.0.0.1:${PORT}`)
})
