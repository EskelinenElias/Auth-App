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

mongoose.connection.once('open', function() {
  console.log('MongoDB connection is open.');
});

mongoose.connection.on('connected', function() {
  console.log('Successfully connected to MongoDB.');
});

mongoose.connection.on('disconnected', function() {
  console.log('Disconnected from MongoDB.');
});

mongoose.connection.on('reconnected', function() {
  console.log('Reconnected to MongoDB.');
});

mongoose.connection.on('error', function(err) {
  console.error('MongoDB error: ' + err);
});

// Connect to mongoDB
const address = "mongodb://127.0.0.1:27017/testdb";
console.log(`Connecting to MongoDB at ${address}...`)
const db = mongoose.connect(address, function(err) {
  if (err) {
      console.error("Connection failed.");
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
