/* 
Handles all functions related to the game.

*/

var game;

var GAME_SIZE = 30;
var SNAKE_LENGTH = 5;


//Game manager
var Game = function () {
    this.board = null;
    this.snakes = null;
    this.snakeCounter = 0;
    this.runFrame = null;
    this.playing = false;
};


/**
 * A complete snake object
 */

//Directions: 
var Snake = function () {
    this.length = null;
    this.direction = 2;
    this.parts = null;
    this.tick = null;
    this.id = null;
    this.linksLeft = 0;
    this.score = 0;
};


/**
 * A single link of a Snake object
 * 
 */
var SnakePart = function () {
    this.x = null;
    this.y = null;
    this.id = null;
    this.next = null;
    this.snake = null;

};

var Apple = function () {
    this.x = null;
    this.y = null;
}


function initGame() {
    game = new Game();
    game.snakes = {};
    game.playing = true;
    clearBoard();
    addSnake();
    addSnake();
    gameLoop();
}

function gameLoop() {
    while (game.playing) {
        printBoard();

        tickAllSnakes();
    }
}

function addSnake() {
    game.snakeCounter++;
    var snakeName = "snake" + game.snakeCounter;
    var snake = new Snake();
    game.snakes[snakeName] = snake;
    snake.id = game.snakeCounter.toString();
    //Generate an x and y coordinate to be between SNAKE_LENGTH - (GAME_SIZE - SNAKE_LENGTH)
    //This is so the snake never starts directly on any of the walls 
    var xStart = Math.floor((Math.random() * (GAME_SIZE - SNAKE_LENGTH)));
    var yStart = Math.floor((Math.random() * (GAME_SIZE - SNAKE_LENGTH)) + SNAKE_LENGTH);
    console.log("Spawning snake at " + xStart + " " + yStart);
    spawnSnake(snake, xStart, yStart, SNAKE_LENGTH);
}


function tickAllSnakes() {
    for (var key in game.snakes) {
        var snake = game.snakes[key];
        tickSnake(snake);
    }
}

/**
 * Sets every element in the board to be 0;
 */
function clearBoard() {
    game.board = [[]];
    var i = GAME_SIZE;
    //Iterate through two dimensions of the array
    while (i--) {
        var j = GAME_SIZE;
        game.board[i] = [];
        while (j--) {
            game.board[i][j] = null;
        }
    }
}


function printBoard() {
    console.log("\n");
    for (i = 0; i < GAME_SIZE; i++) {
        for (j = 0; j < GAME_SIZE; j++) {
            var obj = game.board[i][j];
            if (obj == null) process.stdout.write('-');
            else process.stdout.write(obj.id);
        }
        console.log("");
    }
}

function spawnApple(x, y) {
    apple = new Apple();
    apple.x = x;
    apple.y = y;
    apple.id = "A";
    game.board[y][x] = apple;
}

/**
 * Spawns a snake at the passed location.
 */
function spawnSnake(snake, xStart, yStart, length) {
    snake.parts = [];
    snake.direction = 2;
    snake.length = length;
    //Create snakeblocks. The 'next' block is one block closer to the snake's tail.
    //snake.blocks[0] is the snake's head.
    for (i = 0; i < length; i++) {
        var snakePart = new SnakePart();
        snakePart.x = xStart + i;
        snakePart.y = yStart;
        snakePart.snake = snake;
        snakePart.id = snake.id;
        //Place the snake on the board
        game.board[yStart][xStart + i] = snakePart;
        snake.parts.push(snakePart);
        var prevBlock = snake.parts[i - 1];
        //Account for the first block
        if (prevBlock != undefined) prevBlock.next = snakePart;
    }
    //Set the snake's tail
    snake.tail = snake.parts[length - 1];
}

/* Moves the snake one unit in its specified direction.
Directions are as follows:
        0
     3  +  1
        2
*/

function tickSnake(snake) {

    var newX;
    var newY;

    switch (snake.direction) {
        //Up
        case 0:
            newX = snake.parts[0].x;
            newY = snake.parts[0].y - 1;
            break;
            //Right
        case 1:
            newX = snake.parts[0].x + 1;
            newY = snake.parts[0].y;
            break;
            //Down
        case 2:
            newX = snake.parts[0].x;
            newY = snake.parts[0].y + 1;
            break;
            //Left
        case 3:
            newX = snake.parts[0].x - 1;
            newY = snake.parts[0].y;
            break;
    }

    //Check if we hit either side of the wall
    if (newX < 0 || newY < 0 || newX > GAME_SIZE - 1 || newY > GAME_SIZE - 1) {
        //TODO
        game.playing = false;
        return;
    }
    var newBlock = game.board[newY][newX];

    //Check what's contained in the newBlock

    //newBlock is null, we're safe to move
    if (newBlock == null) {
        advanceSnake(snake, newX, newY);
        return;
    }
    //newBlock is another Snake
    if (newBlock.snake != undefined) {
        //TODO
        return;
    }
    //newBlock is an Apple
    else if (newBlock.id == 'A') {
        //Add three more links onto the snake
        var tailX = snake.tail.x;
        var tailY = snake.tail.y;
        snake.score++;
        for (i = 0; i < snake.score * 2; i++) {
            var newSnakePart = new SnakePart();
            newSnakePart.x = tailX;
            newSnakePart.y = tailY;
            newSnakePart.id = snake.id;
            newSnakePart.snake = snake;
            snake.parts.push(newSnakePart);
            snake.tail.next = newSnakePart;
            snake.tail = newSnakePart;
        }
        snake.linksLeft = snake.score * 2;
        game.board[newY][newX] = null;
        console.log("Links left: " + snake.linksLeft);

        advanceSnake(snake, board, newX, newY);
        console.log("Ate an apple!");

    }
}

function advanceSnake(snake, newX, newY) {
    var newSnakePart = new SnakePart();
    newSnakePart.x = newX;
    newSnakePart.y = newY;
    newSnakePart.next = snake.parts[0];
    newSnakePart.snake = snake;
    newSnakePart.id = snake.id;
    //Add newSnakePart to the beginning of parts (new 'head')
    snake.parts.unshift(newSnakePart);
    //Add the new part on the map
    game.board[newY][newX] = newSnakePart;
    //If the snake recently ate an apple and has links left to drop, don't clear that block
    snake.linksLeft = snake.linksLeft ? snake.linksLeft - 1 : 0;
    //Clear the last part on the map
    var lastPart = snake.parts[snake.parts.length - 1];
    console.log("Links left: " + snake.linksLeft);
    if (!snake.linksLeft) {
        game.board[lastPart.y][lastPart.x] = null;
        //Remove the last item from parts
        snake.parts.pop();
    }



}

initGame();
