/**
 * 模型_态势联动
 */
const query = require("../lib/mysql.js");
const m_tsld = {
    querySbList : function(callBack) {
        query('SELECT * FROM t_sb', callBack);
    },
    queryDsxn : function(startNum, endNum, clfs, callBack) {
        query('SELECT case when sjd <' + startNum + ' then concat(\'next-\',time_format(rq,\'%H:%i\')) else time_format(rq,\'%H:%i\') end as sjd,'
            + clfs + ' FROM t_dsxn WHERE (sjd>='
            + startNum + ' and sjd<=' + endNum + ') or sjd<=' + (endNum-96) + ' order by sjd', callBack);
    },
    queryDsxn_jg : function(callBack) {
        query('SELECT time_format(rq,\'%H:%i\') as sjd,fhyc_zm,fhyc_zm_h,cncfdgl_q,cncfdgl_h,cdzcfdgl_q,cdzcfdgl_h,gffdcl FROM t_dsxn', callBack);
    },
    queryJjgz : function(callBack) {
        query('select time_format(rq,\'%H:%i\') as sjd,rbhdglbh_q,rbhdglbh_h,xtglbh_q,xtglbh_h from t_jjgz', callBack);
    }
}
module.exports = m_tsld;