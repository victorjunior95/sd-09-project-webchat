const express = require('express');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);

const chatRoutes = require('./routes/chatRoutes');

const { PORT } = process.env;

app.set('view engine', 'ejs');

app.use('/', chatRoutes);

http.listen(PORT, () => console.log(`Server running... | port: ${PORT}`));
