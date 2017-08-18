/**
 * 打印机串口通信
 * @type {string}
 */
var SerialPort = require("serialport");  //引入模块
var fs = require('fs');
var property = JSON.parse(fs.readFileSync('app/config/config_print.json', 'utf8'));

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
const printData = ''
    //横线
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
    + 'TEXT 20,' + (lineStart + 10) + ',"TSS24.BF2",0,1,1,"筛选单号："\n'
    + 'TEXT 20,' + (lineStart + lineStep + 10) + ',"TSS24.BF2",0,1,1,"容量档："\n'
    + 'TEXT 20,' + (lineStart + 2*lineStep + 10) + ',"TSS24.BF2",0,1,1,"档位："\n'
    + 'TEXT 20,' + (lineStart + 3*lineStep + 10) + ',"TSS24.BF2",0,1,1,"电压范围："\n'
    + 'TEXT 20,' + (lineStart + 4*lineStep + 10) + ',"TSS24.BF2",0,1,1,"内阻范围："\n'
    + 'TEXT 20,' + (lineStart + 5*lineStep + 10) + ',"TSS24.BF2",0,1,1,"数量："\n'
    //内容
    + 'TEXT 210,' + (lineStart + 13) + ',"3",0,1,1,"data_sxdh"\n'
    + 'TEXT 210,' + (lineStart + lineStep + 13) + ',"3",0,1,1,"data_rld"\n'
    + 'TEXT 210,' + (lineStart + 2*lineStep + 13) + ',"3",0,1,1,"data_dw"\n'
    + 'TEXT 210,' + (lineStart + 3*lineStep + 13) + ',"3",0,1,1,"data_dyfw"\n'
    + 'TEXT 210,' + (lineStart + 4*lineStep + 13) + ',"3",0,1,1,"data_nzfw"\n'
    + 'TEXT 210,' + (lineStart + 5*lineStep + 13) + ',"3",0,1,1,"data_sl"\n'
    + 'TEXT 430,' + (lineStart + 13) + ',"3",0,1,1,"data_sj"\n'
    //条码
    + 'BARCODE 450,100,"128",96,1,0,3,5,"data_tm"\n'
    //开始打印
    + 'PRINT 1,1\n';
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
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
        //console.log(printSet + returnData);
        return printSet + returnData;
    }
}
module.exports = print;
