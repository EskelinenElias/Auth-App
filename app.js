require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const mongoDB = "mongodb://localhost:27017/testdb";
//mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', function() {
  logger.info('MongoDB event open');
  logger.debug('MongoDB connected [%s]', url);

  mongoose.connection.on('connected', function() {
      logger.info('MongoDB event connected');
  });

  mongoose.connection.on('disconnected', function() {
      logger.warn('MongoDB event disconnected');
  });

  mongoose.connection.on('reconnected', function() {
      logger.info('MongoDB event reconnected');
  });

  mongoose.connection.on('error', function(err) {
      logger.error('MongoDB event error: ' + err);
  });

  // return resolve();
  return server.start();
});

const db = mongoose.connect(url, options, function(err) {
  if (err) {
      logger.error('MongoDB connection error: ' + err);
      // return reject(err);
      process.exit(1);
  }
});

/*
mongoose.Promise = Promise;
//mongoose.set('strictQuery', false);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once('open', () => {
  console.log(`Connected to MongoDB at ${mongoDB}.`)
}); */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
