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

function Country(name, number, house, owner) {
    this.name = name;
    this.number = number;
    this.house = house;
    this.owner = owner;
    this.borders = [];

    this.addBorder = function(borderCountry) {
        this.borders.push(borderCountry);
    }
}

// Function to shuffle an array (using Fisher-Yates algorithm)
function createOwnershipArray() {
    const array = [1, 1, 1, 1, 2, 2, 2, 2, 2]; // Define the specific array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j indices
    }
    return array;
}

const ownershipArray = createOwnershipArray();
console.log(ownershipArray);
const North = new Country("North", 1, "Stark", ownershipArray[0])
const Riverlands = new Country("Riverlands", 2, "Tully", ownershipArray[1])
const Vale = new Country("Vale", 3, "Arryn", ownershipArray[2])
const Islands = new Country("Islands", 4, "Greyjoy", ownershipArray[3])
const Westerlands = new Country("Westerlands", 5, "Lannister", ownershipArray[4])
const Crownlands = new Country("Crownlands", 6, "Targaryen", ownershipArray[5])
const Stormlands = new Country("Stormlands", 7, "Baratheon", ownershipArray[6])
const Reach = new Country("Reach", 8, "Tyrell", ownershipArray[7])
const Dorne = new Country("Dorne", 9, "Martell", ownershipArray[8])

North.addBorder(Riverlands);
North.addBorder(Vale);
North.addBorder(Islands);
Riverlands.addBorder(North);
Riverlands.addBorder(Vale);
Riverlands.addBorder(Islands);
Riverlands.addBorder(Westerlands);
Riverlands.addBorder(Crownlands);
Riverlands.addBorder(Reach);
Vale.addBorder(North);
Vale.addBorder(Riverlands);
Islands.addBorder(North);
Islands.addBorder(Riverlands);
Islands.addBorder(Westerlands);
Westerlands.addBorder(Riverlands);
Westerlands.addBorder(Islands);
Westerlands.addBorder(Reach);
Crownlands.addBorder(Riverlands);
Crownlands.addBorder(Stormlands);
Crownlands.addBorder(Reach);
Stormlands.addBorder(Crownlands);
Stormlands.addBorder(Reach);
Stormlands.addBorder(Dorne);
Reach.addBorder(Riverlands);
Reach.addBorder(Westerlands);
Reach.addBorder(Crownlands);
Reach.addBorder(Stormlands);
Reach.addBorder(Dorne);
Dorne.addBorder(Stormlands);
Dorne.addBorder(Reach);

// Client-side logic

function getCountryById(id) {
    switch(id) {
        case "1":
            return North;
        case "2":
            return Riverlands;
        case "3":
            return Vale;
        case "4":
            return Islands;
        case "5":
            return Westerlands;
        case "6":
            return Crownlands;
        case "7":
            return Stormlands;
        case "8":
            return Reach;
        case "9":
            return Dorne;
        default:
            return null;
    }
}

// Function to update the list of countries and their owners in the owners-container
function updateOwnersContainer() {
    const ownersContainer = document.querySelector('.owners-container');

    // Log to check if ownersContainer is correctly selected
    console.log("Owners Container:", ownersContainer);

    ownersContainer.innerHTML = ''; // Clear the container before updating

    // Iterate over each country
    for (let i = 1; i <= 9; i++) {
        const country = getCountryById(i);
        const countryElement = document.createElement('div');
        countryElement.textContent = `${country.name}: Player ${country.owner}`;
        ownersContainer.appendChild(countryElement);
    }

    // Log ownershipArray to check if it contains the correct data
    console.log("Ownership Array:", ownershipArray);
}



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

randomizeDice(diceContainerAttack, 3, "attack", attackResults);
randomizeDice(diceContainerDefend, 2, "defend", defendResults);

const togElement = document.getElementById('tog');
let currentPlayer = 1;

function updateTurnIndicator() {
    if (currentPlayer === 1) {
        togElement.textContent = "Player 1's Turn";
    } else {
        togElement.textContent = "Player 2's Turn";
    }
}

// Function to handle Player 1's turn
function player1Turn() {
    // Update the turn indicator
    togElement.textContent = "Player 1's Turn";
    // Set currentPlayer to 1
    currentPlayer = 1;
    // Implement logic for Player 1's turn here
    handleTurn(document.querySelector('.summary')); // Pass summary directly
}

// Function to handle Player 2's turn
function player2Turn() {
    // Update the turn indicator
    togElement.textContent = "Player 2's Turn";
    // Set currentPlayer to 2
    currentPlayer = 2;
    // Implement logic for Player 2's turn here
    handleTurn(document.querySelector('.summary')); // Pass summary directly
}

let attackFrom = null;
let attackTo = null;

// Variable to track if an attack has been initiated
let attackInitiated = false;

// Function to handle turn logic for both players
function handleTurn(summaryElement) {
    const areas = document.querySelectorAll('map[name="workmap"] area');

    // Define the click event handler function
    function handleClick(event) {
        event.preventDefault();
        const altText = event.target.alt;
        const areaId = event.target.id;
        const owner = ownershipArray[areaId - 1];
        const country = getCountryById(areaId);

        // Check if summaryElement is defined
        if (!summaryElement) {
            console.error("summaryElement is not defined");
            return;
        }

        // Update the summary element with alt text and owner
        summaryElement.innerHTML = `${altText}<br>Home of House ${country.house}<br>Owner: Player ${owner}<br>`;
        summaryElement.style.display = 'block';

        if (owner === currentPlayer) {
            attackFrom = country;
            addAttackFromButton();
        } else if (attackFrom && owner !== currentPlayer && attackFrom.borders.includes(country)) {
            attackTo = country;
            addAttackButton();
            // Do not change the player's turn here
        } else if (attackFrom && owner !== currentPlayer && !attackFrom.borders.includes(country)) {
            summaryElement.innerHTML += `<br>Not a valid target for attack. Select a valid country to attack.`;
        }
    }

    // Attach click event listeners to each area
    areas.forEach((area) => {
        area.addEventListener('click', handleClick);
    });

    function addAttackFromButton() {
        const attackFromButton = document.createElement('button');
        attackFromButton.textContent = 'Attack From';
        attackFromButton.onclick = () => initiateAttackFrom(summaryElement); // Pass summaryElement
        summaryElement.appendChild(attackFromButton); // Append to summary directly
    }

    function addAttackButton() {
        const attackButton = document.createElement('button');
        attackButton.textContent = 'Attack';
        attackButton.onclick = () => initiateAttack(attackFrom, attackTo, summaryElement);
        summaryElement.appendChild(attackButton); // Append to summary directly
    }
}

function initiateAttackFrom(summaryElement) { // Receive summaryElement as an argument
    // Store the selected area as the area to attack from
    attackTo = null; // Reset attackTo in case it was set before
    summaryElement.innerHTML = 'Select the area to attack';
}

// Function to initiate an attack between areas
function initiateAttack(areaFrom, areaTo, summaryElement) {
    attackResults.length = 0;
    defendResults.length = 0;

    const interval = setInterval(() => {
        randomizeDice(diceContainerAttack, 3, "attack", attackResults);
        randomizeDice(diceContainerDefend, 2, "defend", defendResults);
    }, 50);

    setTimeout(() => {
        clearInterval(interval);

        // Slice the arrays to keep only the final 3 numbers for attack and 2 numbers for defend
        let finalAttackResults = attackResults.slice(-3);
        let finalDefendResults = defendResults.slice(-2);

        // Sort the arrays
        finalAttackResults.sort((a, b) => b - a);
        finalDefendResults.sort((a, b) => b - a);

        console.log("Attack Results:", finalAttackResults);
        console.log("Defend Results:", finalDefendResults);

        // Compare dice results
        if (finalAttackResults[0] > finalDefendResults[0] && finalAttackResults[1] > finalDefendResults[1]) {
            // Update owner of defender
            areaTo.owner = currentPlayer;
            // Update the owner property of the country object
            ownershipArray[areaTo.number - 1] = currentPlayer;
            console.log("New Ownership Array:", ownershipArray); // Add this line
            summaryElement.innerHTML = `Victory!<br>${areaTo.name} has been conquered by ${areaFrom.name}`;
            updateOwnersContainer();
            checkGameEnd()
        } else if (finalAttackResults[0] === finalDefendResults[0] && finalAttackResults[1] === finalDefendResults[1]) {
            // Ties
            summaryElement.innerHTML = `Draw!<br>${areaTo.name} has successfully defended itself`;
        } else {
            // Defender successfully defended
            summaryElement.innerHTML = `Failure!<br>${areaTo.name} has successfully defended itself`;
        }

        // Change player's turn only if attack was initiated
        if (attackInitiated) {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateTurnIndicator();
        }

        // Update dice display here
        randomizeDice(diceContainerAttack, 3, "attack", attackResults);
        randomizeDice(diceContainerDefend, 2, "defend", defendResults);

    }, 500);

    // Attack initiated
    attackInitiated = true;
}


// Initial turn indicator
document.getElementById('tog').textContent = "Player 1's Turn";

player1Turn();


function sumArray(arr) {
    return arr.reduce((total, num) => total + num, 0);
}

function addCoinsToUsername(username) {
    fetch('/addCoins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add coins');
            }
            // Success
            console.log('Coins added successfully');
        })
        .catch(error => {
            console.error('Error adding coins:', error);
        });
}

// Function to check if the game has ended
function checkGameEnd(username) {
    if (sumArray(ownershipArray) === 9) {
        addCoinsToUsername(username);
        alert(`Player 1 Wins!!!`);
        return true;
    } else if (sumArray(ownershipArray) === 18) {
        addCoinsToUsername(username);
        alert(`Player 2 Wins!!!`);
        return true;
    }
    return false;
}