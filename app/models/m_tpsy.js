var query = require("../utils/sqlserver");

const m_tpsy = {
    query_ngLength :function (callback) {
        query('select count(id) as length from d_cell_ng',callback);
    },
    query_normalLength :function (callback) {
        query('select count(id) as length from d_cell_normal',callback);
    }
};
module.exports = m_tpsy;