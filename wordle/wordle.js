const startOverButton = document.getElementById("start-over");
let keyDisplay = document.getElementById("key-display");

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
        keyDisplay.style.visibility = "visible";
        keyDisplay.innerHTML = "&#9003;";
        keyDisplay.style.paddingLeft = "20px";
        keyDisplay.style.paddingRight = "20px";
        keyDisplay.style.paddingTop = "21px";
        keyDisplay.style.paddingBottom = "21px";
        keyDisplay.style.backgroundColor = "rgb(54, 54, 54)";
        setTimeout(() => {
            keyDisplay.style.visibility = "hidden";
        }, 3000);
        deleteL();
        return;
    }
    if (pressedKey === "Enter") {
        keyDisplay.style.visibility = "visible";
        keyDisplay.innerHTML = "&#9166;";
        keyDisplay.style.paddingLeft = "28px";
        keyDisplay.style.paddingRight = "28px";
        keyDisplay.style.paddingTop = "22px";
        keyDisplay.style.paddingBottom = "22px";
        keyDisplay.style.backgroundColor = "rgb(54, 54, 54)";
        setTimeout(() => {
            keyDisplay.style.visibility = "hidden";
        }, 3000);
        checkWord();
        return;
    }
    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length >1) {
        return;
    }
    else {
        keyDisplay.style.visibility = "visible";
        keyDisplay.innerHTML = pressedKey.toUpperCase();
        keyDisplay.style.backgroundColor = "rgb(54, 54, 54)";
        keyDisplay.style.paddingLeft = "30px";
        keyDisplay.style.paddingRight = "30px";
        keyDisplay.style.paddingTop = "25px";
        keyDisplay.style.paddingBottom = "25px";
        setTimeout(() => {
            keyDisplay.style.visibility = "hidden";
        }, 3000);
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

function count(str, find) {
    return(str.split(find)).length -1;
}

function occurrence(str, val) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] === val) {
            count++;
        }
    }
    return count;
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

    let guessArray = [];

    for (let j = 0; j < 4; j++) {
        let colour = "grey";
        let tile = row.children[j];
        let letter = currentLetters[j];
        guessArray.push(letter);
        
        if (currentWord.word.toLowerCase().includes(letter)) {
            if (currentWord.word[j].toLowerCase() === letter) {
                colour = "rgb(136, 211, 136)";
                if(count(guess, letter) > count(currentWord.word.toLowerCase(), letter)) {
                    for(let k=0; k < 4; k++) {
                        if (guess[k] === letter && row.children[k].style.backgroundColor === "rgb(255, 255, 137)") {
                            row.children[k].style.backgroundColor = "grey";
                            row.children[k].style.color = "white";
                            let index = guessArray.indexOf(letter);
                            if (index !== -1) {
                                guessArray.splice(index,1);
                            }
                        }
                    }
                }
            }
            else {
                if(occurrence(guessArray, letter) <= count(currentWord.word.toLowerCase(), letter)) {
                    colour = "rgb(255, 255, 137)";
                }
                else {
                    colour = "grey";
                }
            }
        }
            // green colour = "rgb(136, 211, 136)";
            // yellow colour = "rgb(255, 255, 137)";
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
    hintDisplay.style.color = "black";
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
    var brd, instr;
    let container = document.querySelector(".container");
    if (y.classList.contains("init")) {
        y.classList.remove("init");
        x.style.display = "none";
        y.style.display = "none";
        keyDisplay.style.display = "none";
       
       // initialize brd
        brd = document.createElement("div");
        for (let i = 0; i < 4; i++) {
            let row = document.createElement("div");
            row.className = "letter-row";
            for (let j = 0; j < 4; j++) {
                let tile = document.createElement("input-type");
                tile.className = "letter-tile";
                row.appendChild(tile);
            }
            brd.appendChild(row)
        }
        //button

        let button = document.createElement("button");
        button.setAttribute("id", "start-over");
        button.innerHTML = "Start Over";
        brd.appendChild(button);
        brd.setAttribute("class", "item-1");
        container.appendChild(brd);

        // list of instructions
        instr = document.createElement("ul");
        const header = document.createElement("h2");
        header.innerHTML = "How To Play";
        instr.appendChild(header);
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
        const messageSeven = document.createElement("li");
        const hintIcon = document.createElement("span");
        hintIcon.innerHTML = "&#63";
        messageSeven.appendChild(document.createTextNode("If you need a hint, click the "));
        messageSeven.appendChild(hintIcon);
        messageSeven.appendChild(document.createTextNode(" icon"));
        instr.appendChild(messageSeven);
        instr.setAttribute("class", "item-2");
        container.appendChild(instr);
        brd.style.display = "block";
        instr.style.display = "block";
        container.style.flexDirection = "row";
        return;
    }
    if (y.style.display !== "none") {
        let item1 = document.querySelector(".item-1");
        let item2 = document.querySelector(".item-2");
        x.style.display = "none";
        y.style.display = "none";
        item1.style.display = "block";
        item2.style.display = "block";
        container.style.flexDirection = "row";
    }
    else {
        let item1 = document.querySelector(".item-1");
        let item2 = document.querySelector(".item-2");
        item1.style.display = "none";
        item2.style.display = "none";
        x.style.display = "block";
        y.style.display = "block";
        keyDisplay.style.display = "block";
        container.style.flexDirection = "column";
    }
}