const hintContainer = document.getElementById("word");
const instrContainer = document.getElementById("instructions");
const hintButton = document.getElementById("hint");
const hintDisplay = document.getElementById("hint-display");
const startOverButton = document.getElementById("start-over");

let dictionary = [];
let currentWord = "hell";
let currentHint;
let currentLetters = [];
let randomIndex = 0;
let guessLeft = 4;
let lettersFilled = 0;

async function fetchDictionary() {
    startOverButton.disabled = true;
    startOverButton.innerHTML = "Loading..."

    try {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
        headers: {
            "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
  });

  const data = await res.json();
  dictionary = data.dictionary;
} catch (error) {
    console.error(error);
}
  startOverButton.disabled = false;
  startOverButton.innerHTML = "Start Over";
  randomIndex = Number.parseInt(Math.random() * dictionary.length);
  currentWord = dictionary[randomIndex];
}

fetchDictionary();
initializeBoard();

startOverButton.addEventListener("click", function() {
    randomIndex = Number.parseInt(Math.random() * dictionary.length);
    currentWord = dictionary[randomIndex];
    let board = document.getElementById("board");
    board.innerHTML = "";
    initializeBoard();
    currentLetters = [];
    randomIndex = 0;
    guessLeft = 4;
    lettersFilled = 0;
});

hintButton.addEventListener("click", function() {
    hintDisplay.innerHTML = currentWord.hint;
});

function initializeBoard() {
    let board = document.getElementById("board");
    for (let i = 0; i < 4; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < 4; j++) {
            let tile = document.createElement("div")
            tile.className = "letter-tile"
            row.appendChild(tile)
        }
        board.appendChild(row)
    }
}

update.addEventListener("keyup", (e) {
    let pressedKey = String(e.key)
    
    switch (pressedKey) {
        case "Backspace":
            if (lettersFilled !== 0) {
                deleteL();
            }
            break;
        case "Enter":
            checkWord();
            break;
        default:
            insertL(pressedKey);
    }
});

function deleteL() {
    let row = document.getElementsByClassName("letter-row")[4-guessesLeft];
    let tile = row.children[nextLetter -1];
    tile.textContent = "";
    tile.classList.remove("filled-box");
    currentLetters.pop();
    lettersFilled -= 1;
}

function insertL() {
    if (lettersFilled === 4) {
        return;
    }
    pressedKey = pressedKey.toLowerCase();
    let row = document.getElementsByClassName("letter-row")[4-guessesLeft];
    let tile = row.children[lettersFilled];
    tile.textContent = pressedKey;
    tile.classList.add("filled-box");
    currentLetters.push(pressedKey);
    lettersFilled += 1;
}

function checkWord() {
    let row = document.getElementsByClassName("letter-row")[4-guessesLeft];
    let guess = "";
    
    for (const i of currentLetters) {
        guess += i;
    }
    if (guessString.length != 4) {
        window.alert("first complete the word");
    }
    
    for (let i = 0; i < 4; i++) {
        let colour = "";
        let tile = row.children[i];
        let letter = currentLetters[i];
        let position = 1;
        for (let j = 0; j< currentWord.length; j++) {
            if (currentWord[j] === currentLetters[j]) {
                position = j;
                break;
            }
        }
        // Letter not in word
        if (position === -1) {
            colour="grey";
        }
        // Letter in word
        else {
            if (currentLetters[i] === currentWord[i]) {
                colour = "green"
            }
            else {
                colour = "yellow"
            }
        }
        // shade box
        tile.style.backgroundColor = colour;
    }

    if (guess === currentWord) {
        // Congratulations window idk how yet
        window.alert("You guess right!")
        return
    }
    else {
        guessesLeft -= 1;
        currentLetters = [];
        lettersFilled = 0;
    }

    if (guessesLeft === 0) {
        // do the losing window idk how yet
        window.alert("You've run out of guesses")
    }
}
