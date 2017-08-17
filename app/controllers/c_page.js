/**
 * Created by lenovo on 2017/7/6.
 */
//进程之间的通信
const ipc = require('electron').ipcRenderer;
const c_page = {
    regPageToEvent  : function(callBack) {
        ipc.on('pageTo-pong-event', function(event, arg) {
            callBack(arg);
        });
    },
    doPageToEvent  : function(arg) {
        ipc.send('pageTo-ping-event', arg);
    },

    regNewWinEvent  : function(callBack) {
        ipc.on('newWin-pong-event', function(event, arg) {
            callBack(arg);
        });
    },

    doNewWinEvent  : function(arg) {
        //事件监听方式
        ipc.send('newWin-ping-event', arg);
        //easyui窗口组件方式
    },
    regXh : function (err,callBack) {
        ipc.on('xh-pong-event', function(event, arg) {
            callBack(err,arg);
        });
    },
    doValue_fw : function (dataArr_toPlc) {
        ipc.send('value_fw-ping-event', dataArr_toPlc);
    },
    regValue_ng : function (err,callBack) {
        ipc.on('add_ng-pong-event', function(event,dataArr_addNG) {
            callBack(err,dataArr_addNG);
        });
    },
    regValue_casenum :function (err,callBack) {
        ipc.on('sealing_dispose-pong-event', function(event,dataArr_addNoraml) {
            callBack(err,dataArr_addNoraml);
        });
    },

    /*
     * 打开万克LOGO指定的页面
     */
    pageLink  : function(url) {
        var shell = require('electron').shell;
        shell.openExternal(url);
    }
}
module.exports = c_page;