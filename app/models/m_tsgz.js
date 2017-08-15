/**
 * 模型_态势感知
 */

const query = require("./mysql.js");
const m_tsgz = {
    queryFydgl : function(callBack) {
        query('SELECT time_format(t_dsxn_ww.rq,\'%H:%i\') AS sjd,lsfh_gzr AS fdgl FROM t_dsxn_ww', callBack);
    },
    queryClycsj_Max : function(clfs, callBack) {
        var clfs_field = clfs + CLFS_SUFFIX.before;
        query('SELECT time_format(t_tsgz.rq,\'%H:%i\') AS sjd,' + clfs_field + ' as max FROM t_tsgz WHERE ' + clfs_field + '=(SELECT MAX(' + clfs_field + ') FROM t_tsgz)', callBack);
    },
    queryClycsj_Min : function(clfs, callBack) {
        var clfs_field = clfs + CLFS_SUFFIX.before;
        query('SELECT time_format(t_tsgz.rq,\'%H:%i\') AS sjd,' + clfs_field + ' as min FROM t_tsgz WHERE ' + clfs_field + '=(SELECT MIN(' + clfs_field + ') FROM t_tsgz) LIMIT 1', callBack);
    },
    queryClycsj_Avg : function(clfs, callBack) {
        var clfs_field = clfs + CLFS_SUFFIX.before;
        query('SELECT AVG(' + clfs_field + ') as avg FROM t_tsgz', callBack);
    },
    queryClycqx : function(clfs, callBack) {
        var clfs_q = clfs + CLFS_SUFFIX.before;
        var clfs_h = clfs + CLFS_SUFFIX.after;
        query('SELECT time_format(t_tsgz.rq,\'%H:%i\') AS sjd,' + clfs_q + ',' + clfs_h + ' FROM t_tsgz ', callBack);
    },
    queryJddyt : function(jdbh, callBack) {
        query('SELECT time_format(t.rq,\'%H:%i\') AS sjd,' + jdbh + ' FROM t_tsgz_aqpg t', callBack);
    },
    queryGzqx : function(callBack) {
        query('SELECT sjd,dy FROM t_tsgz_jjkz t', callBack);
    }


};
module.exports = m_tsgz;