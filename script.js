// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let goodDropTimer; // Timer for clean water drops
let badDropTimer; // Timer for polluted drops
let countdownTimer; // Will store our game countdown interval

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("stop-btn").addEventListener("click", stopGame);

function stopGame() {
  // Stop the game and reset everything
  gameRunning = false;
  clearInterval(goodDropTimer);
  clearInterval(badDropTimer);
  clearInterval(countdownTimer);
  goodDropTimer = null;
  badDropTimer = null;
  countdownTimer = null;
  document.getElementById("start-btn").hidden = false;
  document.getElementById("stop-btn").hidden = true;
  document.getElementById("score").textContent = "0";
  document.getElementById("time").textContent = "30";

  const gameContainer = document.getElementById("game-container");
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
}
function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;
  
  gameRunning = true;
  let time = 30; // Game duration in seconds
  countdownTimer = setInterval(() => {
    time--;
    
    if (time <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      stopGame();
      return;
    }
    document.getElementById("time").textContent = time;
  }, 1000);
  
  document.getElementById("start-btn").hidden = true;
  document.getElementById("stop-btn").hidden = false;
  // Create new drops every second (1000 milliseconds)
  badDropTimer = setInterval(createBadDrop, 500);
  goodDropTimer = setInterval(createDrop, 500);
}


function createBadDrop() {
  //Create another div element for dirty drops
  const badDrop = document.createElement("div")
  badDrop.className = "bad-drop";

  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.6 + 0.5;
  const size = initialSize * sizeMultiplier;
  badDrop.style.width = badDrop.style.height = `${size}px` ;
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  badDrop.style.left = xPosition + "px";

  badDrop.style.animationDuration = "4s";

  document.getElementById("game-container").appendChild(badDrop);
  badDrop.addEventListener("click", () => {
    badDrop.remove();
    document.getElementById("score").textContent = parseInt(document.getElementById("score").textContent) - 1;
  });

  badDrop.addEventListener("animationend", () => {
    badDrop.remove(); // Clean up drops that weren't caught
  });
}
function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);
  drop.addEventListener("click", () => {
    drop.remove();
    document.getElementById("score").textContent = parseInt(document.getElementById("score").textContent) + 1;
     // Remove the drop if it's clicked
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
    document.getElementById("score").textContent = parseInt(document.getElementById("score").textContent) - 1;
  });
}
