/**
 * 模型_态势联动
 */
const query = require("../lib/mysql.js");
const m_yxkz = {
    querySbList : function(sjlx,sbid,callBack) {
        if(sbid!==""){
             query('SELECT * FROM t_yxkz where sjlx=' + sjlx+' and sbid='+sbid, callBack);
        }else{
            query('SELECT * FROM t_yxkz where sjlx=' + sjlx, callBack);
        }

    }
}
module.exports = m_yxkz;