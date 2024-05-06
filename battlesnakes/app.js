document.addEventListener('DOMContentLoaded', () => {
  const gridDisplay = document.querySelector('.grid-display')
  const userGrid = document.querySelector('.grid-user')
  const computerGrid = document.querySelector('.grid-computer')
  const ships = document.querySelectorAll('.ship')
  const submarine = document.querySelector('.submarine-container')
  const destroyer = document.querySelector('.destroyer-container')
  const cruiser = document.querySelector('.cruiser-container')
  const carrier = document.querySelector('.carrier-container')
  const battleship = document.querySelector('.battleship-container')
  const startButton = document.querySelector('#start')
  const rulesButton = document.querySelector('#rules');
  const rotateButton = document.querySelector('#rotate')
  const textDisplay = document.querySelector('#info')
  const setupButtons = document.getElementById('setup-buttons')
  const squareUsers = []
  const squareEnemy = []
  let isHorizont = true
  let enemyScore = 0
  let rulesPopupGenerated = false;
  let isGameFinished = false
  let userScore = 0
  let currentPlayer = 'user'
  const shipLen = 10
  let allShipsPlaced = false
  let selectedShipNameWithIndex
  let moveShip
  let moveShipLength
  let rulesPopup

  rulesButton.addEventListener('click', function(event) {
    event.preventDefault();

    const buttonRect = rulesButton.getBoundingClientRect();
    const popupLeft = buttonRect.left;
    const popupTop = buttonRect.top + buttonRect.height;

    const rulesWindow = window.open('rules.html', 'Rules', `width=400,height=300,left=${popupLeft},top=${popupTop}`);


    if (rulesWindow) {  // if window open
      rulesWindow.focus();
    }
  });

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


  const shipArray = [ //array for ships
    {
      name: 'destroyer',
      directions: [
        [0, 1],
        [0, shipLen]
      ]
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2],
        [0, shipLen, shipLen*2]
      ]
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2],
        [0, shipLen, shipLen*2]
      ]
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4],
        [0, shipLen, shipLen*2, shipLen*3, shipLen*4]
      ]
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3],
        [0, shipLen, shipLen*2, shipLen*3]
      ]
    },
  ]



  createBoard(userGrid, squareUsers)
  createBoard(computerGrid, squareEnemy)
  startGame();


  function startGame() {
    generate(shipArray[0])
    generate(shipArray[1])
    generate(shipArray[2])
    generate(shipArray[3])
    generate(shipArray[4])

    startButton.addEventListener('click', () => {
      setupButtons.style.display = 'none'
      playgSingle()
      textDisplay.innerHTML = "";
      startTimer();
    })
  }

  function startTimer() {
    console.log("Timer started!"); // Add this line to check if the function is called
    textDisplay.innerHTML = "";
    let startTime = Date.now();
    timerInterval = setInterval(() => {
      let elapsedTime = Date.now() - startTime;
      let minutes = Math.floor(elapsedTime / 60000);
      //textDisplay.innerHTML = minutes;
      if (minutes >= 7) {
        clearInterval(timerInterval); // Stop the timer
        gameOvert("Battleships"); // Call endOfGame function when timer reaches 1 minute
      }
      // Update the HTML element with the timer value
      document.getElementById('rotate').innerText = `${minutes} min`;
    }, 1000); // Update timer every second
  }


  function createBoard(gridLines, spotsOnGrid) { // Board creation
    for (let i = 0; i < shipLen*shipLen; i++) {
      const square = document.createElement('div')
      square.dataset.id = i
      gridLines.appendChild(square)
      spotsOnGrid.push(square)
    }
  }


  function generate(ship) {
    let randPlacement = Math.floor(Math.random() * ship.directions.length)
    let current = ship.directions[randPlacement] //enemy locations
    if (randPlacement === 0) direction = 1
    if (randPlacement === 1) direction = 10
    let randomStart = Math.abs(Math.floor(Math.random() * squareEnemy.length - (ship.directions[0].length * direction)))

    const takenPlacement = current.some(index => squareEnemy[randomStart + index].classList.contains('taken'))
    const locatedRightEdge = current.some(index => (randomStart + index) % shipLen === shipLen - 1)
    const locatedLeftEdge = current.some(index => (randomStart + index) % shipLen === 0)

    if (!takenPlacement && !locatedRightEdge && !locatedLeftEdge) current.forEach(index => squareEnemy[randomStart + index].classList.add('taken', ship.name))

    else generate(ship)
  }

  function rotate() {
    if (isHorizont) {
      destroyer.classList.toggle('destroyer-container-vertical') //shifts ships 90 deg
      submarine.classList.toggle('submarine-container-vertical')
      cruiser.classList.toggle('cruiser-container-vertical')
      battleship.classList.toggle('battleship-container-vertical')
      carrier.classList.toggle('carrier-container-vertical')
      isHorizont = false
      return
    }
    if (!isHorizont) {
      destroyer.classList.toggle('destroyer-container-vertical')
      submarine.classList.toggle('submarine-container-vertical')
      cruiser.classList.toggle('cruiser-container-vertical')
      battleship.classList.toggle('battleship-container-vertical')
      carrier.classList.toggle('carrier-container-vertical')
      isHorizont = true
      return
    }
  }
  rotateButton.addEventListener('click', rotate)

  ships.forEach(ship => ship.addEventListener('dragstart', dragStart)) //drag ship into grid
  squareUsers.forEach(square => square.addEventListener('dragstart', dragStart))
  squareUsers.forEach(square => square.addEventListener('dragover', dragOver))
  squareUsers.forEach(square => square.addEventListener('dragenter', dragEnter))
  squareUsers.forEach(square => square.addEventListener('dragleave', dragLeave))
  squareUsers.forEach(square => square.addEventListener('drop', dragDrop))
  squareUsers.forEach(square => square.addEventListener('dragend', dragEnd))

  ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id
  }))

  function dragStart() {
    moveShip = this
    moveShipLength = this.childNodes.length
  }

  function dragOver(e) {
    e.preventDefault()
  }

  function dragEnter(e) {
    e.preventDefault()
  }

  function dragLeave() {
    // console.log('drag leave')
  }

  function dragDrop() {


    let shipNameWithLastId = moveShip.lastChild.id
    let shipClass = shipNameWithLastId.slice(0, -2)
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
    let shipLastId = lastShipIndex + parseInt(this.dataset.id)

    const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
    const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]

    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
    let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

    shipLastId = shipLastId - selectedShipIndex


    if (isHorizont && !newNotAllowedHorizontal.includes(shipLastId)) {
      for (let i=0; i < moveShipLength; i++) {
        let directionClass
        if (i === 0) directionClass = 'start'
        if (i === moveShipLength - 1) directionClass = 'end'
        squareUsers[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass)
      }
    } else if (!isHorizont && !newNotAllowedVertical.includes(shipLastId)) {
      for (let i=0; i < moveShipLength; i++) {
        let directionClass
        if (i === 0) directionClass = 'start'
        if (i === moveShipLength - 1) directionClass = 'end'
        squareUsers[parseInt(this.dataset.id) - selectedShipIndex + shipLen*i].classList.add('taken', 'vertical', directionClass, shipClass)
      }
    } else return

    gridDisplay.removeChild(moveShip)


    const allShips = document.querySelectorAll('.ship') // checks if all ships are on grid
    allShipsPlaced = true
    allShips.forEach(ship => {
      if (!ship.classList.contains('taken')) {
        allShipsPlaced = false
      }
    })

    if(allShipsPlaced) {
      textDisplay.innerHTML = "Ready to start the game."
    } else {
      textDisplay.innerHTML = "Please place all ships"
    }
  }

  function dragEnd() {
    // console.log('') will log dragDrop end
  }

  function playgSingle() { //game log
    if (isGameFinished) return
    if (currentPlayer === 'user') {
      squareEnemy.forEach(square => square.addEventListener('click', function(e) {
        shotFired = square.dataset.id
        showOutcome(square.classList)
      }))
    }
    if (currentPlayer === 'enemy') { //code stuck on this
      setTimeout(enemyGo, 2000)
    }
  }

  let submarineCount = 0
  let destroyerCount = 0
  let cruiserCount = 0
  let carrierCount = 0
  let battleshipCount = 0
  let submarineFCount = 0
  let destroyerFCount = 0
  let cruiserFCount = 0
  let carrierFCount = 0
  let battleshipFCount = 0

  function showOutcome(classList) {
    if (isGameFinished) return;
    if (!allShipsPlaced) { // wont start game til all ships are placed
      textDisplay.innerHTML = "Please place all the ships before starting the game."
      return;
    }
    const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired}']`)
    const obj = Object.values(classList)
    if (!enemySquare.classList.contains('boom') && currentPlayer === 'user' && !isGameFinished) {
      if (obj.includes('destroyer')) destroyerCount++
      if (obj.includes('submarine')) submarineCount++
      if (obj.includes('cruiser')) cruiserCount++
      if (obj.includes('battleship')) battleshipCount++
      if (obj.includes('carrier')) carrierCount++

    }
    if (obj.includes('taken')) {
      enemySquare.classList.add('boom')
    } else {
      enemySquare.classList.add('miss')
    }
    checkForWins()
    currentPlayer = 'enemy'
    playgSingle()
  }

  let enemyFDestroyerCnt = 0
  let enemyFSubmarineCnt = 0
  let enemyFCruiserCnt = 0
  let enemyFBattleshipCnt = 0
  let enemyFCarrierCnt = 0
  let enemyDestroyerCnt = 0
  let enemySubmarineCnt = 0
  let enemyCruiserCnt = 0
  let enemyBattleshipCnt = 0
  let enemyCarrierCnt = 0


  function enemyGo() {
    const pickTaken = Math.random() < 0.9;
    let square;
    if (pickTaken) {
      const takenSquares = squareUsers.filter(square => square.classList.contains('taken') && !square.classList.contains('boom'));
      if (takenSquares.length > 0) {
        square = takenSquares[Math.floor(Math.random() * takenSquares.length)];
      } else {
        square = squareUsers[Math.floor(Math.random() * squareUsers.length)];
      }
    } else {
      // random square choosen
      square = squareUsers[Math.floor(Math.random() * squareUsers.length)];
    }

    // Proceed with the chosen square
    if (!square.classList.contains('boom')) {
      const hit = square.classList.contains('taken');
      square.classList.add(hit ? 'boom' : 'miss');
      if (hit) {
        if (square.classList.contains('destroyer')) enemyDestroyerCnt++;
        if (square.classList.contains('submarine')) enemySubmarineCnt++;
        if (square.classList.contains('cruiser')) enemyCruiserCnt++;
        if (square.classList.contains('battleship')) enemyBattleshipCnt++;
        if (square.classList.contains('carrier')) enemyCarrierCnt++;
      }
      checkForWins();
    } else {
      // If the chosen square was already hit, try again
      enemyGo();
      return;
    }
    currentPlayer = 'user'; // Change to user's turn
  }


  function checkForWins() {

    if (destroyerCount === 2) {
      destroyerFCount = 10
    }
    if (submarineCount === 3) {
      submarineFCount = 10
    }
    if (cruiserCount === 3) {
      cruiserFCount = 10
    }
    if (battleshipCount === 4) {
      battleshipFCount = 10
    }
    if (carrierCount === 5) {
      carrierFCount = 10
    }
    if (enemyDestroyerCnt === 2) {
      enemyFDestroyerCnt = 10
    }
    if (enemySubmarineCnt === 3) {
      enemyFSubmarineCnt = 10
    }
    if (enemyCruiserCnt === 3) {
      enemyFCruiserCnt = 10
    }
    if (enemyBattleshipCnt === 4) {
      enemyFBattleshipCnt = 10
    }
    if (enemyCarrierCnt === 5) {
      enemyFCarrierCnt = 10
    }

    const totalShipCount = (destroyerFCount + submarineFCount + cruiserFCount + battleshipFCount + carrierFCount)/10;
    const totalShipCountElement = document.getElementById("total-ship-count");
    totalShipCountElement.textContent = totalShipCount.toString();


    const enemyTotalShipCount = (enemyFDestroyerCnt + enemyFSubmarineCnt + enemyFCruiserCnt + enemyFBattleshipCnt + enemyFCarrierCnt) / 10;
    const enemyTotalShipCountElement = document.getElementById("enemy-total-ship-count");
    enemyTotalShipCountElement.textContent = enemyTotalShipCount.toString();



    if ((destroyerFCount + submarineFCount + cruiserFCount + battleshipFCount + carrierFCount) === 50) {
      gameOver("User");
      // user wins
    }
    if ((enemyFDestroyerCnt + enemyFSubmarineCnt + enemyFCruiserCnt + enemyFBattleshipCnt + enemyFCarrierCnt) === 50) {
      gameOver("Enemy");
      // enemy wins
    }

  }

  function gameOver(winner) {
    isGameFinished = true
    startButton.removeEventListener('click', playgSingle)
    textDisplay.innerHTML = `${winner} wins! Game over.`;
  }

  function gameOvert(winner) {
    isGameFinished = true
    startButton.removeEventListener('click', playgSingle)

    textDisplay.innerHTML = `${winner} lost at sea! Game over.`;

  }


})