var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

// Ensure directories exist
const dirs = [
  "storage/uploads/videos",
  "storage/uploads/thumbnails",
  "storage/uploads/images",
  "storage/uploads/audios",
];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

var indexRouter = require('./routes/index');
var authRouter = require("./routes/auth");
var mediaRouter = require("./routes/media");

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

module.exports = app;
