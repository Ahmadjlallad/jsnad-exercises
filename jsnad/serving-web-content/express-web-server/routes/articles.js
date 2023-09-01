const express = require('express')
const router = express.Router();
const hnLatestStream = require('hn-latest-stream');
const NodeStream = require('stream')
const hbs = require('hbs');
const fs = require("fs/promises");

router.get('/', (req, res, next) => {
    const {amount = 10, type = 'html'} = req.query;
    if (type === 'html') res.type('text/html')
    if (type === 'json') res.type('application/json')

    /**
     * @type {ReadableStream}
     */
    const stream = hnLatestStream(amount, type);
    let chunkCount = 0;
    stream.on('data', (chunk) => {
        if (chunkCount === 1) {
            stream.destroy(new Error('foo error'))
            return;
        }
        if (!res.write(chunk)) {
            stream.pause();
            return;
        }
        ++chunkCount;
    })

    stream.on('end', (err) => {
        if (!res.closed) {
            res.end()
        }
    })
    res.on('drain', () => {
        stream.resume();
    })
    // stream.pipe(res, {end: false});
    // NodeStream.finished(stream, {}, (err) => {

    //     if (err) {
    //         next(err)
    //         return
    //     }
    //     res.end()
    // })
    stream.on('error', async (err) => {
        const errorContent = await fs.readFile(req.app.locals.settings.views + '/error.hbs');
        const style = `<style>body {background: #333; margin: 1.25rem;}h1 { color: #EEE;font-family: sans-serif;}</style>`
        const errorPage = hbs.compile(style + errorContent.toString())({
            message: err.message,
            error: {
                status: 500,
                stack: err.stack
            }
        })

        return res.end(Buffer.from(errorPage))
    })
})

module.exports = router;

