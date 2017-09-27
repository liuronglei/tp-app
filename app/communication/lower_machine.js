/**
 * Created by Administrator on 2017/9/19 0019.
 */
var fs = require('fs');
var plc_client = require('../utils/plc_client');
var dataformat = require('../utils/dataformat');
var property = JSON.parse(fs.readFileSync('app/config/config_plc.json'));
var normalBarcode = 0;
var ngBarcode = 0;
const responsedata = 22;
const len = 8;        //双字16进制位数
var lower_machinel = {
    //读取内阻，电压范围
    getnzdyfw : function (callBack) {
        plc_client.read("D", property.ADDRESS_DYXX, 8, function(error,hexStr) {
            var dyxx = hexStr.substr(0,len);
            var dysx = hexStr.substr(len,len);
            var nzxx = hexStr.substr(len*2 ,len);
            var nzsx = hexStr.substr(len*3 ,len);
            nzxx = dataformat.hex2float_r(nzxx).toFixed(2);
            nzsx = dataformat.hex2float_r(nzsx).toFixed(2);
            dyxx = dataformat.hex2float_r(dyxx).toFixed(2);
            dysx = dataformat.hex2float_r(dysx).toFixed(2);
            callBack(dyxx,dysx,nzxx,nzsx);
        });
    },
    //读取容量，电压差范围
    getrldycfw : function (callBack) {
        plc_client.read("D", property.ADDRESS_DYCXX, 8, function(error,hexStr) {
            var dycxx = hexStr.substr(0,len);
            var dycsx = hexStr.substr(len,len);
            var rlxx = hexStr.substr(len*2 ,len);
            var rlsx = hexStr.substr(len*3 ,len);
            rlxx = dataformat.hex2float_r(rlxx).toFixed(2);
            rlsx = dataformat.hex2float_r(rlsx).toFixed(2);
            dycxx = dataformat.hex2float_r(dycxx).toFixed(2);
            dycsx = dataformat.hex2float_r(dycsx).toFixed(2);
            callBack(dycxx,dycsx,rlxx,rlsx);
        });
    },
    //如果勾选ocv，则读取OCV和容量范围
    getrlocvArr : function (callBack) {
        plc_client.read("D", property.ADDRESS_OCVDATA, 48, function(error,hexStr) {
            var rlArr = [];
            var ocvArr = [];
            for(var i = 0 ; i < property.CHECK_NUM_SINGLE ; i++){
                rlArr[i] = hexStr.substr(len*i,len);
                rlArr[i] = dataformat.hex2float_r(rlArr[i]).toFixed(2);
                ocvArr[i] = hexStr.substr(len*(i+12),len);
                ocvArr[i] = dataformat.hex2float_r(ocvArr[i]).toFixed(2);
            }
            callBack(rlArr,ocvArr);
        });
    },
    //检测ocv数据是否写入
    finishOcv : function (callBack) {
        var flag = false;
        plc_client.read("D", property.ADDRESS_FLAG_BARCODE_RESULT, 2, function(error,hexStr) {
            var num = dataformat.hex2int_r(hexStr);
            if(num >= parseInt("1000000000000000",2)) {
                flag = true;
                plc_client.writeInt("D", property.ADDRESS_FLAG_BARCODE_RESULT, 2, [0],function(error,hexStr){
                    if(!error) callBack(flag);
                });
            } else {
                callBack(flag);
            }
        });
    },
    //进行电芯检测分选
    sorting : function (json_fw,rlArr,ocvArr){
        var nzarr_random = new Array();
        var dyarr_random = new Array();
        var dycarr = new Array();
        var zztArr = new Array();
        var dyztArr = new Array();
        var nzztArr = new Array();
        var rlztArr = new Array();
        var dycztArr = new Array();
        var rldycfwArr = [json_fw.rlxx, json_fw.rlsx, json_fw.dycxx, json_fw.dycsx];
        var ng = 1;
        var normal = 0;
        for (var i = 0; i < property.CHECK_NUM_SINGLE; i++) {
            nzarr_random.push((Math.floor(Math.random() * 32) + 30));
            dyarr_random.push((Math.floor(Math.random() * 60) + 3600) / 1000);
            dycarr.push(dyarr_random[i] - ocvArr[i]);
            zztArr[i] = normal;
            dyztArr[i] = normal;
            nzztArr[i] = normal;
            rlztArr[i] = normal;
            dycztArr[i] = normal;
            if (dyarr_random[i] < json_fw.dyxx || dyarr_random[i] > json_fw.dysx) {
                zztArr[i] = ng;
                dyztArr[i] = ng;
            }
            if (nzarr_random[i] < json_fw.nzxx || nzarr_random[i] > json_fw.nzsx) {
                zztArr[i] = ng;
                nzztArr[i] = ng;
            }
            if(rlArr[i] != 0){
                if (rlArr[i] < json_fw.rlxx || rlArr[i] > json_fw.rlsx) {
                    zztArr[i] = ng;
                    rlztArr[i] = ng;
                }
                if (Math.abs(dycarr[i]) > Math.abs(json_fw.dycxx) || dycarr[i] > json_fw.dycsx) {
                    zztArr[i] = ng;
                    dycztArr[i] = ng;
                }
            }
            if (dyarr_random[i] == '' || nzarr_random[i] == '') {
                zztArr[i] = ng;
            }
            if (zztArr[i] == normal) {
                normalBarcode++;
                //console.log(normalBarcode);
            }
            if (zztArr[i] == ng) {
                ngBarcode++;
            }
        }
        //写入D4000-D4116的数据，前56个为12个电芯的实际电压内阻值，加压差范围和容量范围。
        // 后面60个为电芯分选状态（总状态，电压状态，内阻状态，容量状态，电压差状态。
        plc_client.writeFloat("D", property.ADDRESS_CHECKDATA, 24, nzarr_random, function () {});
        plc_client.writeFloat("D", property.ADDRESS_CHECKDATA + property.CHECK_NUM_SINGLE * 2, 24, dyarr_random, function () {});
        plc_client.writeFloat("D", property.ADDRESS_CHECKDATA + property.CHECK_NUM_SINGLE * 4, 8, rldycfwArr, function () {});
        plc_client.writeInt("D", property.ADDRESS_RESULTDATA, 12, zztArr, function () {});
        plc_client.writeInt("D", property.ADDRESS_RESULTDATA + property.CHECK_NUM_SINGLE, 12, dyztArr, function () {});
        plc_client.writeInt("D", property.ADDRESS_RESULTDATA + property.CHECK_NUM_SINGLE * 2, 12, nzztArr, function () {});
        plc_client.writeInt("D", property.ADDRESS_RESULTDATA + property.CHECK_NUM_SINGLE * 3, 12, rlztArr, function () {});
        plc_client.writeInt("D", property.ADDRESS_RESULTDATA + property.CHECK_NUM_SINGLE * 4, 12, dycztArr, function () {});
        plc_client.writeInt("D", property.ADDRESS_FLAG_CHECK, 2, [1], function (error, hexStr) {
            if (error) {
                console.log("check not completed");
                setTimeout(lower_machinel.boxProcess,2000);
                //plc.finishOcvFlag();
            }
        });
        /*console.log(zztArr);
         console.log(dyztArr);
         console.log(nzztArr);
         console.log(rlztArr);
         console.log(dycztArr);*/
    },
    boxProcess :function () {
        //判断正常电芯数是否可以封箱，可以则把封箱标记位置为1
        plc_client.read("D", property.ADDRESS_ZCZXS, 2, function (error, hexStr) {
            var int_num = dataformat.hex2int_r(hexStr);
            if (normalBarcode >= int_num) {
                plc_client.writeInt("D", property.ADDRESS_FLAG_BOX, 2,[1], function () {});
                normalBarcode = normalBarcode - int_num;
                console.log("发送封箱处理");
            }
        });
    }
};

module.exports = lower_machinel;