var choose_dx = require('../../controllers/tpsy/choose_dx');
const getValue_plc = {
    add_NG : function (dataArr_addNG) {
        var cxTime = new Date();
        var date=cxTime.getFullYear()+"/"+(cxTime.getMonth()+1)+"/"+cxTime.getDate()+" "+cxTime.getHours()+":"+cxTime.getMinutes()+":"+cxTime.getSeconds();
        for(var i = 0; i < dataArr_addNG.length; i++){
            var dataArr = [dataArr_addNG[i].dx,dataArr_addNG[i].sbh,dataArr_addNG[i].czrygh,dataArr_addNG[i].scgd,dataArr_addNG[i].pc,dataArr_addNG[i].dy,
                dataArr_addNG[i].dy_min,dataArr_addNG[i].dy_max,dataArr_addNG[i].nz,dataArr_addNG[i].nz_min,dataArr_addNG[i].dy_max,dataArr_addNG[i].rl,
                dataArr_addNG[i].rl_min, dataArr_addNG[i].dy_max,dataArr_addNG[i].ocv4,dataArr_addNG[i].dyc,dataArr_addNG[i].dyc_min,dataArr_addNG[i].dyc_max,
                dataArr_addNG[i].dj, dataArr_addNG[i].dj_min,dataArr_addNG[i].dj_max,date,dataArr_addNG[i].ng_reason,"1"];
            choose_dx.add_ng(dataArr);
        }
    },
    add_normal : function (dataArr_addNoraml) {
        var cxTime = new Date();
        var date=cxTime.getFullYear()+"/"+(cxTime.getMonth()+1)+"/"+cxTime.getDate()+" "+cxTime.getHours()+":"+cxTime.getMinutes()+":"+cxTime.getSeconds();
        for(var i = 0; i < dataArr_addNoraml.length; i++) {
            var dataArr = [
                dataArr_addNoraml[i].xh, dataArr_addNoraml[i].dx, dataArr_addNoraml[i].sbh, dataArr_addNoraml[i].czrygh, dataArr_addNoraml[i].scgd,
                dataArr_addNoraml[i].pc, dataArr_addNoraml[i].dy, dataArr_addNoraml[i].dy_min, dataArr_addNoraml[i].dy_max, dataArr_addNoraml[i].nz,
                dataArr_addNoraml[i].nz_min, dataArr_addNoraml[i].dy_max, dataArr_addNoraml[i].rl, dataArr_addNoraml[i].rl_min, dataArr_addNoraml[i].dy_max,
                dataArr_addNoraml[i].ocv4, dataArr_addNoraml[i].dyc, dataArr_addNoraml[i].dyc_min, dataArr_addNoraml[i].dyc_max, dataArr_addNoraml[i].dj, dataArr_addNoraml[i].dj_min,
                dataArr_addNoraml[i].dj_max, dataArr_addNoraml[i].zxs, date
            ];
            choose_dx.add_normal(dataArr);
        }
    },
    select_normal : function(callback){
        choose_dx.select_normal(function (result) {
            var record = {};
            var dataArr_upload = new Array();
            var dataObj_upload = {};
            for(var i = 0 ; i < result.recordset.length; i++){
                record = result.recordset[i];
                for( var key in record){
                    dataObj_upload[key] = record[key];
                }
                dataArr_upload.push(dataObj_upload);
            }
            callback(dataArr_upload);
        })
    },
    select_casenum : function (callback) {
        choose_dx.select_casenum(function (result) {
            var casenum = 0;
            if(result.recordset != null && result.recordset.length > 0 && typeof result.recordset[0].casenum != "undefined"){
                casenum = result.recordset[0].casenum;
            }
            callback(casenum);
        })
    }
};

module.exports = getValue_plc;