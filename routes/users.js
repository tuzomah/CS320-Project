const express = require('express');
const router = express.Router();
const db = require('../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');

router.get('/', (req, res) => {
  const sessionData = req.session;
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const username = req.body.usrnm;
  const password = req.body.psswrd;
  const sql = 'SELECT * FROM Logins WHERE Username = ? AND Password = ?';

  db.query(sql, [`${username}`, `${password}`], (err, results) => {
    if (results.length > 0) {
      res.redirect('/home');
    }
    else {
      res.redirect('/login');
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
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

module.exports = router;
