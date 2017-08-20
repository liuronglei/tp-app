const {app, globalShortcut, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const ipcMain = require('electron').ipcMain;
const m_cssz = require(path.join(__dirname, 'app/models/m_cssz'))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 1600, height:  900,autoHideMenuBar :true})
    //win.maximize();
    //win.setFullScreen(true);
    win.setMenu(null);
    // globalShortcut.register('ESC', function() {
    //     win.setFullScreen(!win.isFullScreen());
    // });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'app/views/tpsy/tpsy_sy.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    //win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
    app.quit()
}
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
    createWindow()
}
})
ipcMain.on('pageTo-ping-event', (event, arg) => {
    win.webContents.send('pageTo-pong-event', arg)
})
ipcMain.on('newWin-ping-event', (event, arg) => {
    win.webContents.send('newWin-pong-event', arg)
})

//保存全局变量
global.sharedObject = {
    rootdir: __dirname,
    barCodeArr: new Array(),
    checkInfoArr: new Array(),
};


//串口发送箱号给渲染进程
function scanBarCode(arg) {
    win.webContents.send('scanBarCode-pong-event', arg)
}
const scanner = require(path.join(__dirname, 'app/communication/comm_scanner'));
scanner.receive(function(barCode) {
    scanBarCode(barCode);
});

//plc发送电芯条码，实际容量，实际OCV4实际电压，实际内阻，ng原因给渲染进程
function addNgData(dataArr_addNG) {
    win.webContents.send('add_ng-pong-event',dataArr_addNG);
}
//封箱处理
function sealingDispose(dataArr_addNoraml) {
    //获得箱号
    var getValue_plc = require(path.join(__dirname, 'app/controllers/tpsy/getValue_plc'));
    getValue_plc.select_casenum(function(casenum) {
        //封箱处理
        var xh = parseInt(casenum) + 1;
        for(var key in dataArr_addNoraml) {
            dataArr_addNoraml[key].xh = xh;
        }
        win.webContents.send('sealing_dispose-pong-event',dataArr_addNoraml);
        //打印标签
        var csszMap = global.sharedObject.csszMap;
        var scgd = csszMap.get("scgd");
        var dyfwStr = csszMap.get("dyfw");
        var nzfwStr = csszMap.get("nzfw");
        var zxs = csszMap.get("zxs");
        const print = require(path.join(__dirname, 'app/communication/comm_print'));
        print.write(print.getData_TP({sxdh:scgd, rld:"", dw:"", dyfw:dyfwStr.replace(";","-"), nzfw:nzfwStr.replace(";","-"), sl:zxs, tm:xh}));
    });
}

//参数设置全局变量保存
function updateCssz() {
    m_cssz.fillCsszMap(function (hashmap) {
        global.sharedObject.csszMap = hashmap;
        //同时设置PLC参数
        plc.setCssz(hashmap);
        //如果勾选了ocv数据筛选，则读取对应ocv文件数据
        if(hashmap.get("sjsx") == "1" && (typeof global.sharedObject.excelMap == "undefined" || global.sharedObject.excelMap == null)) {
            saveOcvData();
        }
    });
}
//ocv勾选后，保存ocv数据
function saveOcvData() {
    var property = JSON.parse(fs.readFileSync(path.join(__dirname, 'app/config/config_ocv.json'), 'utf8'));
    global.sharedObject.excelMap = fileread.readData(property.FILE_PATH);
}
updateCssz();

//plc发送箱号，电芯条码
ipcMain.on('updateCssz-ping-event',(event) => {
    updateCssz();
})

//开始plc数据监听
var plc = require(path.join(__dirname, 'app/communication/comm_plc'));
plc.start();

//启动后，要清空扫码数据表
const m_barcode = require(path.join(__dirname, 'app/models/m_barcode'))
//m_barcode.clearData(function(){});
//定时取PLC数据（每200ms）
function schedulePLC(time) {
//    setInterval(function() {
    setTimeout(function() {
        //获取3个标记位
        plc.readAllFlag(function(flagArr){
            if(flagArr[0]) {
                m_barcode.queryBarCode(function (error, results, fields) {
                    if (error) throw error;
                    //保存电芯条码列表
                    var barCodeArr = global.sharedObject.barCodeArr;
                    for(var i=0; i<results.length; i++) {
                        //barCodeArr[barCodeArr.length] = results[i].barcode;
                        barCodeArr[barCodeArr.length] = 'KA2GA18 ' + (i + 101004);
                        console.log('barCode:' + results[i].barcode);
                    }
                    //如果参数设置勾选了OCV筛选，则需要传递OCV数据给PLC
                    var csszMap = global.sharedObject.csszMap;
                    if(csszMap.get("sjsx") == "1") {
                        var excelMap = global.sharedObject.excelMap;
                        var rlArr = new Array();
                        var ocv4Arr = new Array();
                        for(var i=0; i<results.length; i++) {
                            var barObj = excelMap.get(barcode);
                            rlArr[rlArr.length] = barObj[1];
                            ocv4Arr[ocv4Arr.length] = barObj[2];
                        }
                        console.log(rlArr);
                        console.log(ocv4Arr);
                        plc.writeBarInfo(rlArr,ocv4Arr);
                    }
                    //将标记位置为02，用于通知PLC已经存放数据
                    plc.finishBarCodeFlag();
                });
            }
            if(flagArr[1]) {
                plc.readCheckInfo(function(data) {
                    //保存电性能能检测结果列表
                    var checkInfoArr = global.sharedObject.barCodeArr;
                    console.log('checkInfo:');
                    console.log(data);
                });
                plc.resetCheckFlag();
            }
        });
    }, time);
}
schedulePLC(2000);

//填充首页表格数据
function filltable(dataArr_addNG) {
    win.webContents.send('filltable-pong-event',dataArr_addNG);
}


/*
 var dataformat = require(path.join(__dirname,'app/utils/dataformat'));
 console.log(new Buffer([0xD0,0x00,0x00,0xFF,0xFF,0x03,0x00,0x04,0x00,0x00,0x00,0x00,0x00]).toString('hex'));
 console.log(dataformat.bytes2hex([0xD0,0x00,0x00,0xFF,0xFF,0x03,0x00,0x04,0x00,0x00,0x00,0x00,0x00]));
 console.log(dataformat.hex2bytes('D00000FFFF0300040000000000'));
 console.log(dataformat.bytes2float(dataformat.hex2bytes('10DD0000')));

 var receiveData = 'hex12345';
 var hex = receiveData.substring(receiveData.length-2, receiveData.length);
 console.log(hex);
 var dataformat = require(path.join(__dirname,'app/utils/dataformat'));
 //console.log(dataformat.bytes2float(dataformat.hex2bytes('00000000')));
 console.log(dataformat.float2bytes(1));
 //console.log(dataformat.bytes2float(dataformat.float2bytes(3.14)));


 var dataformat = require(path.join(__dirname,'app/utils/dataformat'));
 console.log(dataformat.float2bytes(2000));

 */
//开始标签打印
/*
 const print = require(path.join(__dirname, 'app/communication/comm_print'));
 function boxLablePrint(data) {
 print.write(data);
 }
 boxLablePrint(print.getData_TP({sxdh:1, rld:2, dw:3, dyfw:4, nzfw:5, sl:6, tm:'1234567'}));
 */

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//箱号扫码
//天鹏MES
//显示到界面
//取到外观数据（条码）
//（获取PCI标记）根据条码获取到PLC检测数据
//NG数据入库
//（获取PCI标记）封箱
//生成箱号
//正常数据入库，天鹏MES