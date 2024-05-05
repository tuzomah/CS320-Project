const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { getCoins, chooseAd } = require('../util');

router.get('/', async (req, res) => {
    const username = req.session.username;
    const coins = await getCoins(username);
    const { image_name, link } = await chooseAd();
    res.render('battleship', { username, coins, image_name, link });
});;

module.exports = router;