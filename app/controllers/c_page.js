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
    regScanBarCode : function (callBack) {
        ipc.on('scanBarCode-pong-event', function(event, arg) {
            callBack(arg);
        });
    },
    updateCssz : function () {
        ipc.send('updateCssz-ping-event');
    },
    regValue_ng : function (callBack) {
        ipc.on('add_ng-pong-event', function(event,dataArr_addNG) {
            callBack(dataArr_addNG);
        });
    },
    regValue_casenum :function (callBack) {
        ipc.on('sealing_dispose-pong-event', function(event,dataArr_addNoraml) {
            callBack(dataArr_addNoraml);
        });
    },
    regFilltable : function (callBack) {
        ipc.on('filltable-pong-event', function(event,dataArr_filltable) {
            callBack(dataArr_filltable);
        });
    },
    regFillCombobox : function (callBack) {
        ipc.on('casenum_refresh-pong-event', function(event,dataArr) {
            callBack(dataArr);
        });
    },
    doPrint : function (dataArr) {
        ipc.send('casenumPrint-ping-event',dataArr);
    },
    boxError : function() {
        ipc.send('boxError-ping-event');
    },
    doQlfx : function () {
        ipc.send('clearBox-ping-event');
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