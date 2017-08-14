/**
 * 模型_多源协同
 */
const query = require("../lib/mysql.js");
const m_dyxt = {
    queryCdyh_line : function(startNum, endNum, currentClfs, callBack) {
        query('SELECT case when sjd <' + startNum + ' then concat(\'next-\',time_format(rq,\'%H:%i\')) else time_format(rq,\'%H:%i\') end as sjd,'
            + currentClfs + CLFS_SUFFIX.before + ',' + currentClfs + CLFS_SUFFIX.after + ' FROM t_dyxt WHERE (t_dyxt.sjd>='
            + startNum + ' and sjd<=' + endNum + ') or t_dyxt.sjd<=' + (endNum-96) + ' order by sjd', callBack);
    },
    queryCdyh_cover : function(startNum, endNum, callBack) {
        query('SELECT case when sjd <' + startNum + ' then concat(\'next-\',time_format(rq,\'%H:%i\')) else time_format(rq,\'%H:%i\') end as sjd,xtfhbh_q,xtfhbh_h,(xtfhbh_h-xtfhbh_q) as xtfhbh_c FROM t_dyxt WHERE (t_dyxt.sjd>='
            + startNum + ' and sjd<=' + endNum + ') or t_dyxt.sjd<=' + (endNum-96) + ' order by sjd', callBack);
    },
    queryDataBySjd : function(sjd, callBack) {
        query('SELECT * FROM t_dyxt WHERE t_dyxt.sjd = ' + sjd, callBack);
    }
};
module.exports = m_dyxt;