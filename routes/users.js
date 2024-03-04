const express = require('express');
const router = express.Router();
const db = require('../database');
var bodyParser = require('body-parser');
var mysql = require('mysql');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/checklogin', (req, res, next) => {
  const username = req.body.usrnm;
  const password = req.body.psswrd;
  const sql = 'SELECT * FROM Logins WHERE Username = ? AND Password = ?';

  db.query(sql, [`${username}`], [`${password}`], (err, results) => {
    if (err) throw err;
    else if (results.length > 0) {
      //res.redirect('/home');
      window.location.href = 'resume.ejs'
    }
    else {
      res.send('Invalid login.');
    }
  });
});

router.get('/home', (req, res) => {
  res.render('resume');
});

router.get('/search', (req, res) => {
  const sql = 'SELECT * FROM Logins';
  db.query(sql, (err, data) => {
    if (err) throw err;
    res.render('user-list', { title: 'User List', userData: data });
  });
});

router.post('/search-results', (req, res) => {
  const userInput = req.body.userInput;

  const sql = 'SELECT * FROM Logins WHERE Username LIKE ?';
  db.query(sql, [`%${userInput}%`], (err, data) => {
    if (err) throw err;
    res.render('search-results', { title: 'Search Results', userData: data });
  });
});

router.post('/math-results', (req, res) => {
  var num1 = parseFloat(req.body.num1);
  var num2 = parseFloat(req.body.num2);
  var num3 = parseFloat(req.body.num3);
  var mult = num1 * num2 * num3;
  var sum = num1 + num2 + num3;

  var multResults = num1 + ' * ' + num2 + ' * ' + num3 + ' = ' + mult;
  var sumResults = num1 + ' + ' + num2 + ' + ' + num3 + ' = ' + sum;

  res.render('math-results', {  multResults, sumResults })
});

module.exports = router;