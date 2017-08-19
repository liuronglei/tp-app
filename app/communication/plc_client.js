/**
 * Created by liurong on 2017/8/14.
 */
var fs = require('fs');
var net = require('net');
var path = require('path');
var __rootdir = global.sharedObject.rootdir;
var dataformat = require(path.join(__rootdir,'app/utils/dataformat'));
var property = JSON.parse(fs.readFileSync(path.join(__rootdir,'app/config/config_plc.json'), 'utf8'));
var client= new net.Socket();
client.setEncoding('binary');
console.log(property.PLC_PORT);
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
    receiveFlag : function(len,callBack) {
        client.on('data',function(data){
            console.log(data);
            var response = new Array(11+len);
            for(var i=0;i<response.length;i++){
                console.log((response[i]&0xFF).toString(16));
            }
            hex = (response[11]&0xFF).toString(16);
            if(hex.length()<2){
                hex="0"+hex;
            }
            var returnValue = false;
            if(hex == "10" || hex == "11") {
                returnValue = true;
            } else if(hex == "00" || hex == "01") {
                returnValue = false;
            } else {
                console.log("readFlag Error！！！！");
                returnValue = false;
            }
            console.log('recv data:'+ returnValue);
            callBack(returnValue);
        });
    },
    receiveInfo : function(len,callBack) {
        client.on('data',function(data){
            console.log('recv data old:');
            console.log(data);
            var hex = new Array(len*2);
            var response = new Array(11+len*2);
            response = data;
            var response_frame = new Array(len*2);
            for(var i=0;i<response.length;i++){
                console.log((response[i]&0xFF).toString(16));
            }
            for(var i=11;i<response.length;i++){
                response_frame[i-11]=response[i];
                hex[i-11]=(response_frame[i-11]&0xFF).toString(16);
                if(hex[i-11].length<2){
                    hex[i-11]="0"+hex[i-11];
                }
            }
            console.log('recv data new:'+ hex);
            callBack(hex);
        });
    },
    write : function(data) {
        client.write(new Buffer(data));
    }
}
module.exports = _client;