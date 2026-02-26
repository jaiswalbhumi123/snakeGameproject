const board = document.querySelector("#board");

// For the movement of pots
const colorsPots = ["redPot", "bluePot", "greenPot", "yellowPot"];

// For Audio
const drop = document.querySelector("#drop");
const ladder = document.querySelector("#ladder");
const snake = document.querySelector("#snake");
const diceAudio = document.querySelector("#diceAudio");
const success = document.querySelector("#success");

// For showing the winner message and ranks
const modal = document.querySelector("#modal");
const podiumContainer = document.querySelector("#podiumContainer");

// Original ladders and snakes data based on difficulty
const originalLadders = [
  [4, 16, 17, 25],
  [21, 39],
  [29, 32, 33, 48, 53, 67, 74],
  [43, 57, 64, 76],
  [63, 62, 79, 80],
  [71, 89],
];

// UPDATED: Original snakes array with only head and tail
const originalSnakes = [
  [30, 7],
  [47, 15],
  [56, 19],
  [73, 51],
  [82, 42],
  [92, 75],
  [98, 55],
];

let ladders = [];
let snakes = [];

// Dice probabilities array
const diceArray = [1, 2, 3, 4, 5, 6];
// Dice icon according to random dice value
const diceIcons = [
  "fa-dice-one",
  "fa-dice-two",
  "fa-dice-three",
  "fa-dice-four",
  "fa-dice-five",
  "fa-dice-six",
];
// Array of object for tracking user
const players = [
  {
    name: "Player 1",
    image: 1,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
    isAI: false
  },
  {
    name: "Computer",
    image: 0,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
    isAI: false
  },
  {
    name: "Player 3",
    image: 3,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
    isAI: false
  },
  {
    name: "Player 4",
    image: 4,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
    isAI: false
  },
];

// Multiple screens on the page
const screen1 = document.querySelector("#screen1");
const screen2 = document.querySelector("#screen2");
const screen3 = document.querySelector("#screen3");
const screen4 = document.querySelector("#screen4");
const screen5 = document.querySelector("#screen5");

// Tracking the current player
let currentPlayer = 1;
// tracking selected players
let playersCount = 2;
// tracking selected level
let selectedLevel = 'easy';
let gameFinished = false; // New flag to check if game is over
let gameMode = 'multiplayer';

// Create a board where pots are placed
const drawBoard = () => {
  let content = "";
  let boxCount = 101;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i % 2 === 0) boxCount--;
      content += `<div class="box" id="potBox${boxCount}"></div>`;
      if (i % 2 != 0) boxCount++;
    }
    boxCount -= 10;
  }
  board.innerHTML = content;
};

// Initial state at the beginning of the game
const initialState = () => {
  drawBoard();
  screen2.style.display = "none";
  screen3.style.display = "none";
  screen4.style.display = "none";
  screen5.style.display = "none";
};

initialState();

// Initialize ladders and snakes based on the selected level
const initializeGame = () => {
  switch (selectedLevel) {
    case 'easy':
      ladders = [

        [4, 25],
        [21, 39],
        [29, 74],
        [43, 76],
        [63, 80],
        [71, 89],
      ];
      snakes = [
        [30, 7],
        [47, 15],
        [56, 19],
        [82, 42],
        [73, 51],
        [98, 55],
        [92, 75],
      ];

      break; // Fewer snakes, more ladders

    case 'medium':
      ladders = [
        [1, 38],
        [4, 14],
        [9, 31],
        [21, 42],
        [28, 84],
        [51, 67],
        [72, 91],
        [80, 99],

      ];
      snakes = [
        [17, 7],
        [62, 18],
        [54, 34],
        [87, 36],
        [64, 60],
        [93, 73],
        [95, 75],
        [98, 79],
      ];
      break;
    case 'hard':
      ladders = [
        [2, 38],
        [4, 14],
        [9, 31],
        [21, 42],
        [28, 84],
        [37, 43],
        [51, 67],
        [72, 91],
        [79, 100],

      ];
      snakes = [
        [16, 6],
        [49, 11],
        [62, 19],
        [87, 24],
        [47, 26],
        [56, 53],
        [64, 60],
        [93, 73],
        [95, 75],
        [98, 78],

      ];
      break;
  }
};

// Select players for the game
const selectPlayers = (value) => {
  const playerSelectBoxes = document.querySelectorAll('#screen2 .selectBox');
  playerSelectBoxes.forEach(box => box.classList.remove('selected'));

  if (value === '1-ai') {
    playersCount = 2;
    gameMode = '1-ai';
    document.getElementById('1-player-box').classList.add('selected');
  } else {
    playersCount = value;
    gameMode = 'multiplayer';
    document.getElementById(`${value}-player-box`).classList.add('selected');
  }
};


// Navigate from Player Selection to Name Input
const showPlayerSelection = () => {
  screen1.style.display = 'none';
  screen2.style.display = 'flex';
};

const showPlayerNameInput = () => {
  document.getElementById("screen2").style.display = "none";
  document.getElementById("screen3").style.display = "flex";
  document.getElementById("playerCountDisplay").textContent = playersCount;

  if (gameMode === '1-ai') {
    document.getElementById("card1").style.display = "flex";
    document.getElementById("card2").style.display = "flex";
    document.getElementById("card3").style.display = "none";
    document.getElementById("card4").style.display = "none";
    document.getElementById("name2").disabled = true;
    document.getElementById("name2").value = "Computer";
    players[1].isAI = true;
    players[1].name = "Computer";
  } else {
    document.getElementById("name2").disabled = false;
    document.getElementById("name2").value = "Player2";
    players[1].isAI = false;
    hideUnwantedPlayers();
  }
};

// Navigate from Name Input to Level Selection
const showLevelSelection = () => {
  const enteredNames = [];
  for (let i = 1; i <= playersCount; i++) {
    const nameInput = document.getElementById(`name${i}`);
    let nameValue = nameInput.value.trim();

    // Check 1: Empty name
    if (nameValue === '') {
      alert(`Player ${i}'s name cannot be empty.`);
      nameInput.focus();
      return;
    }

    // Check 2: Length check (e.g., min 2, max 20 characters)
    if (nameValue.length < 2 || nameValue.length > 20) {
      alert(`Player ${i}'s name must be between 2 and 20 characters long.`);
      nameInput.focus();
      return;
    }

    // Check 3: Character check (allow only letters and spaces)
    const namePattern = /^[a-zA-Z ]+$/;
    if (!namePattern.test(nameValue)) {
      alert(`Player ${i}'s name contains invalid characters. Please use only letters and spaces.`);
      nameInput.focus();
      return;
    }

    // Check 4: Uniqueness check
    if (enteredNames.includes(nameValue)) {
      alert(`Player ${i}'s name "${nameValue}" is already taken. Please choose a unique name.`);
      nameInput.focus();
      return;
    }
    enteredNames.push(nameValue);
  }
  screen3.style.display = 'none';
  screen5.style.display = 'flex';
};

const selectLevel = (level) => {
  const levelBoxes = document.querySelectorAll('#screen5 .selectBox');
  levelBoxes.forEach(box => box.classList.remove('selected-level'));
  document.getElementById(`level-${level}`).classList.add('selected-level');
  selectedLevel = level;
};

// Back button from Name Input to Player Selection
const backToPlayerSelection = () => {
  screen3.style.display = "none";
  screen2.style.display = "flex";
  resetPlayersCount();
};

// Back button from Level Selection to Name Input
const backToNameInput = () => {
  screen5.style.display = 'none';
  screen3.style.display = 'flex';
};

// Function to change the board image based on the selected level
const setBoardImage = () => {
  const boardImage = document.getElementById('game-board-image');
  let imageName = '';

  switch (selectedLevel) {
    case 'easy':
      imageName = 'board_easy.png';
      break;
    case 'medium':
      imageName = 'board_medium.png';
      break;
    case 'hard':
      imageName = 'board_hard.png';
      break;
    default:
      imageName = 'board.png'; // A default board
      break;
  }
  boardImage.src = `images/${imageName}`;
};

// Start the game
const next = () => {
  initializeGame();
  screen5.style.display = "none";
  screen4.style.display = "flex";

  // Call the new function here to set the correct image
  setBoardImage();

  if (gameMode === '1-ai') {
    playersCount = 2; // For AI mode, there are always 2 players
    document.getElementById('playerCard3').style.display = 'none';
    document.getElementById('playerCard4').style.display = 'none';
  } else {
    hideFinalPlayers();
  }

  displayNames();
  disableDices();
  updateScoreboard(); // Initial scoreboard update
};

// Show the final ranks with enhanced styling
const showFinalRanks = () => {
  const rankedPlayers = players.filter((p, i) => i < playersCount).sort((a, b) => b.score - a.score);

  // Add a 'rank' property to each player in the ranked list
  // यह लाइन सुनिश्चित करती है कि आपके पास हर खिलाड़ी के लिए एक 'rank' है।
  rankedPlayers.forEach((player, index) => {
    player.rank = index + 1;
  });

  podiumContainer.innerHTML = ""; // Clear previous list
  rankedPlayers.forEach((player, index) => {
    const rank = index + 1;
    let rankClass = "";

    if (rank === 1) {
      rankClass = "gold";
    } else if (rank === 2) {
      rankClass = "silver";
    } else if (rank === 3) {
      rankClass = "bronze";
    }

    const podiumRank = document.createElement("div");

    // Check if rankClass is not empty before adding it
    if (rankClass) {
      podiumRank.classList.add("podium-rank", rankClass);
    } else {
      podiumRank.classList.add("podium-rank");
    }


    let playerName = player.name;
    if (rank === 1) {
      playerName += " 🏆";
    }

    podiumRank.innerHTML = `
      <div class="rank-number">${rank}</div>
      <img src="images/avatars/${player.image}.png" alt="${player.name}" />
      <div class="rank-details">
        <span class="rank-name">${playerName}</span>
        <span class="rank-score">Score: ${player.score}</span>
      </div>
    `;
    podiumContainer.appendChild(podiumRank);
  });

  document.getElementById("winnerHeading").textContent = "Game Over!";
  modal.className = "modal";

  // Prepare data to send to the backend with PascalCase keys
  const gameData = {
    // These keys now match the C# DTO property names
    GameLevel: selectedLevel,
    Players: rankedPlayers.map(player => ({
      Name: player.name,
      Score: player.score,
      Rank: player.rank, // 'Rank' को यहाँ से भेजा जा रहा है
      ProfileImage: player.image,
      IsAI: player.isAI
    }))
  };

  // Send the data to the backend
  fetch('/api/Game/finish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData)
  })
    .then(response => {
      if (!response.ok) {
        console.error('Failed to save game results to the database. Status:', response.status);
      }
      console.log('Game results sent to backend successfully!');
    })
    .catch(error => {
      console.error('Error sending game data:', error);
    });
};


// Update the scoreboard display for all players
const updateScoreboard = () => {
  for (let i = 1; i <= playersCount; i++) {
    const scoreElement = document.getElementById(`score${i}`);
    const lastRollElement = document.getElementById(`lastRoll${i}`);

    if (scoreElement && lastRollElement) {
      scoreElement.textContent = players[i - 1].score;
      lastRollElement.textContent = players[i - 1].lastDice;
    }
  }
};

// Reset the number of players in the add profile screen
const resetPlayersCount = () => {
  for (let i = 3; i < 5; i++) {
    let x = "card" + i;
    document.getElementById(x).style.display = "flex";
  }
};
// Hide unwanted Players according to the player count
const hideUnwantedPlayers = () => {
  for (let i = playersCount + 1; i < 5; i++) {
    let x = "card" + i;
    document.getElementById(x).style.display = "none";
  }
};
// Hide the final screen 4 players
const hideFinalPlayers = () => {
  for (let i = playersCount + 1; i < 5; i++) {
    let x = "playerCard" + i;
    document.getElementById(x).style.display = "none";
  }
};
// Display the name and profile icon for the users
const displayNames = () => {
  for (let i = 1; i < playersCount + 1; i++) {
    const baseURL = "images/avatars/";
    let x = "displayName" + i;
    let y = "avatar" + i;
    document.getElementById(x).innerHTML = players[i - 1].name;
    document.getElementById(y).src = baseURL + players[i - 1].image + ".png";
  }
};
// Update the name and profile icon for the users
const updateUserProfile = (playerNo, value) => {
  // Change profile to next profile in order
  const baseURL = "images/avatars/";
  if (value === 1) {
    players[playerNo - 1].image = (players[playerNo - 1].image + 1) % 8;
  } else {
    if (players[playerNo - 1].image === 0) {
      players[playerNo - 1].image = 7;
    } else {
      players[playerNo - 1].image = Math.abs(
        (players[playerNo - 1].image - 1) % 8
      );
    }
  }
  let x = "profile" + playerNo;
  document.getElementById(x).src =
    baseURL + players[playerNo - 1].image + ".png";
};
// Change the name of the player from input box
const changeName = (playerNo) => {
  let x = "name" + playerNo;
  let value = document.getElementById(x).value.trim(); // Trim whitespace
  if (value.length > 0) {
    players[playerNo - 1].name = value;
  } else {
    players[playerNo - 1].name = "Player" + playerNo;
  }
};
// Clean the board with no pots
const resetBoard = () => {
  for (let i = 0; i < 100; i++) {
    let x = i + 1;
    document.getElementById("potBox" + x).innerHTML = "";
  }
};
// Refresh the board after every dice roll
const updateBoard = () => {
  resetBoard();
  for (let i = 0; i < playersCount; i++) {
    if (players[i].score != 0) {
      let x = "potBox" + players[i].score;
      document.getElementById(
        x
      ).innerHTML += `<div class="pot ${colorsPots[i]}" ></div>`;
    }
  }
};

// Used for moving pot from one place to another
const movePot = (value, playerNumber) => {
  const playerValue = players[playerNumber - 1].score;
  let end = playerValue + value;
  if (end < 101) {
    let currentPosition = players[playerNumber - 1].score;
    let t = setInterval(() => {
      currentPosition++;
      players[playerNumber - 1].score = currentPosition;
      drop.currentTime = 0;
      drop.play();
      updateBoard();
      updateScoreboard();

      if (currentPosition === end) {
        clearInterval(t);
        const isLadder = checkLadder(players[playerNumber - 1].score, playerNumber);
        if (!isLadder) {
          checkSnake(players[playerNumber - 1].score, playerNumber);
        }

        if (players[playerNumber - 1].score === 100 && !gameFinished) {
          gameFinished = true; // Set flag so it only runs once
          setTimeout(() => {
            showFinalRanks();
            success.play();
          }, 500);
        }
      }
    }, 400);
  }
};

// For random dice value and handling turns
const rollDice = async (playerNo) => {
  if (playerNo === currentPlayer) {
    diceAudio.play();

    try {
      const response = await fetch('/api/dice/roll');
      if (!response.ok) {
        throw new Error('Failed to fetch dice roll from backend');
      }
      const diceNumber = await response.json();

      let x = "dice" + playerNo;

      // This line is safe now as currentPlayer will be within playersCount range
      document.getElementById(x).innerHTML = `<i class="diceImg fas ${diceIcons[diceNumber - 1]}"></i>`;

      players[playerNo - 1].lastDice = diceNumber;
      updateScoreboard();

      let tempCurrentPlayer = currentPlayer;
      currentPlayer = 0; // Disable dice roll during animation

      setTimeout(() => {
        movePot(diceNumber, tempCurrentPlayer);
      }, 1000);

      setTimeout(() => {
        // Corrected turn logic
        let nextPlayer = tempCurrentPlayer + 1;
        if (nextPlayer > playersCount) {
          nextPlayer = 1;
        }
        currentPlayer = nextPlayer;

        disableDices();

        if (gameMode === '1-ai' && players[currentPlayer - 1].isAI) {
          setTimeout(() => {
            rollDice(currentPlayer);
          }, 1500);
        }
      }, 2000 + diceNumber * 400);

    } catch (error) {
      console.error("Error fetching dice roll:", error);
      currentPlayer = playerNo;
    }
  }
};

// Disable Other player's dice that are not current player
const disableDices = () => {
  for (let i = 1; i < playersCount + 1; i++) {
    const diceElement = document.getElementById("dice" + i);
    if (diceElement) {
      if (currentPlayer != i) {
        diceElement.style.color = "grey";
        diceElement.style.cursor = "not-allowed";
      } else {
        diceElement.style.color = "";
        diceElement.style.cursor = "pointer";
      }
    }
  }
};

// Check the current player is on ladder or not
const checkLadder = (value, playerNumber) => {
  for (let i = 0; i < ladders.length; i++) {
    if (ladders[i][0] === value) {
      specialMove(i, playerNumber);
      return true;
    }
  }
  return false;
};
// Check the current player is on snake or not
const checkSnake = (value, playerNumber) => {
  for (let i = 0; i < snakes.length; i++) {
    if (snakes[i][0] === value) {
      // Pass the index of the snake to specialMoveSnake
      specialMoveSnake(i, playerNumber);
      return true;
    }
  }
  return false;
};
// Move the pot on the ladder
const specialMove = (value, playerNumber) => {
  let i = 0;
  var t = setInterval(() => {
    players[playerNumber - 1].score = ladders[value][i];
    ladder.play();
    updateBoard();
    updateScoreboard();
    i++;
    if (i === ladders[value].length) {
      clearInterval(t);
    }
  }, 400);
};
// UPDATED: Move the pot according to snake (instant move to the tail)
const specialMoveSnake = (value, playerNumber) => {
  snake.play();
  // Move player directly to the tail (last element of the array)
  players[playerNumber - 1].score = snakes[value][snakes[value].length - 1];
  updateBoard();
  updateScoreboard();
};