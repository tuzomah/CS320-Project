const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { getCoins } = require('../util');

router.get('/', async (req, res) => {
    const username = req.session.username;
    const coins = await getCoins(username);
    res.render('snakes', { username, coins });
});;

module.exports = router;