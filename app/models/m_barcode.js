/**
 * 模型_电芯扫码
 */
const query = require("../utils/mysql.js");
const m_barcode = {
    queryBarCode : function(num,callBack) {
        query('select * from(select * from table_barcode t order by `Index` desc limit ' + num + ') order by `Index` asc', callBack);
    },
    clearData : function(callBack) {
        query('delete from table_barcode', callBack);
    },
};
module.exports = m_barcode;