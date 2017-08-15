/**
 * Created by liurong on 2017/8/14.
 */
var fs = require('fs');
var net = require('net');
var path = require('path');
var dataformat = require('app/utils/dataformat');
var property = JSON.parse(fs.readFileSync('config/config_plc.json', 'utf8'));
var dataFlag =
var client= new net.Socket();
client.setEncoding('binary');
//连接到服务端
client.connect(parseInt(property.PLC_PORT),property.PLC_IP,function(){
    console.log('connected');
});
client.on('data',function(data){
    console.log('recv data:'+ data);
});
client.on('error',function(error){
    console.log('error:'+error);
    //client.destory();
});
client.on('close',function(){
    console.log('Connection closed');
});
module.exports = client;