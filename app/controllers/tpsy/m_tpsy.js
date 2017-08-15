var query = require("./sqlserver");

var m_tpsy = {
    query_sycsInit : function (callback) {
        query('select * from p_cssz',callback);
    },
};


module.exports = m_tpsy;