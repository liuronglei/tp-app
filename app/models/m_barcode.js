/**
 * 模型_
 */
const query = require("../utils/mysql.js");
const m_barcode = {
    queryBarCode : function(callBack) {
        query('SELECT * FROM table_barcode t  order by Index desc LIMIT 12', callBack);
    },
    clearData : function(callBack) {
        query('delete from table_barcode', callBack);
    },
};
module.exports = m_barcode;