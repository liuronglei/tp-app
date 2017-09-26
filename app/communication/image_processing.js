/**
 * Created by Administrator on 2017/9/6 0006.
 */
const fs = require('fs');
var property_plc = JSON.parse(fs.readFileSync('app/config/config_plc.json', 'utf8'));
const dataformat = require('../utils/dataformat');
const m_barcode = require('../models/m_barcode');
var barcodeCount = 0;
const image_processing = {
    // 生成12个电芯条码数据并入库;
    getBarcodeArr : function () {
        var barcodeArr =new Array();
        var randomnum_miss = Math.floor(Math.random()*12);
        var randomnum_fill = Math.floor(Math.random()*12);
        for(var i = 0; i < property_plc.CHECK_NUM_SINGLE; i++){
            barcodeCount++;
            var barcode=dataformat.fillZero(barcodeCount,8);
            if( i == randomnum_miss){
                barcode = property_plc.BARCODE_MISS;
            }
            if(i == randomnum_fill){
                barcode = property_plc.BARCODE_FAIL;
            }
            barcodeArr.push(barcode);
        }
        //console.log(barcodeArr);
        m_barcode.insertBarCode(barcodeArr,function (err) {
            if (err){
                alert(err);
                return;
            }
        });
    },
    start:function () {
        setInterval(function () {
            image_processing.getBarcodeArr();
        }, 1000);
    }
};

module.exports = image_processing;



//生成12条条码
//得到12条条码
//入库
