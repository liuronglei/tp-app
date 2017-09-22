/**
 * 模型_电芯扫码
 */
const query = require("../utils/mysql.js");
const m_barcode = {
    queryBarCode : function(start,end,callBack) {
        query('select t.* from table_barcode t where `Index`>=' + start + ' and `Index`<=' + end + ' order by `Index` asc', callBack);
    },
    queryLastIndex : function(callBack) {
        query('select `Index` as lastindex from table_barcode order by `Index` desc limit 1', callBack);
    },
    clearData : function(callBack) {
        query('truncate table table_barcode', callBack);
    },
    insertBarCode : function (barCodeArr,callback) {
        insertBarcode(barCodeArr,0,callback);
    }
};
function insertBarcode(barCodeArr,key,callback){
    if(key >= barCodeArr.length){
        callback();
    }
    else{
        query('insert into table_barcode (barcode) values ("'+barCodeArr[key]+'")',function(){insertBarcode(barCodeArr,++key,callback)});
    }

}
module.exports = m_barcode;