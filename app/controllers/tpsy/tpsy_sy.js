var fs = require('fs');
var HashMap = require('../../utils/hashmap');
var m_cssz = require("../../models/m_cssz");
var m_tpsy = require("../../models/m_tpsy");
var c_page = require("../../controllers/c_page");
var webService = require("../../controllers/tpsy/webservice");
var getValue_plc = require("../../controllers/tpsy/getValue_plc");
var property = JSON.parse(fs.readFileSync('app/config/config_webservice.json', 'utf8'));
var url = property.URL;
var csszMap = require('electron').remote.getGlobal('sharedObject').csszMap;

$(document).ready(function () {
    sycsInit();
    $('#zc').hide();
    $('#yc').hide();
    $("#btn_cssz").click(CreatWindows_cssz);
    $("#btn_ngsjcx").click(CreatWindows_ngsjcx);
    add_NG_DB();
    sealing_dispose();
    filltable();
    judgeNormal();
});

function CreatWindows_cssz() {
    $('#win_cssz').window({
        title:'参数设置',
        left:500,
        top:80,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:440,
        height:615,
        modal:false,
        draggable:true
    });
    $('#win_cssz').window('refresh', './tpsy_cssz.html');
}
function CreatWindows_ngsjcx() {
    $('#win_cssz').window({
        title: 'NG数据查询',
        left:200,
        top:80,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:1040,
        height:680,
        modal:false,
        draggable:true
    });
    $('#win_cssz').window('refresh', './tpsy_sjcx.html');
}

function sycsInit() {
    m_cssz.query_csszInit(function (err,result) {
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
        $('#sy_rlfw').text(hashMap.get("rlfw").replace(";","-"));
        $('#sy_zxs').text(hashMap.get("zxs"));
        $('#sy_sjsx').text(hashMap.get("sjsx")==1 ? " 是" : "否");
        m_tpsy.query_ngLength(function (err,result) {
            if(err){
                console.log(err);
                return;
            }
            for(var i = 0;i < result.recordset.length; i++){
                $('#sy_ngdxsl').text(result.recordset[i].length);
            }
        });
        m_tpsy.query_normalLength(function (err,result) {
            if(err){
                console.log(err);
                return;
            }
            for(var i = 0;i < result.recordset.length; i++){
                $('#sy_dxsl').text(result.recordset[i].length);
            }
        });
    });
    $('#ng_table_sy').datagrid({
        columns: [[
            {field:'dx',title:'电芯条码'},
            {field:'rl',title:'容量'+"("+csszMap.get('rlfw').replace(";","-")+")"},
            {field:'nz',title:'内阻'+"("+csszMap.get('nzfw').replace(";","-")+")"},
            {field:'dy',title:'电压'+"("+csszMap.get('dyfw').replace(";","-")+")"},
            {field:'ocv4',title:'ocv4'},
            {field:'dyc',title:'电压差'+"("+csszMap.get('dycfw').replace(";","-")+")"},
            {field:'result',title:'结果'}
        ]]
    });
}

function judgeNormal() {
    c_page.regScanBarCode(function (arg) {
        var hashMap = require('electron').remote.getGlobal('sharedObject').csszMap;
        var Json_Check = {
            Key : "",
            Role : "",
            TransactionType: 0,
            StarData : "",
            EndData : "",
            InDataSet :[{
                RltBillNo :hashMap.get("scgd"),   //"SCTZD104579",               //数据库查询 生产工单
                CaseNo : arg,   //"01491377",                             //扫码得到 箱号
                CapSubGrade : hashMap.get("rlfw"), //"9",                   //数据库查询 容量档
                PdtGrade : "",  //"A5X",                  //数据库查询 档位，暂时制空
                MachineNo :hashMap.get("sbh"),   //"4#",            //数据库查询 设备号
                WorkerNo : hashMap.get("czrygh")    //"8888"                //数据库查询 操作人员工号
            }]
        };
        var json = JSON.stringify(Json_Check);
        webService.check(url,json,function (result) {
            if(result.ret == 0){
                $('#zc').show();
            }
            else{
                $('#yc_text').text(result.Msg);
                $('#yc').show();
                c_page.boxError();
            }
        });
    });
}

function add_NG_DB() {
    c_page.regValue_ng(function (dataArr_addNG) {
        getValue_plc.add_NG(dataArr_addNG);
        m_tpsy.query_ngLength(function (err,result) {
            if(err){
                console.log(err);
                return;
            }
            for(var i = 0;i < result.recordset.length; i++){
                $('#sy_ngdxsl').text(result.recordset[i].ngcount);
            }
        });
    });
}

function sealing_dispose() {
    c_page.regValue_casenum(function (dataArr_addNoraml) {
        getValue_plc.add_normal(dataArr_addNoraml);
        m_tpsy.query_normalLength(function (err,result) {
            if(err){
                console.log(err);
                return;
            }
            for(var i = 0;i < result.recordset.length; i++){
                $('#sy_dxsl').text(result.recordset[i].normalcount);
            }
        });
        getValue_plc.select_normal(function (dataArr) {
            var dataArr_upload = dataArr;
            for(var i = 0; i < dataArr_upload.length; i++){
                var upload = dataArr_upload[i];
                var Json_Upload = {
                    Key: "",      //未使用，为空字符串
                    Role: "",      //未使用，为空字符串
                    TransactionType: 1,     //校验check:0   数据上传：1
                    StartDate: "",//未使用，空字符串
                    EndDate: "", //未使用，空字符串
                    InDataSet :[{
                        LotNo: upload.batch,     // 批号
                        RltBillNo: upload.productionorder,   //筛选单号
                        MachineNo: upload.equiptmentnum,  //机台号
                        WorkerNo: upload.workernum,  // 工号
                        Qty: upload.binningnum,          //数量
                        LevelGrade: "",        //档位 对应等级
                        CapSubGrade: upload.volume_min+"-"+upload.volume_max,      //容量档 对应容量范围
                        Voltage: upload.voltage_min+"-"+upload.voltage_max,  //电压
                        InterResist: upload.resistance_min+"-"+upload.resistance_max,       //内阻
                        RecordTime: upload.creattime,      //时间
                        ReTest: upload.checknum,      // 二次筛选 筛选次数
                        Remark: ""           //    备注
                    }]
                };
                var json = JSON.stringify(Json_Upload);
                webService.upload(url,json,function (result) {
                    if(result.ret == 0){
                        console.log("case update : sccu")
                    }
                    else { console.log("case update errot:"+result.Msg) }
                });
            }
        });
    });
}

/* datagrid 初始化  */
function dataGrid_Init(dataArr) {
    $('#ng_table_sy').datagrid({
        columns: [[
            {field:'dx',title:'电芯条码'},
            {field:'rl',title:'容量'+"("+csszMap.get('rlfw').replace(";","-")+")"},
            {field:'nz',title:'内阻'+"("+csszMap.get('nzfw').replace(";","-")+")"},
            {field:'dy',title:'电压'+"("+csszMap.get('dyfw').replace(";","-")+")"},
            {field:'ocv4',title:'ocv4'},
            {field:'dyc',title:'电压差'+"("+csszMap.get('dycfw').replace(";","-")+")"},
            {field:'result',title:'结果'}
        ]],
        data : dataArr
    });
}

function filltable(){
    /* dataArr格式 ： [{},{},...] 对象数组  */
    c_page.regFilltable(function (dataArr) {
        dataGrid_Init(dataArr);
    });
}

function closeCsszWin(){
    $('#win_cssz').window('close');
}




