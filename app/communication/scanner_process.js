var SerialPort = require("serialport");  //引入模块
var fs = require('fs');
var property = JSON.parse(fs.readFileSync('config/config_scanner.json', 'utf8'));
var serialPort = new SerialPort(property.PRINT_PORT, {
    baudRate: property.PRINT_BAUDRATE,  //波特率
    dataBits: property.PRINT_DATABITS,    //数据位
    parity: 'none',   //奇偶校验
    stopBits: property.PRINT_STOPBITS,   //停止位
    flowControl: false
}, false);
serialPort.open(function(error){
    if(error){
        console.log("open serialport: "+error);
    }
    serialPort.on('data',function(data){
        console.log('dataShow:' + data);
    })
});
var aa = 15;
console.log(aa.toString(16));