'use strict'
const { STATUS_CODES } = require('node:http');
const http = require('node:http');
const PORT = process.env.PORT || 3000;
const url = require('node:url');

const hello = `<html>
  <head>
    <style>
      body {background: #333; margin: 1.25rem}
      h1 {color: $eee; font-family: sans-serif;}
    </style>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
`;
const root = `<html>
<head>
  <style>
   body { background: #333; margin: 1.25rem }
   a { color: yellow; font-size: 2rem; font-family: sans-serif }
  </style>
</head>
<body>
  <a href='/hello'>Hello</a>
</body>
</html>
`

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(STATUS_CODES[res.statusCode] + '\r\n');
    return;
  }

  const { pathname } = url.parse(req.url);
  if (pathname === '/hello') {
    res.end(hello)
    return;
  }

  res.statusCode = 404;
  res.end(STATUS_CODES[res.statusCode + '\r\n']);
});

server.listen(PORT);
