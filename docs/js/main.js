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
let statusChecker;

let currentWord = '';

// DOM Elements
const wordInput = document.querySelector('#word-input');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
const startButton = document.querySelector('#start-game');

// HTML Elements for word colorings
const greenSubstr = document.getElementById('green-substr');
const redSubstr = document.getElementById('red-substr');
const whiteSubstr = document.getElementById('white-substr');

let words;
let httpRequest = new XMLHttpRequest();

// Initialize Game
function init() {

  // Grab words from an api call
  httpRequest.onreadystatechange = processResponse;
  httpRequest.open('GET', 'http://cors-anywhere.herokuapp.com/https://www.randomlists.com/data/words.json');
  httpRequest.setRequestHeader('X-Requested-With', '');
  httpRequest.send();

  isPlaying = false;
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  timeDisplay.innerHTML = time;

  // Start game button
  startButton.addEventListener('click', startGame);
  showInitialMessage();
}

function processResponse() {
    if(httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            words = JSON.parse(httpRequest.response)['data'];
        }
    }
}

function showInitialMessage() {
    // Initial Prompt when users first see page
    if(!isPlaying && time === currentLevel) {
        message.innerHTML = 'Click the button to start game';
        whiteSubstr.innerHTML = 'Ready ?';
        greenSubstr.innerHTML = '';
        redSubstr.innerHTML = '';
    }
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
    // Check game status
    statusChecker = setInterval(checkStatus, 50);
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

  let numCorrectChars = 0;
  let numInCorrectChars = 0;
  for(let i = 0; i < wordInput.value.length; i++) {
    if(wordInput.value.charAt(i) === currentWord.charAt(i)) {
        numCorrectChars++;
    } else {
        numInCorrectChars++;
    }
  }

  // Color comparison for user input and the current word
  greenSubstr.innerHTML = currentWord.slice(0, numCorrectChars);
  redSubstr.innerHTML = currentWord.slice(numCorrectChars, numCorrectChars + numInCorrectChars);
  whiteSubstr.innerHTML = currentWord.slice(numCorrectChars + numInCorrectChars, currentWord.length);

  return wordInput.value === currentWord;
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  // Avoid repeating words
  let randIndex;
  do {
    randIndex = Math.floor(Math.random() * words.length);
  } while(words[randIndex] === currentWord)

  currentWord = words[randIndex];
  // Output random word
  whiteSubstr.innerHTML = words[randIndex];
  redSubstr.innerHTML = '';
  greenSubstr.innerHTML = '';
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
  // Game over prompt
  if (!isPlaying && time === 0) {
    redSubstr.innerHTML = '';
    greenSubstr.innerHTML = '';
    whiteSubstr.innerHTML = 'Game Over!';
    message.innerHTML = 'Start again';
    wordInput.blur();
    wordInput.removeEventListener('input', inMatch);
    currentWord = '';
    clearInterval(myCountDown);
    clearInterval(statusChecker);

    // Reset to initial state 'Ready?'
    setTimeout(function(){ 
        time = currentLevel; 
        showInitialMessage();
    }, 8000);
  }
}
