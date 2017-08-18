var query = require("./sqlserver");

const m_choose = {
    addNG :function (dataArr,callBack) {
        query('merge into d_cell_ng as t1\n' +
            'using (select \''+dataArr[0]+'\' as cellnum,\''+dataArr[1]+'\' as equiptmentnum,\''+dataArr[2]+'\' as workernum,\''+dataArr[3]+'\' as productionorder,\''+dataArr[4]+'\' as batch,'+dataArr[5]+' as voltage,'+dataArr[6]+' as voltage_min,\n' +
            '\t'+dataArr[7]+' as voltage_max,'+dataArr[8]+' as resistance,'+dataArr[9]+' as resistance_min,'+dataArr[10]+' as resistance_max,'+dataArr[11]+' as volume, '+dataArr[12]+' as volume_min,'+dataArr[13]+' as volume_max,\n' +
            '\t '+dataArr[14]+' as ocv4,'+dataArr[15]+' as volumedifference_min,'+dataArr[16]+' as volumedifference_max, \''+dataArr[17]+'\' as grade,\''+dataArr[18]+'\' as grade_min, \''+dataArr[19]+'\' as grade_max,'+dataArr[20]+' as binningnum,\''+dataArr[21]+'\' as creattime,\''+dataArr[22]+'\'as ng_reason,\n' +
            '\tCASE when (select top 1 checknum from d_cell_ng where cellnum=\''+dataArr[0]+'\') is null then 1 \n' +
            '\telse (select top 1 checknum+1 from d_cell_ng where cellnum=\''+dataArr[0]+'\') end as checknum) as t2\n' +
            'on t1.cellnum=t2.cellnum\n' +
            'when matched \n' +
            'then update set t1.checknum=t2.checknum,t1.ng_reason=t2.ng_reason,t1.creattime = t2.creattime\n' +
            'when not matched\n' +
            'then insert (cellnum,equiptmentnum,workernum,productionorder,batch,voltage,voltage_min,voltage_max,resistance,resistance_min,resistance_max,\n' +
            'volume,volume_min,volume_max,ocv4,volumedifference_min,volumedifference_max,grade,grade_min,grade_max,binningnum,creattime,ng_reason,checknum) \n' +
            'values(t2.cellnum,t2.equiptmentnum,t2.workernum,t2.productionorder,t2.batch,t2.voltage,t2.voltage_min,t2.voltage_max,t2.resistance,\n' +
            't2.resistance_min,t2.resistance_max,t2.volume,t2.volume_min,t2.volume_max,t2.ocv4,t2.volumedifference_min,t2.volumedifference_max,t2.grade,\n' +
            't2.grade_min,t2.grade_max,t2.binningnum,t2.creattime,t2.ng_reason,t2.checknum);',callBack);
    },
    addNormal :function (dataArr,callBack) {
        query('merge into d_cell_normal as t1\n' +
            'using (select \''+dataArr[0]+'\' as casenum, \''+dataArr[1]+'\' as cellnum,\''+dataArr[2]+'\' as equiptmentnum,\''+dataArr[3]+'\' as workernum,\''+dataArr[4]+'\' as productionorder,\''+dataArr[5]+'\' as batch,'+dataArr[6]+' as voltage,'+dataArr[7]+' as voltage_min,\n' +
            '\t'+dataArr[8]+' as voltage_max,'+dataArr[9]+' as resistance,'+dataArr[10]+' as resistance_min,'+dataArr[11]+' as resistance_max,'+dataArr[12]+' as volume, '+dataArr[13]+' as volume_min,'+dataArr[14]+' as volume_max,\n' +
            '\t '+dataArr[15]+' as ocv4,'+dataArr[16]+' as volumedifference_min,'+dataArr[17]+' as volumedifference_max, \''+dataArr[18]+'\' as grade,\''+dataArr[19]+'\' as grade_min, \''+dataArr[20]+'\' as grade_max,'+dataArr[21]+' as binningnum,\''+dataArr[22]+'\' as creattime,\n' +
            '\tCASE when (select top 1 checknum from d_cell_ng where cellnum=\''+dataArr[1]+'\') is null then 1 \n' +
            '\telse (select top 1 checknum+1 from d_cell_ng where cellnum=\''+dataArr[1]+'\') end as checknum) as t2\n' +
            'on t1.cellnum=t2.cellnum\n' +
            'when matched \n' +
            'then update set t1.checknum=t2.checknum,t1.creattime = t2.creattime\n' +
            'when not matched\n' +
            'then insert (casenum,cellnum,equiptmentnum,workernum,productionorder,batch,voltage,voltage_min,voltage_max,resistance,resistance_min,resistance_max,\n' +
            'volume,volume_min,volume_max,ocv4,volumedifference_min,volumedifference_max,grade,grade_min,grade_max,binningnum,creattime,checknum) \n' +
            'values(t2.casenum,t2.cellnum,t2.equiptmentnum,t2.workernum,t2.productionorder,t2.batch,t2.voltage,t2.voltage_min,t2.voltage_max,t2.resistance,\n' +
            't2.resistance_min,t2.resistance_max,t2.volume,t2.volume_min,t2.volume_max,t2.ocv4,t2.volumedifference_min,t2.volumedifference_max,t2.grade,\n' +
            't2.grade_min,t2.grade_max,t2.binningnum,t2.creattime,t2.checknum);',callBack);
    },
    deleteNG : function (dataArr,callBack) {
        query('delete  from d_cell_ng where cellnum = \''+dataArr[1]+'\'',callBack);
    },
    query_normal : function (callback) {
        query('select * from d_cell_normal',callback);
    },
    query_xh : function (callback) {
        query('select top 1 casenum from d_cell_normal order by casenum desc',callback);
    }
};


module.exports = m_choose;