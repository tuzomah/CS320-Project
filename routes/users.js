const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { getCoins } = require('../util');

router.get('/', (req, res) => {
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
      // Authentication successful
      // Store the username in the session
      req.session.username = username;
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

router.get('/home', async (req, res) => {
  const username = req.session.username;
  const coins = await getCoins(username);
  res.render('home', { username, coins });
});

router.get('/leaderboard', (req, res) => {
  const username = req.session.username;
  const sql = 'SELECT Coins FROM Logins WHERE Username = ?';

  db.query(sql, [`${username}`], (err, results) => {
    const coins = results[0].Coins;
    const sqlTable = 'SELECT * FROM Logins';
    db.query(sqlTable, (err, data) => {
      if (err) throw err;
      res.render('leaderboard', { username: username, coins: coins,title: 'User List', userData: data});
    });
  });
});

router.get('/credits', (req, res) => {
  const username = req.session.username;
  const sql = 'SELECT Coins FROM Logins WHERE Username = ?';

  db.query(sql, [`${username}`], (err, results) => {
    const coins = results[0].Coins;
    console.log('Coins:', coins); // Log the value of coins
    res.render('credits', { username: username, coins: coins });
  });
});

router.get('/testsession', (req, res) => {
  if (req.session && req.session.username) {
    // Session exists and contains a username
    const username = req.session.username;
    // Proceed with handling the request
    res.send(`Hello, ${username}!`);
  } else {
    // No session established or username not present in the session
    // Handle this case, such as redirecting to login page or displaying an error message
    res.send('You are not logged in.');
  }
});

module.exports = router;