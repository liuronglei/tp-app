var printSet = 'REFERENCE 0,0\n'
    + 'DIRECTION 1\n'
    + 'SET PEEL OFF\n'
    + 'SET COUNTER @0 1\n'
    + '@0="00001"\n'
    + 'SET COUNTER @1 1\n'
    + '@1="ABCD007"\n'
    + 'SET CUTTER OFF\n'
    + 'SIZE 100 mm ,65 mm\n'
    + 'GAP 3 mm,0\n'
    + 'DENSITY 8\n'
    + 'SPEED 3\n'
    + 'CLS\n';
var printData = 'BAR 300,300,1200,50\n'
    + 'BOX 600,250,700,50,5\n'
    + 'TEXT 250,390,"5",0,1,1,"DENSITY = 8"\n'
    + 'TEXT 250,40,"5",0,1,1,"SPEED = 4"\n'
    + 'TEXT 50,50,"5",0,1,1,@0\n'
    + 'TEXT 50,150,"5",0,1,1,"TSC PRINTER"\n'
    + 'BARCODE 50,300,"39",48,1,0,2,4,@1\n'
    + 'BARCODE 100,200,"128",48,1,0,2,4,"123456789"\n'
    + 'PRINT 1,1\n';
var SerialPort = require("serialport");  //引入模块
var fs = require('fs');
var property = JSON.parse(fs.readFileSync('config/config_print.json', 'utf8'));
var serialPort = new SerialPort(property.PRINT_PORT, {
    baudRate: property.PRINT_BAUDRATE,  //波特率
    dataBits: property.PRINT_DATABITS,    //数据位
    parity: 'none',   //奇偶校验
    stopBits: property.PRINT_STOPBITS,   //停止位
    flowControl: false
}, false);
const print_process = {
    write : function() {
        serialPort.open(function(error){
            if(error){
                console.log("open serialport: "+error);
            }
            serialPort.write(printSet + printData, function(err, results) {
                console.log('err ' + err);
                console.log('results ' + results);
            });
        });
    }
}
module.exports = print_process;
