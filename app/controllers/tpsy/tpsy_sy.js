var soap = require('soap');
var HashMap = require('../../utils/hashmap');
var m_tpsy = require("../../controllers/tpsy/m_tpsy");
var c_page = require("../../controllers/c_page");
var webService = require("../../controllers/tpsy/webservice");

var url = 'http://221.178.135.214:8099/Service1.asmx?wsdl';

$(document).ready(function () {
    argArrive();
    Webservice();
    sycsInit();
    $('#zc').hide();
    $('#yc').hide();
    $("#btn_cssz").click(CreatWindows_cssz);
    $("#btn_ngsjcx").click(CreatWindows_ngsjcx);
});


function argArrive() {
    c_page.regValue(function (err,dxArr,dyArr,nzArr,ng_reasonArr) {
        if(err) throw err;
        var check_ocv = $('#sjsx').attr("checked") ? 1 : 0;
        if(check_ocv == 1){
            getValue_plc.isOcv(dxArr,dyArr,nzArr,ng_reasonArr);
        }
        else { getValue_plc.noOcv(dxArr,dyArr,nzArr,ng_reasonArr); }
    });
    c_page.regValue_casenum(function (err,casenum,dxArr) {
        if(err) throw err;
        var check_ocv = $('#sjsx').attr("checked") ? 1 : 0;
        if(check_ocv == 1){
            getValue_plc.getCase(casenum,dxArr);
        }
        else { getValue_plc.getCase(casenum,dxArr); }
        var Json_Upload = {
            Key: "",      //未使用，为空字符串
            Role: "",      //未使用，为空字符串
            TransactionType: 1,     //校验check:0   数据上传：1
            StartDate: "",//未使用，空字符串
            EndDate: "", //未使用，空字符串
            InDataSet :[{
                LotNo: "TC02 SXTZ004980 1284",     // 批号
                RltBillNo: "SXTZ004980",   //筛选单号
                MachineNo: "6#",  //机台号
                WorkerNo: "1759",  // 工号
                Qty: "228",          //数量
                LevelGrade: "4",         //档位
                CapSubGrade: "8",      //容量档
                Voltage: "3.74-3.78",  //电压
                InterResist: "10-16",       //内阻
                RecordTime: RecordTime,      //时间
                ReTest: "1",      // 二次筛选
                Remark: "XXX"           //    备注
            }]
        };
        var json = JSON.stringify(Json_Upload);
        webService.upload(url,json,function (err,result) {
            if (err) throw  err;
            if(result != 0){
                alert("上传失败")
            }
            else { alert("上传成功") }
        });
    });
}
function CreatWindows_cssz() {
    $('#win_cssz').window({
        title:'参数设置',
        left:500,
        top:100,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:500,
        height:700,
        modal:false,
        draggable:true
    });
    $('#win_cssz').window('refresh', './tpsy_cssz.html');
}
function CreatWindows_ngsjcx() {
    $('#win_cssz').window({
        title: 'NG数据查询',
        left:150,
        top:100,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:1200,
        height:700,
        modal:false,
        draggable:true
    });
    $('#win_cssz').window('refresh', './tpsy_sjcx.html');
}

function sycsInit() {
    m_tpsy.query_sycsInit(function (err,result) {
        if(err){
            console.log(err);
            return;
        }
        var key = "";
        var value = "";
        var hashMap = new HashMap.Map();
        for(var i = 0; i < result.recordset.length; i++){
            var record = result.recordset[i];
            key =  record.name ;
            value =  record.value ;
            hashMap.put(key,value);
        }
        $('#sy_sbh').text(hashMap.get("sbh"));
        $('#sy_czrygh').text(hashMap.get("czrygh"));
        $('#sy_scgd').text(hashMap.get("scgd"));
        $('#sy_pc').text(hashMap.get("pc"));
        $('#sy_rlfw').text(hashMap.get("rlfw"));
        $('#sy_zxs').text(hashMap.get("zxs"));
        $('#sy_sjsx').text(hashMap.get("sjsx")==1 ? " 是" : "否");
    })
}

function Webservice() {
    c_page.regMes(function (err,arg) {
        if(err) throw err;
        m_tpsy.query_sycsInit(function (err,result) {
            if (err) {
                console.log(err);
                return;
            }
            var key = "";
            var value = "";
            var hashMap = new HashMap.Map();
            for (var i = 0; i < result.recordset.length; i++) {
                var record = result.recordset[i];
                key = record.name;
                value = record.value;
                // 得到容量范围的前一个值
                if(record.type == 3){
                    var valueArr = value.split(";");
                    value = valueArr[0];
                }
                hashMap.put(key, value);
            }
            var Json_Check = {
                Key : "",
                Role : "",
                TransactionType: 0,
                StarData : "",
                EndData : "",
                InDataSet :[{
                    RltBillNo : hashMap.get("scgd"),                //数据库查询
                    CaseNo : arg,                            //扫码得到
                    CapSubGrade : hashMap.get("rlfw"),
                    PdtGrade : "",
                    MachineNo : hashMap.get("sbh"),
                    WorkerNo : hashMap.get("czrygh")
                }]
            };
            var json = JSON.stringify(Json_Check);
            webService.check(url,json,function (err,result) {
                if(err) throw  err;
                if(result == 0){
                    $('#zc').show();
                }
                else{
                    $('#yc').show();
                }
            });
        });
    });
}

function closeCsszWin(){
    $('#win_cssz').window('close');
}




