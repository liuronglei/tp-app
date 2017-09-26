/**
 * Created by liurong on 2017/8/10.
 */
var fs = require('fs');
var path = require('path');
var __rootdir = global.sharedObject.rootdir;
var dataformat = require(path.join(__rootdir,'app/utils/dataformat'));
var property = JSON.parse(fs.readFileSync(path.join(__rootdir,'app/config/config_plc.json'), 'utf8'));
var plc_client = require(path.join(__rootdir,'app/utils/plc_client'));
const plc = {
    //开始监听
    start: function() {
        plc_client.dataReceive();
    },
    //初始化读写标记
    initFlag: function() {
        plc_client.initFlag();
    },
    //获得条码标记位内容
    readBarCodeFlag : function(callBack) {
        plc_client.read("D", property.ADDRESS_FLAG_BARCODE, 2, function(error,hexStr) {
            var flag = false;
            var tempStr = hexStr;
            if(property.FLAG_TRUE == tempStr) {
                flag = true;
            }
            callBack(flag);
        });
    },
    //获得检测标记位内容
    readCheckFlag : function(callBack) {
        plc_client.read("D", property.ADDRESS_FLAG_CHECK, 2, function(error,hexStr) {
            var flag = false;
            var tempStr = hexStr;
            if(property.FLAG_TRUE == tempStr) {
                flag = true;
            }
            callBack(flag);
        });
    },
    //获得封箱标记位内容
    readBoxFlag : function(callBack) {
        plc_client.read("D", property.ADDRESS_FLAG_BOX, 2, function(error,hexStr) {
            var flag = false;
            var tempStr = hexStr;
            if(property.FLAG_TRUE == tempStr) {
                flag = true;
            }
            callBack(flag);
        });
    },
    //获得初始化标记位内容
    readInitFlag : function(callBack) {
        plc_client.read("D", property.ADDRESS_FLAG_INIT, 2, function(error,hexStr) {
            var flag = false;
            var tempStr = hexStr;
            if(property.FLAG_TRUE == tempStr) {
                flag = true;
            }
            callBack(flag);
        });
    },
    //将扫码完成置为1（PLC获取该标记位后，读取由上位机写入的OCV数据）
    finishOcvFlag : function() {
        plc_client.writeInt("D", property.ADDRESS_OCVWC, 2, [1],function(error,hexStr){
            if(error) {
                console.log("error to write flag finishOcvFlag");
            }
        });
    },
    //外观扫码标记位重置
    resetBarCodeFlag : function(callBack) {
        plc_client.writeInt("D", property.ADDRESS_FLAG_BARCODE, 2, [0],function(error,hexStr){
            if(error) {
                console.log("error to write flag resetBarCodeFlag");
                callBack(true);
            } else {
                callBack(false);
            }
        });
    },
    //电性能检测完成标记位重置
    resetCheckFlag : function(callBack) {
        plc_client.writeInt("D", property.ADDRESS_FLAG_CHECK, 2, [0],function(error,hexStr){
            if(error) {
                console.log("error to write flag resetCheckFlag");
                callBack(true);
            } else {
                callBack(false);
            }
        });
    },
    //封箱完成标记位重置
    resetBoxFlag : function(callBack) {
        plc_client.writeInt("D", property.ADDRESS_FLAG_BOX, 2, [0],function(error,hexStr){
            if(error) {
                console.log("error to write flag resetBoxFlag");
                callBack(true);
            } else {
                callBack(false);
            }
        });
    },
    //初始化完成标记位重置
    resetInitFlag : function(callBack) {
        plc_client.writeInt("D", property.ADDRESS_FLAG_INIT, 2, [0],function(error,hexStr){
            if(error) {
                console.log("error to write flag resetInitFlag");
                callBack(true);
            } else {
                callBack(false);
            }
        });
    },
    //系统参数写入
    setCssz : function(csszHashMap) {
        var rlfw = csszHashMap.get('rlfw');
        var rlfwArr = rlfw.split(";");
        var dycfw = csszHashMap.get('dycfw');
        var dycfwArr = dycfw.split(";");
        var dyfw = csszHashMap.get('dyfw');
        var dyfwArr = dyfw.split(";");
        var nzfw = csszHashMap.get('nzfw');
        var nzfwArr = nzfw.split(";");
        var sjsx = csszHashMap.get('sjsx');
        var sfsm = csszHashMap.get('sfsm');
        var zxs = csszHashMap.get('zxs');
        plc_client.writeFloat("D", property.ADDRESS_RLXX, 2, [parseFloat(rlfwArr[0])], function(){}); //容量下限
        plc_client.writeFloat("D", property.ADDRESS_RLSX, 2, [parseFloat(rlfwArr[1])], function(){}); //容量上限
        plc_client.writeFloat("D", property.ADDRESS_DYCXX, 2, [parseFloat(dycfwArr[0])], function(){}); //压差下限
        plc_client.writeFloat("D", property.ADDRESS_DYCSX, 2, [parseFloat(dycfwArr[1])], function(){}); //压差上限
        plc_client.writeFloat("D", property.ADDRESS_DYXX, 2, [parseFloat(dyfwArr[0])], function(){}); //电压下限
        plc_client.writeFloat("D", property.ADDRESS_DYSX, 2, [parseFloat(dyfwArr[1])], function(){}); //电压上限
        plc_client.writeFloat("D", property.ADDRESS_NZXX, 2, [parseFloat(nzfwArr[0])], function(){}); //内阻下限
        plc_client.writeFloat("D", property.ADDRESS_NZSX, 2, [parseFloat(nzfwArr[1])], function(){}); //内阻上限
        plc_client.writeInt("D", property.ADDRESS_ZCZXS, 2, [parseInt(zxs)], function(){}); //正常装箱数
        plc_client.writeInt("D", property.ADDRESS_SJSX, 2, sjsx == "1" ? [1] : [0], function(){}); //OCV勾选
        plc_client.writeInt("D", property.ADDRESS_SFSM, 2, sfsm != "1" ? [1] : [0], function(){}); //是否扫码勾选
    },
    //写入电芯扫码结果
    writeBarCodeFlag : function(data, count) {
        var value = parseInt(data, 2);
        plc_client.writeInt("D", property.ADDRESS_FLAG_BARCODE_RESULT, 2, [value], function(){});
    },
    //写入电芯OCV数据
    writeBarInfo : function(rlArr,ocv4Arr) {
        var data = new Array();
        for(var i=0; i<rlArr.length; i++) {
            data[data.length] = rlArr[i];
        }
        for(var i=0; i<ocv4Arr.length; i++) {
            data[data.length] = ocv4Arr[i];
        }
        plc_client.writeFloat("D", property.ADDRESS_OCVDATA, 48, data, function(){}); //OCV检测数据
    },
    //获取电性能检测结果数据
    readCheckInfo : function(callBack) {
        plc_client.read("D", property.ADDRESS_CHECKDATA, 116, function(error,hexStr) {
            var len = 8;        //双字16进制位数
            var single_len = 4; //单字16进制位数
            var errorFlag = "0100";
            var nzArr = new Array(property.CHECK_NUM_SINGLE);
            var dyArr = new Array(property.CHECK_NUM_SINGLE);
            var zztArr = new Array(property.CHECK_NUM_SINGLE);
            var dyztArr = new Array(property.CHECK_NUM_SINGLE);
            var nzztArr = new Array(property.CHECK_NUM_SINGLE);
            var rlztArr = new Array(property.CHECK_NUM_SINGLE);
            var dycztArr = new Array(property.CHECK_NUM_SINGLE);
            //D4000开始，获取内阻和电压检测值
            for(var i=0; i<nzArr.length; i++) {
                var tempStr = hexStr.substring(len*i, len*(i+1));
                nzArr[i] = dataformat.hex2float_r(tempStr);
            }
            for(var i=0; i<dyArr.length; i++) {
                var tempStr = hexStr.substring(len*(property.CHECK_NUM_SINGLE+i), len*(property.CHECK_NUM_SINGLE+i+1));
                dyArr[i] = Math.abs(dataformat.hex2float_r(tempStr));
            }
            //D4056开始，获取NG状态标记位，标记位为1个单字
            //中间4个双字是容量范围和电压差范围，所以要跳过
            for(var i=0; i<zztArr.length; i++) {
                var tempStr = hexStr.substring(len*(property.CHECK_NUM_SINGLE*2+4) + single_len*i,
                    len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(i+1));
                zztArr[i] = tempStr == errorFlag ? false : true;
            }
            for(var i=0; i<dyztArr.length; i++) {
                var tempStr = hexStr.substring(len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE+i),
                    len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE+i+1));
                dyztArr[i] = tempStr == errorFlag ? false : true;
            }
            for(var i=0; i<nzztArr.length; i++) {
                var tempStr = hexStr.substring(len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*2+i),
                    len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*2+i+1));
                nzztArr[i] = tempStr == errorFlag ? false : true;
            }
            for(var i=0; i<rlztArr.length; i++) {
                var tempStr = hexStr.substring(len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*3+i),
                    len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*3+i+1));
                rlztArr[i] = tempStr == errorFlag ? false : true;
            }
            for(var i=0; i<dycztArr.length; i++) {
                var tempStr = hexStr.substring(len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*4+i),
                    len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*4+i+1));
                dycztArr[i] = tempStr == errorFlag ? false : true;
            }
            callBack(nzArr,dyArr,zztArr,dyztArr,nzztArr,rlztArr,dycztArr);
        });
    },

}
module.exports = plc;