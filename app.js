var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var battleshipRouter = require('./routes/battleship');
var mysql = require('mysql');
const session = require('express-session');

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
app.use(express.static(path.join(__dirname, 'battlesnakes')));
app.use('/battlesnakes', express.static(path.join(__dirname, 'battlesnakes')));
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
app.use('/battleship', battleshipRouter);

// Define route for fetching data from multiple tables
app.get('/getMultipleTablesData', (req, res) => {
  // Perform multiple database queries
  const query1 = 'SELECT * FROM table1';
  const query2 = 'SELECT * FROM table2';

  // Execute queries in parallel
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(query1, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(query2, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    })
  ])
      .then(([data1, data2]) => {
        // Combine the results from both queries
        const combinedData = { data1, data2 };
        res.json(combinedData);
      })
      .catch(err => {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
      });
});

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
