'use strict'
const http = require('http')
const data = require('./data')

const app = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(http.STATUS_CODES[res.statusCode])
    return;
  }

  if (url.pathname === '/') {
    const resData = await data();
    res.end(resData)
    return;
  }

  res.statusCode = 404;
  res.end(http.STATUS_CODES[res.statusCode])
})

module.exports = app;
