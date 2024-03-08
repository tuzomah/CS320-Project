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
      res.render('loginerror');
    }
  });
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password1 = req.body.password1;
  const password2 = req.body.password2;
  const defaultCoins = 100;
  const sqlCheckPasswords = 'SELECT * FROM Logins WHERE Password = ?'
  const sqlCheckUser = 'SELECT * FROM Logins WHERE Username = ?'
  const sqlInsert = 'INSERT INTO Logins (`username`, `password`, `coins`) VALUES (?, ?, ?)';

  db.query(sqlCheckPasswords, [`${password1}`, `${password2}`], (err, results) => {
    if (password1 !== password2) {
      res.render('signuppasswords');
    }
    else {
      db.query(sqlCheckUser, [`${username}`], (err, results) => {
        if (results.length > 0) {
          res.render('signuperror');
        } else {
          db.query(sqlInsert, [`${username}`, `${password1}`, `${defaultCoins}`], (err, results) => {
            if (err) throw err;
            res.render('signupsuccess');
          });
        }
      });
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
    res.render('home');
});

router.get('/snakes', (req, res) => {
  res.render('snakes');
});

router.get('/battleship', (req, res) => {
  res.render('battleship');
});

router.get('/risk', (req, res) => {
  res.render('risk');
});

router.get('/more', (req, res) => {
  const sql = 'SELECT * FROM Logins';
  db.query(sql, (err, data) => {
    if (err) throw err;
    res.render('more', { title: 'User List', userData: data });
  });
});

router.get('/store', (req, res) => {
  res.render('store');
});

router.get('/leaderboard', (req, res) => {
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