import express from 'express';

const app = express();

app.get('/', function(req, res) {
  res.send('Hello');
});

module.exports = app;