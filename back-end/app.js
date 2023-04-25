const express = require('express');
const cors = require('cors');
const {logRequest} = require('#src/middlewares/logger');
const errorHandler = require("#src/middlewares/error");

const app = express();

require('dotenv').config();

global.__appDir = __dirname;
global.__isDev = process.env.NODE_ENV === 'development';

const baseUrl = '/api';
app.use(cors());
app.use(errorHandler);

app.use(`${baseUrl}/v1`, logRequest, require('#src/routes/main'));

const port = process.env.PORT || 3005;
const server = app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
    console.log(process.env.NODE_ENV);
    console.log(process.platform);
    console.log(global.__appDir);
});


