var query = require("../utils/sqlserver");

const m_sjcx = {
    query_selectBatch : function (batch,callback) {
        query('select cellnum,equiptmentnum,workernum,productionorder,batch,\n' +
            'voltage,resistance,volume,ocv4,voltagedifference,grade,\n' +
            'Convert(nvarchar(30),creattime)as creattime,ng_reason,checknum from d_cell_ng where batch =\''+batch+'\'',callback);
    },
    query_select : function (ng_reason,batch,callback) {
        query('select cellnum,equiptmentnum,workernum,productionorder,batch,\n' +
            'voltage,resistance,volume,ocv4,voltagedifference,grade,\n' +
            'Convert(nvarchar(30),creattime)as creattime,ng_reason,checknum from d_cell_ng \n' +
            'where batch =\''+batch+'\' and ng_reason like \'%'+ng_reason+'%\'',callback);
    },
    query_selectAll_batch :function (callback) {
        query('select batch from d_cell_ng group by batch',callback);
    },
    query_selectAll_ng_reason :function (callback) {
        query('select ng_reason from d_cell_ng group by ng_reason',callback);
    },
    query_select_dqbatch : function (callback) {
        query('select batch from d_cell_ng where batch = (select value from p_cssz where name = \'pc\')',callback);
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


