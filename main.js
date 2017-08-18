const {app, globalShortcut, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain;
const fileread = require('./app/controllers/tpsy/fileread.js')
const m_cssz = require('./app/controllers/tpsy/m_cssz');

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
  win.webContents.openDevTools()

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

//串口发送箱号给渲染进程
ipcMain.on('xh-ping-event',(event, arg) => {
  win.webContents.send('xh-pong-event', arg)
})
//plc发送电芯条码，实际容量，实际OCV4实际电压，实际内阻，ng原因给渲染进程
ipcMain.on('add_ng-ping-event',(event, dataArr_addNG) => {
  win.webContents.send('add_ng-pong-event',dataArr_addNG);
})
//plc发送箱号，电芯条码
ipcMain.on('sealing_dispose-ping-event',(event,dataArr_addNoraml) => {
  win.webContents.send('sealing_dispose-pong-event',dataArr_addNoraml);
})

//plc从渲染进程接受参数
function getValue_ym(callback) {
    ipcMain.on('value_fw-ping-event',(event,dataObj_toPlc) => {
    })
    callback(dataObj_toPlc);
}
//plc从数据库接受参数
function getValue_db(callback) {
  m_cssz.query_csszInit(function (err,result) {
    if(err) throw err;
    callback(result.recordset[10].value,result.recordset[4].value,result.recordset[5].value,result.recordset[6].value,result.recordset[7].value);
  })
}



//保存全局变量
global.sharedObject = {
    rootdir: __dirname,
    excelMap:fileread.readData('D:\\公司\\tianpeng\\文档数据\\Detail_01.csv'),
};

m_cssz.fillCsszMap(function (hashmap) {
    global.sharedObject.csszMap = hashmap;
});

//
//require('./app/communication/plc_service');
//require('./app/communication/plc_process');
require('./app/communication/scanner_process');
//var print_process = require('./app/communication/print_process');
//print_process.write();

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.