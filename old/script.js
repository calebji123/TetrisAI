// get a reference to the canvas element
var canvas = document.getElementById("game-board");
// get the rendering context for the canvas
var ctx = canvas.getContext("2d");

// const
const SPEED_INCREMENT = 10;
const SCORE_INCREMENT = 2;
const INITIAL_SPEED = 1000;
const MOVE_LEFT = "ArrowLeft";
const MOVE_RIGHT = "ArrowRight";
const SOFT_DROP = "ArrowDown";
const HARD_DROP = " ";
const HOLD = "Shift";
const ROTATE_LEFT = "z";
const ROTATE_RIGHT = "x";


// define the game board as a 2D array of blocks
var gameBoard = [
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


function definePieces() {
   // define the Z piece
   var Z = [
     [1, 1, 0],
     [0, 1, 1],
     [0, 0, 0]
   ];
 
   // define the S piece
   var S = [
     [0, 1, 1],
     [1, 1, 0],
     [0, 0, 0]
   ];
 
   // define the T piece
   var T = [
     [0, 1, 0],
     [1, 1, 1],
     [0, 0, 0]
   ];
 
   // define the O piece
   var O = [
     [1, 1],
     [1, 1]
   ];
 
   // define the L piece
   var L = [
     [0, 0, 1],
     [1, 1, 1],
     [0, 0, 0]
   ];
 
   // define the I piece
   var I = [
     [1, 1, 1, 1],
     [0, 0, 0, 0],
     [0, 0, 0, 0],
     [0, 0, 0, 0]
   ];
 
   // define the J piece
   var J = [
     [1, 0, 0],
     [1, 1, 1],
     [0, 0, 0]
   ];
 
   // return the array of pieces
   return [Z, S, T, O, L, I, J];
 }

 var colors = ["grey","red","green","yellow","blue","purple","cyan","orange"];

 var gameState = {
   board: gameBoard,
   currentPiece: generatePiece(),
   score: 0,
   linesCleared: 0,
   holdUsed: false,
   heldPiece: null,
   nextPieces: [generatePiece(), generatePiece(), generatePiece()],
   gameOver: false,
   gameLoop: null,
 };

 function startGameLoop(gameState, speed) {
   // start the game loop that updates the game state at a specified interval
   setInterval(function() {
      gameState.gameLoop = this;
     // update the game state
     gameState = updateGameState(gameState);
     draw(gameState, canvas)
     // if the game is over, stop the game loop
     if (gameState.gameOver) {
       clearInterval(this);
       drawEndScene()
     }
 
     // increase the speed based on the number of lines cleared
     speed -= gameState.linesCleared * SPEED_INCREMENT;
   }, speed);
 }
 

 function updateGameState(gameState) {
   // move the current piece down
   gameState.currentPiece.y += 1;
 
   // check if the current piece has collided with the bottom of the game board
   // or with another piece on the board
   if (hasCollision(gameState)) {
     // if there is a collision, move the piece back up and add it to the game board
     gameState.currentPiece.y -= 1;
     addPieceToBoard(gameState);
   }
   
   gameState.isGameOver = isGameOver(gameState)
   // return the updated game state
   return gameState;
 }

 function isGameOver(gameState) {
   // get the game board and the current piece from the game state
   var gameBoard = gameState.board;
   var currentPiece = gameState.currentPiece;
 
   // loop through the rows and columns of the current piece
   for (var r = 0; r < currentPiece.type.length; r++) {
     for (var c = 0; c < currentPiece.type[r].length; c++) {
       // if the current block is filled and it has reached the top of the game board,
       // return true to indicate that the game is over
       if (
         currentPiece.type[r][c] === 1 &&
         currentPiece.y + r < 0
       ) {
         return true;
       }
     }
   }
 
   // if the current piece has not reached the top of the game board, return false
   return false;
 }
 
 
 function hasCollision(gameState) {
   // Get the current piece and its shape
   const currentPiece = gameState.currentPiece;
   const currentPieceShape = currentPiece.type;
 
   // Loop through each row and column of the current piece's shape
   for (let row = 0; row < currentPieceShape.length; row++) {
     for (let col = 0; col < currentPieceShape[row].length; col++) {
       // Check if the current block in the current piece's shape is occupied (i.e. has a value of 1)
       if (currentPieceShape[row][col] === 1) {
         // Calculate the position of the block in the gameboard
         const boardRow = currentPiece.y + row;
         const boardCol = currentPiece.x + col;
 
         // Check if the block is out of bounds or colliding with a fixed block on the gameboard
         if (boardRow >= gameState.board.length || boardCol < 0 || boardCol >= gameState.board[0].length || gameState.board[boardRow][boardCol] !== 0) {
           // If any of these conditions are true, there is a collision, so return true
           return true;
         }
       }
     }
   }
 
   // If the loop completes without finding a collision, return false
   return false;
 }
 

 function addPieceToBoard(gameState) {
   // get the game board and the current piece
   var gameBoard = gameState.board;
   var currentPiece = gameState.currentPiece;
 
   // loop through the rows and columns of the current piece
   for (var r = 0; r < currentPiece.type.length; r++) {
     for (var c = 0; c < currentPiece.type[r].length; c++) {
       // if the current block is filled, update the corresponding block on the game board
       if (currentPiece.type[r][c] === 1) {
         gameBoard[currentPiece.y + r][currentPiece.x + c] = currentPiece.color;
       }
     }
   }

   // check for completed lines and remove them
   removeCompletedLines(gameState);
 
   // generate a new piece and set it as the current piece
   gameState.currentPiece = generatePiece();

   gameState.holdUsed = false;
 }

 function removeCompletedLines(gameState) {
   // get the game board and the current score
   var gameBoard = gameState.board;
   var score = gameState.score;
   var linesCleared = gameState.linesCleared;
 
   // loop through the rows of the game board
   for (var r = 0; r < gameBoard.length; r++) {
     // check if the current row is completed
     if (gameBoard[r].every(function(val) { return val === 1; })) {
       // if the row is completed, remove it by shifting the remaining rows down
       for (var i = r; i > 0; i--) {
         gameBoard[i] = gameBoard[i - 1];
       }
       // add a new empty row at the top of the game board
       gameBoard[0] = new Array(gameBoard[0].length).fill(0);
 
       // increment the score by 1
       linesCleared += 1
       score += linesCleared*SCORE_INCREMENT;
     }
   }
 
   // update the game state with the updated game board and score
   gameState.board = gameBoard;
   gameState.score = score;
 }
 
 function generatePiece() {
   // get the array of pieces from the definePieces function
   var pieces = definePieces();
 
   // select a random piece from the array
   var index = Math.floor(Math.random() * pieces.length)
   var piece = pieces[index];
   var color = index + 1;
 
   // return an object with the x and y coordinates of the piece and the type of the piece
   return { x: 3, y: 0, type: piece, color: color, };
 }

 function generateNextPieces(gameState) {
 
   // Generate three new random pieces and add them to the nextPieces array
   for (let i = 0; i < 3; i++) {
      if (i >= gameState.nextPieces.length){
         gameState.nextPieces.push(generatePiece());
      }
   }
 }
 

 function draw(gameState, canvas) {
   // Calculate the size of each block in pixels
   const blockSize = canvas.width / gameState.board[0].length;
 
   // Clear the canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   // Draw the gameboard
   for (let row = 0; row < gameState.board.length; row++) {
     for (let col = 0; col < gameState.board[row].length; col++) {
       // Get the value and color of the current block on the gameboard
       const value = gameState.board[row][col];
       const color = colors[value];
       ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height)
       // Check if the block is occupied (i.e. has a value greater than 0)
       if (value > 0) {
         // Draw a filled rectangle at the position of the block
         ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
       }
     }
   }
   // Draw the held piece box
   ctx.strokeStyle = 'black';
   ctx.strokeRect(0, 0, blockSize * 4, blockSize * 4);
   if (gameState.heldPiece != null) {
      drawPiece(gameState.heldPiece, gameState.board, blockSize, ctx, blockSize);
   }

   // Draw the current piece
   drawPiece(gameState.currentPiece, gameState.board, blockSize, ctx);

   // Draw the next pieces box
   ctx.strokeStyle = 'black';
   ctx.strokeRect(canvas.width - blockSize * 12, 0, blockSize * 12, blockSize * 4);
   gameState.nextPieces.forEach((piece, index) => {
      drawPiece(piece, gameState.board, blockSize, ctx, canvas.width - blockSize * 8 + (index * blockSize * 4));
   });
 }

 function drawPiece(piece, board, blockSize, ctx, offsetX = 0) {
   // Get the shape of the piece and its position on the gameboard
   const shape = piece.type;
   const x = piece.x;
   const y = piece.y;

   // Loop through each row and column of the piece's shape
   for (let row = 0; row < shape.length; row++) {
     for (let col = 0; col < shape[row].length; col++) {
       // Check if the current block in the piece's shape is occupied (i.e. has a value of 1)
       if (shape[row][col] === 1) {
         // Calculate the position of the block on the gameboard
         const boardRow = y + row;
         const boardCol = x + col;
 
         // Check if the block is within the bounds of the gameboard
         if (boardRow >= 0 && boardRow < board.length && boardCol >= 0 && boardCol < board[0].length) {
           // If the block is within the bounds of the gameboard, set the fill style to the color of the piece
           ctx.fillStyle = colors[piece.color];

           // Draw a filled rectangle at the position of the block, with the specified offset
           ctx.fillRect((boardCol * blockSize) + offsetX, boardRow * blockSize, blockSize, blockSize);
         }
       }
     }
   }
 }
 
 function drawEndScene() {
 
   // draw the game over message on the canvas
   ctx.font = "24px Arial";
   ctx.fillText("Game Over", canvas.width / 2 - 60, canvas.height / 2 - 24);
 
   // draw the final score on the canvas
   ctx.font = "18px Arial";
   ctx.fillText("Score: " + gameState.score, canvas.width / 2 - 40, canvas.height / 2);
 
 }
 
 
 

 function rotatePiece(gameState, direction) {
   // get the current piece from the game state
   var currentPiece = gameState.currentPiece;
 
   // transpose the current piece
   var transposedPiece = transpose(currentPiece.type);
 
   // if the direction is "left", reverse the rows of the transposed piece
   // if the direction is "right", reverse the columns of the transposed piece
   if (direction === "left") {
     currentPiece.type = reverseRows(transposedPiece);
   } else {
     currentPiece.type = reverseColumns(transposedPiece);
   }
 
   // return the updated game state with the rotated current piece
   return gameState;
 }
 

 // transpose the matrix of a piece
function transpose(piece) {
   return piece[0].map((_, colIndex) => piece.map(row => row[colIndex]));
 }
 
 // reverse the rows of the matrix of a piece
 function reverseRows(piece) {
   return piece.map(row => row.reverse());
 }
 
 // reverse the columns of the matrix of a piece
 function reverseColumns(piece) {
   return piece.reverse();
 }
 

 function dropPieceDown(gameState) {
   // First, make a copy of the current piece so we can modify it
   const currentPiece = gameState.currentPiece;
   const currentPieceCopy = {
     shape: currentPiece.type,
     x: currentPiece.x,
     y: currentPiece.y
   };
 
   // Move the copy of the current piece down until it hits the bottom or another piece
   while (!hasCollision(gameState, currentPieceCopy)) {
     currentPieceCopy.y += 1;
   }
 
   // Move the copy of the current piece up by one row to undo the last invalid move
   currentPieceCopy.y -= 1;
 
   // Update the game state to use the copy of the current piece
   gameState.currentPiece = currentPieceCopy;
 
   // Fix the current piece in place on the gameboard
   addPieceToBoard(gameState);
 }
 
 function softDrop(gameState) {
   updateGameState(gameState)
 }

 function movePieceLeftRight(gameState, direction) {
   // First, make a copy of the current piece so we can modify it
   const currentPiece = gameState.currentPiece;
   const currentPieceCopy = {
     shape: currentPiece.type,
     x: currentPiece.x,
     y: currentPiece.y
   };
 
   // Move the copy of the current piece left or right depending on the direction
   if (direction === 'left') {
     currentPieceCopy.x -= 1;
   } else if (direction === 'right') {
     currentPieceCopy.x += 1;
   }
 
   // Check if the move is valid (i.e. not out of bounds and not overlapping with any fixed blocks)
   if (!hasCollision(gameState, currentPieceCopy)) {
     // If the move is valid, update the game state to use the copy of the current piece
     gameState.currentPiece = currentPieceCopy;
   }
 }
 
 function holdPiece(gameState) {
   // Check if the player has already used their hold for this game
   if (gameState.holdUsed) {
     // If the hold has already been used, do nothing
     return;
   }
 
   // Check if there is a piece currently being held
   if (gameState.heldPiece) {
     // If there is a piece being held, swap it with the current piece
     const currentPiece = gameState.currentPiece;
     gameState.currentPiece = gameState.heldPiece;
     gameState.heldPiece = currentPiece;
   } else {
     // If there is no piece being held, set the held piece to the current piece and generate a new current piece
     gameState.heldPiece = gameState.currentPiece;
     gameState.currentPiece = gameState.nextPieces.shift();
     generateNextPieces(gameState);
   }
 
   // Mark the hold as used
   gameState.holdUsed = true;
 }
 


 window.addEventListener('keydown', (event) => {const callback = {
   MOVE_LEFT  : () => {movePieceLeftRight(gameState, "left")},
   MOVE_RIGHT : () => {movePieceLeftRight(gameState, "right")},
   SOFT_DROP  : () => {softDrop(gameState)},
   HARD_DROP  : () => {dropPieceDown(gameState)},
   HOLD       :() => {holdPiece(gameState)},
   ROTATE_LEFT:() => {rotatePiece(gameState, "left")},
   ROTATE_RIGHT:() => {rotatePiece(gameState, "left")},
}[event.key]
callback?.()});


// get the start and pause buttons
var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");

// add an event listener to the start button
startBtn.addEventListener("click", function() {
  // if the game is not started, start the game
  if (!gameState.started) {
    // reset the game state
   gameState = {
      board: gameBoard,
      currentPiece: generatePiece(),
      score: 0,
      linesCleared: 0,
      holdUsed: false,
      heldPiece: null,
      nextPieces: [generatePiece(), generatePiece(), generatePiece()],
      colors: ["grey", "red","green","yellow","blue","purple","cyan","orange"],
      gameOver: false,
      gameLoop: null,
      started: false,
      paused: false,
    };
 
    // start the game
    startGameLoop(gameState, INITIAL_SPEED);

    // update the game state to indicate that the game has started
    gameState.started = true;

    // update the text of the start button
   startBtn.textContent = "Restart";
  }
});

pauseBtn.addEventListener("click", function() {
   // if the game is started and not paused, pause the game
   if (gameState.started && !gameState.paused) {
     // stop the game loop
     clearInterval(gameState.gameLoop);
 
     // update the text of the pause button
     pauseBtn.textContent = "Resume";
 
     // update the game state to indicate that the game is paused
     gameState.paused = true;
   } else if (gameState.started && gameState.paused) {
     // if the game is started and paused, unpause the game
 
     // start the game loop
     startGameLoop(gameState, INITIAL_SPEED);
 
     // update the text of the pause button
     pauseBtn.textContent = "Pause";
 
     // update the game state to indicate that the game is not paused
     gameState.paused = false;
   }
 });
 
 
 
 
 

