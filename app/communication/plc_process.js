/**
 * Created by liurong on 2017/8/10.
 */
var path = require('path');
var __rootdir = global.sharedObject.rootdir;
const plc = require(path.join(__rootdir,"app/communication/comm_plc"));
const m_barcode = require(path.join(__rootdir, 'app/models/m_barcode'))
const plc_process = {
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
        plc.write("D", 1734, [parseFloat(rlfwArr[0])]); //容量下限
        plc.write("D", 1736, [parseFloat(rlfwArr[1])]); //容量上限
        plc.write("D", 1730, [parseFloat(dycfwArr[0])]); //压差下限
        plc.write("D", 1732, [parseFloat(dycfwArr[1])]); //压差上限
        plc.write("D", 1600, [parseFloat(dyfwArr[0])]); //电压下限
        plc.write("D", 1602, [parseFloat(dyfwArr[1])]); //电压上限
        plc.write("D", 1604, [parseFloat(nzfwArr[0])]); //内阻下限
        plc.write("D", 1606, [parseFloat(nzfwArr[1])]); //内阻上限
        plc.write("D", 2626, [parseFloat(zxs)]); //正常装箱数
        plc.write("M", 2530, [parseFloat(sjsx)]); //OCV勾选
    },
    writeBarInfo : function(rlArr,ocv4Arr) {
        var data = new Array();
        for(var i=0; i<rlArr.length; i++) {
            data[data.length] = parseFloat(rlArr[i]);
        }
        for(var i=0; i<ocv4Arr.length; i++) {
            data[data.length] = parseFloat(ocv4Arr[i]);
        }
        plc.write("D", 1800, data); //OCV检测数据
    },
    readCheckInfo : function(callBack) {
        plc.getFlag("M", 511, 1, function(data) {
            if(data == 1) {
                plc.read("D", 4000, 116, function(data) {
                    bytes2float
                    callBack(data);
                });
            }
        });
    },
    readBarCodeInfo : function(callBack) {
        plc.getFlag("D", 101, 1, function(data) {
            if(data == 1) {
                m_barcode.queryBarCode(callBack);
            }
        });
    }
}
module.exports = plc_process;