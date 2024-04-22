var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var riskRouter = require('./routes/risk');
var snakesRouter = require('./routes/snakes');
var battleshipRouter = require('./routes/battleship');
var mysql = require('mysql');
const session = require('express-session');
const handleRiskRoute = require('./public/javascripts/riskLogic');

var app = express();
var port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your_unique_secret_key_here', // Change this to a secure key
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.use('/', usersRouter);
app.use('/risk', riskRouter);
app.use('/snakes', snakesRouter);
app.use('/battleship', battleshipRouter);

// Error handling middleware
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;