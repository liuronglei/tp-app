/**
 * 模型_首页
 */
const query = require("./mysql.js");
const m_sy = {
    queryYxjsBySjd : function(sjd, callBack) {
        query('select t3.fhyc_zm_h,t1.rqljcl,t1.ljfsfd,t1.ljtmfd,(t1.gffdcl_5500kw+t1.gffdcl_9350kw) as gffdcl,t1.fjcl,t1.cdzcfdgl,t2.cn_soc_h'
            + ' from t_yxjs t1, t_dyxt t2, t_dsxn t3 where t1.sjd=t2.sjd and t1.sjd=t3.sjd and t1.sjd=' + sjd, callBack);
    }
}
module.exports = m_sy;