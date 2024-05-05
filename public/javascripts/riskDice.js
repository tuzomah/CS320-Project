const attackResults = [];
const defendResults = [];

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

import { startGame } from './riskLogic.js';

// Call getSessionUsername() to set the sessionUsername variable

// Update the content of the placeholder element with the fetched username
window.onload = function() {
    startGame();
};

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