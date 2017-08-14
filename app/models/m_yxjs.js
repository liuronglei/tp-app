/**
 * 模型_态势联动
 */
const query = require("../lib/mysql.js");
const m_yxjs = {
    queryYxjs : function(startNum, endNum, currentClfs, callBack) {
        query('SELECT time_format(rq,\'%H:%i\') as sjd,' + currentClfs + ' FROM t_yxjs WHERE t_yxjs.sjd>='
            + startNum + ' and sjd<=' + endNum, callBack);
    }
}
module.exports = m_yxjs;