const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { getCoins, chooseAd } = require('../util');

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