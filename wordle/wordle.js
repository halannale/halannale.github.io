const startOverButton = document.getElementById("start-over");

let dictionary = [];
let currentWord;
let currentLetters = [];
let randomIndex = 0;
let guessesLeft = 4;
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
    currentLetters = [];
    guessesLeft = 4;
    lettersFilled = 0;
    randomIndex = Number.parseInt(Math.random() * dictionary.length);
    currentWord = dictionary[randomIndex];
    let board = document.getElementById("board");
    board.innerHTML = "";
    initializeBoard();
    let bottom = document.getElementById("bottom-display");
    bottom.innerHTML = "";
    bottom.style.display = "none";
    bottom.style.color = "black";
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
    if (pressedKey=== "Backspace" && lettersFilled !== 0) {
        deleteL();
        return;
    }
    if (pressedKey === "Enter") {
        checkWord();
        return;
    }
    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length >1) {
        return;
    }
    else {
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
            correct = correct.concat("", currentWord.word[l].toLowerCase());
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

    if (guess === currentWord.word.toLowerCase()) {
        let board = document.getElementById("board");
        board.innerHTML = "";
        const img = new Image(400,300);
        img.src = "https://res.cloudinary.com/mkf/image/upload/v1675467141/ENSF-381/labs/congrats_fkscna.gif";
        board.appendChild(img);
        let congrats = document.getElementById("bottom-display");
        let message = "You guessed the word";
        message = message.concat(" ", currentWord.word);
        message = message.concat(" ", "correctly!");
        congrats.innerHTML = message;
        congrats.style.backgroundColor = "rgb(235, 230, 230)";
        var x = document.getElementById("bottom-display");
        x.style.display = "block";
        return;
    }
    else {
        guessesLeft -= 1;
        currentLetters = [];
        lettersFilled = 0;
    }

    if (guessesLeft === 0) {
        let lostDisplay = document.getElementById("bottom-display");
        let message = "You missed the word";
        message = message.concat(" ", currentWord.word);
        message = message.concat(" ", "and lost!");
        lostDisplay.innerHTML = message;
        lostDisplay.style.backgroundColor = "red";
        lostDisplay.style.color = "white";
        var x = document.getElementById("bottom-display");
        x.style.display = "block";
    }
}

// light/dark mode
function mode() {
    var element = document.body;
    element.classList.toggle("dark");
}

// hint section
function showHint() {
    let hintDisplay = document.getElementById("bottom-display");
    let message = "Hint:";
    message = message.concat(" ", currentWord.hint);
    hintDisplay.innerHTML = message;
    hintDisplay.style.backgroundColor = "rgb(255, 243, 205)";
    var x = document.getElementById("bottom-display");
    if (x.style.display === "block") {
        x.style.display = "none";
    }
    else {
        x.style.display = "block";
    }
}

// instructions
function instructions() {
    var x = document.getElementById("board");
    var y = document.getElementById("start-over");
    if (x.style.display !== "none") {
        x.style.display = "none";
        y.style.display = "none";
        let container = document.getElementsByClassName("container");
        container.style.flexDirection = "row";
        let halfBoard = document.createElement("div");
        let img = new Image(200,200);
        img.src = "https://res.cloudinary.com/dceubf2vw/image/upload/v1676363529/photos/Screenshot_2023-02-14_013003_mn1pdr.png";
        halfBoard.appendChild(img);
        // halfBoard.setAttribute("class", "item-1");
        container.appendChild(img);

        /*
        const instr = document.createElement("ul");
        const messageOne = document.createTextNode("Start typing. The letters will appear in the boxes");
        const one = document.createElement("li");
        one.appendChild(messageOne);
        instr.appendChild(one);
        const messageTwo = document.createTextNode("Remove letters with Backspace");
        const two = document.createElement("li");
        two.appendChild(messageTwo);
        instr.appendChild(two);
        const messageThree = document.createTextNode("Hit Enter/Return to submit an answer");
        const three = document.createElement("li");
        three.appendChild(messageThree);
        instr.appendChild(three);
        const messageFour = document.createTextNode("Letters with green background are in the right spot");
        const four = document.createElement("li");
        four.appendChild(messageFour);
        instr.appendChild(four);
        const messageFive = document.createTextNode("Letters with yellow background exist in the word, but are in the wrong spots");
        const five = document.createElement("li");
        five.appendChild(messageFive);
        instr.appendChild(five);
        const messageSix = document.createTextNode("Letters with gray background do not exist in the word");
        const six = document.createElement("li");
        six.appendChild(messageSix);
        instr.appendChild(six);
        const messageSeven = document.createTextNode("If you need a hint, click the &#63; icon");
        const seven = document.createElement("li");
        seven.appendChild(messageSeven);
        instr.appendChild(seven);
        instr.setAttribute("class", "item-2");
        container.appendChild(instr);
        */
    }
    else {
        // halfBoard.style.display = "none";
        // instr.style.display = "none";
        x.style.display = "block";
        y.style.display = "block";
        container.style.flexDirection = "column";
    }
}