var fs = require("fs");
var m_sjcx = require('../../models/m_sjcx');
var csszMap = require('electron').remote.getGlobal('sharedObject').csszMap;

$(document).ready(function () {
    window.setTimeout('comboboxInit();',500);
    $('#btn_qd').click(select_All);
    $('#btn_dc').click(dcCsv);
});


/* 下拉框初始化 */
function comboboxInit() {
    m_sjcx.query_selectAll_batch(function (err,result) {
        if(err) throw err;
        var data = [];
        for( var i = 0; i < result.recordset.length; i++){
            var record = result.recordset[i].batch;
            var value = {value: record ,text: record};
            data.push(value);

        }
        $('#combobox_pc').combobox("loadData",data);
    });
    m_sjcx.query_select_dqbatch(function (err,result) {
        if(err) throw err;
        var defaultValue = result.recordset[0].batch;
        $('#combobox_pc').combobox({value: defaultValue});
    });
    m_sjcx.query_selectAll_ng_reason(function (err,result) {
        if (err) throw err;
        var data1 = [];
        for (var i = 0; i < result.recordset.length; i++) {
            var value = {};
            var record = result.recordset[i].ng_reason;
            if(record == "NG1"){
                value = {value: record, text: "扫码不良"};
            }
            if(record == "NG2"){
                value = {value: record, text: "电压异常"};
            }
            if(record == "NG3"){
                value = {value: record, text: "内阻异常"};
            }
            if(record == "NG4"){
                value = {value: record, text: "容量信息不匹配"};
            }
            if(record == "NG5"){
                value = {value: record, text: "△V不良"};
            }
            if(record == "NG6"){
                value = {value: record, text: "电压内阻未测试到"};
            }
            data1.push(value);
        }
        $('#combobox_ngyy').combobox("loadData",data1);
    });
    var batch = csszMap.get("pc");
    m_sjcx.query_selectBatch(batch,function (error,result) {
        if(error){
            console.log(error);
            return;
        }
        dataGrid_Init(result.recordset);
    });
}

/* 查询数据 */
function select_All(){
    var batch =$('#combobox_pc').combobox('getValue');
    var ng_reason = $('#combobox_ngyy').combobox('getValue');
    m_sjcx.query_selectBatch(batch,function (error,result) {
        if(error){
            console.log(error);
            return;
        }
        dataGrid_Init(result.recordset);
    });
    if(batch != "" && ng_reason != "") {
        batch =$('#combobox_pc').combobox('getValue');
        m_sjcx.query_select(ng_reason,batch,function (error,result) {
            if(error){
                console.log(error);
                return;
            }
            dataGrid_Init(result.recordset);
        });
    }
}

/* datagrid 初始化  */
function dataGrid_Init(dataArr) {
    $('#ng_table').datagrid({loadFilter:pagerFilter}).datagrid({
        columns: [[
            {field:'cellnum',title:'电芯条码'},
            {field:'batch',title:'批次'},
            {field:'volume',title:'容量'+"("+csszMap.get('rlfw').replace(";","-")+")"},
            {field:'resistance',title:'内阻'+"("+csszMap.get('nzfw').replace(";","-")+")"},
            {field:'voltage',title:'电压'+"("+csszMap.get('dyfw').replace(";","-")+")"},
            {field:'ocv4',title:'ocv4'},
            {field:'volumedifference',title:'电压差'+"("+csszMap.get('dycfw').replace(";","-")+")"},
            {field:'ng_reason',title:'NG原因'},
            {field:'checknum',title:'检测次数'},
            {field:'equiptmentnum',title:'设备号'},
            {field:'workernum',title:'操作人员工号'},
            {field:'productionorder',title:'生产工单'},
            {field:'grade',title:'等级'+"("+csszMap.get('djfw').replace(";","-")+")"},
            {field:'creattime',title:'创建时间'},
        ]],
        data : dataArr
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

/* 导出csv文件 */
function dcCsv() {
    var batch = $('#combobox_pc').combobox('getValue');
    var ng_reason = $('#combobox_ngyy').combobox('getValue');
    var property = JSON.parse(fs.readFileSync('app/config/config_filesave.json', 'utf8'));
    if (batch != "" && ng_reason == "") {
        m_sjcx.query_selectBatch(batch, function (error, result) {
            if (error) {
                console.log(error);
                return;
            }
            var str = "电芯条码" + "," + "设备号" + "," + "操作人员工号" + "," + "生产工单" + "," + "批次" + "," + "电压" + "," + "电压范围" + "," + "内阻" + "," + "内阻范围" + "," + "容量" + "," + "容量范围" + "," + "Ocv4" + "," + "电压差范围" + "," + "等级" + "," + "等级范围" + "," + "创建时间" + "," + "NG原因" + "," + "检测次数" + "\n";
            for (var i = 0; i < result.recordset.length; i++) {
                for (var key in result.recordset[i]) {
                    str = str + (result.recordset[i][key]) + ",";
                }
                str = str + "\n";
            }
            fs.writeFile(property.FILESAVE_PATH, str, function (err) {
                if (err) throw err;
                alert('数据导出成功');
            });
        });
    }
    else if (batch != "" && ng_reason != "") {
        batch = $('#combobox_pc').combobox('getValue');
        m_sjcx.query_select(ng_reason, batch, function (error, result) {
            if (error) {
                console.log(error);
                return;
            }
            var str = "电芯条码" + "," + "设备号" + "," + "操作人员工号" + "," + "生产工单" + "," + "批次" + "," + "电压" + "," + "电压范围" + "," + "内阻" + "," + "内阻范围" + "," + "容量" + "," + "容量范围" + "," + "Ocv4" + "," + "电压差范围" + "," + "等级" + "," + "等级范围" + "," + "创建时间" + "," + "NG原因" + "," + "检测次数" + "\n";
            for (var i = 0; i < result.recordset.length; i++) {
                for (var key in result.recordset[i]) {
                    str = str + (result.recordset[i][key]) + ",";
                }
                str = str + "\n";
            }
            fs.writeFile(property.FILESAVE_PATH, str, function (err) {
                if (err) throw err;
                alert('数据导出成功');
            });
        });
    }
}
