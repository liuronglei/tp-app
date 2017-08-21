/**
 * 模型_电芯扫码
 */
const query = require("../utils/mysql.js");
const m_barcode = {
    queryBarCode : function(num,callBack) {
        query('select * from (select t.*,t.`Index` as sn from table_barcode t order by `Index` desc limit ' + num + ' ) as t2 order by t2.sn asc', callBack);
    },
    clearData : function(callBack) {
        query('delete from table_barcode', callBack);
    },
};
module.exports = m_barcode;