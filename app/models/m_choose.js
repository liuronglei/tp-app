var query = require("../utils/sqlserver");

const m_choose = {
    addNG :function (dataArr,callBack) {
        query('merge into d_cell_ng as t1\n' +
            'using (select \''+dataArr.dx+'\' as cellnum,\''+dataArr.sbh+'\' as equiptmentnum,\''+dataArr.czrygh+'\' as workernum,\''+dataArr.scgd+'\' as productionorder,\''+dataArr.pc+'\' as batch,'+dataArr.dy+' as voltage,'+dataArr.dy_min+' as voltage_min,\n' +
            '\t'+dataArr.dy_max+' as voltage_max,'+dataArr.nz+' as resistance,'+dataArr.nz_min+' as resistance_min,'+dataArr.nz_max+' as resistance_max,'+dataArr.rl+' as volume, '+dataArr.rl_min+' as volume_min,'+dataArr.rl_max+' as volume_max,\n' +
            '\t '+dataArr.ocv4+' as ocv4,'+dataArr.dyc+' as voltagedifference,'+dataArr.dyc_min+' as voltagedifference_min,'+dataArr.dyc_max+' as voltagedifference_max, \''+dataArr.dj+'\' as grade,\''+dataArr.dj_min+'\' as grade_min, \''+dataArr.dj_max+'\' as grade_max,\''+dataArr.creattime+'\' as creattime,\''+dataArr.ng_reason+'\'as ng_reason,'+dataArr.checkindex+' as checkindex,\n' +
            '\tCASE when (select top 1 checknum from d_cell_ng where cellnum=\''+dataArr.dx+'\') is null then 1 \n' +
            '\t when \''+dataArr.dx+'\'=\'Fail\' then 1 \n' +
            '\telse (select top 1 checknum+1 from d_cell_ng where cellnum=\''+dataArr.dx+'\') end as checknum) as t2\n' +
            'on t1.cellnum=t2.cellnum and t2.cellnum != \'Fail\'\n' +
            'when matched \n' +
            'then update set t1.checknum=t2.checknum,t1.ng_reason=t2.ng_reason,t1.creattime = t2.creattime,t1.equiptmentnum = t2.equiptmentnum,t1.workernum = t2.workernum,' +
            't1.productionorder = t2.productionorder,t1.batch = t2.batch,t1.voltage=t2.voltage,t1.resistance=t2.resistance,t1.voltagedifference = t2.voltagedifference,t1.checkindex = t2.checkindex\n' +
            'when not matched\n' +
            'then insert (cellnum,equiptmentnum,workernum,productionorder,batch,voltage,voltage_min,voltage_max,resistance,resistance_min,resistance_max,\n' +
            'volume,volume_min,volume_max,ocv4,voltagedifference,voltagedifference_min,voltagedifference_max,grade,grade_min,grade_max,creattime,ng_reason,checknum,checkindex) \n' +
            'values(t2.cellnum,t2.equiptmentnum,t2.workernum,t2.productionorder,t2.batch,t2.voltage,t2.voltage_min,t2.voltage_max,t2.resistance,\n' +
            't2.resistance_min,t2.resistance_max,t2.volume,t2.volume_min,t2.volume_max,t2.ocv4,t2.voltagedifference,t2.voltagedifference_min,t2.voltagedifference_max,t2.grade,\n' +
            't2.grade_min,t2.grade_max,t2.creattime,t2.ng_reason,t2.checknum,t2.checkindex);',callBack);
    },
    addNormal :function (dataArr,callBack) {
        query('merge into d_cell_normal as t1\n' +
            'using (select \''+dataArr.xh+'\' as casenum, \''+dataArr.dx+'\' as cellnum,\''+dataArr.sbh+'\' as equiptmentnum,\''+dataArr.czrygh+'\' as workernum,\''+dataArr.scgd+'\' as productionorder,\''+dataArr.pc+'\' as batch,'+dataArr.dy+' as voltage,'+dataArr.dy_min+' as voltage_min,\n' +
            '\t'+dataArr.dy_max+' as voltage_max,'+dataArr.nz+' as resistance,'+dataArr.nz_min+' as resistance_min,'+dataArr.nz_max+' as resistance_max,'+dataArr.rl+' as volume, '+dataArr.rl_min+' as volume_min,'+dataArr.rl_max+' as volume_max,\n' +
            '\t '+dataArr.ocv4+' as ocv4,'+dataArr.dyc+' as voltagedifference,'+dataArr.dyc_min+' as voltagedifference_min,'+dataArr.dyc_max+' as voltagedifference_max, \''+dataArr.dj+'\' as grade,\''+dataArr.dj_max+'\' as grade_min, \''+dataArr.dj_min+'\' as grade_max,'+dataArr.zxs+' as binningnum,\''+dataArr.creattime+'\' as creattime,'+dataArr.checkindex+' as checkindex,\n' +
            '\tCASE when (select top 1 checknum from d_cell_ng where cellnum=\''+dataArr.dx+'\') is null then 1 \n' +
            '\telse (select top 1 checknum+1 from d_cell_ng where cellnum=\''+dataArr.dx+'\') end as checknum) as t2\n' +
            'on t1.cellnum=t2.cellnum\n' +
            'when matched \n' +
            'then update set t1.casenum = t2.casenum,t1.checknum=t2.checknum,t1.creattime = t2.creattime,t1.equiptmentnum = t2.equiptmentnum,t1.workernum = t2.workernum,' +
            't1.productionorder = t2.productionorder,t1.batch = t2.batch,t1.voltage=t2.voltage,t1.resistance=t2.resistance,t1.voltagedifference = t2.voltagedifference,t1.binningnum = t2.binningnum,t1.checkindex = t2.checkindex\n' +
            'when not matched\n' +
            'then insert (casenum,cellnum,equiptmentnum,workernum,productionorder,batch,voltage,voltage_min,voltage_max,resistance,resistance_min,resistance_max,\n' +
            'volume,volume_min,volume_max,ocv4,voltagedifference,voltagedifference_min,voltagedifference_max,grade,grade_min,grade_max,binningnum,creattime,checknum,checkindex) \n' +
            'values(t2.casenum,t2.cellnum,t2.equiptmentnum,t2.workernum,t2.productionorder,t2.batch,t2.voltage,t2.voltage_min,t2.voltage_max,t2.resistance,\n' +
            't2.resistance_min,t2.resistance_max,t2.volume,t2.volume_min,t2.volume_max,t2.ocv4,t2.voltagedifference,t2.voltagedifference_min,t2.voltagedifference_max,t2.grade,\n' +
            't2.grade_min,t2.grade_max,t2.binningnum,t2.creattime,t2.checknum,t2.checkindex);',callBack);
    },
    deleteNG : function (dataArr,callBack) {
        query('delete  from d_cell_ng where cellnum = \''+dataArr.dx+'\'',callBack);
    },
    query_normal : function (callback) {
        query('select * from d_cell_normal',callback);
    },
    query_xh : function (callback) {
        query('select top 1 casenum from d_cell_normal order by casenum desc',callback);
    }
};


module.exports = m_choose;