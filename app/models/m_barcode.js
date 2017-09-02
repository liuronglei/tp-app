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
};
module.exports = m_barcode;