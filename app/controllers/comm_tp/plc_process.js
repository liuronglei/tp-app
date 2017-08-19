/**
 * Created by liurong on 2017/8/10.
 */
const plc = require("../../communication/comm_plc");
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
        plc.write("D", 1734, parseFloat(rlfwArr[0])); //容量下限
        plc.write("D", 1736, parseFloat(rlfwArr[1])); //容量上限
        plc.write("D", 1730, parseFloat(dycfwArr[0])); //压差下限
        plc.write("D", 1732, parseFloat(dycfwArr[1])); //压差上限
        plc.write("D", 1600, parseFloat(dyfwArr[0])); //电压下限
        plc.write("D", 1602, parseFloat(dyfwArr[1])); //电压上限
        plc.write("D", 1604, parseFloat(nzfwArr[0])); //内阻下限
        plc.write("D", 1606, parseFloat(nzfwArr[1])); //内阻上限
        plc.write("D", 2626, parseFloat(zxs)); //正常装箱数
        plc.write("M", 2530, parseFloat(sjsx)); //OCV勾选
    },
    readCheckInfo : function(callBack) {
        /*
        plc.getFlag("M", 511, 1, function(data) {
            if(data == 1) {
                plc.read("D", 4000, 116, function(data) {
                    callBack(data);
                });
            }
        });
        */
    },
    readBarCodeInfo : function(callBack) {
        /*
        plc.getFlag("M", 511, 1, function(data) {
            if(data == 1) {
                plc.read("D", 4000, 116, function(data) {
                    callBack(data);
                });
            }
        });
        */
    }
}
module.exports = plc_process;