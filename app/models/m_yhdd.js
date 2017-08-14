/**
 * 模型_优化调度
 */
const query = require("../lib/mysql.js");
const m_yhdd = {
    queryCdyh_line : function(startNum, endNum, currentClfs, callBack) {
        query('SELECT case when sjd <' + startNum + ' then concat(\'next-\',time_format(rq,\'%H:%i\')) else time_format(rq,\'%H:%i\') end as sjd,'
            + 't.cn_soc,t.cdzcfdgl,t.xbcglgl,t.xtfhbh_q,t.xtfhbh_h FROM t_yhdd_jjzy t WHERE (t.sjd>='
            + startNum + ' and t.sjd<=' + endNum + ') or t.sjd<=' + (endNum-96) + ' order by sjd', callBack);
    },
    queryYqxf_line : function(startNum, endNum, clfs, callBack) {
        var clfs_q = clfs + CLFS_SUFFIX.before;
        var clfs_h = clfs + CLFS_SUFFIX.after;
        query('SELECT case when sjd <' + startNum + ' then concat(\'next-\',time_format(rq,\'%H:%i\')) else time_format(rq,\'%H:%i\') end as sjd,'
            + clfs_q + ',' + clfs_h + ' FROM t_yhdd_yqxf t WHERE (t.sjd>='
            + startNum + ' and t.sjd<=' + endNum + ') or t.sjd<=' + (endNum-96) + ' order by sjd', callBack);
    },
    queryFydgl : function(callBack) {
        query('SELECT time_format(t1.rq,\'%H:%i\') as sjd, t2.xtfhbh_q as ydgl, t1.gffdcl*5 as fdgl FROM t_dsxn_ww t1,t_yhdd_jjzy t2 where t1.rq=t2.rq', callBack);
    },
    queryDsxn : function(startNum, endNum, clfs, callBack) {
        query('SELECT case when sjd <' + startNum + ' then concat(\'next-\',time_format(rq,\'%H:%i\')) else time_format(rq,\'%H:%i\') end as sjd,'
            + clfs + ' FROM t_dsxn_ww WHERE (sjd>='
            + startNum + ' and sjd<=' + endNum + ') or sjd<=' + (endNum-96) + ' order by sjd', callBack);
    },
    queryDsxn_jg : function(callBack) {
        query('SELECT time_format(rq,\'%H:%i\') as sjd,fhyc_zm,fhyc_zm_h,cncfdgl_q,cncfdgl_h,cdzcfdgl_q,cdzcfdgl_h,gffdcl FROM t_dsxn_ww', callBack);
    },
    querySsfdgl : function(callBack) {
        query('select time_format(rq,\'%H:%i\') as sjd,gffdcl_q,fjcl_q from t_tsgz', callBack);
    },
    querySy : function(isOptimised,callBack) {
        var sql = 'select date_format(rq,\'%m-%d\') as sjd,gain,gain_yc from t_gain t where t.rq<date_sub(now(),interval 1 day) and t.rq>date_sub(now(),interval 8 day)'
        if(isOptimised) {
            sql += ' union all select date_format(now(),\'%m-%d\') as sjd, \'-\',19752 as gain from dual';
        }
        query(sql, callBack);
    },
    queryClyc_right : function(startNum, endNum, clfs, callBack) {
        var clfs_q = clfs + CLFS_SUFFIX.before;
        var clfs_h = clfs + CLFS_SUFFIX.after;
        query('SELECT case when sjd <' + startNum + ' then concat(\'next-\',time_format(rq,\'%H:%i\')) else time_format(rq,\'%H:%i\') end as sjd,'
            + clfs_q + ',' + clfs_h + ' FROM t_tsgz t WHERE (sjd>='
            + startNum + ' and sjd<=' + endNum + ') or sjd<=' + (endNum-96) + ' order by sjd', callBack);
    }
};
module.exports = m_yhdd;