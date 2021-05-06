console.log("connected");
// let keypadBtns = document.querySelectorAll(".keypad-button");
let keypad = document.querySelector('#keypad');
let timerDisplay = document.querySelector('#timer');
let roundDisplay = document.querySelector('#round-text');
let playBtns = document.querySelectorAll('.play-button');
let startScreen = document.querySelector('#start-screen'); 
let gameOverScreen = document.querySelector('#game-over-screen');
let resetBtn = document.querySelector('#reset-button');

//main variables
let round = 1;
let roundsToWin = 5;
let timeAddedPerRound = 5;
let sequenceCount = 0;
let pattern = [];
let buttonCount = 4;
let gameTime = 30;
let keypadBtns = [];
let gameIsOver = false;
let gameTimer = null;
let goodButtonPressColor = "green"
let badButtonPressColor = "red"
let displayButtonPressColor = "red"
let defaultButtonColor = "gray"

//set up game
//connect all keypad buttons
function setUpButtons(buttonCount) {
    for(let i = 0; i < buttonCount; i++){
        let newButton = document.createElement('div');
        newButton.classList.add('keypad-button');
        newButton.textContent = i+1;
        if (buttonCount <= 4) {
            newButton.style.width = "35%";
            newButton.style.height = "35%";
        } else {
            newButton.style.width = "25%";
            newButton.style.height = "25%";
        }
        newButton.dataset.number = i
        newButton.addEventListener('click', buttonIsClicked);
        keypadBtns.push(newButton);
        keypad.appendChild(newButton);
        // let buttonNumber = keypadBtns[i].dataset.buttonnumber
        // console.dir(keypadBtns[i]);
        // console.log(buttonNumber);
        // keypadBtns[i].addEventListener('click', ()=>{console.log(buttonNumber)});
    }
}
//create pattern for user
function generatePattern(patternCount, patternRange) {
    let pattern = []
    for (let i=0; i < patternCount; i++){
        let randomNumber = Math.floor(Math.random()*patternRange)
        pattern.push(randomNumber);
    }
    console.log(pattern);
    return pattern;
}
// highlight buttons to show sequence
// function displayPattern(gamePattern) {
//     for (let i = 0; i < gamePattern.length; i++){
//         console.log(gamePattern[i]);
//         setTimeout( () => {keypadBtns[gamePattern[i]].style.backgroundColor = displayButtonPressColor}, 500);
//         setTimeout( () => {keypadBtns[gamePattern[i]].style.backgroundColor = defaultButtonColor}, 1000);
//     }
// }

function displaySequence(sequence, element=0){
    keypadBtns[sequence[element]].style.backgroundColor = displayButtonPressColor
    setTimeout( () => {keypadBtns[sequence[element]].style.backgroundColor = defaultButtonColor}, 800);
    if (element + 1 < sequence.length) {
        setTimeout(() => {displaySequence(sequence, element +1)}, 1000);
    } else {
        //sequence done displaying
        startTimer();
    }
}
    
function gameOver() {
    gameIsOver = true;
    pauseTimer();
    setTimeout(displayGameOver, 500);
}

function displayGameOver(){
    console.dir(keypad)
    keypad.innerHTML = "";
    keypadBtns = [];
    keypad.style.display = "none";
    gameOverScreen.style.display = "flex";
}
    
function completeRound() {
    alert(`You beat round: ${round}`)
    setTimeout(()=>{advanceToNextRound(round)}, 600);
}

function advanceToNextRound(roundNumber){
    if (round == roundsToWin) {
        alert('You survived');
        pauseTimer();
    } else {
        round++;
        console.log(`round complete, next round: ${round}`);
        roundDisplay.textContent = `Round: ${round} of ${roundsToWin}`;
        gameTime += timeAddedPerRound;
        timerDisplay.textContent = gameTime;
        setTimeout(()=>{startRound(round)}, 600);
    }
}
    
function buttonIsClicked(e){
    console.log(e.target.dataset.number);
    if (e.target.dataset.number == pattern[sequenceCount]){
        // keep playing
        e.target.style.backgroundColor = goodButtonPressColor;
        setTimeout(()=> {e.target.style.backgroundColor = defaultButtonColor}, 500);
        sequenceCount++;
        if (sequenceCount >= pattern.length) {
            setTimeout(()=>{advanceToNextRound(round)}, 600);
        }
    } else {
        e.target.style.backgroundColor = badButtonPressColor;
        gameOver();
    }
    
}

//timer
function startTimer() {
    gameTimer = setInterval(updateTimer, 1000);
}

function pauseTimer(){
    clearInterval(gameTimer);
}
function updateTimer(){
    gameTime--;
    timerDisplay.textContent = gameTime;
    if (gameTime <= 0){
        gameOver();
    }
}
function resetGame(){
    gameOverScreen.style.display = "none";
    startScreen.style.display = "flex";
}

//start game
function setUpGame(){
    keypad.style.display = "flex";
    setUpButtons(buttonCount);

}
function startGame(e) {
    console.dir(e);
    startScreen.style.display = "none"
    if (e.target.dataset.mode == "easy"){
        buttonCount = 4;
        timeAddedPerRound = 5;
        roundsToWin = 5
    } else {
        buttonCount = 9;
        timeAddedPerRound = 3;
        roundsToWin = 10;
    }
    
    setUpGame();
    round = 1;
    roundDisplay.textContent = `Round: ${round} of ${roundsToWin}`;
    gameTime = 10;
    gameIsOver = false
    setTimeout(()=>{startRound(round)}, 1000);
    
}

function startRound(roundNumber){
    pattern = generatePattern(roundNumber, buttonCount);
    //displayPattern(pattern);
    sequenceCount = 0;
    pauseTimer();
    displaySequence(pattern);
}
    
for (let i =0; i < playBtns.length; i++){
    //console.log(playBtns);
    playBtns[i].addEventListener("click", startGame);
}
resetBtn.addEventListener('click', resetGame);
    //startGame();