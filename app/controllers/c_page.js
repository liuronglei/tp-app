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
    regMes : function (err,callBack) {
        ipc.on('xh-pong-event', function(event, arg) {
            callBack(err,arg);
        });
    },
    doValue_dx_isOcv : function (arg,value_rl,value_dy,value_dyc,value_nz) {
        ipc.send('value-ping-event', arg,value_rl,value_dy,value_dyc,value_nz);
    },
    regValue : function (err,callBack) {
        ipc.on('valueTo-pong-event', function(event,dxArr,dyArr,nzArr,ng_reason) {
            callBack(err,dxArr,dyArr,nzArr,ng_reason);
        });
    },
    regValue_casenum :function (err,callBack) {
        ipc.on('valueCaseTo-pong-event', function(event,casenum,dxArr) {
            callBack(err,casenum,dxArr);
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