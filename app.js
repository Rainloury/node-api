const request = require('request');
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require('compression');

const multer = require('multer');
const upload = multer({ dest: 'upload/' });

const createError = require('http-errors');

const logger = require('morgan');

const api = require('./routes/api');

const mongoose = require('./config/mongoose.js')
const db = mongoose();

const app = express();

if (process.env.NODE_ENV === 'test') {
    app.use(`${process.env.CONTEXT}/swagger`, express.static('swagger'));
}

app.all('*', (req, res, next) => {
    const {
        origin,
        Origin,
        referer,
        Referer
    } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'Express');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.json({ limit: '10mb', extended: false, parameterLimit: 100000 }, (req, res, next) => {
    next();
}));
app.use(express.urlencoded({ limit: '10mb', extended: false, multipart: true, parameterLimit: 100000 }, (req, res, next) => {
    next();
}));

app.use(upload.any());
app.use(cookieParser());
app.use(compression());
app.use('/static', express.static(path.resolve(__dirname, 'public')));

// register router
app.use('/api', api)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;