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
            }
            else {
                const coins = results.length > 0 ? results[0].Coins : null;
                resolve(coins);
            }
        });
    });
}

function chooseAd() {
    return new Promise((resolve, reject) => {
        var randomNumber = Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
        const sql = 'SELECT image_name, link FROM ads WHERE ad_num = ?';

        db.query(sql, [randomNumber], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                console.log("Query Results:", results); // Log the results of the query
                const image_name = results[0].image_name;
                const link = results[0].link;
                resolve({ image_name, link });
            }
        });
    });
}

module.exports = {
    getCoins,
    chooseAd
};