const express = require('express');
const session = require('express-session');
const router = express.Router();
const path = require('path');
const db = require('../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { getCoins } = require('../util');

// Route to fetch data from the database
router.get('/data', function(req, res, next) {
    // Check if the username exists in the session
    const username = req.session.username;
    if (!username) {
        return res.status(400).json({ error: 'Username not found in session' });
    }

    // Query the database for the username and coins columns where username matches session username
    const query = "SELECT username, coins FROM Logins WHERE username = ?";

    // Execute the query with the username parameter
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error fetching data from database' });
        }
        // Send the results as JSON
        res.json(results);
    });
});

router.post('/addCoins', function(req, res) {
    const { username } = req.body;
    const sql = 'UPDATE Logins SET Coins = Coins + 10 WHERE Username = ?';

    db.query(sql, [username], (err, results) => {
        if (err) {
            reject(err);
        }
        else {
            console.log('10 coins added')
        }
    });

    res.status(200).send('Coins added successfully');
});

module.exports = router;