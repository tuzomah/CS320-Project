function fetchDataAndUpdatePage() {
    fetch('/risk/data')
        .then(response => response.json())
        .then(data => {
            // Update the username and coins on the page
            document.getElementById('username').textContent = data[0].username;
            document.getElementById('coins').textContent = data[0].coins;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Call the function to fetch data and update the page when the page loads
window.addEventListener('load', fetchDataAndUpdatePage);

let tog = 1
let rollingSound = new Audio('SnakesAndLadder_rpg-dice-rolling-95182.mp3')
let winSound = new Audio('SnakesAndLadder_winharpsichord-39642.mp3')
let gameStatus = 'ongoing'

rollingSound.onerror = () => console.error('Failed to load rolling sound');
winSound.onerror = () => console.error('Failed to load win sound');

function saveGameStateToBackend(player1Position, player2Position, diceRoll, currentTurn, gameStatus) {
    const gameStateData = {
        player1Position: player1Position,
        player2Position: player2Position,
        diceRoll: diceRoll,
        currentTurn: currentTurn,
        gameStatus: gameStatus
    };

    fetch('/save-game-state', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameStateData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save game state.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); // Log success message
        })
        .catch(error => {
            console.error('Error saving game state:', error);
        });
}

function fetchGameStateFromBackend() {
    fetch('/get-game-state')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch game state.');
            }
            return response.json();
        })
        .then(data => {
            updateGameStateInFronted(data);
        })
        .catch(error => {
            console.error('Error fetching game state:', error);
        });
}

window.addEventListener('load', fetchGameStateFromBackend);

function updateGameStateInFronted(data) {
    // Update player positions on the game board
    document.getElementById('player1').style.left = `${data.player1Position * 62}px`;
    document.getElementById('player2').style.left = `${data.player2Position * 62}px`;

    // Update game status display
    document.getElementById('gameStatus').innerText = `Game Status: ${data.gameStatus}`;

    // Update turn indicator
    document.getElementById('tog').innerText = `Current Turn: ${data.currentTurn}`;

    //Check if the game has ended
    if (data.gameStatus === 'finished') {
        //Display a message indicating the winner
        if (data.player1Position === 100) {
            alert("Red Won !!");
        }
        else if (data.player2Position === 100) {
            alert("Yellow Won !!");
        }
    }
}

function resetGame() {
    // Reset game state variables
    p1sum = 0;
    p2sum = 0;
    tog = 1;
    gameStatus = 'ongoing';

    // Reset player positions on the game board
    document.getElementById('player1').style.left = '0px';
    document.getElementById('player2').style.left = '0px';

    // Update UI to indicate the start of a new game
    document.getElementById('gameStatus').innerText = 'Game Status: Ongoing';
    document.getElementById('tog').innerText = "Red's Turn : ";


    document.getElementById('diceBtn').disabled = false;
}
let p1sum = 0
let p2sum = 0



function play(player, psum, correction, num) {
    let sum
    if (psum == 'p1sum') {

        p1sum = p1sum + num

        if (p1sum > 100) {
            p1sum = p1sum - num
            // sum = p1sum
        }

        if (p1sum == 1) {
            p1sum = 38
        }
        if (p1sum == 4) {
            p1sum = 14
        }
        if (p1sum == 8) {
            p1sum = 30
        }
        if (p1sum == 21) {
            p1sum = 42
        }
        if (p1sum == 28) {
            p1sum = 76
        }
        if (p1sum == 32) {
            p1sum = 10
        }
        if (p1sum == 36) {
            p1sum = 6
        }
        if (p1sum == 48) {
            p1sum = 26
        }
        if (p1sum == 50) {
            p1sum = 67
        }
        if (p1sum == 62) {
            p1sum = 18
        }
        if (p1sum == 71) {
            p1sum = 92
        }
        if (p1sum == 80) {
            p1sum = 99
        }
        if (p1sum == 88) {
            p1sum = 24
        }
        if (p1sum == 95) {
            p1sum = 56
        }
        if (p1sum == 97) {
            p1sum = 78
        }

        sum = p1sum



    }

    if (psum == 'p2sum') {

        p2sum = p2sum + num

        if (p2sum > 100) {
            p2sum = p2sum - num
            // sum = p1sum
        }


        if (p2sum == 1) {
            p2sum = 38
        }
        if (p2sum == 4) {
            p2sum = 14
        }
        if (p2sum == 8) {
            p2sum = 30
        }
        if (p2sum == 21) {
            p2sum = 42
        }
        if (p2sum == 28) {
            p2sum = 76
        }
        if (p2sum == 32) {
            p2sum = 10
        }
        if (p2sum == 36) {
            p2sum = 6
        }
        if (p2sum == 48) {
            p2sum = 26
        }
        if (p2sum == 50) {
            p2sum = 67
        }
        if (p2sum == 62) {
            p2sum = 18
        }
        if (p2sum == 71) {
            p2sum = 92
        }
        if (p2sum == 80) {
            p2sum = 99
        }
        if (p2sum == 88) {
            p2sum = 24
        }
        if (p2sum == 95) {
            p2sum = 56
        }
        if (p2sum == 97) {
            p2sum = 78
        }

        sum = p2sum



    }


    document.getElementById(`${player}`).style.transition = `linear all 1s`





    if (sum < 10) {

        document.getElementById(`${player}`).style.left = `${(sum - 1) * 62}px`
        document.getElementById(`${player}`).style.top = `${-0 * 62 - correction}px`


    }

    else if (sum == 100) {
        winSound.play()
        if (player == 'p1') {
            alert("Red Won !!")
        }
        else if (player == 'p2') {
            alert("Yellow Won !!")
        }
        gameStatus = 'finished'
        resetGame();
    }

    else {

        numarr = Array.from(String(sum))
        n1 = eval(numarr.shift())
        n2 = eval(numarr.pop())
        // console.log(n1, n2)

        if (n1 % 2 != 0) {

            if (n2 == 0) {
                document.getElementById(`${player}`).style.left = `${(9) * 62}px`
                document.getElementById(`${player}`).style.top = `${(-n1 + 1) * 62 - correction}px`
            }
            else {
                document.getElementById(`${player}`).style.left = `${(9 - (n2 - 1)) * 62}px`
                document.getElementById(`${player}`).style.top = `${-n1 * 62 - correction}px`

            }

        }
        else if (n1 % 2 == 0) {
            if (n2 == 0) {

                document.getElementById(`${player}`).style.left = `${(0) * 62}px`
                document.getElementById(`${player}`).style.top = `${(-n1 + 1) * 62 - correction}px`
            }
            else {

                document.getElementById(`${player}`).style.left = `${(n2 - 1) * 62}px`
                document.getElementById(`${player}`).style.top = `${-n1 * 62 - correction}px`
            }

        }



    }

    saveGameStateToBackend(p1sum, p2sum, num, tog, gameStatus);

}


document.getElementById("diceBtn").addEventListener("click", function () {
    rollingSound.play()
    num = Math.floor(Math.random() * (6 - 1 + 1) + 1)
    document.getElementById("dice").innerText = num


    if (tog % 2 != 0) {
        document.getElementById('tog').innerText = "Yellow's Turn : "
        play('p1', 'p1sum', 0, num)

    }

    else if (tog % 2 == 0) {
        document.getElementById('tog').innerText = "Red's Turn : "

        play('p2', 'p2sum', 55, num)

    }

    tog = tog + 1




})