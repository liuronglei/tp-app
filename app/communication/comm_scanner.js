/**
 * 扫码枪串口通信
 * @type {SerialPort|exports|module.exports}
 */
var SerialPort = require("serialport");  //引入模块
var fs = require('fs');
var path = require('path');
var __rootdir = global.sharedObject.rootdir;
var property = JSON.parse(fs.readFileSync(path.join(__rootdir,'app/config/config_scanner.json'), 'utf8'));
var serialPort = new SerialPort(property.PRINT_PORT, {
    baudRate: property.PRINT_BAUDRATE,  //波特率
    dataBits: property.PRINT_DATABITS,    //数据位
    parity: 'none',   //奇偶校验
    stopBits: property.PRINT_STOPBITS,   //停止位
    flowControl: false
}, false);
const scanner = {
    receive : function(callBack) {
        serialPort.open(function(error){
            if(error){
                console.log("open serialport-----: "+error);
            }
            serialPort.on('data',function(data){
                data = new Buffer(data).toString();
                var data = data.replace(/\ +/g, ""); //去掉空格
                data = data.replace(/[ ]/g, "");    //去掉空格
                data = data.replace(/[\r\n]/g, "")
                if(data == "") {
                    return;
                }
                console.log('boxCode:---' + data + "---");
                callBack(data);
            })
        });
    }
}
module.exports = scanner;