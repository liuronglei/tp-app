var choose_dx = require('../../controllers/tpsy/choose_dx');
const getValue_plc = {
    //组装NG数据
    add_ng : function (dataArr_addNG) {
        var nowTime = new Date();
        var date=nowTime.getFullYear()+"/"+(nowTime.getMonth()+1)+"/"+nowTime.getDate()+" "+nowTime.getHours()+":"+
          nowTime.getMinutes()+":"+nowTime.getSeconds();
        for(var i = 0; i < dataArr_addNG.length; i++){
            dataArr_addNG[i].creattime = date;
            choose_dx.add_ng(dataArr_addNG[i]);
        }
    },

    //组装正常数据
    add_normal : function (dataArr_addNormal) {
        var nowTime = new Date();
        var date=nowTime.getFullYear()+"/"+(nowTime.getMonth()+1)+"/"+nowTime.getDate()+" "+
          nowTime.getHours()+":"+nowTime.getMinutes()+":"+nowTime.getSeconds();
        for(var i = 0; i < dataArr_addNormal.length; i++) {
            var dataArr = {
                xh : dataArr_addNormal[i].xh,
                dx: dataArr_addNormal[i].dx,
                sbh :dataArr_addNormal[i].sbh,
                czrygh : dataArr_addNormal[i].czrygh,
                scgd : dataArr_addNormal[i].scgd,
                pc : dataArr_addNormal[i].pc,
                dy : dataArr_addNormal[i].dy,
                dy_min : dataArr_addNormal[i].dy_min,
                dy_max : dataArr_addNormal[i].dy_max,
                nz : dataArr_addNormal[i].nz,
                nz_min : dataArr_addNormal[i].nz_min,
                nz_max : dataArr_addNormal[i].nz_max,
                rl : dataArr_addNormal[i].rl,
                rl_min : dataArr_addNormal[i].rl_min,
                rl_max : dataArr_addNormal[i].rl_max,
                ocv4 : dataArr_addNormal[i].ocv4,
                dyc : dataArr_addNormal[i].dyc,
                dyc_min : dataArr_addNormal[i].dyc_min,
                dyc_max : dataArr_addNormal[i].dyc_max,
                dj : dataArr_addNormal[i].dj,
                dj_min : dataArr_addNormal[i].dj_min,
                dj_max : dataArr_addNormal[i].dj_max,
                zxs : dataArr_addNormal[i].zxs,
                creattime : date,
                checkindex : dataArr_addNormal[i].checkindex
            };
            choose_dx.add_normal(dataArr);
        }
    },
    /*select_normal : function(callback){
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
    },*/

    //返回箱号信息
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