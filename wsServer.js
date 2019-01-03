var ws = require("nodejs-websocket")
var PORT = 3000

//  给每个客户端数量
var clientCount  = 0

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection")
    clientCount++
    conn.nickname = 'user' + clientCount

    var mes = {}
    mes.type = 'enter'
    mes.data = conn.nickname + ' comes in'// 每个客户端进入发送一个消息

    broadcast(JSON.stringify(mes))  // 把对象格式化为字符串

    conn.on("text", function (str) {
        console.log("Received "+str)
        var mes = {}
        mes.type = 'message'
        mes.data = conn.nickname + ' says: '  +  str
        broadcast(JSON.stringify(mes))
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        var mes = {}
        mes.type = 'leave'
        mes.data = conn.nickname  + ' left'
        broadcast(JSON.stringify(mes))
    })
    conn.on("error", function (err) { // 对关掉网页会throw err的处理写进这个函数
        console.log("handle err");
        console.log(err)
    })
}).listen(PORT);

console.log("websocket server listen on Port" + PORT)

function broadcast(str) {
    console.log(str)
    // 遍历所有客户端的连接 给每个客户端发送broadcast
    server.connections.forEach(function (connection) {
        connection.sendText(str)
    })
}