const hintContainer = document.getElementById("word");
const instrContainer = document.getElementById("instructions");

let dictionary = [];
let currentWord = "hike";
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

const startOverButton = document.getElementById("start-over");
startOverButton.addEventListener("click", function() {
    randomIndex = Number.parseInt(Math.random() * dictionary.length);
    currentWord = dictionary[randomIndex];
    let board = document.getElementById("board");
    board.innerHTML = "";
    initializeBoard();
    currentLetters = [];
    randomIndex = 0;
    guessesLeft = 4;
    lettersFilled = 0;
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
        window.alert("You must complete the word first.");
        return;
    }

    for (let j = 0; j < 4; j++) {
        let colour = "";
        let tile = row.children[j];
        let letter = currentLetters[j];
        let position = -1;
        let correct = "";

        for (let l = 0; l < 4; l++) {
            correct = correct.concat("", currentWord[l]);
        }

        for (let k = 0; k < 4; k++) {
            if (currentLetters[j] === correct[k]) {
                position = k;
                break;
            }
        }
        // Letter not in word: grey
        if (position === -1) {
            colour= "grey";
        }
        // Letter in word
        else {
            // green
            if (letter === correct[j]) {
                colour = "rgb(136, 211, 136)";
            }
            // yellow
            else {
                colour = "rgb(255, 255, 137)";
                for (let k = j+1; k < 4; k++) {
                    if (letter === guess[k] || (letter ===guess[k] && guess[k] === correct[k])) {
                        colour = "grey";
                    }
                    if (letter === guess[k-2] && guess[k-2] === correct[k-2]) {
                        colour = "grey";
                    }
                }
                if (j === 3) {
                    for (let k = 0; k < 3; k++) {
                        if (letter === guess[k] && guess[k] === correct[k]) {
                            colour = "grey";
                            break;
                        }
                    }
                }
            }
            correct = correct.split(letter).join("#");
        }
        // shade box
        tile.style.backgroundColor = colour;
        tile.style.color = "black";
        if (colour === "grey") {
            tile.style.color = "white";
        }
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

// light/dark mode
function mode() {
    var element = document.body;
    element.classList.toggle("dark");
}