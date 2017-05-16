// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('./server/database/db');
const fileUpload = require('express-fileupload');

const passport = require('passport');


// Get our API routes
const users_api = require('./server/_routes/userRoute');

const app = express();

app.use(bodyParser.json());
app.use(require('skipper')());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
require('./server/config/passport')(passport);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use('/api/user', users_api);

const port = process.env.PORT || '3002';
app.set('port', port);
const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));