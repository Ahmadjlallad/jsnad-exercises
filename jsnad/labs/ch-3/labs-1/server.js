const server = require('./app')
const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
  console.log(`app is running on http://127.0.0.1:3000`)
})
