var io = require('socket.io')(http);

io.on('connection', functino(socket) {
    console.log('Someone connected');
});
