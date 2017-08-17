var query = require("./sqlserver");

const m_sjcx = {
    query_selectBatch : function (batch,callback) {
        query('select cellnum,equiptmentnum,workernum,productionorder,batch,\n' +
            'voltage,(Convert(nvarchar(50),voltage_min)+\'——\'+Convert(nvarchar(50),voltage_max)) as voltage_range,\n' +
            'resistance,(Convert(nvarchar(50),resistance_min)+\'——\'+Convert(nvarchar(50),resistance_max)) as resistance_range,volume,\n' +
            '(Convert(nvarchar(50),volume_min)+\'——\'+Convert(nvarchar(50),volume_max)) as volume_range,ocv4,\n' +
            '(Convert(nvarchar(50),volumedifference_min)+\'——\'+Convert(nvarchar(50),volumedifference_max)) as volumedifference_range, \n' +
            'grade,(Convert(nvarchar(50),grade_min)+\'——\'+Convert(nvarchar(50),grade_max)) as grade_range,Convert(nvarchar(30),creattime)as creattime,ng_reason,checknum from d_cell_ng where batch =\''+batch+'\' ',callback);
    },
    query_select : function (ng_reason,batch,callback) {
        query('select cellnum,equiptmentnum,workernum,productionorder,batch,\n' +
            'voltage,(Convert(nvarchar(50),voltage_min)+\'——\'+Convert(nvarchar(50),voltage_max)) as voltage_range,\n' +
            'resistance,(Convert(nvarchar(50),resistance_min)+\'——\'+Convert(nvarchar(50),resistance_max)) as resistance_range,volume,\n' +
            '(Convert(nvarchar(50),volume_min)+\'——\'+Convert(nvarchar(50),volume_max)) as volume_range,ocv4,\n' +
            '(Convert(nvarchar(50),volumedifference_min)+\'——\'+Convert(nvarchar(50),volumedifference_max)) as volumedifference_range, \n' +
            'grade,(Convert(nvarchar(50),grade_min)+\'——\'+Convert(nvarchar(50),grade_max)) as grade_range,Convert(nvarchar(30),creattime)as creattime,ng_reason,checknum from d_cell_ng where batch =\''+batch+'\' and ng_reason like \'%'+ng_reason+'%\' ',callback);
    },
    query_selectAll_batch :function (callback) {
        query('select batch from d_cell_ng',callback);
    },
    query_selectAll_ng_reason :function (callback) {
        query('select ng_reason from d_cell_ng',callback);
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


