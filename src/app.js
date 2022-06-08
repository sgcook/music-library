const express = require('express');
const artistsRouter = require('./routes/artists');

const app = express();

app.use(express.json());

app.use('/artists', artistsRouter);

module.exports = app;