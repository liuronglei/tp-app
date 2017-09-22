var query = require("../utils/sqlserver");

const m_sjcx_normal = {
    query_select : function (searchCondition,callback) {
        var sql = 'select casenum,cellnum,equiptmentnum,workernum,productionorder,batch,' +
            'voltage,resistance,volume,ocv4,voltagedifference,grade,binningnum,' +
            'CONVERT(varchar(100), creattime, 20) as creattime,checknum,checkindex from d_cell_normal where 1=1';
        if(!isEmptyStr(searchCondition.batch)) {
            sql += " and batch='" + searchCondition.batch + "'";
        }
        if(!isEmptyStr(searchCondition.casenum)) {
            sql += " and casenum= " + searchCondition.casenum + "";
        }
        if(!isEmptyStr(searchCondition.scgd)) {
            sql += " and productionorder ='" + searchCondition.scgd + "'";
        }
        if(!isEmptyStr(searchCondition.ygh)) {
            sql += " and workernum ='" + searchCondition.ygh + "'";
        }
        if(!isEmptyStr(searchCondition.kssj)){
            sql += " and creattime>=CONVERT(datetime,'"+searchCondition.kssj+"',20)";
        }
        if(!isEmptyStr(searchCondition.jjsj)){
            sql += " and creattime<=CONVERT(datetime,'"+searchCondition.jjsj+"',20)";
        }
        query(sql,callback);
    },
    query_selectAll_batch :function (callback) {
        query('select batch from d_cell_normal group by batch',callback);
    },
    query_selectAll_casenum : function (pc,callback) {
        query('select casenum from d_cell_normal group by casenum',callback);
    },
    query_selectAll_ygh :function (pc,callback) {
        query('select workernum from d_cell_normal group by workernum',callback);
    },
    query_selectAll_scgd : function (pc,callback) {
        query('select productionorder from d_cell_normal group by productionorder',callback);
    }
};


module.exports = m_sjcx_normal;


/*  测试代码  */
/*m_sjcx.query_ngSelect(function (err,result) {
    if (err) {
        console.log(err);
        return;
    }
    var Arr = new Array();
    Arr = result.recordset[0];
    console.log(result.recordset);
    //console.log(Arr.Voltage_Min);
});*/


