const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { getCoins, chooseAd } = require('../util');
const { handleRiskRoute, getAreaInfoFromDatabase } = require('../public/javascripts/riskLogic');

router.get('/', async (req, res) => {
    await handleRiskRoute(req, res);
});

module.exports = router;