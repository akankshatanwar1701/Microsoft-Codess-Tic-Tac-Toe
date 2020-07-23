/* ---------------------------------------------- */
/*         GLOBAL VARIABLES/CONSTANTS           */
/* ---------------------------------------------- */
const boardCell = document.querySelectorAll("[data-cell]")
// Default settings
var winningRow,
  starting_player=1,          // starting player is alien
  player_turn=1,              // alien's turn
  difficulty_level=9,         // unbeatable
  circleTurn=false,         // circleTurn should not be placed, cross should be placed
  starting_marker_circle=false,      // starting marker is cross
  opponent=1,                 // opponent is alien
  player_marker,              // marker of player 1
  opponent_marker,            // marker of opponent
  isWild=0,                   // regular tic tac toe
  suggestions=0               // suggestions are disabled
  optimization=1              // optimization is enabled
  array= new Array(9)       // stores current status of board


/* --------------------------------------------------- */
/*         ADDING EVENT LISTENERS TO OPTIONS           */
/* --------------------------------------------------- */
// STARTING PLAYER OPTION
var player= document.getElementById("player_turn")
player.addEventListener("click", (event) => {
  // Remove active class first
  player.children[0].children[0].classList.remove("active")
  player.children[0].children[1].classList.remove("active")
  // Add active class on clicked element
  event.target.classList.add("active")
  starting_player= event.target.dataset.value;
  newGame()
});

// MARKER OPTION
var marker= document.getElementById("player_marker")
marker.addEventListener("click", (event) => {
  // Remove active class first
  marker.children[0].children[0].classList.remove("active")
  marker.children[0].children[1].classList.remove("active")
  // Add active class on clicked element
  event.target.classList.add("active")
  starting_marker_circle=event.target.dataset.value==1?false:true
  newGame()
});

// OPPONENT OPTION
var op= document.getElementById("opponent")
op.addEventListener("click", (event) => {
  // Remove active class first
  op.children[0].children[0].classList.remove("active")
  op.children[0].children[1].classList.remove("active")
  // Add active class on clicked element
  event.target.classList.add("active")
  opponent = event.target.dataset.value;

  const humanPlayer = document.querySelector(".human_player")
  const alienPlayer = document.querySelector(".alien-player")
  const opponentImage = document.querySelector(".alien")
  if(opponent==0){            //Game is against human
    // Display suggestions option
    var suggestionText= document.querySelector(".suggestions")
    suggestionText.classList.add("show")

    // Remove optimization option
    var optimizationText= document.querySelector(".optimization")
    optimizationText.classList.remove("show")

    // Update opponent option
    humanPlayer.innerText= "Human1"
    alienPlayer.innerText= "Human2"
    opponentImage.src = "../static/images/human 2.png"

    // Update heading of scoring
    const human1Heading = document.querySelector(".human-heading")
    const human2Heading = document.querySelector(".alien-heading")
    human1Heading.innerText= "Human 1"
    human2Heading.innerText= "Human 2"

    // Disable difficulty level
    document.querySelector(".range-slider").classList.add("hide")
  }

  else{                   //Game is against alien
    // Remove suggestions option
    var suggestionText= document.querySelector(".suggestions")
    suggestionText.classList.remove("show")

    // Display optimization option
    var optimizationText= document.querySelector(".optimization")
    optimizationText.classList.add("show")

    // Update opponent option
    humanPlayer.innerText= "Human"
    alienPlayer.innerText= "Alien"
    opponentImage.src = "../static/images/alien.png"

    // Update heading of scoring
    const humanHeading = document.querySelector(".human-heading")
    const alienHeading = document.querySelector(".alien-heading")
    humanHeading.innerText= "Human"
    alienHeading.innerText= "Alien"

    // Enable difficulty level
    document.querySelector(".range-slider").classList.remove("hide")
  }

  // Reset scores
  const player1Score = document.querySelector(".human-score")
  const player2Score = document.querySelector(".alien-score")
  player1Score.innerText= "0"
  player2Score.innerText= "0"
  newGame()
});

// SUGGESTIONS BUTTON
function checkChoice(){
  var checkbox = document.getElementById("suggestions-button")
  if (checkbox.checked == true){
    suggestions=1
    difficulty_level=9
  }
  else
    suggestions=0
  newGame()
}

// OPTIMIZATION BUTTON
function checkChoice2(){
  var checkbox = document.getElementById("optimization-button")
  if (checkbox.checked == true){
    optimization=0
  }
  else
    optimization=1
  console.log(optimization)
  newGame()
}

// NEW GAME BUTTON
const newGameButton = document.getElementById("newGameButton")
newGameButton.addEventListener("click", newGame)

// RESET SCORE BUTTON
const resetScoreButton = document.getElementById("resetScore")
resetScoreButton.addEventListener("click", (event) => {
  const player1Score = document.querySelector(".human-score")
  const player2Score = document.querySelector(".alien-score")
  player1Score.innerText= "0"
  player2Score.innerText= "0"
  newGame()
});

// WILD TIC TAC TOE BUTTON
const wildButton = document.getElementById("wild")
wildButton.addEventListener("click", (event) => {
  isWild=1;
  const wildText = document.querySelector(".grid p")
  wildText.classList.add("show")
  newGame()
});

// REGULAR TIC TAC TOE BUTTON
const regularButton = document.getElementById("regular")
regularButton.addEventListener("click", (event) => {
  isWild=0;
  const wildText = document.querySelector(".grid p")
  wildText.classList.remove("show")
  newGame()
});

// DIFFICULTY LEVEL SLIDER
var range = $('.input-range')
var value = $('.range-value')

range.on('input', function(){
  const levelText= document.querySelector(".difficulty-text")
  level= this.value

  if(level==1){
    difficulty_level=9
    levelText.innerText="Unbeatable"
    levelText.classList.remove("number")
  }
  else{         //Because slider is 180deg inverted
    if (level==2)
      difficulty_level=4
    else if (level==3)
      difficulty_level=3
    else if (level==4)
      difficulty_level=2
    else if (level==5)
        difficulty_level=1

    levelText.innerText=difficulty_level
    levelText.classList.add("number")
  }

  if(opponent==1)       //If opponent is alien
    newGame()
});


/* -------------------------------- */
/*         GAME FUNCTIONS           */
/* -------------------------------- */
newGame()

function newGame() {
  // Remove all old classes
  boardCell.forEach(cell => {
    cell.classList.remove("x")
    cell.classList.remove("circle")
    cell.classList.remove("win_h")
    cell.classList.remove("win_v")
    cell.classList.remove("win_d1")
    cell.classList.remove("win_d2")
    cell.classList.remove("no-move")
    cell.removeEventListener("click", clickEvent)
    cell.addEventListener("click", clickEvent, { once: true })
  })
  const gameOverMessage = document.getElementById("winningMessage")
  gameOverMessage.classList.remove("show")

  // Reinitialise array which is sent to back-end
  for(var i=0;i<array.length;++i)
    array[i]="blank"

  // Set Player and opponent marker
  player_turn=starting_player
  circleTurn= starting_marker_circle
  var start_mark= starting_marker_circle==false?1:0
  var not_start_mark= start_mark==0?1:0
  player_marker= starting_player==0?start_mark:not_start_mark
  opponent_marker= player_marker==0?1:0

  // Change colors of scores
  const player1Heading = document.querySelector(".human-heading")
  const player2Heading = document.querySelector(".alien-heading")
  const player1Score = document.querySelector(".human-score")
  const player2Score = document.querySelector(".alien-score")
  // (Player= human, marker= circle) OR (player= alien, marker= x)
  if((starting_player==0 && circleTurn==true) || (starting_player==1 && circleTurn==false)){
    player1Heading.classList.add("change-color")
    player2Heading.classList.add("change-color")
    player1Score.classList.add("change-color")
    player2Score.classList.add("change-color")
  }
  else{
    player1Heading.classList.remove("change-color")
    player2Heading.classList.remove("change-color")
    player1Score.classList.remove("change-color")
    player2Score.classList.remove("change-color")
  }

  hoverEffect()
  // Opponent is alien and it is starting player || opponent is human and suggestions are enabled
  if((opponent==1 && starting_player==1) || (opponent==0 && suggestions==1))
    callAI()
}


function clickEvent(e) {         //main function that calls all functions
  const cell = e.target
  const currentClass = circleTurn ? "circle" : "x"
  placeMarker(cell, currentClass)
  if (checkWin(currentClass)) {
    gameOver(false)
    drawLine()
    disableClick()
  }
  else if (matchDraw()) {
    gameOver(true)
  }
  else{
    nextTurn()
    if(!(opponent==1 && player_turn==1))      //if it is alien's turn, don't show hover effect
      hoverEffect()
  }
}


function placeMarker(cell, currentClass) {
  cell.classList.add(currentClass)
  updateArray(cell)
}


function updateArray(cell){
  // Finding index of clicked cell
  var index = 0;
  while( (cell = cell.previousSibling) != null )
    index++;
  index= Math.floor(index/2)

  // Update array
  if(boardCell[index].classList.contains("x"))
    array[index]= "x"
  else if(boardCell[index].classList.contains("circle"))
    array[index]= "circle"
}


function placeSuggestion(cell, currentClass) {
  cell.classList.add(currentClass+"-suggestion")
  setTimeout(function(){
    $(cell).removeClass(currentClass+"-suggestion");
  },300);
}


function nextTurn() {
  circleTurn = !circleTurn
  player_turn= player_turn==1?0:1

  // Opponent is alien and alien's turn || opponent is human and suggestions are enabled
  if((opponent==1 && player_turn==1) || (opponent==0 && suggestions==1))
    callAI()
}


function callAI(){
  // Make markers for sending to minimax when game is human vs human and suggestions are enabled
  if (opponent==0 && suggestions==1){
    player_marker= circleTurn==true?0:1
    opponent_marker= circleTurn==true?1:0
    difficulty_level=9
  }

  // Make ajax call to django
  $.ajax({
    type: "get",
    url: "",
    data: {
      array: array ,
      difficulty_level: difficulty_level,
      player_marker: player_marker,
      opponent_marker: opponent_marker,
      isWild: isWild,
      optimization: optimization
    },
    contentType: "text/plain",
    success: function (response) {
      var aiMove= response.result
      console.log("AI move is " + aiMove)
      const currentClass = circleTurn ? "circle" : "x"

      //If opponent is alien and it is alien's turn
      if(opponent==1 && player_turn==1){
        placeMarker(boardCell[aiMove], currentClass)
        boardCell[aiMove].removeEventListener("click", clickEvent)

        // Check for game over conditions
        if (checkWin(currentClass)) {
          gameOver(false)
          drawLine()
          disableClick()
        }
        else if (matchDraw()) {
          gameOver(true)
        }

        // If game is not over control returns here
        circleTurn = !circleTurn
        player_turn= player_turn==1?0:1
        hoverEffect()
      }
      else{               //suggestions were generated for human vs human game
        placeSuggestion(boardCell[aiMove], currentClass)
        hoverEffect()
      }
    },
    error: function (response) {
      alert("Error!");
    }
  })
}


function hoverEffect() {
  const board = document.getElementById("board")
  board.classList.remove("x")
  board.classList.remove("circle")
  if (circleTurn) {
    board.classList.add("circle")
  } else {
    board.classList.add("x")
  }
}


function checkWin(currentClass) {
  const winning_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  return winning_combinations.some(combination => {
    winningRow=combination
    return combination.every(index => {
      return boardCell[index].classList.contains(currentClass)
    })
  })
}


function matchDraw() {
  //if all cells contain either x or circle means game is draw
  return [...boardCell].every(cell => {
    return cell.classList.contains("x") || cell.classList.contains("circle")
  })
}


function gameOver(draw) {
  const gameOverText = document.querySelector("[data-winning-message-text]")
  const player1Score = document.querySelector(".human-score")
  const player2Score = document.querySelector(".alien-score")

  if (draw)
    gameOverText.innerText = "Draw!"
  else {
    if(opponent==1){         //game was against alien
      if(player_turn==0 && isWild==0){
        gameOverText.innerText = "⭐Human Wins!⭐"
        score= parseInt(player1Score.innerText)
        player1Score.innerText= score+1
      }
      else if (player_turn==1 && isWild==0) {
        gameOverText.innerText = "⭐Alien Wins!⭐"
        score= parseInt(player2Score.innerText)
        player2Score.innerText= score+1
      }
      else if (player_turn==1 && isWild==1){
        gameOverText.innerText = "⭐You Win!⭐"
        score= parseInt(player1Score.innerText)
        player1Score.innerText= score+1
      }
      else if (player_turn==0 && isWild==1){
        gameOverText.innerText = "😞 You Lose! 😞"
        score= parseInt(player2Score.innerText)
        player2Score.innerText= score+1
      }
    }
    else{             //game was against human
      if((player_turn==0 && isWild==0) || (player_turn==1 && isWild==1)){
        gameOverText.innerText = "⭐Human 1 Wins!⭐"
        score= parseInt(player1Score.innerText)
        player1Score.innerText= score+1
      }
      else if ((player_turn==1 && isWild==0) || (player_turn==0 && isWild==1)){
        gameOverText.innerText = "⭐Human 2 Wins!⭐"
        score= parseInt(player2Score.innerText)
        player2Score.innerText= score+1
      }
    }
  }

  const gameOverMessage = document.getElementById("winningMessage")
  gameOverMessage.classList.add("show")
}


function drawLine(){
  var winType
  var elements=document.getElementById("board").children

  var i=winningRow[0]
  if(winningRow.includes(i) && winningRow.includes(i+1))
    winType= "horizontal"
  else if(winningRow.includes(i) && winningRow.includes(i+3))
    winType= "vertical"
  else if(winningRow.includes(0))
    winType= "diagonal1"
  else
    winType= "diagonal2"

  winningRow.forEach(index => {
    if(winType=="horizontal")
      elements.item(index).classList.add("win_h")
    else if(winType=="vertical")
      elements.item(index).classList.add("win_v")
    else if(winType=="diagonal1")
      elements.item(index).classList.add("win_d1")
    else
      elements.item(index).classList.add("win_d2")
  })
}


function disableClick(){
  //No more moves allowed, so set cursor as not-allowed and disable click
  boardCell.forEach(cell => {
    cell.classList.add("no-move")
    cell.removeEventListener("click", clickEvent)
  })
}
