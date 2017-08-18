/**
 * Created by liurong on 2017/8/14.
 */
var fs = require('fs');
var net = require('net');
var path = require('path');
var dataformat = require('../utils/dataformat');
var property = JSON.parse(fs.readFileSync('app/config/config_plc.json', 'utf8'));
var client= new net.Socket();
client.setEncoding('binary');
//连接到服务端
client.connect(parseInt(property.PLC_PORT),property.PLC_IP,function(){
    console.log('connected');
});
client.on('error',function(error){
    console.log('error:'+error);
    //client.destory();
});
client.on('close',function(){
    console.log('Connection closed');
});
const _client = {
    receive : function(callBack) {
        client.on('data',function(data){
            callBack(data);
            console.log('recv data:'+ data);
        });
    },
    write : function(data) {
        client.write(new Buffer(data));
    }
}
module.exports = _client;