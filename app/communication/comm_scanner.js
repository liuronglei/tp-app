/**
 * 通讯相关_扫码枪串口通信
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
    stopBits: property.PRINT_STOPBITS,   //停止位,
    parser: SerialPort.parsers.Readline,
    autoOpen: false,
    //rtscts: true,
    //xon:true,
    //xoff:true,
    //xany:true,
    //lock:false,
    //buffersize:1024,
    //highWaterMark:16,
}, function() {});
var isSleep = false;
var barCode = "";
const scanner = {
    start : function(callBack) {
        serialPort.open(function(error) {
            if(error) console.log(error);
            callBack(error);
        });
    },
    receive : function(callBack) {
        serialPort.on('data',function(data){
            var returnData = new Buffer(data).toString();
            returnData = returnData.replace(/\ +/g, ""); //去掉空格
            returnData = returnData.replace(/[ ]/g, "");    //去掉空格
            returnData = returnData.replace(/[\r\n]/g, "");
            if(returnData == "") {
                return;
            }
            if(!isSleep) {
                isSleep = true;
                barCode = returnData;
                setTimeout(function() {
                    isSleep = false;
                    console.log('boxCode:---' + barCode + "---");
                    callBack(barCode);
                }, 200);
            } else {
                barCode += returnData;
            }
        })
    },
    close : function(callBack) {
        serialPort.close(callBack);
    }

}
module.exports = scanner;