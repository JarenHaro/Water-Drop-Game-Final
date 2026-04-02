// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let goodDropTimer; // Timer for clean water drops
let badDropTimer; // Timer for polluted drops
let countdownTimer; // Will store our game countdown interval

const GAME_MODES = {
  easy: {
    duration: 45,
    goodDropSpawnMs: 700,
    badDropSpawnMs: 1100,
    dropFallSeconds: 5
  },
  medium: {
    duration: 30,
    goodDropSpawnMs: 500,
    badDropSpawnMs: 500,
    dropFallSeconds: 4
  },
  hard: {
    duration: 20,
    goodDropSpawnMs: 450,
    badDropSpawnMs: 350,
    dropFallSeconds: 3.2
  }
};

let currentModeSettings = GAME_MODES.medium;

const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");
const difficultySelect = document.getElementById("difficulty-select");
const scoreValue = document.getElementById("score");
const timeValue = document.getElementById("time");
const gameContainer = document.getElementById("game-container");
const endPopup = document.getElementById("end-popup");
const endPopupSummary = document.getElementById("end-popup-summary");
const closePopupButton = document.getElementById("close-popup-btn");

// Wait for button click to start the game
startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", () => stopGame("stopped"));
difficultySelect.addEventListener("change", updateModeSettings);

if (closePopupButton) {
  closePopupButton.addEventListener("click", closeEndPopup);
}

if (endPopup) {
  endPopup.addEventListener("click", (event) => {
    if (event.target.dataset.closePopup === "true") {
      closeEndPopup();
    }
  });
}

document.addEventListener("click", (event) => {
  if (event.target && event.target.id === "close-popup-btn") {
    closeEndPopup();
  }
});

function updateModeSettings() {
  currentModeSettings = GAME_MODES[difficultySelect.value] || GAME_MODES.medium;

  // Keep the timer preview in sync when no game is running.
  if (!gameRunning) {
    timeValue.textContent = String(currentModeSettings.duration);
  }
}

updateModeSettings();

function closeEndPopup() {
  setPopupVisibility(false);
}

function setPopupVisibility(isVisible) {
  if (!endPopup) return;

  endPopup.hidden = !isVisible;
  endPopup.setAttribute("aria-hidden", String(!isVisible));
}

function openEndPopup(stopReason, finalScore) {
  const modeLabel = difficultySelect.options[difficultySelect.selectedIndex].text;
  const reasonText = stopReason === "finished" ? "Time is up." : "Game stopped.";

  endPopupSummary.textContent = `${reasonText} Final Score: ${finalScore}. Mode: ${modeLabel}.`;
  setPopupVisibility(true);
}

function stopGame(stopReason = "stopped") {
  const finalScore = parseInt(scoreValue.textContent, 10) || 0;

  // Stop the game and reset everything
  gameRunning = false;
  clearInterval(goodDropTimer);
  clearInterval(badDropTimer);
  clearInterval(countdownTimer);
  goodDropTimer = null;
  badDropTimer = null;
  countdownTimer = null;
  startButton.hidden = false;
  stopButton.hidden = true;
  difficultySelect.disabled = false;
  scoreValue.textContent = "0";
  timeValue.textContent = String(currentModeSettings.duration);

  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }

  openEndPopup(stopReason, finalScore);
}
function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  closeEndPopup();
  
  gameRunning = true;
  updateModeSettings();
  let time = currentModeSettings.duration;
  difficultySelect.disabled = true;
  timeValue.textContent = String(time);

  countdownTimer = setInterval(() => {
    time--;
    
    if (time <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      stopGame("finished");
      return;
    }
    timeValue.textContent = String(time);
  }, 1000);
  
  startButton.hidden = true;
  stopButton.hidden = false;
  badDropTimer = setInterval(createBadDrop, currentModeSettings.badDropSpawnMs);
  goodDropTimer = setInterval(createDrop, currentModeSettings.goodDropSpawnMs);
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

  badDrop.style.animationDuration = `${currentModeSettings.dropFallSeconds}s`;

  document.getElementById("game-container").appendChild(badDrop);
  badDrop.addEventListener("click", () => {
    badDrop.remove();
    scoreValue.textContent = String(parseInt(scoreValue.textContent, 10) - 1);
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
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  drop.style.animationDuration = `${currentModeSettings.dropFallSeconds}s`;

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);
  drop.addEventListener("click", () => {
    drop.remove();
    scoreValue.textContent = String(parseInt(scoreValue.textContent, 10) + 1);
     // Remove the drop if it's clicked
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
    scoreValue.textContent = String(parseInt(scoreValue.textContent, 10) - 1);
  });
}
