var m_cssz = require("./m_cssz");
var excelMap = require('electron').remote.getGlobal('sharedObject').excelMap;

const choose_dx = {
    check_rl : function (dxArr,dyValueArr,nzValueArr,ng_reasonArr) {
        m_cssz.query_csszInit(function (err,result) {
            if(err) throw err;
            var cxTime = new Date();
            var valueArr = new Array();
            var date=cxTime.getFullYear()+"/"+(cxTime.getMonth()+1)+"/"+cxTime.getDate()+" "+cxTime.getHours()+":"+cxTime.getMinutes()+":"+cxTime.getSeconds();
            for(var i = 0; i < result.recordset.length; i++){
                var record = result.recordset;
                if(record[i].type == "3"){
                    valueArr.push(record[i].value.split(";"));
                }
            }
            for(var j = 0; j < dxArr.length; j++){
                var dataArr = [dxArr[j],record[0].value,record[1].value,record[2].value,record[3].value,excelMap.get(dxArr[j])[1],valueArr[0][0],valueArr[0][1],dyValueArr[j],valueArr[1][0],valueArr[1][1],nzValueArr[j],valueArr[3][0],valueArr[3][1],excelMap.get(dxArr[j])[2],valueArr[2][0],valueArr[2][1],excelMap.get(dxArr[j])[0],valueArr[4][0],valueArr[4][1],record[9].value,date,ng_reasonArr[j],"1"];
                if(ng_reasonArr[j] != "") {
                    m_cssz.query_addNG_rl(dataArr,function (err) {
                        if(err) throw err;
                    })
                }
                else {
                    m_cssz.query_addNormal_rl(dataArr,function (err) {
                        if(err) throw err;
                        m_cssz.query_deleteNG(dataArr,function (err) {
                            if(err) throw err;
                        });
                    });
                }
            }
        });
    },
    check_dy : function (dxArr,dyValueArr,nzValueArr,ng_reasonArr) {
        m_cssz.query_csszInit(function (err,result) {
            if(err) throw err;
            var cxTime = new Date();
            var date=cxTime.getFullYear()+"/"+(cxTime.getMonth()+1)+"/"+cxTime.getDate()+" "+cxTime.getHours()+":"+cxTime.getMinutes()+":"+cxTime.getSeconds();
            for(var i = 0; i < result.recordset.length; i++){
                var record = result.recordset;
                if(record[i].name == "dyfw"){
                    var valueArr_dy = record[i].value.split(";");
                }
                if(record[i].name == "nzfw"){
                    var valueArr_nz = record[i].value.split(";");
                }
            }
            for(var j = 0; j < dxArr.length; j++){
                var dataArr = [dxArr[j],record[0].value,record[1].value,record[2].value,record[3].value,dyValueArr[j],valueArr_dy[0],valueArr_dy[1],nzValueArr[j],valueArr_nz[0],valueArr_nz[1],record[9].value,date,ng_reasonArr[j],"1"];
                if(ng_reasonArr[j] != "") {
                    m_cssz.query_addNG_dy(dataArr,function (err) {
                        if(err) throw err;
                    })
                }
                else{
                    m_cssz.query_addNormal_dy(dataArr,function (err) {
                        if (err) throw err;
                        m_cssz.query_deleteNG(dataArr,function (err) {
                            if(err) throw err;
                        });
                    })
                }
            }
        });
    },
    add_casenum : function (casenum,dxArr) {
        for(var i = 0; i < dxArr.length; i++){
            var dxtm = dxArr[i];
            m_cssz.query_addCase(casenum,dxtm);
        }

    }
};


module.exports = choose_dx;

/*  添加有ocv筛选的正常数据
else {
    m_cssz.query_addNormal_rl(dataArr,function (err) {
        if(err) throw err;
        m_cssz.query_deleteNG(dataArr,function (err) {
            if(err) throw err;
        });
    });
}
*/

/* 添加没有ocv筛选的正常数据
else{
    m_cssz.query_addNormal_dy(dataArr,function (err) {
        if (err) throw err;
        m_cssz.query_deleteNG(dataArr,function (err) {
            if(err) throw err;
        });
    })
}
*/