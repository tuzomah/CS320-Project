
// Server-side logic
// Fetch all the tables from the database
fetch('/getMultipleTablesData')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Process the fetched data
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

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
    const numbers = Array.from({length: 9}, (_, index) => index + 1);
    const shuffledNumbers = shuffleArray(numbers);
    const player1Numbers = shuffledNumbers.slice(0, 4);
    const player2Numbers = shuffledNumbers.slice(4);
    return { player1Numbers, player2Numbers };
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

async function insertPlayerNumbersByUsername(username, player1Numbers, player2Numbers) {
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

// Function to fetch area info from the database
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

// Client-side logic

const attackResults = [];
const defendResults = [];

// Function to create dice HTML element
function createDice(number, attackDefend) {
    const dotPositionMatrix = {
        1: [
            [50, 50]
        ],
        2: [
            [20, 20],
            [80, 80]
        ],
        3: [
            [20, 20],
            [50, 50],
            [80, 80]
        ],
        4: [
            [20, 20],
            [20, 80],
            [80, 20],
            [80, 80]
        ],
        5: [
            [20, 20],
            [20, 80],
            [50, 50],
            [80, 20],
            [80, 80]
        ],
        6: [
            [20, 20],
            [20, 80],
            [50, 20],
            [50, 80],
            [80, 20],
            [80, 80]
        ]
    };

    const dice = document.createElement("div");

    if (attackDefend === "attack") {
        dice.classList.add("attack-dice");
    }
    else if (attackDefend === "defend") {
        dice.classList.add("defend-dice");
    }

    for(const dotPosition of dotPositionMatrix[number]) {
        const dot = document.createElement("div");

        dot.classList.add("dice-dot");
        dot.style.setProperty("--top", dotPosition[0] + "%");
        dot.style.setProperty("--left", dotPosition[1] + "%");
        dice.appendChild(dot);
    }

    return dice;
}

function randomizeDice(diceContainer, numDice, attackDefend, resultsArray) {
    diceContainer.innerHTML = "";
    let dice;

    for(let i=0; i<numDice; i++) {
        const random = Math.floor((Math.random() * 6) + 1);
        resultsArray.push(random);

        if (attackDefend === "attack") {
            dice = createDice(random, "attack");
        }
        else if (attackDefend === "defend") {
            dice = createDice(random, "defend");
        }

        diceContainer.appendChild(dice);
    }
}

const diceContainerAttack = document.querySelector(".dice-container-attack");
const diceContainerDefend = document.querySelector(".dice-container-defend");
const btnRollDice = document.querySelector(".btn-roll-dice");

randomizeDice(diceContainerAttack, 3, "attack", attackResults);
randomizeDice(diceContainerDefend, 2, "defend", defendResults);

// Event listener for rolling dice
btnRollDice.addEventListener("click", () => {
    attackResults.length = 0;
    defendResults.length = 0;

    const interval = setInterval(() => {
        randomizeDice(diceContainerAttack, 3, "attack", attackResults);
        randomizeDice(diceContainerDefend, 2, "defend", defendResults);
    }, 50);

    setTimeout(() => {
        clearInterval(interval);
        attackResults.splice(0,27);
        attackResults.sort();
        attackResults.reverse();
        defendResults.splice(0,18);
        defendResults.sort();
        defendResults.reverse();
        console.log("Attack Results:", attackResults);
        console.log("Defend Results:", defendResults);
    }, 500);
});

// Function to start the game
async function startGame() {
    const { player1Numbers, player2Numbers } = divideNumbersBetweenPlayers();
    console.log("Player 1 numbers:", player1Numbers);
    console.log("Player 2 numbers:", player2Numbers);

    // Assuming you have a session variable for the username
    const username = req.session.username;

    // Insert player numbers into the database
    await insertPlayerNumbersByUsername(username, player1Numbers, player2Numbers);
}

// Event listener for gameboard map clicks
document.addEventListener('DOMContentLoaded', () => {
    const areas = document.querySelectorAll('map[name="workmap"] area');
    const summaryElement = document.querySelector('.summary-container .summary');

    areas.forEach(area => {
        area.addEventListener('click', function(event) {
            event.preventDefault();

            // Log the clicked element for debugging
            console.log(event.target);

            // Extract alt text from the clicked area
            const altText = event.target.alt;
            summaryElement.textContent = altText;
            summaryElement.style.display = 'block';
        });
    });
});

// Export server-side functions
module.exports = {
    startGame,
    getAreaInfoFromDatabase
};