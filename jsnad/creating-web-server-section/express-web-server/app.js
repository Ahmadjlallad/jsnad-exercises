'use strict'
const express = require('express');

const app = express();
const createError = require('http-errors');
const indexRoutes = require('./routes/index')
const helloRoutes = require('./routes/hello')

app.use('/', indexRoutes);
app.use('/hello', helloRoutes);

app.use((req, _, next) => {
  if (req.method !== "GET") {
    next(createError(405));
    return;
  }

  next(createError.NotFound("couldn't find your requsted route :("));
})

app.use((err, _, res) => {
  res.status(err.status || 500);
  res.send('hello')
})

module.exports = app;
