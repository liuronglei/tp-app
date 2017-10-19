var dgram = require('dgram');
var clientSocket = dgram.createSocket('udp4');
var messages = {
    "type":0,
    "flag":"***",
    "src":"****",// string，生产设备标识，或生产系统标识
    "auth":"",
    "inf":"20101",
    "param":{
        "equipId":"****",  // 生产设备标识
        "status":0      /*  int，0 空闲，1 生产中，9 故障中，其它可由各设备具体自定义。 */
    }
};
function sendMsg(){//send to server
    var msg = JSON.stringify(messages);
    console.log(msg);
    clientSocket.send(msg, 0, msg.length, 8899, '115.29.137.236');
}
//start a timer to send message to echoServer
setInterval(sendMsg, 1000);

clientSocket.on('message', function(msg, rinfo){
    console.log('recv %s(%d) from server\n', msg, msg.length);
});

clientSocket.on('error', function(err){
    console.log('error, msg - %s, stack - %s\n', err.message, err.stack);
});

//clientSocket.bind(8899);