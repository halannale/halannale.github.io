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
let guessesLeft = 4;
let lettersFilled = 0;

/*
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
*/
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
        let row = document.createElement("div");
        row.className = "letter-row";
        for (let j = 0; j < 4; j++) {
            let tile = document.createElement("input-type");
            tile.className = "letter-tile";
            row.appendChild(tile);
        }
        board.appendChild(row)
    }
}

document.addEventListener("keyup", (e) => {
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
    let tile = row.children[lettersFilled -1];
    tile.textContent = "";
    tile.classList.remove("filled-tile");
    currentLetters.pop();
    lettersFilled -= 1;
}

function insertL(pressedKey) {
    if (lettersFilled === 4) {
        return;
    }
    pressedKey = pressedKey.toLowerCase();
    let row = document.getElementsByClassName("letter-row")[4-guessesLeft];
    let tile = row.children[lettersFilled];
    tile.textContent = pressedKey;
    tile.classList.add("filled-tile");
    currentLetters.push(pressedKey);
    lettersFilled += 1;
}

function checkWord() {
    let row = document.getElementsByClassName("letter-row")[4-guessesLeft];
    let guess = "";
    
    for (const i of currentLetters) {
        guess += i;
    }
    if (guess.length != 4) {
        window.alert("first complete the word");
        return;
    }
    
    for (let j = 0; j < 4; j++) {
        let colour = "";
        let tile = row.children[j];
        let letter = currentLetters[j];
        let position = 1;
        for (let k = 0; k < currentWord.length; k++) {
            if (currentWord[k] === currentLetters[k]) {
                position = k;
                break;
            }
        }
        // Letter not in word
        if (position === -1) {
            colour="grey";
        }
        // Letter in word
        else {
            if (letter === currentWord[i]) {
                colour = "green"
            }
            else {
                colour = "yellow"
            }
            currentWord[position] = "#";
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
