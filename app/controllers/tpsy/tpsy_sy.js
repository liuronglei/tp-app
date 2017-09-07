var fs = require('fs');
var HashMap = require('../../utils/hashmap');
var m_cssz = require("../../models/m_cssz");
var m_tpsy = require("../../models/m_tpsy");
var c_page = require("../../controllers/c_page");
var webService = require("../../controllers/tpsy/webservice");
var getValue_plc = require("../../controllers/tpsy/getValue_plc");
var property = JSON.parse(fs.readFileSync('app/config/config_webservice.json', 'utf8'));
//var dataformat = require('../../utils/dataformat');
var normalCount = require('electron').remote.getGlobal('sharedObject').normalCount;
var ngCount = require('electron').remote.getGlobal('sharedObject').ngCount;
var url = property.URL;
var checkResultArr = [];
/*var url = "http://221.178.135.214:8099/Service1.asmx?wsdl";
var count = 0;*/
$(document).ready(function () {
    fillCombobox();
    updataCountShow();
    sycsInit();
    $('#zc').hide();
    $('#yc').hide();
    $("#btn_cssz").click(CreatWindows_cssz);
    $("#btn_ngsjcx").click(CreatWindows_ngsjcx);
    $("#btn_zcsjcx").click(CreatWindows_zcsjcx);
    $("#btn_cxdy").click(print);
    $("#btn_qlfx").click(qlfx);
    add_NG_DB();
    sealing_dispose();
    filltable();
    judgeNormal();
});

function updataCheckResult() {
    //遍历checkResultArr
    for(var i = 0; i < checkResultArr.length; i++){
        var arg = checkResultArr[i].arg;
        var ret = checkResultArr[i].ret;
        var Msg = "正常";
        var checkFlag = "zc";
        var nowCheck ="";
        if(ret == 1){
            checkFlag = "yc";
            Msg = checkResultArr[i].Msg;      //异常则有异常信息,需要显示出来
        }
        var historyCheck = "normal";
        if(i == 0){
            historyCheck = "now";
            nowCheck = "now-";
        }
        console.log(arg);
        var htmlStr = '<img class="'+historyCheck+'-picture" src="../../../public/img/icon_tp/icon-big-'+checkFlag+'.png"/>'+
            '<div class="history_list">'+
            '<span class="'+checkFlag+''+nowCheck+'content">'+Msg+'</span>'+
            '<span class="'+checkFlag+''+nowCheck+'content-code">'+arg+'</span>'+
            '</div>';
        $("#check_0"+(i+1)).html(htmlStr);
    }
}

function qlfx() {
    if(window.confirm('确定要进行尾料清算吗？')) {
        c_page.doQlfx();
    }
}

function fillCombobox (){
    c_page.regFillCombobox(function (json_xh) {
        $('#combobox_xh').combobox("loadData",json_xh);
    })
}
function print() {
    var json_xh_value = $('#combobox_xh').combobox('getValue');
    c_page.doPrint(json_xh_value);
}
function CreatWindows_cssz() {
    var csszMap = require('electron').remote.getGlobal('sharedObject').csszMap;
    $('#win_cssz').window({
        title:'参数设置',
        left:500,
        top:30,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:440,
        height:150 + csszMap.size()*39,
        modal:true,
        draggable:true
    });
    $('#win_cssz').window('refresh', './tpsy_cssz.html');
}
function CreatWindows_ngsjcx() {
    $('#win_ngsjcx').window({
        title: 'NG数据查询',
        left:230,
        top:50,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:1040,
        height:710,
        modal:true,
        draggable:true
    });
    $('#win_ngsjcx').window('refresh', './tpsy_sjcx.html');
}
function CreatWindows_zcsjcx() {
    $('#win_normalsjcx').window({
        title: '正常数据查询',
        left:230,
        top:50,
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:1040,
        height:710,
        modal:true,
        draggable:true
    });
    $('#win_normalsjcx').window('refresh', './tpsy_sjcx_normal.html');
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
        $('#ng_table_sy').datagrid({
            columns: [[
                {field:'dx',title:'电芯条码'},
                {field:'dy',title:'电压'+"("+hashMap.get('dyfw').replace(";","-")+")"},
                {field:'nz',title:'内阻'+"("+hashMap.get('nzfw').replace(";","-")+")"},
                {field:'rl',title:'容量'+"("+hashMap.get('rlfw').replace(";","-")+")"},
                {field:'dyc',title:'电压差'+"("+hashMap.get('dycfw').replace(";","-")+")"},
                {field:'ocv4',title:'ocv4'},
                {field:'result',title:'结果'}
            ]]
        });
        $('#sy_ngdxsl').text(0);
        $('#sy_dxsl').text(0);
    });
}

function judgeNormal() {
    c_page.regScanBarCode(function (arg) {
        /*count++;
        var arg=dataformat.fillZero(count,8);*/
        var csszMap = require('electron').remote.getGlobal('sharedObject').csszMap;
        var Json_Check = {
            Key : "",
            Role : "",
            TransactionType: 0,
            StarData : "",
            EndData : "",
            InDataSet :[{
                RltBillNo :csszMap.get("scgd"),   //"SCTZD104579",               //数据库查询 生产工单
                CaseNo : arg,   //"01491377",                             //扫码得到 箱号
                CapSubGrade : csszMap.get("rld"), //"9",                   //数据库查询 容量档
                PdtGrade : "",  //"A5X",                  //数据库查询 档位，暂时制空
                MachineNo :csszMap.get("sbh"),   //"4#",            //数据库查询 设备号
                WorkerNo : csszMap.get("czrygh")    //"8888"                //数据库查询 操作人员工号
            }]
        };
        var json = JSON.stringify(Json_Check);
        webService.check(url,json,function (result) {
            //将历史检测结果记录下来
            if(checkResultArr == "" || arg!="undefined" && arg !=checkResultArr[0].arg){
                checkResultArr.unshift({arg:arg,ret :result.ret,Msg :result.Msg});
                while(checkResultArr.length >5){
                    checkResultArr.pop();
                }
                updataCheckResult();
            }
            /*var ret = checkResultArr[0].arg.ret;
            var Msg = "正常";
            var checkFlag = "zc";
            if(ret == 1){
                checkFlag = "yc";
                Msg = checkResultArr[0].arg.Msg;
            }
            $('#check_01').append('<img class="now-picture" src="../../../public/img/icon_tp/icon-big-'+checkFlag+'.png"/>'+
                '<div class="history_list">'+
                '<span class="content">'+Msg+'</span>'+
                '<span class="content">'+arg+'</span>'+
                '</div>')*/
            /*$('#yc').hide();
            $('#zc').hide();
            if(result.ret == 0){
                $('#zc').show();

            }
            else{
                $('#yc_text').text(result.Msg);
                $('#yc').show();
                c_page.boxError();
            }*/
        });
    });
}

function add_NG_DB() {
    c_page.regValue_ng(function (dataArr_addNG) {
        getValue_plc.add_NG(dataArr_addNG);
    });
}

function updataCountShow() {
    setInterval(function() {
        m_tpsy.query_normalLength(function (err,result) {
            if(err){
                console.log(err);
                return;
            }
            var normalBarArr = require('electron').remote.getGlobal('sharedObject').normalBarArr;
            var count = parseInt(result.recordset[0].normalcount) + normalBarArr.length;
            if($('#sy_dxsl').text() == "" || count > parseInt($('#sy_dxsl').text())){
                $('#sy_dxsl').text(count);
            }
        });
        m_tpsy.query_ngLength(function (err,result) {
            if(err){
                console.log(err);
                return;
            }
            for(var i = 0;i < result.recordset.length; i++){
                $('#sy_ngdxsl').text(result.recordset[i].ngcount);
            }
        });
        $('#sy_yxdxsl').text(normalCount);
        $('#sy_yxngdxsl').text(ngCount);
    }, 1000);
}
function sealing_dispose() {
    c_page.regValue_casenum(function (dataArr_addNoraml) {
        getValue_plc.add_normal(dataArr_addNoraml);
        var csszMap = require('electron').remote.getGlobal('sharedObject').csszMap;
        var Json_Upload = {
            Key: "",      //未使用，为空字符串
            Role: "",      //未使用，为空字符串
            TransactionType: 1,     //校验check:0   数据上传：1
            StartDate: "",//未使用，空字符串
            EndDate: "", //未使用，空字符串
            InDataSet :[{
                LotNo: csszMap.get("pc"),     // 批号
                RltBillNo: csszMap.get("scgd"),   //筛选单号
                MachineNo: csszMap.get("sbh"),  //机台号
                WorkerNo: csszMap.get("czrygh"),  // 工号
                Qty: dataArr_addNoraml.length,          //数量
                LevelGrade: "",        //档位 对应等级
                CapSubGrade: (csszMap.get("rlfw")).replace(";","-"),      //容量档 对应容量范围
                Voltage: (csszMap.get("dyfw")).replace(";","-"),  //电压
                InterResist: (csszMap.get("nzfw")).replace(";","-"),       //内阻
                RecordTime: "",      //时间
                ReTest: "",      // 二次筛选 筛选次数
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
    });
}

/* datagrid 初始化  */
function dataGrid_Init(dataArr) {
    $('#ng_table_sy').datagrid("loadData",dataArr);
}

function filltable(){
    /* dataArr格式 ： [{},{},...] 对象数组  */
    c_page.regFilltable(function (dataArr) {
        $('#ng_table_sy').datagrid("loadData",dataArr);
    });
}

function closeCsszWin(){
    $('#win_cssz').window('close');
}