/**
 * Created by liurong on 2017/8/10.
 */
var net = require('net');
var Hashmap = require('../utils/hashmap');
var timeout = 20000;//超时
var listenPort = 2002;//监听端口
var hashmap = new Hashmap.Map();
var encodeing = 'binary';

const plc_server = {
    startServer : function () {
        // 请求报文
        const requstlength = 14;//请求数据长度
        const area=36;//区域
        const address_1=30;//位置1
        const address_2=32;//位置2
        const address_3=34;//位置3
        const read_bit_1=38;//数量1
        const read_bit_2=40;//数量2
        // 响应报文
        const responselength = 7;
        var addressArr = new Array();
        var server = net.createServer(function(socket){
            // 我们获得一个连接 - 该连接自动关联一个socket对象
            console.log('connect: ' +
                socket.remoteAddress + ':' + socket.remotePort);
            socket.setEncoding(encodeing);
            //超时事件
            //  socket.setTimeout(timeout,function(){
            //    console.log('连接超时');
            //    socket.end();
            //  });
            //接收到数据
            socket.on('data',function(data){
                var message_base_red_normal = [
                    0xD0,0x00,//副帧头 0-1
                    0x00,//网络编号 2
                    0xFF,//PC编号 3
                    0xFF,0x03,//请求目标模块 4-5L
                    0x00,//请求目标多点站号 6
                    0x04,0x00,//响应数据长 7-8 //后面的字节数
                    0x00,0x00,//结束代码 9-10
                ];
                var message_base_red_error = [
                    0xD0,0x00,//副帧头 0-1
                    0x00,//网络编号 2
                    0xFF,//PC编号 3
                    0xFF,0x03,//请求目标模块 4-5L
                    0x00,//请求目标多点站号 6
                    0x0B,0x00,//请求数据长 7-8 //后面的字节数
                    0x51,0xC0,//结束代码 9-10
                    0x00,//出错信息部 网络编号
                    0xFF,//PC标号
                    0xFF,0x03,//请求目标模块
                    0x00,//请求目标多点站号
                    //指令
                    //子指令

                ];
                var message_base_write_normal = [
                    0xD0,0x00,//副帧头 0-1
                    0x00,//网络编号 2
                    0xFF,//PC编号 3
                    0xFF,0x03,//请求目标模块 4-5L
                    0x00,//请求目标多点站号 6
                    0x02,0x00,//响应数据长 7-8 //后面的字节数
                    0x00,0x00,//结束代码 9-10
                ];
                var message_base_write_error = [
                    0xD0,0x00,//副帧头 0-1
                    0x00,//网络编号 2
                    0xFF,//PC编号 3
                    0xFF,0x03,//请求目标模块 4-5L
                    0x00,//请求目标多点站号 6
                    0x0B,0x00,//请求数据长 7-8 //后面的字节数
                    0x51,0xC0,//结束代码 9-10
                    0x00,//出错信息部 网络编号
                    0xFF,//PC标号
                    0xFF,0x03,//请求目标模块
                    0x00,//请求目标多点站号
                    //指令
                    //子指令
                ];
                var data = Buffer.from(data, encodeing).toString('hex');
                var requestlength_hex = parseInt(data[requstlength]+data[requstlength+1],16);
                var dataLength = parseInt(data[read_bit_1]+data[read_bit_1+1],16);
                var dataAdress = 0;
                var recvdata = 42;
                //var dataArr = new Array();
                var dataArea = "";
                if((data[area]+data[area+1]).toUpperCase () == 'A8'){
                    dataArea = "D";
                }
                if(data[area]+data[area+1].toUpperCase () == '90'){
                    dataArea = "M";
                }
                if(data[area]+data[area+1].toUpperCase () == '9C'){
                    dataArea = "X";
                }
                //  将地址写入地址数组，并倒序
                addressArr.push(data[address_1]+data[address_1+1]);
                addressArr.push(data[address_2]+data[address_2+1]);
                addressArr.push(data[address_3]+data[address_3+1]);
                addressArr = addressArr.reverse();
                //  把地址转成10进制存储
                dataAdress = dataAdress + parseInt(addressArr[0],16)*256*256 +  parseInt(addressArr[1],16)*256 + parseInt(addressArr[2],16);
                var dataAdress_originally = dataAdress;
                //读取操作
                if((data[24]+data[25]) == '04'){
                    message_base_red_normal[responselength] = parseInt(2+dataLength*2,16);
                    var keyFlag = true;
                    for(var k = 0; k < dataLength ; k++){
                        var value = getValue(dataArea,dataAdress);
                        if(value == null || value == "" || value.length != 2){
                            keyFlag = false;
                            break;
                        }
                        dataAdress++;
                    }
                    if(keyFlag){
                        for (var j = 0; j < dataLength; j++){
                            //console.log(hashmap.get(dataArea+dataAdress_originally));
                            message_base_red_normal.push(parseInt(getValue(dataArea,dataAdress_originally)[0],16));
                            message_base_red_normal.push(parseInt(getValue(dataArea,dataAdress_originally)[1],16));
                            dataAdress_originally++;
                        }
                        socket.write(Buffer.from(message_base_red_normal,encodeing));
                    }
                    else{
                        socket.write(Buffer.from(message_base_red_error,encodeing));
                    }
                }
                //写入数据操作
                else{
                    //将数据写入hashmap
                    if(dataLength > 1){
                        for(var i = 0;i < dataLength;i++){
                            var value = [data[recvdata]+data[recvdata+1],data[recvdata+2]+data[recvdata+3]];
                            putValue(dataArea, dataAdress,value);
                            //dataArr.push(value);
                            recvdata = recvdata+4;
                            dataAdress++;
                        }
                    }
                    if(requestlength_hex - 12 == dataLength*2) {
                        socket.write(Buffer.from(message_base_write_normal,encodeing));
                    }
                    else{
                        socket.write(Buffer.from(message_base_write_error,encodeing));
                    }
                }
                //console.log('recv:' + data);
                //console.log(hashmap.keySet());
            });
            //数据错误事件
            socket.on('error',function(exception){
                console.log('socket error:' + exception);
                socket.end();
            });
            //客户端关闭事件
            socket.on('close',function(data){
                console.log('close: ' +
                    socket.remoteAddress + ' ' + socket.remotePort);
            });
        }).listen(listenPort);
        //服务器监听事件
        server.on('listening',function(){
            console.log("server listening:" + server.address().port);
        });
        //服务器错误事件
        server.on("error",function(exception){
            console.log("server error:" + exception);
        });
    }
};

function getValue(area, address) {
    var key = area + address;
    if(hashmap.containsKey(key)) {
        return hashmap.get(key);
    } else {
        return ["00","00"];
    }
}

function putValue(area, address, value) {
    var key = area + address;
    hashmap.put(key, value);
}

module.exports = plc_server;