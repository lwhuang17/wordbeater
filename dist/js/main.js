window.addEventListener('load', init);

// Globals

// Available Levels
const levels = {
  easy: 5,
  medium: 3,
  hard: 1
};

// To change level
const currentLevel = levels.easy;

let time = currentLevel;
let score = 0;
let isPlaying;

let myCountDown; 
let previousWord = '';

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
const startButton = document.querySelector('#start-game');

const words = [
  'hat',
  'river',
  'lucky',
  'statue',
  'generate',
  'stubborn',
  'cocktail',
  'runaway',
  'joke',
  'developer',
  'establishment',
  'hero',
  'javascript',
  'nutrition',
  'revolver',
  'echo',
  'siblings',
  'investigate',
  'horrendous',
  'symptom',
  'laughter',
  'magic',
  'master',
  'space',
  'definition'
];

// Initialize Game
function init() {
  isPlaying = false;
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  timeDisplay.innerHTML = time;

  // Start game button
  startButton.addEventListener('click', startGame);
  // Check game status
  setInterval(checkStatus, 50);
}


// Pressing start button
function startGame() {
    isPlaying = true;
    wordInput.addEventListener('input', inMatch);
    wordInput.focus();
    score = 0;
    scoreDisplay.innerHTML = score;
    wordInput.value = '';
    message.innerHTML = '';
    time = levels.easy;
    showWord(words);
    // Call countdown every second
    myCountDown = setInterval(countdown, 1000);
}

// Start match
function inMatch() {
  if (matchWords()) {
    time = currentLevel + 1;
    showWord(words);
    wordInput.value = '';
    score++;
  }

  scoreDisplay.innerHTML = score;
}

// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  // Avoid repeating words
  let randIndex;
  do {
    randIndex = Math.floor(Math.random() * words.length);
  } while(words[randIndex] === previousWord)

  previousWord = words[randIndex];
  // Output random word
  currentWord.innerHTML = words[randIndex];
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = time;
}

// Check game status
function checkStatus() {
  // Initial Prompt when users first see page
  if(!isPlaying && time === currentLevel) {
    currentWord.innerHTML = 'Ready ?'
    message.innerHTML = 'Click the button to start game'
  }

  // Game over prompt
  if (!isPlaying && time === 0) {
    currentWord.innerHTML = 'Game Over!'
    message.innerHTML = 'Start again';
    wordInput.blur();
    wordInput.removeEventListener('input', inMatch);
    previousWord = '';
    clearInterval(myCountDown);

    setTimeout(function(){ 
        time = currentLevel; 
    }, 8000);
  }
}
