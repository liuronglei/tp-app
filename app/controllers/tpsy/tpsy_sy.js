var soap = require('soap');
var fs = require('fs');
var HashMap = require('../../utils/hashmap');
var m_cssz = require("../../models/m_cssz");
var c_page = require("../../controllers/c_page");
var webService = require("../../controllers/tpsy/webservice");
var getValue_plc = require("../../controllers/tpsy/getValue_plc");
var property = JSON.parse(fs.readFileSync('app/config/config_webservice.json', 'utf8'));
var url = property.URL;
/*var dataObj_ng = {
    sbh : "2",
    czrygh : "null",
    scgd : "null",
    pc :　"null",
    dx : "KA2GA18 101005",
    dy : "2000",
    dy_min : "null",
    dy_max : "null",
    nz : "100",
    nz_min : "null",
    nz_max : "null",
    rl : "null",
    rl_min: "null",
    rl_max: "null",
    ocv4 : "null",
    dyc_min : "null",
    dyc_max : "null",
    dj : "null",
    dj_min: "null",
    dj_max: "null",
    zxs : "null",
    ng_reason : "NG1"
};*/
/*var dataObj_normal = {
    xh : "",
    sbh : "2",
    czrygh : "null",
    scgd : "null",
    pc :　"null",
    dx : "KA2GA18 101005",
    dy : "2000",
    dy_min : "null",
    dy_max : "null",
    nz : "100",
    nz_min : "null",
    nz_max : "null",
    rl : "null",
    rl_min: "null",
    rl_max: "null",
    ocv4 : "null",
    dyc_min : "null",
    dyc_max : "null",
    dj : "null",
    dj_min: "null",
    dj_max: "null",
    zxs : "null"
};
var dataArr = [dataObj_normal];*/
$(document).ready(function () {
    filltable();
    judgeNormal();
    sycsInit();
    $('#zc').hide();
    $('#yc').hide();
    $("#btn_cssz").click(CreatWindows_cssz);
    $("#btn_ngsjcx").click(CreatWindows_ngsjcx);
    add_NG_DB();
    sealing_dispose();
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
        top:80,
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
    })
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
                RltBillNo : hashMap.get("scgd"),                //数据库查询
                CaseNo : arg,                            //扫码得到
                CapSubGrade : hashMap.get("rlfw"),
                PdtGrade : "",
                MachineNo : hashMap.get("sbh"),
                WorkerNo : hashMap.get("czrygh")
            }]
        };
        var json = JSON.stringify(Json_Check);
        webService.check(url,json,function (result) {
            alert(result);
            if(result == 0){
                $('#zc').show();
            }
            else{
                $('#yc').show();
            }
        });
    });
}

function add_NG_DB() {
    c_page.regValue_ng(function (err,dataArr_addNG) {
        if(err) throw err;
        getValue_plc.add_NG(dataArr_addNG);
    });
}

function sealing_dispose() {
    c_page.regValue_casenum(function (err,dataArr_addNoraml) {
        if(err) throw err;
        getValue_plc.add_normal(dataArr_addNoraml);
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
                        LevelGrade: upload.grade,         //档位
                        CapSubGrade: upload.volume_min+"-"+upload.volume_max,      //容量档
                        Voltage: upload.voltage_min+"-"+upload.voltage_max,  //电压
                        InterResist: upload.resistance_min+"-"+upload.resistance_max,       //内阻
                        RecordTime: upload.creattime,      //时间
                        ReTest: upload.checknum,      // 二次筛选
                        Remark: ""           //    备注
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
            }
        });
    });
}

/* datagrid 初始化  */
function dataGrid_Init(dataArr) {
    var csszMap = require('electron').remote.getGlobal('sharedObject').csszMap;
    $('#ng_table_sy').datagrid({
        columns: [[
            {field:'cellnum',title:'电芯条码'},
            {field:'voltage',title:'电压'+"("+csszMap.get('dyfw').replace(";","-")+")"},
            {field:'resistance',title:'内阻'+"("+csszMap.get('nzfw').replace(";","-")+")"},
            {field:'volume',title:'容量'+"("+csszMap.get('rlfw').replace(";","-")+")"},
            {field:'volumedifference_range',title:'电压差'+"("+csszMap.get('dycfw').replace(";","-")+")"},
            {field:'creattime',title:'创建时间'},
            {field:'result',title:'结果'}
        ]]
    });
    $('#ng_table_sy').datagrid({loadFilter:pagerFilter}).datagrid({
        data : dataArr,
    });
}

/* easyui 分页  */
function pagerFilter(data){
    if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
        data = {
            total: data.length,
            rows: data
        }
    }
    var dg = $(this);
    var opts = dg.datagrid('options');
    var pager = dg.datagrid('getPager');
    pager.pagination({
        onSelectPage:function(pageNum, pageSize){
            opts.pageNumber = pageNum;
            opts.pageSize = pageSize;
            pager.pagination('refresh',{
                pageNumber:pageNum,
                pageSize:pageSize
            });
            dg.datagrid('loadData',data);
        }
    });
    if (!data.originalRows){
        data.originalRows = (data.rows);
    }
    var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
    var end = start + parseInt(opts.pageSize);
    data.rows = (data.originalRows.slice(start, end));
    return data;
}

function filltable(){
    c_page.regFilltable(function (dataArr) {
        dataGrid_Init(dataArr);
    });
}

function closeCsszWin(){
    $('#win_cssz').window('close');
}




