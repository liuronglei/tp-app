var query = require("../utils/sqlserver");

const m_tpsy = {
    query_ngLength :function (callback) {
        query("select count(id) as ngcount from d_cell_ng where batch = (select value from p_cssz where name = 'pc')",callback);
    },
    query_normalLength :function (callback) {
        query("select count(id) as normalcount from d_cell_normal where batch = (select value from p_cssz where name = 'pc')",callback);
    }
};
module.exports = m_tpsy;