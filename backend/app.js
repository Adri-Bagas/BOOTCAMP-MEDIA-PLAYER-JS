var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require("./routes/auth");
var mediaRouter = require("./routes/media");
var storageRouter = require("./routes/storage");

var checkCookiesMiddleware = require("./middleware/check-cookies");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/media", checkCookiesMiddleware, mediaRouter);
app.use("/api/v1/storage", checkCookiesMiddleware, storageRouter);

module.exports = app;
