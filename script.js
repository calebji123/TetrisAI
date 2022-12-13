class Tetris {
   constructor() {
      this.scoreElement = document.getElementById("score");
      this.levelElement = document.getElementById("level");
      this.lineCountElement = document.getElementById("line-count");
      this.startButton = document.getElementById("start-button");
      this.pauseButton = document.getElementById("pause-button");

      // Initialize variables
      this.canvas = document.getElementById("game-board");
      this.ctx = this.canvas.getContext("2d");
      this.heldPiece = document.getElementById("held-piece");
      this.nextBox = document.getElementById("next-box");
      this.holdctx = this.heldPiece.getContext("2d")
      this.nextctx = this.nextBox.getContext("2d")
      this.currentTetromino = null;
      this.gameboard = [];
      this.heldTetromino = null;
      this.nextTetromino = null;
      this.score = 0;
      this.level = 1;
      this.lineCount = 0;
      this.running = false;
      this.started = false;
      this.isGameOver = false;
      this.initializeGameboard()
      this.gameLoop = new timer(()=>{}, 10000)
      this.changeKeyBind = false;


      // gamemodes
      this.sticktris = false;
      this.noRotation = false;
      this.generateRotated = false;
      this.addGarbage = false;
      this.columnScoring = false;


      //Constants
      this.speedDecrement = 100;
      this.START_SPEED = 1000;
      this.BLOCK_SIZE = this.canvas.width / this.gameboard[0].length;
      this.maxGarbage = 15;
      this.averageGarbage = 1;
      this.columnScoreLength = 10;

      // Define key constants
      this.MOVE_LEFT = "ArrowLeft";
      this.MOVE_RIGHT = "ArrowRight";
      this.SOFT_DROP = "ArrowDown";
      this.HARD_DROP = " ";
      this.HOLD = "Shift";
      this.ROTATE_LEFT = "z";
      this.ROTATE_RIGHT = "x";
      this.PAUSE = "Escape";

      this.startButton.addEventListener("click", this.start.bind(this));
      this.pauseButton.addEventListener("click", this.pause.bind(this));
      document.addEventListener("keydown", this.handleKeyDown.bind(this));

      // Get references to the input elements
      const sticktrisCheckbox = document.getElementById("sticktris");
      const norotationCheckbox = document.getElementById("norotation");
      const generaterotatedCheckbox = document.getElementById("generaterotated");
      const addGarbageCheckbox = document.getElementById("addGarbage");
      const maxGarbageSlider = document.getElementById("maxGarbage");
      const averageGarbageSlider = document.getElementById("averageGarbage");
      const columnScoringCheckbox = document.getElementById("columnScoring");
      const columnScoreLengthSlider = document.getElementById("columnScoreLength");
      const maxGarbageValue = document.getElementById("maxGarbageValue");
      const averageGarbageValue = document.getElementById("averageGarbageValue");
      const columnScoreLengthValue = document.getElementById("columnScoreLengthValue");

      sticktrisCheckbox.checked = this.sticktris;
      norotationCheckbox.checked = this.noRotation;
      generaterotatedCheckbox.checked = this.generateRotated;
      addGarbageCheckbox.checked = this.addGarbage;
      columnScoringCheckbox.checked = this.columnScoring;
      maxGarbageSlider.disabled = !this.addGarbage;
      averageGarbageSlider.disabled = !this.addGarbage;
      columnScoreLengthSlider.disabled = !this.columnScoring;
      maxGarbageSlider.value = this.maxGarbage;
      averageGarbageSlider.value = this.averageGarbage;
      columnScoreLengthSlider.value = this.columnScoreLength;
      maxGarbageValue.textContent = this.maxGarbage;
      averageGarbageValue.textContent = this.averageGarbage;
      columnScoreLengthValue.textContent = this.columnScoreLength;


      // Add event listeners for the checkboxes and sliders
      sticktrisCheckbox.addEventListener("change", () => {
        this.sticktris = sticktrisCheckbox.checked;
      });

      norotationCheckbox.addEventListener("change", () => {
      this.noRotation = norotationCheckbox.checked;
      });

      generaterotatedCheckbox.addEventListener("change", () => {
      this.generateRotated = generaterotatedCheckbox.checked;
      });

      addGarbageCheckbox.addEventListener("change", () => {
      this.addGarbage = addGarbageCheckbox.checked;
      maxGarbageSlider.disabled = !this.addGarbage;
      averageGarbageSlider.disabled = !this.addGarbage;
      });

      maxGarbageSlider.addEventListener("change", () => {
      this.maxGarbage = maxGarbageSlider.value;
      maxGarbageValue.textContent = this.maxGarbage;
      });

      averageGarbageSlider.addEventListener("change", () => {
      this.averageGarbage = averageGarbageSlider.value;
      averageGarbageValue.textContent = this.averageGarbage;
      });

      columnScoringCheckbox.addEventListener("change", () => {
      this.columnScoring = columnScoringCheckbox.checked;
      columnScoreLengthSlider.disabled = !this.columnScoring;
      });

      columnScoreLengthSlider.addEventListener("change", () => {
      this.columnScoreLength = columnScoreLengthSlider.value;
      columnScoreLengthValue.textContent = this.columnScoreLength;
      });

      // Get references to the input elements
      const moveLeftButton = document.getElementById("moveLeft");
      const moveRightButton = document.getElementById("moveRight");
      const softDropButton = document.getElementById("softDrop");
      const hardDropButton = document.getElementById("hardDrop");
      const holdButton = document.getElementById("hold");
      const rotateLeftButton = document.getElementById("rotateLeft");
      const rotateRightButton = document.getElementById("rotateRight");
      const pauseButton = document.getElementById("pause");

      moveLeftButton.value = this.MOVE_LEFT;
      moveRightButton.value = this.MOVE_RIGHT;
      softDropButton.value = this.SOFT_DROP;
      hardDropButton.value = this.HARD_DROP;
      holdButton.value = this.HOLD;
      rotateLeftButton.value = this.ROTATE_LEFT;
      rotateRightButton.value = this.ROTATE_RIGHT;
      pauseButton.value = this.PAUSE;


      // Add an event listener for the "click" event on each input element
      moveLeftButton.addEventListener("click", () => {
         this.updateKeyBind(moveLeftButton);
      });
      moveRightButton.addEventListener("click", () => {
         this.updateKeyBind(moveRightButton);
      });
      softDropButton.addEventListener("click", () => {
         this.updateKeyBind(softDropButton);
      });
      hardDropButton.addEventListener("click", () => {
         this.updateKeyBind(hardDropButton);
      });
      holdButton.addEventListener("click", () => {
         this.updateKeyBind(holdButton);
      });
      rotateLeftButton.addEventListener("click", () => {
         this.updateKeyBind(rotateLeftButton);
      });
      rotateRightButton.addEventListener("click", () => {
         this.updateKeyBind(rotateRightButton);
      });
      pauseButton.addEventListener("click", () => {
         this.updateKeyBind(pauseButton);
      });
      this.render();
   }

   // Define the updateKeyBind function
   updateKeyBind(button) {
   // Set the button's value to "..." to indicate that a key press is expected
   button.value = "...";
   button.blur();
   this.changeKeyBind = true;
   this.button = button;
 }

   pause() {
      // Check if game is running
      if (this.started && !this.isPaused) {
        // Stop game loop
        this.gameLoop.pause();
  
        // Update isRunning flag
        this.isRunning = false;

        // update the text of the pause button
         this.pauseButton.textContent = "Resume";
      
         // update the game state to indicate that the game is paused
         this.isPaused = true;
         this.render()
      } else if (this.started && this.isPaused) {
         this.run();
         // update the text of the pause button
         this.pauseButton.textContent = "Pause";
               
         // update the game state to indicate that the game is paused
         this.isPaused = false;
         this.render()
      }
    }

    start() {
      // Reset game
      this.reset();
      if (this.addGarbage){
         this.fillGameboard(this.maxGarbage, this.averageGarbage);
      }
      // Start game if not running
      this.run();
      this.startButton.textContent = "Restart"
    }

  
    reset() {
      // Clear gameboard
      this.initializeGameboard()
      this.gameLoop.pause();
      // Generate new current and next tetrominos
      this.currentTetromino = this.getRandomTetromino();
      this.nextTetromino = this.getRandomTetromino();
      this.heldTetromino = null;
  
      // Reset score and level
      this.score = 0;
      this.level = 1;
      this.lineCount = 0;
  
      // Reset flags
      this.isRunning = false;
      this.canHold = true;
      this.isPaused = false;
      this.started = false;
      this.isGameOver = false;
    }
  
    run() {
      // Check if game is not running
      if (!this.isRunning) {
         if (!this.started) {
            this.createGameLoop();
            this.started = true;
         } else {
            this.gameLoop.start();
         }
        this.render()
        // Update isRunning flag
        this.isRunning = true;
      }
    }

    createGameLoop() {
      // Calculate interval
      var interval = this.START_SPEED - this.level * this.speedDecrement;
      this.speedDecrement = Math.min(100, Math.round(interval/10));

      if (interval < 100) {
         interval = 5
      }
      
      // Start game loop
      this.gameLoop = new timer(() => {
      this.createGameLoop()
      }, interval);

      this.update(0,1);
    }


   initializeGameboard() {
      this.gameboard = [];
      for (let i = 0; i < 20; i++) {
        this.gameboard.push(new Array(10).fill(0));
      }
    }
  
   fillGameboard(maxLevel, garbAve, sd = 2) {
      // Iterate over the rows and columns of the gameboard
      for (var row = 0; row < this.gameboard.length; row++) {
         if (row >= this.gameboard.length - maxLevel){
            var count = 0
            for (var col = 0; col < this.gameboard[row].length; col++) {
               if (this.gameboard[row][col] === 0){
                  // Use Math.random() to determine whether to fill the cell with a color
                  if (Math.random() < garbAve / this.gameboard[row].length && !(count > garbAve + sd)) {
                     // Fill the cell with a random color
                     this.gameboard[row][col] = "darkgrey";
                     count += 1
                  }
               }
             }
         }
        
      }
    }
    
    getRandomColor() {
      const colors = ["cyan", "yellow", "purple", "green", "red", "blue", "orange"]
      const index = Math.floor(Math.random()*colors.length)
      return colors[index]
    }

   getRandomTetromino(det = null) {
      const tetrominos = [
        {
          type: [[1, 1, 1, 1]],
          color: "cyan",
        },
        {
          type: [[1, 1], [1, 1]],
          color: "yellow",
        },
        {
          type: [[0, 1, 1], [1, 1, 0]],
          color: "purple",
        },
        {
          type: [[1, 1, 0], [0, 1, 1]],
          color: "green",
        },
        {
          type: [[1, 0, 0], [1, 1, 1]],
          color: "red",
        },
        {
          type: [[0, 0, 1], [1, 1, 1]],
          color: "blue",
        },
        {
          type: [[0, 1, 0], [1, 1, 1]],
          color: "orange",
        },
      ];

     
      // Get a random tetromino and add an x and y property
      let tetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
      if (det !== null) {
         tetromino = tetrominos[det]
      }
  
      tetromino.x = Math.floor(this.canvas.width / this.BLOCK_SIZE / 2) - Math.floor(tetromino.type[0].length / 2);
      tetromino.y = 0;
  
      return tetromino;
    }

   randomRotatedTetromino() {
      // Generate a random tetronimo using getRandomTetronimo()
      var tetronimo = this.getRandomTetromino();
    
      // Generate a random number between 0 and 3
      var random = Math.floor(Math.random() * 4);
    
      // Use the random number to determine which rotation to apply
      switch (random) {
        case 0:
          // Do not rotate the tetronimo
          break;
        case 1:
          // Rotate the tetronimo left
          tetronimo = this.getRotatedTetromino(tetronimo, 'left');
          break;
        case 2:
          // Rotate the tetronimo right
          tetronimo = this.getRotatedTetromino(tetronimo, 'right');
          break;
        case 3:
          // Rotate the tetronimo twice
          tetronimo = this.getRotatedTetromino(tetronimo, 'left');
          tetronimo = this.getRotatedTetromino(tetronimo, 'left');
          break;
      }
    
      // Return the rotated tetronimo
      return tetronimo;
    }

    updateScore() {
      // Get score element
      const scoreElement = document.getElementById("score");
  
      // Update score element
      scoreElement.innerText = this.score;
    }
  
    updateLevel() {
      // Get level element
      const levelElement = document.getElementById("level");
  
      // Update level element
      levelElement.innerText = this.level;
    }
  
    updateLineCount() {
      // Get line count element
      const lineCountElement = document.getElementById("line-count");
  
      // Update line count element
      lineCountElement.innerText = this.lineCount;
    }
  

    update(x, y) {
         // Check if current tetromino collides
         if (this.collides(this.currentTetromino, 0, y) || (this.sticktris && this.collides(this.currentTetromino, x, y))) {
            // Add current tetromino to gameboard
            this.addToGameboard();

            if(!this.isGameOver) {
               // Check for full rows
               this.fullRows();

               //check for filled columns
               if (this.columnScoring) {
                this.fullColumns();
               }
            }

            // Get new random tetromino
            this.currentTetromino = this.nextTetromino;
            this.nextTetromino = this.generateRotated ? this.randomRotatedTetromino() : this.getRandomTetromino();

            this.canHold = true;
         } else if (this.collides(this.currentTetromino, x, 0) && !this.sticktris) {
            this.currentTetromino.y += y;
         } else {
            // Move current tetromino
            this.currentTetromino.x += x;
            this.currentTetromino.y += y;
         }

      this.render()
    }
    
  
    addToGameboard() {
      // Loop through current tetromino blocks
      for (let row = 0; row < this.currentTetromino.type.length; row++) {
        for (let col = 0; col < this.currentTetromino.type[row].length; col++) {
          // Check if block is filled
          if (this.currentTetromino.type[row][col] !== 0) {
            // Add block to gameboard
            if (this.gameboard[this.currentTetromino.y + row][this.currentTetromino.x + col] != 0) {
               this.gameOver();
            }
            this.gameboard[this.currentTetromino.y + row][this.currentTetromino.x + col] = this.currentTetromino.color;
            
          }
        }
      }
    }
  

    fullRows() {
      // Create array to store full rows
      const fullRows = [];
  
      // Loop through rows
      for (let row = 0; row < this.gameboard.length; row++) {
        // Check if row is full
        if (this.gameboard[row].every(block => block !== 0)) {
          // Add row to full rows array
          fullRows.push(row);
        }
      }
  
      // Check if there are any full rows
      if (fullRows.length > 0) {
        // Calculate score
        let score = 0;
        switch (fullRows.length) {
          case 1:
            score = 100;
            break;
          case 2:
            score = 300;
            break;
          case 3:
            score = 500;
            break;
          case 4:
            score = 800;
            break;
          default:
            break;
        }
  
        // Update score
        this.score += score * this.level;
  
        // Update line count
        this.lineCount += fullRows.length;
  
        // Check if level should be increased
        if (this.lineCount >= 10) {
          // Increase level
          this.level++;
          this.fillGameboard(this.garbageMaxLevel, this.garbageAve)
  
          // Reset line count
          this.lineCount = 0;
        }
  
        // Clear full rows
        for (let row of fullRows) {
          // Set row to 0s
          this.gameboard[row] = Array(this.gameboard[row].length).fill(0);
  
          // Shift rows down
          for (let i = row; i > 0; i--) {
            this.gameboard[i] = this.gameboard[i - 1];
          }
  
          // Set top row to 0s
          this.gameboard[0] = Array(this.gameboard[0].length).fill(0);
        }
      }
    }
   

    fullColumns() {
      var colscleared = 0
      // Iterate over the rows and columns of the array
      for (var col = 0; col < this.gameboard[0].length; col++) {
        var consecutiveCount = 0; // Count of consecutive values in the current column
    
        // Iterate over the values in the current column
        for (var row = 0; row < this.gameboard.length; row++) {
          // Check if the current value is consecutive and not equal to zero
          if (this.gameboard[row][col] !== 0) {
            consecutiveCount++; // Increment the consecutive count
          } else {
            // Check if the consecutive count is greater than COL_SCORE_LENGTH
            if (consecutiveCount >= this.columnScoreLength) {
               // Replace the values with zero
               for (var i = 1; i < consecutiveCount+1; i++) {
                 this.gameboard[row - i][col] = 0;
               }
     
               colscleared++; // Increment colscleared
             }
            consecutiveCount = 0; // Reset the consecutive count
          }
        }
        // Check if the consecutive count is greater than COL_SCORE_LENGTH
        if (consecutiveCount >= this.columnScoreLength) {
         // Replace the values with zero
         for (var i = 1; i < consecutiveCount+1; i++) {
           this.gameboard[row - i][col] = 0;
         }

         colscleared++; // Increment colscleared
       }
      }
      // Calculate score
      let score = 0;
      switch (colscleared) {
         case 1:
            score = 100;
            break;
         case 2:
            score = 300;
            break;
         case 3:
            score = 500;
            break;
         case 4:
            score = 800;
            break;
         default:
            break;
      }

      // Update score
      this.score += score * this.level;

      // Update line count
      this.lineCount += colscleared;

      // Check if level should be increased
      if (this.lineCount >= 10) {
         // Increase level
         this.level++;
         this.fillGameboard(this.garbageMaxLevel, this.garbageAve)

         // Reset line count
         this.lineCount = 0;
      }

    }
  
    gameOver() {
      this.isRunning = false;
      this.gameLoop.pause();
      this.isGameOver = true;
      this.started = false;
    }
  

    render() {

      // Clear screen
      this.ctx.fillStyle = "gray";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Draw gameboard
      this.gameboard.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            this.ctx.fillStyle = value;
            this.ctx.fillRect(x*this.BLOCK_SIZE, y*this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
          }
        });
      });
  
      // Draw current tetromino
      if (this.currentTetromino !== null) {
         this.currentTetromino.type.forEach((row, y) => {
            row.forEach((value, x) => {
              if (value !== 0) {
                this.ctx.fillStyle = this.currentTetromino.color;
                this.ctx.fillRect((this.currentTetromino.x + x)*this.BLOCK_SIZE, (this.currentTetromino.y + y)*this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
              }
            });
          });
      }

      if (this.isGameOver) {
         // Set the font and text alignment
         this.ctx.font = '32px serif';
         this.ctx.textAlign = 'center';

         // Create the "game over" text
         var text = 'Game Over';


         // Calculate the x coordinate for the text
         var x = this.canvas.width / 2;

         // Calculate the y coordinate for the text
         var y = this.canvas.height / 2;

         // Set the fill style to red
         this.ctx.fillStyle = 'red';

         // Set the stroke style to black
         this.ctx.strokeStyle = 'white';
         this.ctx.lineWidth = 4;

         // Add a black border to the text
         this.ctx.strokeText(text, x, y);

         // Draw the "game over" text on the canvas
         this.ctx.fillText(text, x, y);
      } else if (this.isPaused ) {
         // Set the font and text alignment
         this.ctx.font = '32px serif';
         this.ctx.textAlign = 'center';

         // Create the "game over" text
         var text = 'Paused';


         // Calculate the x coordinate for the text
         var x = this.canvas.width / 2;

         // Calculate the y coordinate for the text
         var y = this.canvas.height / 2;

         // Set the fill style to red
         this.ctx.fillStyle = 'red';

         // Set the stroke style to black
         this.ctx.strokeStyle = 'white';
         this.ctx.lineWidth = 4;

         // Add a black border to the text
         this.ctx.strokeText(text, x, y);

         // Draw the "game over" text on the canvas
         this.ctx.fillText(text, x, y);
      }

  
      // Update next box
      this.updateNextBox();
  
      // Update hold box
      this.updateHoldBox();
  
      // Update score, level, and line count
      this.updateScore();
      this.updateLevel();
      this.updateLineCount();
    }
  
    updateNextBox() {
      // Clear next box
      this.nextctx.fillStyle = "gray";
      this.nextctx.fillRect(0, 0, this.nextBox.width, this.nextBox.height);
      if(this.nextTetromino !== null) {
      // Calculate the center of the canvas
      var canvasCenterX = this.nextBox.width / 2;
      var canvasCenterY = this.nextBox.height / 2;

      // Calculate the dimensions of the tetronimo
      var tetronimoWidth = this.nextTetromino.type[0].length * this.BLOCK_SIZE;
      var tetronimoHeight = this.nextTetromino.type.length * this.BLOCK_SIZE;

      // Calculate the x and y coordinates for the tetronimo
      var tetronimoX = canvasCenterX - tetronimoWidth / 2;
      var tetronimoY = canvasCenterY - tetronimoHeight / 2;

      // Draw next tetromino
      this.nextTetromino.type.forEach((row, y) => {
      row.forEach((value, x) => {
         if (value !== 0) {
            this.nextctx.fillStyle = this.nextTetromino.color;
            this.nextctx.fillRect(tetronimoX + x*this.BLOCK_SIZE, tetronimoY + y*this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
         }
      });
      });
      }
    }

    updateHoldBox() {
      // Clear hold box
      this.holdctx.fillStyle = "gray";
      this.holdctx.fillRect(0, 0, this.heldPiece.width , this.heldPiece.height);
      // Draw held tetromino
      if (this.heldTetromino !== null ) {
               // Calculate the center of the canvas
         var canvasCenterX = this.heldPiece.width / 2;
         var canvasCenterY = this.heldPiece.height / 2;

         // Calculate the dimensions of the tetronimo
         var tetronimoWidth = this.heldTetromino.type[0].length * this.BLOCK_SIZE;
         var tetronimoHeight = this.heldTetromino.type.length * this.BLOCK_SIZE;

         // Calculate the x and y coordinates for the tetronimo
         var tetronimoX = canvasCenterX - tetronimoWidth / 2;
         var tetronimoY = canvasCenterY - tetronimoHeight / 2;

         this.heldTetromino.type.forEach((row, y) => {
            row.forEach((value, x) => {
              if (value !== 0) {
                this.holdctx.fillStyle = this.heldTetromino.color;
                this.holdctx.fillRect(tetronimoX+ x*this.BLOCK_SIZE, tetronimoY+y*this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
              }
            });
          });
      }
    }

    updateScore() {
      // Update score element
      this.scoreElement.innerText = this.score;
    }
  
    updateLevel() {
      // Update level element
      this.levelElement.innerText = this.level;
    }
  
    updateLineCount() {
      // Update line count element
      this.lineCountElement.innerText = this.lineCount;
    }


    holdPiece() {
      // Check if hold is available
      if (this.canHold) {
         if (this.heldTetromino === null) {
            this.heldTetromino = this.currentTetromino;
            this.currentTetromino = this.nextTetromino;
            this.nextTetromino = this.getRandomTetromino();
         } else {
            // Swap held piece with current piece
            [this.heldTetromino, this.currentTetromino] = [this.currentTetromino, this.heldTetromino];
            
            // Reset current tetromino position
            this.currentTetromino.x = Math.floor(this.canvas.width / this.BLOCK_SIZE / 2) - Math.floor(this.currentTetromino.type[0].length / 2);
            this.currentTetromino.y = 0;
         }
  
        // Update canHold 
        this.canHold = false;
        this.render()
      }

    }
  
    
    collides(tetromino, x, y) {
      // Loop through tetromino blocks
      for (let row = 0; row < tetromino.type.length; row++) {
        for (let col = 0; col < tetromino.type[row].length; col++) {
          // Check if block is filled
          if (tetromino.type[row][col] !== 0) {
            // Calculate block position
            const blockX = tetromino.x + col + x;
            const blockY = tetromino.y + row + y;
            if (blockX < 0 || blockX >= this.gameboard[0].length || blockY < 0 || blockY >= this.gameboard.length) {
              return true;
            }
  
            // Check if block collides with another block
            if (this.gameboard[blockY][blockX] !== 0) {
              return true;
            }
          }
        }
      }

  
      // No collision
      return false;
    }

    movePiece(x, y) {
      this.update(x, y);
    }

    rotatePiece(direction) {
      // Create new rotated tetromino
      const rotatedTetromino = this.getRotatedTetromino(this.currentTetromino, direction);
  
      // Check if rotation is valid
      if (!this.collides(rotatedTetromino, 0, 0)) {
        // Update current tetromino
        this.currentTetromino = rotatedTetromino;
      }

      this.update(0,0)
    }
  
   getRotatedTetromino(currentPiece, direction) {
      // transpose the current piece
      var transposedPiece = this.transpose(currentPiece.type);
      var rotatedTetromino = []
    
      // if the direction is "left", reverse the rows of the transposed piece
      // if the direction is "right", reverse the columns of the transposed piece
      if (direction === "right") {
        rotatedTetromino = this.reverseRows(transposedPiece);
      } else if (direction === "left") {
        rotatedTetromino = this.reverseColumns(transposedPiece);
      } else {
         rotatedTetromino = currentPiece.type
      }
    
      // return the updated game state with the rotated current piece
      return {
         type: rotatedTetromino,
         x: currentPiece.x,
         y: currentPiece.y,
         color: currentPiece.color
       };;
    }


    
   
    // transpose the matrix of a piece
    transpose(piece) {
      return piece[0].map((_, colIndex) => piece.map(row => row[colIndex]));
    }
    
    // reverse the rows of the matrix of a piece
     reverseRows(piece) {
      return piece.map(row => row.reverse());
    }
    
    // reverse the columns of the matrix of a piece
     reverseColumns(piece) {
      return piece.reverse();
    }
    


    softDrop() {
      // Update current tetromino position
      this.update(0,1);
    }
  
  
    hardDrop() {
      // Update current tetromino position until it collides
      while (!this.collides(this.currentTetromino, 0, 1)) {
        this.currentTetromino.y++;
      }
      // Update game state and render
      this.update(0, 1);
    }
  
    handleKeyDown(event) {
      event.preventDefault();
      // Handle keydown event
      if (this.isRunning) {
         switch (event.key) {
            case this.MOVE_LEFT:
              this.movePiece(-1, 0);
              break;
            case this.MOVE_RIGHT:
              this.movePiece(1, 0);
              break;
            case this.ROTATE_LEFT:
               if(!this.noRotation){
                  this.rotatePiece("left");
               }
              break;
             case this.ROTATE_RIGHT:
               if(!this.noRotation){
                  this.rotatePiece("right");
               }
              break;
            case this.SOFT_DROP:
              this.softDrop();
              break;
            case this.HARD_DROP:
              this.hardDrop();
              break;
            case this.HOLD:
              this.holdPiece();
              break;
             case this.PAUSE:
                this.pause()
                break;
            default:
              break;
          }
      } else {
         if (event.key === this.PAUSE) {
            this.pause();
         }
      }

      if (this.changeKeyBind) {
         // Update the button's value with the key code of the pressed key
         this.button.value = event.key;

         // Update the corresponding key bind variable with the pressed key
         switch (this.button.id) {
         case "moveLeft":
            this.MOVE_LEFT = event.key;
            break;
         case "moveRight":
            this.MOVE_RIGHT = event.key;
            break;
         case "softDrop":
            this.SOFT_DROP = event.key;
            break;
         case "hardDrop":
            this.HARD_DROP = event.key;
            break;
         case "hold":
            this.HOLD = event.key;
            break;
         case "rotateLeft":
            this.ROTATE_LEFT = event.key;
            break;
         case "rotateRight":
            this.ROTATE_RIGHT = event.key;
            break;
         case "pause":
            this.PAUSE = event.key;
            break;
         }
         this.changeKeyBind = false;
      }
      
    }

  
}

const game = new Tetris();
 


function timer(callback, delay) {
   var id, started, remaining = delay, running

   this.start = function() {
       running = true
       started = new Date()
       id = setTimeout(callback, remaining)
   }

   this.pause = function() {
       running = false
       clearTimeout(id)
       remaining -= new Date() - started
   }

   this.getTimeLeft = function() {
       if (running) {
           this.pause()
           this.start()
       }

       return remaining
   }

   this.getStateRunning = function() {
       return running
   }

   this.start()
}

