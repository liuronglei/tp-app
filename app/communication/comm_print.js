/**
 * 打印机串口通信
 * @type {string}
 */
var SerialPort = require("serialport");  //引入模块
var fs = require('fs');
var path = require('path');
var __rootdir = global.sharedObject.rootdir;
var property = JSON.parse(fs.readFileSync(path.join(__rootdir,'app/config/config_print.json'), 'utf8'));

const lineStart = 10;
const lineStep = 48;
const printSet = 'REFERENCE 0,10\n'    //打印起始位置参考坐标，单位dot，200 DPI : 1 mm = 8  dots  300 DPI : 1 mm = 12 dots  600 DPI : 1 mm = 24 dots
    + 'DIRECTION 1\n'               //出纸方向，1或0，正着出或者反着出
    + 'SET PEEL OFF\n'
    + 'SET COUNTER @0 1\n'
    + '@0="00001"\n'
    + 'SET COUNTER @1 1\n'
    + '@1="ABCD007"\n'
    + 'SET CUTTER OFF\n'
    + 'SIZE 100 mm ,40 mm\n'        //纸张宽高
    + 'GAP 3 mm,0\n'                //纸张间距
    + 'DENSITY 8\n'                 //打印浓度，从0~15
    + 'SPEED 3\n'
    + 'CLS\n';
 const printTcx ='D:\>COPY CON LPT1\n'
     + 'DOWNLOAD "PRINT.PCX",10188,^Z\n'
     + 'COPY PRINT.PCX /B LPT1\n'
     + 'COPY CON LPT1\n'
     + 'MOVE\n'
     + '＾Z\n';
const printTcx_fixed ='D:\>COPY CON LPT1\n'
    + 'DOWNLOAD F,"PRINT.PCX",10542,^Z\n'
    + 'COPY PRINT.PCX /B LPT1\n'
    + 'COPY CON LPT1\n';
const printData = ''
    //背景图
    + 'PUTPCX 0,0,"PRINT.PCX"\n'
    //横线
    /*
    + 'BAR 10, ' + lineStart + ', 770, 3\n'
    + 'BAR 10, ' + (lineStart + lineStep) + ', 770, 3\n'
    + 'BAR 10, ' + (lineStart + 2*lineStep) + ', 400, 3\n'
    + 'BAR 10, ' + (lineStart + 3*lineStep) + ', 400, 3\n'
    + 'BAR 10, ' + (lineStart + 4*lineStep) + ', 400, 3\n'
    + 'BAR 10, ' + (lineStart + 5*lineStep) + ', 400, 3\n'
    + 'BAR 10, ' + (lineStart + 6*lineStep) + ', 770, 3\n'
    //竖线
    + 'BAR 10, 10, 3, 290\n'
    + 'BAR 200, 10, 3, 290\n'
    + 'BAR 410, 10, 3, 290\n'
    + 'BAR 780, 10, 3, 290\n'
    //内容标题
    + 'TEXT 20,' + (lineStart + 10) + ',"Font001",0,1,1,"筛选单号："\n'
    + 'TEXT 20,' + (lineStart + lineStep + 10) + ',"Arial",0,1,1,"容量档："\n'
    + 'TEXT 20,' + (lineStart + 2*lineStep + 10) + ',"3",0,1,1,"档位："\n'
    + 'TEXT 20,' + (lineStart + 3*lineStep + 10) + ',"TSS24.BF2",0,1,1,"电压范围："\n'
    + 'TEXT 20,' + (lineStart + 4*lineStep + 10) + ',"TST16.BF2",0,1,1,"内阻范围："\n'
    + 'TEXT 20,' + (lineStart + 5*lineStep + 10) + ',"TST16.BF2",0,1,1,"数量："\n'
     */
    //内容
    + 'TEXT 230,' + (lineStart + 18) + ',"3",0,1,1,"data_sxdh"\n'
    + 'TEXT 230,' + (lineStart + lineStep + 18) + ',"3",0,1,1,"data_rld"\n'
    + 'TEXT 230,' + (lineStart + 2*lineStep + 18) + ',"3",0,1,1,"data_rlfw"\n'
    + 'TEXT 230,' + (lineStart + 3*lineStep + 18) + ',"3",0,1,1,"data_dyfw"\n'
    + 'TEXT 230,' + (lineStart + 4*lineStep + 18) + ',"3",0,1,1,"data_nzfw"\n'
    + 'TEXT 230,' + (lineStart + 5*lineStep + 18) + ',"3",0,1,1,"data_sl"\n'
    + 'TEXT 460,' + (lineStart + 18) + ',"3",0,1,1,"data_sj"\n'
    //条码
    + 'BARCODE 460,100,"128",96,1,0,3,5,"data_tm"\n'
    //开始打印
    + 'PRINT 1,1\n';
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }

    var currentdate = year + seperator1 + month + seperator1 + strDate
        + " " + hours + seperator2 + minutes + seperator2 + seconds;
    return currentdate;
}
var serialPort = new SerialPort(property.PRINT_PORT, {
    baudRate: property.PRINT_BAUDRATE,  //波特率
    dataBits: property.PRINT_DATABITS,    //数据位
    parity: 'none',   //奇偶校验
    stopBits: property.PRINT_STOPBITS,   //停止位
    flowControl: false
}, false);
const print = {
    write : function(data) {
        serialPort.open(function(error){
            if(error){
                console.log("open serialport: "+error);
            }
            serialPort.write(data, function(err, results) {
                console.log('err ' + err);
                console.log('results ' + results);
            });
        });
    },
    //xxdh, rld, dw, dyfw, nzfw, sl, tm
    getData_TP : function(dataJson) {
        var returnData = printData;
        for(var key in dataJson) {
            returnData = returnData.replace('data_' + key, dataJson[key]);
        }
        returnData = returnData.replace('data_sj', getNowFormatDate());
        return printSet + returnData;
    }
}
module.exports = print;
