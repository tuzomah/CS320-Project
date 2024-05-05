const express = require('express');
const session = require('express-session');
const router = express.Router();
const path = require('path');
const db = require('../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { getCoins } = require('../util');

router.get('/userdata', async (req, res) => {
    const username = req.session.username;

    try {
        const coins = await getCoins(username);
        res.json({username, coins}); // Send the user data as JSON response
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});