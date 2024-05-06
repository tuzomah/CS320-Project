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

router.post('/save-game-state', (req, res) => {
    const { player1Position, player2Position, diceRoll, currentTurn, gameStatus } = req.body;

    const sql = `INSERT INTO snakesnladdersGameState (player1_position, player2_position, dice_roll, current_turn, game_status) 
    VALUES (?, ?, ?, ?, ?)`;
    const values = [player1Position, player2Position, diceRoll, currentTurn, gameStatus];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error saving game state:', err);
            res.status(500).json({ error: 'Failed to save game state.' });
            return;
        }
        console.log('Game state saved successfully.');
        res.status(201).json({ message: 'Game state saved successfully.' });
    });
});

router.get('/get-game-state', (req, res) => {
    const sql = `SELECT * FROM snakesnladdersGameState ORDER BY id DESC 1`;

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving game state:', err);
            res.status(500).json({ error: 'Failed to retrieve game state.'});
            return;
        }

        if(result.length === 0) {
            res.status(404).json({error: 'No game state found.'});
        }

        const gameState = result[0];
        res.status(200).json({
            player1Position: gameState.player1_position,
            player2Position: gameState.player2_position,
            diceRoll: gameState.dice_roll,
            currentTurn: gameState.current_turn,
            gameStatus: gameState.game_status
        });
    });
});