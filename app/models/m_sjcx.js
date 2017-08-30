var query = require("../utils/sqlserver");

const m_sjcx = {
    query_select : function (ng_reason,batch,scgd,ygh,kssj,jjsj,callback) {
        var sql = 'select cellnum,equiptmentnum,workernum,productionorder,batch,' +
            'voltage,resistance,volume,ocv4,voltagedifference,grade,' +
            'CONVERT(varchar(100), creattime, 20) as creattime,ng_reason,checknum from d_cell_ng where 1=1';
        if(batch != null && batch != "") {
            sql += " and batch='" + batch + "'";
        }
        if(ng_reason != null && ng_reason != "") {
            sql += " and ng_reason like '%" + ng_reason + "%'";
        }
        if(scgd != null && scgd != "") {
            sql += " and productionorder ='" + scgd + "'";
        }
        if(ygh != null && ygh != "") {
            sql += " and workernum ='" + ygh + "'";
        }
        if(kssj != null && kssj != ""){
            sql += " and creattime>=CONVERT(datetime,'"+kssj+"',20)";
        }
        if(jjsj != null && jjsj != ""){
            sql += " and creattime<=CONVERT(datetime,'"+jjsj+"',20)";
        }
        query(sql,callback);
    },
    query_selectAll_batch :function (callback) {
        query('select batch from d_cell_ng group by batch',callback);
    },
    query_selectAll_ygh :function (pc,callback) {
        query('select workernum from d_cell_ng where batch='+pc+' group by workernum',callback);
    },
    query_selectAll_scgd : function (pc,callback) {
        query('select productionorder from d_cell_ng where batch='+pc+' group by productionorder',callback);
    }
};


module.exports = m_sjcx;


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


