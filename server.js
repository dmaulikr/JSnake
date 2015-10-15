//192.168.0.13
var app = require('./app');
var snake = require('./snake');

var http = require('http');
var server = http.Server(app.app);
var io = require('socket.io')(server);
var idCounter = 0;
var players = {};

var Player = function () {
    this.socket = null;
    this.id = null;
};

function initiateServer() {
    server.listen(5252);
    snake.initGame();
    setInterval(runGameLoop, 300);

    io.on('connection', function (socket) {
        console.log('Someone connected');

        //When an ID is requested, emit a newly assigned ID
        socket.on('requestId', function (data) {
            console.log("ID requested");
            socket.emit('id', {
                id: ++idCounter
            });
            var newPlayer = new Player();
            newPlayer.socket = socket;
            var id = idCounter;
            newPlayer.id = id;
            players[id] = newPlayer;
            snake.addSnake(id);

        });

        socket.on('direction', function (data) {
            var id = data['id'];
            var dir = data['direction'];
            snake.setSnakeDirection(id, dir);
        });

        //        socket.on('play', function (data) {
        //            snake.addSnake();
        //        });
    });
}

function emitBoardToPlayers(board) {
    var textBoard = [[]];
    var i = board.length;
    //Iterate through two dimensions of the array
    while (i--) {
        var j = board.length;
        textBoard[i] = [];
        while (j--) {
            if (board[i][j] == null) textBoard[i][j] = null;
            else textBoard[i][j] = board[i][j].id;
        }
    }

    for (var key in players) {
        var player = players[key];
        //        console.log(textBoard);
        player.socket.emit('board', {
            board: textBoard
        });
    }
}

function runGameLoop() {
    snake.gameLoop();
    emitBoardToPlayers(snake.board())
}

module.exports = {
    initiateServer: initiateServer
}
