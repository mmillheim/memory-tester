console.log("connected");
// let keypadBtns = document.querySelectorAll(".keypad-button");
let keypad = document.querySelector("#keypad");
let timerDisplay = document.querySelector("#timer");
let roundDisplay = document.querySelector("#round-text");

//main variables
let round = 1;
let roundsToWin = 5;
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
    setTimeout(()=>{alert("The Game is Over")}, 500);
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
        gameTime += 5;
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

//start game
function setUpGame(){
    setUpButtons(4);

}
function startGame() {
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
    
    setUpGame();
    startGame();