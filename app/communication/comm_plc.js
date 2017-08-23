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
    //获得所有标记位内容
    readAllFlag : function(callBack) {
        plc_client.read("D", property.ADDRESS_FLAG, 6, function(hexStr) {
            var index_fix = 22; //报文返回内容起始下标值
            var len = 8;        //双字16进制位数
            var flagArr = [false, false, false];
            var tempStr = hexStr.substring(index_fix, index_fix + len);
            if(property.FLAG_TRUE == tempStr) {
                flagArr[0] = true;
            }
            tempStr = hexStr.substring(index_fix + len, index_fix + len*2);
            if(property.FLAG_TRUE == tempStr) {
                flagArr[1] = true;
            }
            tempStr = hexStr.substring(index_fix + len*2, index_fix + len*3);
            if(property.FLAG_TRUE == tempStr) {
                flagArr[2] = true;
            }
            callBack(flagArr);
        });
    },
    //外观扫码标记位置为已完成（PLC获取该标记位后，读取由上位机写入的OCV数据）
    finishBarCodeFlag : function() {
        plc_client.writeByte("D", property.ADDRESS_FLAG, 2, plc_client.getFlagByte(2));
    },
    //电性能检测完成标记位重置
    resetCheckFlag : function() {
        plc_client.writeByte("D", property.ADDRESS_FLAG + 2, 2, plc_client.getFlagByte(0));
    },
    //封箱完成标记位重置
    resetBoxFlag : function() {
        plc_client.writeByte("D", property.ADDRESS_FLAG + 4, 2, plc_client.getFlagByte(0));
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
        var zxs = csszHashMap.get('zxs');
        plc_client.writeFloat("D", property.ADDRESS_RLXX, 2, [parseFloat(rlfwArr[0])]); //容量下限
        plc_client.writeFloat("D", property.ADDRESS_RLSX, 2, [parseFloat(rlfwArr[1])]); //容量上限
        plc_client.writeFloat("D", property.ADDRESS_DYCXX, 2, [parseFloat(dycfwArr[0])]); //压差下限
        plc_client.writeFloat("D", property.ADDRESS_DYCSX, 2, [parseFloat(dycfwArr[1])]); //压差上限
        plc_client.writeFloat("D", property.ADDRESS_DYXX, 2, [parseFloat(dyfwArr[0])]); //电压下限
        plc_client.writeFloat("D", property.ADDRESS_DYSX, 2, [parseFloat(dyfwArr[1])]); //电压上限
        plc_client.writeFloat("D", property.ADDRESS_NZXX, 2, [parseFloat(nzfwArr[0])]); //内阻下限
        plc_client.writeFloat("D", property.ADDRESS_NZSX, 2, [parseFloat(nzfwArr[1])]); //内阻上限
        plc_client.writeInt("D", property.ADDRESS_ZCZXS, 2, parseInt(zxs)); //正常装箱数
        plc_client.writeByte("D", property.ADDRESS_SJSX, 2, sjsx == "1" ? plc_client.getFlagByte(1) : plc_client.getFlagByte(0)); //OCV勾选
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
        plc_client.writeFloat("D", property.ADDRESS_OCVDATA, 48, data); //OCV检测数据
    },
    //获取电性能检测结果数据
    readCheckInfo : function(callBack) {
        plc_client.read("D", property.ADDRESS_CHECKDATA, 116, function(hexStr) {
            var index_fix = 22; //报文返回内容起始下标值
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
            for(var i=0; i<nzArr.length; i++) {
                var tempStr = hexStr.substring(index_fix + len*i, index_fix + len*(i+1));
                nzArr[i] = dataformat.hex2float(tempStr);
            }
            for(var i=0; i<dyArr.length; i++) {
                var tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE+i), index_fix + len*(property.CHECK_NUM_SINGLE+i+1));
                dyArr[i] = Math.abs(dataformat.hex2float(tempStr));
            }
            for(var i=0; i<zztArr.length; i++) {
                var tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*i,
                    index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(i+1));
                zztArr[i] = tempStr == errorFlag ? false : true;
            }
            for(var i=0; i<dyztArr.length; i++) {
                var tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE+i),
                    index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE+i+1));
                dyztArr[i] = tempStr == errorFlag ? false : true;
            }
            for(var i=0; i<nzztArr.length; i++) {
                var tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*2+i),
                    index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*2+i+1));
                nzztArr[i] = tempStr == errorFlag ? false : true;
            }
            for(var i=0; i<rlztArr.length; i++) {
                var tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*3+i),
                    index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*3+i+1));
                rlztArr[i] = tempStr == errorFlag ? false : true;
            }
            for(var i=0; i<dycztArr.length; i++) {
                var tempStr = hexStr.substring(index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*4+i),
                    index_fix + len*(property.CHECK_NUM_SINGLE*2+4) + single_len*(property.CHECK_NUM_SINGLE*4+i+1));
                dycztArr[i] = tempStr == errorFlag ? false : true;
            }
            callBack(nzArr,dyArr,zztArr,dyztArr,nzztArr,rlztArr,dycztArr);
        });
    },
}
module.exports = plc;