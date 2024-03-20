const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');
const mysql = require('mysql');

function getCoins(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Coins FROM Logins WHERE Username = ?';

        db.query(sql, [username], (err, results) => {
            if (err) {
                reject(err);
            } else {
                const coins = results.length > 0 ? results[0].Coins : null;
                resolve(coins);
            }
        });
    });
}

module.exports = {
    getCoins
};