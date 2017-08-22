var m_choose = require("../../models/m_choose");

const choose_dx = {
    add_ng : function (dataArr) {
        m_choose.addNG(dataArr,function (err) {
            if(err) throw err;
        })
    },
    add_normal : function (dataArr) {
        m_choose.addNormal(dataArr,function (err) {
            if(err) throw err;
            m_choose.deleteNG(dataArr,function (err) {
                if(err) throw err;
            })
        });
    },
    select_normal : function (callback) {
        m_choose.query_normal(function (err,result) {
            if(err) throw err;
            callback(result);
        })
    },
    select_casenum :function (callback) {
        m_choose.query_xh(function (err,result) {
            if(err) throw err;
            callback(result);
        })
    }
};

module.exports = choose_dx;
/*var dataObj_ng = {
    sbh: '23122',
    czrygh: '12313',
    scgd: '312312',
    pc: '1',
    dx: 'KA2GA18 101015',
    dy: 3.6403000354766846,
    dy_min: '2.34',
    dy_max: '2.67',
    nz: 166.0900115966797,
    nz_min: '23.45',
    nz_max: '25.75',
    rl: '2229',
    rl_min: '2000',
    rl_max: '3000',
    ocv4: 3.6521999999999997,
    dyc: 0.011899964523315099,
    dyc_min: '-0.50',
    dyc_max: '0.51',
    dj: 'null',
    dj_min: 'null',
    dj_max: 'null',
    zxs: '100',
    ng_reason: 'NG2;NG3;NG4;NG5',
    creattime: "2017/8/22 11:37:00",
};
var dataArr = [dataObj_ng];
choose_dx.add_ng(dataArr[0]);*/