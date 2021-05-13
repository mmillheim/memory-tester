console.log("connected");
// let keypadBtns = document.querySelectorAll(".keypad-button");
let keypad = document.querySelector('#keypad');
let timerDisplay = document.querySelector('#timer');
let roundDisplay = document.querySelector('#round-text');
let playBtns = document.querySelectorAll('.play-button');
let startScreen = document.querySelector('#start-screen'); 
let gameOverScreen = document.querySelector('#game-over-screen');
let victoryScreen = document.querySelector('#victory-screen');
let resetBtns = document.querySelectorAll('.reset-button');
let menuScreen = document.querySelector('#menu-screens');

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
// let goodButtonPressColor = "green"
// let badButtonPressColor = "red"
// let displayButtonPressColor = "red"
// let defaultButtonColor = "gray"
let isDisplaying = true;
let nextRoundMessage = ["OK", "PASS", "MEH", "TICK TICK", "PFFT", "*SIGH*"];

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
function displaySequence(sequence, element=0){
    // keypadBtns[sequence[element]].style.backgroundColor = displayButtonPressColor
    keypadBtns[sequence[element]].classList.toggle("highlight");
    isDisplaying = true;
    // setTimeout( () => {keypadBtns[sequence[element]].style.backgroundColor = defaultButtonColor}, 800);
    setTimeout( () => {keypadBtns[sequence[element]].classList.toggle("highlight")}, 800);
    if (element + 1 < sequence.length) {
        setTimeout(() => {displaySequence(sequence, element +1)}, 1000);
    } else {
        //sequence done displaying
        setTimeout(()=>{
            isDisplaying = false;
            startTimer();
        }, 500);
    }
}

//set the game over conditions and then display the game over screen.
function gameOver() {
    gameIsOver = true;
    pauseTimer();
    timerDisplay.textContent = "BOOM";
    setTimeout(displayGameOver, 500);
}

//remove the keypad buttons and make the game over screen visible
function displayGameOver(){
    console.dir(keypad);
    keypad.innerHTML = "";
    keypadBtns = [];
    keypad.style.display = "none";
    menuScreen.style.display = "flex";
    gameOverScreen.style.display = "flex";
}
    
function advanceToNextRound(roundNumber){
    round++;
    console.log(`round complete, next round: ${round}`);
    roundDisplay.textContent = `Round: ${round} of ${roundsToWin}`;
    gameTime += timeAddedPerRound;
    // timerDisplay.textContent = gameTime;
    updateTimeDisplay(gameTime);
    setTimeout(()=>{startRound(round)}, 600);
}

function displayVictory(){
    pauseTimer();
    timerDisplay.textContent = "DISARMED";
    keypad.innerHTML = "";
    keypadBtns = [];
    keypad.style.display = "none";
    menuScreen.style.display = "flex";
    victoryScreen.style.display = "flex";

}

function buttonIsClicked(e){
    console.log(e.target.dataset.number);
    if (!isDisplaying) {

        if (e.target.dataset.number == pattern[sequenceCount]){
            // keep playing
            // e.target.style.backgroundColor = goodButtonPressColor;
            e.target.classList.toggle("highlight");
            setTimeout(()=> {e.target.classList.toggle("highlight")}, 500);
            sequenceCount++;
            if (sequenceCount >= pattern.length) {
                if (round == roundsToWin) {
                    displayVictory();
                } else {
                    pauseTimer();
                    timerDisplay.textContent = nextRoundMessage[Math.floor(Math.random()*nextRoundMessage.length)];
                    setTimeout(()=>{advanceToNextRound(round)}, 600);
                }
            }
        } else {
            // e.target.style.backgroundColor = badButtonPressColor;
            e.target.classList.toggle("wrong");
            gameOver();
        }
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
    //timerDisplay.textContent = gameTime;
    updateTimeDisplay(gameTime);
    if (gameTime <= 0){
        gameOver();
    }
}

function updateTimeDisplay(time){
    let seconds = Math.floor(time % 60);
    let minutes = Math.floor(time / 60);
    let gameTimeString =  (minutes < 10 ? "0" + minutes : minutes.toString()) + ":" + (seconds < 10 ? "0" + seconds : seconds.toString());
    timerDisplay.textContent = gameTimeString
}
function resetGame(){
    gameOverScreen.style.display = "none";
    victoryScreen.style.display = "none";
    menuScreen.style.display = "flex";
    startScreen.style.display = "flex";
}

//start game
function setUpGame(){
    keypad.style.display = "flex";
    setUpButtons(buttonCount);

}
function startGame(e) {
    console.dir(e);
    startScreen.style.display = "none";
    menuScreen.style.display = "none";
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
    updateTimeDisplay(gameTime);
    gameIsOver = false
    setTimeout(()=>{startRound(round)}, 1000);
    
}

function startRound(roundNumber){
    pattern = generatePattern(roundNumber, buttonCount);
    //pattern = generatePattern(1, buttonCount);
    //displayPattern(pattern);
    //updateTimeDisplay(gameTime);
    sequenceCount = 0;
    pauseTimer();
    timerDisplay.textContent = "PATTERN"
    displaySequence(pattern);
}
    
for (let i =0; i < playBtns.length; i++){
    //console.log(playBtns);
    playBtns[i].addEventListener("click", startGame);
}
for (let i =0; i < resetBtns.length; i++){
    resetBtns[i].addEventListener('click', resetGame);
}
    //startGame();