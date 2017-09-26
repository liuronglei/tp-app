/**
 * Created by Administrator on 2017/9/5 0005.
 */
var fs = require('fs');
/*var path = require('path');
var __rootdir = global.sharedObject.rootdir;
var plc_client = require(path.join(__rootdir,'app/utils/plc_client'));
var lower_machine = require(path.join(__rootdir,'app/utils/lower_machine'));
var dataformat = require(path.join(__rootdir,'app/utils/dataformat'));
var property = JSON.parse(fs.readFileSync(path.join(__rootdir,'app/config/config_plc.json'), 'utf8'));*/
var plc_client = require('../utils/plc_client');
var lower_machine = require('../communication/lower_machine');
var dataformat = require('../utils/dataformat');
var property = JSON.parse(fs.readFileSync('app/config/config_plc.json'));

/*var data = [];
// 容量OCV数据模拟
for(var i = 0; i < property.CHECK_NUM_SINGLE; i++){
    data[data.length] = (Math.random()*100+2200).toFixed(2);
}
for(var j = 0; j < property.CHECK_NUM_SINGLE; j++){
    data[data.length] = (Math.random()*60+3600).toFixed(3);
}
var rlfw_max = '2300.00';
var rlfw_min = '2200.00';
var dycfw_max = '30.00';
var dycfw_min = '-30.00';
var dyfw_max = '3700.00';
var dyfw_min = '3600.00';
var nzfw_max = '50.00';
var nzfw_min = '30.00';
var sjsx = '1';
var sfsm = '0';
var zxs = '256';
var str = '1000000000000000';

plc_client.writeFloat("D", property.ADDRESS_DYCXX, 2, [parseFloat(dycfw_min)], function(){}); //压差下限
plc_client.writeFloat("D", property.ADDRESS_DYCSX, 2, [parseFloat(dycfw_max)], function(){}); //压差上限
plc_client.writeFloat("D", property.ADDRESS_RLXX, 2, [parseFloat(rlfw_min)], function(){}); //容量下限
plc_client.writeFloat("D", property.ADDRESS_RLSX, 2, [parseFloat(rlfw_max)], function(){}); //容量上限
plc_client.writeFloat("D", property.ADDRESS_DYXX, 2, [parseFloat(dyfw_min)], function(){}); //电压下限
plc_client.writeFloat("D", property.ADDRESS_DYSX, 2, [parseFloat(dyfw_max)], function(){}); //电压上限
plc_client.writeFloat("D", property.ADDRESS_NZXX, 2, [parseFloat(nzfw_min)], function(){}); //内阻下限
plc_client.writeFloat("D", property.ADDRESS_NZSX, 2, [parseFloat(nzfw_max)], function(){}); //内阻上限
plc_client.writeInt("D", property.ADDRESS_ZCZXS, 2, parseInt(zxs), function(){}); //正常装箱数
plc_client.writeByte("D", property.ADDRESS_SJSX, 2, sjsx == "1" ? plc_client.getFlagByte(1) : plc_client.getFlagByte(0), function(){}); //OCV勾选
plc_client.writeByte("D", property.ADDRESS_SFSM, 2, sfsm != "1" ? plc_client.getFlagByte(1) : plc_client.getFlagByte(0), function(){}); //是否扫码勾选
plc_client.writeBinary("D", property.ADDRESS_FLAG_BARCODE_RESULT, 2, str, function(){});
plc_client.writeByte("D", property.ADDRESS_OCVWC, 2, plc_client.getFlagByte(1),function(error,hexStr){
    if(error) {
        console.log("error to write flag finishOcvFlag");
        //plc.finishOcvFlag();
    }
});*/
/*plc_client.read("D", property.ADDRESS_OCVWC, 2, function(error,hexStr) {
    var str = hexStr.slice(responsedata);//截取数据位
    console.log(hexStr);
    //console.log(dataformat.bytes2float(dataformat.hex2bytes(str)).toFixed(2));//浮点数保存
    var bytesArr = dataformat.hex2bytes(str);
    var int_num = bytesArr[0] + bytesArr[1]*256+bytesArr[2]*256*256+bytesArr[3]*256*256*256;
    console.log(int_num);//整数保存
    console.log("读取成功");
});*/
const responsedata = 22;
const plc_simulation = {
    start:function () {
        plc_client.writeInt("D", property.ADDRESS_FLAG_INIT, 2,[1], function (){});
        setInterval(finishOcv,200);
        function finishOcv(){
            lower_machine.finishOcv(function (flag) {
                if(flag){
                    setTimeout(start_plc,1000);
                }
            });
        }
        function start_plc() {
            lower_machine.getnzdyfw(function (dyxx,dysx,nzxx,nzsx) {
                lower_machine.getrldycfw(function(dycxx,dycsx,rlxx,rlsx) {
                    var json_fw = {
                        dyxx:dyxx,
                        dysx:dysx,
                        nzxx:nzxx,
                        nzsx:nzsx,
                        dycxx:dycxx,
                        dycsx:dycsx,
                        rlxx:rlxx,
                        rlsx:rlsx
                    };
                    plc_client.read("D", property.ADDRESS_SJSX, 2, function(error,hexStr) {
                        var int_num = dataformat.hex2int_r(hexStr);
                        if(int_num){
                            plc_client.read("D", property.ADDRESS_OCVWC, 2, function(error,hexStr) {
                                var int_num = dataformat.hex2int_r(hexStr);
                                if(int_num){
                                    lower_machine.getrlocvArr(function (rlArr, ocvArr) {
                                        lower_machine.sorting(json_fw, rlArr, ocvArr);
                                    });
                                }
                            });
                        }
                        else{
                            var rlArr = [];
                            var ocvArr = [];
                            for(var i = 0;i < 12; i++){
                                rlArr.push(0);
                                ocvArr.push(0);
                            }
                            lower_machine.sorting(json_fw, rlArr, ocvArr);
                        }
                    });
                });
            });
        }
    }
};

module.exports = plc_simulation;