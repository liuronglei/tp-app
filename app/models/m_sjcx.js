var query = require("../utils/sqlserver");

const m_sjcx = {
    query_select : function (searchCondition,callBack) {
        var sql = 'select cellnum,equiptmentnum,workernum,productionorder,batch,' +
            'voltage,resistance,volume,ocv4,voltagedifference,grade,' +
            'CONVERT(varchar(100), creattime, 20) as creattime,ng_reason,checknum,checkindex from d_cell_ng where 1=1';
        if(!isEmptyStr(searchCondition.batch)) {
            sql += " and batch='" + searchCondition.batch + "'";
        }
        if(!isEmptyStr(searchCondition.ng_reason)) {
            sql += " and ng_reason like '% "+ searchCondition.ng_reason +" %'";
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
        query(sql,callBack);
    },
    selectall_batch :function (callBack) {
        query('select batch from d_cell_ng group by batch',callBack);
    },
    selectall_ygh :function (pc,callBack) {
        query('select workernum from d_cell_ng group by workernum',callBack);
    },
    selectall_scgd : function (pc,callBack) {
        query('select productionorder from d_cell_ng group by productionorder',callBack);
    },
    //电芯替换页面用
    select_all: function (dx,callBack) {
        query('select casenum,cellnum,equiptmentnum,workernum,productionorder,batch,' +
          'voltage,resistance,volume,ocv4,voltagedifference,grade,CONVERT(varchar(100), creattime, 20) as creattime,' +
          'binningnum,checknum,checkindex from d_cell_normal where cellnum = \''+dx+'\'',callBack);
    },
    updateBarcode : function (json_replace,callBack) {
        query('update d_cell_normal set casenum = \''+json_replace.casenum+'\',' +
          'productionorder = \''+json_replace.productionorder+'\',batch = \''+json_replace.batch+'\' ' +
          'where cellnum = \''+json_replace.cellnum+'\'',callBack)
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


