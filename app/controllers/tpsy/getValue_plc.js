var choose_dx = require('../../controllers/tpsy/choose_dx');

const getValue_plc = {
    isOcv : function (dxArr,dyArr,nzArr,ng_reasonArr) {
        choose_dx.check_rl(dxArr,dyArr,nzArr,ng_reasonArr);
    },
    noOcv :function (dxArr,dyArr,nzArr,ng_reasonArr) {
        choose_dx.check_dy(dxArr,dyArr,nzArr,ng_reasonArr);
    },
    getCase : function (casenum,dxArr) {
        choose_dx.add_casenum(casenum,dxArr);
    }
};

module.exports = getValue_plc;
