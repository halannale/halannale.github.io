const hintContainer = document.getElementById("word");
const instrContainer = document.getElementById("instructions");
const hintButton = document.getElementById("hint");
const hintDisplay = document.getElementById("hint-display");
const startOverButton = document.getElementById("start-over");

let dictionary = [];
let currentWord = "hello";
let currentHint;
let currentLetters = [];
let randomIndex = 0;

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
    // more resetting stuff
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