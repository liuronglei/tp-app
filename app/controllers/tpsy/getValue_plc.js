var choose_dx = require('../../controllers/tpsy/choose_dx');
const getValue_plc = {
    add_NG : function (dataArr_addNG) {
        var cxTime = new Date();
        var date=cxTime.getFullYear()+"/"+(cxTime.getMonth()+1)+"/"+cxTime.getDate()+" "+cxTime.getHours()+":"+cxTime.getMinutes()+":"+cxTime.getSeconds();
        for(var i = 0; i < dataArr_addNG.length; i++){
            var dataArr = {
                dx: dataArr_addNG[i].dx,
                sbh :dataArr_addNG[i].sbh,
                czrygh : dataArr_addNG[i].czrygh,
                scgd : dataArr_addNG[i].scgd,
                pc : dataArr_addNG[i].pc,
                dy : dataArr_addNG[i].dy,
                dy_min : dataArr_addNG[i].dy_min,
                dy_max : dataArr_addNG[i].dy_max,
                nz : dataArr_addNG[i].nz,
                nz_min : dataArr_addNG[i].nz_min,
                nz_max : dataArr_addNG[i].nz_max,
                rl : dataArr_addNG[i].rl,
                rl_min : dataArr_addNG[i].rl_min,
                rl_max : dataArr_addNG[i].rl_max,
                ocv4 : dataArr_addNG[i].ocv4,
                dyc : dataArr_addNG[i].dyc,
                dyc_min : dataArr_addNG[i].dyc_min,
                dyc_max : dataArr_addNG[i].dyc_max,
                dj : dataArr_addNG[i].dj,
                dj_min : dataArr_addNG[i].dj_min,
                dj_max : dataArr_addNG[i].dj_max,
                creattime : date,
                ng_reason : dataArr_addNG[i].ng_reason
                };
            choose_dx.add_ng(dataArr);
        }
    },
    add_normal : function (dataArr_addNoraml) {
        var cxTime = new Date();
        var date=cxTime.getFullYear()+"/"+(cxTime.getMonth()+1)+"/"+cxTime.getDate()+" "+cxTime.getHours()+":"+cxTime.getMinutes()+":"+cxTime.getSeconds();
        for(var i = 0; i < dataArr_addNoraml.length; i++) {
            var dataArr = {
                xh : dataArr_addNoraml[i].xh,
                dx: dataArr_addNoraml[i].dx,
                sbh :dataArr_addNoraml[i].sbh,
                czrygh : dataArr_addNoraml[i].czrygh,
                scgd : dataArr_addNoraml[i].scgd,
                pc : dataArr_addNoraml[i].pc,
                dy : dataArr_addNoraml[i].dy,
                dy_min : dataArr_addNoraml[i].dy_min,
                dy_max : dataArr_addNoraml[i].dy_max,
                nz : dataArr_addNoraml[i].nz,
                nz_min : dataArr_addNoraml[i].nz_min,
                nz_max : dataArr_addNoraml[i].nz_max,
                rl : dataArr_addNoraml[i].rl,
                rl_min : dataArr_addNoraml[i].rl_min,
                rl_max : dataArr_addNoraml[i].rl_max,
                ocv4 : dataArr_addNoraml[i].ocv4,
                dyc : dataArr_addNoraml[i].dyc,
                dyc_min : dataArr_addNoraml[i].dyc_min,
                dyc_max : dataArr_addNoraml[i].dyc_max,
                dj : dataArr_addNoraml[i].dj,
                dj_min : dataArr_addNoraml[i].dj_min,
                dj_max : dataArr_addNoraml[i].dj_max,
                zxs : dataArr_addNoraml[i].zxs,
                creattime : date,
            }

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
var data =[ { sbh: '23122',
    czrygh: '12313',
    scgd: '312312',
    pc: '1',
    dx: '1',
    dy: '3.635',
    dy_min: '1',
    dy_max: '5',
    nz: '1000.200',
    nz_min: '1',
    nz_max: '99',
    rl: 'null',
    rl_min: '2000',
    rl_max: '3000',
    ocv4: 'null',
    dyc: 'null',
    dyc_min: '-10',
    dyc_max: '10',
    dj: 'null',
    dj_min: 'null',
    dj_max: 'null',
    zxs: '20',
    ng_reason: 'NG3' },
    { sbh: '23122',
        czrygh: '12313',
        scgd: '312312',
        pc: '1',
        dx: '2',
        dy: '3.641',
        dy_min: '1',
        dy_max: '5',
        nz: '1000.200',
        nz_min: '1',
        nz_max: '99',
        rl: 'null',
        rl_min: '2000',
        rl_max: '3000',
        ocv4: 'null',
        dyc: 'null',
        dyc_min: '-10',
        dyc_max: '10',
        dj: 'null',
        dj_min: 'null',
        dj_max: 'null',
        zxs: '20',
        ng_reason: 'NG3' },
    { sbh: '23122',
        czrygh: '12313',
        scgd: '312312',
        pc: '1',
        dx: '3',
        dy: '3.643',
        dy_min: '1',
        dy_max: '5',
        nz: '1000.200',
        nz_min: '1',
        nz_max: '99',
        rl: 'null',
        rl_min: '2000',
        rl_max: '3000',
        ocv4: 'null',
        dyc: 'null',
        dyc_min: '-10',
        dyc_max: '10',
        dj: 'null',
        dj_min: 'null',
        dj_max: 'null',
        zxs: '20',
        ng_reason: 'NG3' },
    { sbh: '23122',
        czrygh: '12313',
        scgd: '312312',
        pc: '1',
        dx: '4',
        dy: '3.641',
        dy_min: '1',
        dy_max: '5',
        nz: '127.600',
        nz_min: '1',
        nz_max: '99',
        rl: 'null',
        rl_min: '2000',
        rl_max: '3000',
        ocv4: 'null',
        dyc: 'null',
        dyc_min: '-10',
        dyc_max: '10',
        dj: 'null',
        dj_min: 'null',
        dj_max: 'null',
        zxs: '20',
        ng_reason: 'NG3' },
    { sbh: '23122',
        czrygh: '12313',
        scgd: '312312',
        pc: '1',
        dx: '5',
        dy: '3.642',
        dy_min: '1',
        dy_max: '5',
        nz: '1000.100',
        nz_min: '1',
        nz_max: '99',
        rl: 'null',
        rl_min: '2000',
        rl_max: '3000',
        ocv4: 'null',
        dyc: 'null',
        dyc_min: '-10',
        dyc_max: '10',
        dj: 'null',
        dj_min: 'null',
        dj_max: 'null',
        zxs: '20',
        ng_reason: 'NG3' } ];
getValue_plc.add_NG(data);