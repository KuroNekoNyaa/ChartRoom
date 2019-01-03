var app = require('express')();
var http = require('http').Server(app); // 创建一个http的server
var io = require('socket.io')(http);

var clientCount = 0 // 连接的客户端数量

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    clientCount++;
    socket.nickname = 'user' + clientCount;//第一个客户端连接上是user1 第二个就是user2
    io.emit('enter', socket.nickname + ' comes in');//广播
    socket.on('message', function (str) {
        io.emit('message', socket.nickname + ' says: ' + str);
    });
    socket.on('disconnect', function () {
        io.emit('leave', socket.nickname + ' left');
    });
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});
