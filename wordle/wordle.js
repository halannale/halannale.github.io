const hintContainer = document.getElementById("word");
const instrContainer = document.getElementById("instructions");
const hintButton = document.getElementById("hint");
const hintDisplay = document.getElementById("hint-display");
const startOverButton = document.getElementById("start-over");
const letterBoxes = document.querySelectorAll(".letter-box");

let dictionary;
let currentWord = "Hello";
let currentHint;
let currentLetters = [];
let randomIndex = 0;

async function fetchDictionary() {
    startOverButton.disabled = true;
    startOverButton.innerHTML = "Loading..."

    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
        headers: {
            "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
  });

  const data = await res.json();
  dictionary = data.dictionary;
  startOverButton.disabled = false;
  startOverButton.innerHTML = "Start Over";
  randomIndex = Number.parseInt(Math.random() * dictionary.length);
  currentWord = dictionary[randomIndex];
}

fetchDictionary();

startOverButton.addEventListener("click", function() {
    randomIndex = Number.parseInt(Math.random() * dictionary.length);
    currentWord = dictionary[randomIndex];
    // Reset other aspects of game (letters and stuff)
});

hintButton.addEventListener("click", function() {
    hintDisplay.innerHTML = currentWord;
});

const wordTable = document.querySelector("#word-table");
const rows = 4;
const columns = 4;
const totalBoxes = rows * columns;

for (let i = 0; i < rows; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < columns; j++) {
        const column = document.createElement("td");
        column.innerHTML = '<input type="text" maxlength="1"/>';
        row.appendChild(column);
    }
    wordTable.appendChild(row);
}

letterBoxes.forEach(function(letterBox) {
    letterBox.addEventListener("keyup", function(event) {
        // Capture the key events and populate the letter boxes
    });
});
