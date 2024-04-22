const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../../database');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { getCoins, chooseAd } = require('../../util');


// This function expects req and res as parameters
async function handleRiskRoute(req, res) {
    // Access session data from req.session
    const username = req.session.username;
    const coins = await getCoins(username);
    const {image_name, link} = await chooseAd();
    res.render('risk', {username, coins, image_name, link});


// Function to shuffle an array (using Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

// Function to divide numbers between two players
    function divideNumbersBetweenPlayers() {
        // Generate an array containing numbers 1-9
        const numbers = Array.from({length: 9}, (_, index) => index + 1);

        // Shuffle the array to randomize the order of numbers
        const shuffledNumbers = shuffleArray(numbers);

        // Divide the shuffled array into two parts
        const player1Numbers = shuffledNumbers.slice(0, 4); // Player 1 gets 4 numbers
        const player2Numbers = shuffledNumbers.slice(4);    // Player 2 gets the remaining numbers

        return {player1Numbers, player2Numbers};
    }

    function createOwnershipArray(player1Numbers, player2Numbers) {
        const ownership = Array.from({length: 9}, (_, index) => {
            if (player1Numbers.includes(index + 1)) {
                return 1; // Player 1 owns this country
            } else {
                return 2; // Player 2 owns this country
            }
        });

        return ownership;
    }

    function insertPlayerNumbersByUsername(username, player1Numbers, player2Numbers) {
        const ownership = createOwnershipArray(player1Numbers, player2Numbers);

        // Construct the SQL query to delete existing rows for the given username
        const deleteSql = `DELETE FROM risk_gamestate WHERE username = ?`;

        // Construct the SQL query to insert new data
        const insertSql = `
        INSERT INTO risk_gamestate (
            username,
            player_turn,
            north_player,
            north_troops,
            riverlands_player,
            riverlands_troops,
            vale_player,
            vale_troops,
            islands_player,
            islands_troops,
            westerlands_player,
            westerlands_troops,
            crownlands_player,
            crownlands_troops,
            stormlands_player,
            stormlands_troops,
            reach_player,
            reach_troops,
            dorne_player,
            dorne_troops
        )
        VALUES (?, 1, ?, 10, ?, 10, ?, 10, ?, 10, ?, 10, ?, 10, ?, 10, ?, 10, ?, 10)`;

        // Define the parameters for the delete query
        const deleteParams = [username];

        // Define the parameters for the insert query
        const insertParams = [
            username,
            ...ownership // Spread the ownership array
        ];

        // Execute the delete query
        return new Promise((resolve, reject) => {
            db.query(deleteSql, deleteParams, (deleteError, deleteResults) => {
                if (deleteError) {
                    console.error('Error deleting existing rows:', deleteError);
                    reject(deleteError);
                } else {
                    // If deletion is successful, execute the insert query
                    db.query(insertSql, insertParams, (insertError, insertResults) => {
                        if (insertError) {
                            console.error('Error inserting player numbers by username:', insertError);
                            reject(insertError);
                        } else {
                            console.log('Player numbers inserted successfully by username:', insertResults);
                            resolve(insertResults);
                        }
                    });
                }
            });
        });
    }

// Insert player numbers into risk_gamestate table
    const {player1Numbers, player2Numbers} = divideNumbersBetweenPlayers();
    console.log("Player 1 numbers:", player1Numbers);
    console.log("Player 2 numbers:", player2Numbers);

    insertPlayerNumbersByUsername(username, player1Numbers, player2Numbers);
}

async function getAreaInfoFromDatabase(areaId) {
    const username = 'test';

    return new Promise((resolve, reject) => {
        const sql = 'SELECT , ? FROM risk_gamestate WHERE username = ?';
        let areaTroops = "";

        if (areaId == 1) {
            areaTroops = "north_player, north_troops"
        }
        else if (areaId == 2) {
            areaTroops = "riverlands_player, riverlands_troops"
        }
        else if (areaId == 3) {
            areaTroops = "vale_player, vale_troops"
        }
        else if (areaId == 4) {
            areaTroops = "islands_player, islands_troops"
        }
        else if (areaId == 5) {
            areaTroops = "westerlands_player, westerlands_troops"
        }
        else if (areaId == 6) {
            areaTroops = "crownlands_player, crownlands_troops"
        }
        else if (areaId == 7) {
            areaTroops = "stormlands_player, stormlands_troops"
        }
        else if (areaId == 8) {
            areaTroops = "reach_player, reach_troops"
        }
        else {
            areaTroops = "dorne_player, dorne_troops"
        }

        db.query(sql, [`${areaTroops}`, `${username}`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    const areaInfo = {
                        owner: results[0][0],
                        troopCount: results[0][1]
                    };
                    resolve(areaInfo);
                } else {
                    reject(new Error('Area not found'));
                }
            }
        });
    });
}

// // Function to play the game
// function playGame(players) {
//     for (let player of players) {
//         movePlayer(player);
//     }
// }


// Test play
// const player1 = new Player("Player 1");
// const player2 = new Player("Player 2");
//
// playGame(player1, player2);



module.exports = {
    handleRiskRoute,
    getAreaInfoFromDatabase
};