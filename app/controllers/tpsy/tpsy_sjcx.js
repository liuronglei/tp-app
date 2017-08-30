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
    var pc =csszMap.get("pc");
    var ng_reason = $('#combobox_ngyy').combobox('getValue');
    var scgd = csszMap.get("scgd");
    var ygh = $('#combobox_ygh').combobox('getValue');
    var kssj = $('#dd_star').datetimebox('getValue');
    var jjsj = $('#dd_end').datetimebox('getValue');
    m_sjcx.query_selectAll_batch(function (err,result) {
        if(err) throw err;
        var data = [];
        var contains =  false;
        var value = {value: "",text: "全部"};
        data.push(value);
        for( var i = 0; i < result.recordset.length; i++){
            var record = result.recordset[i].batch;
            value = {value: record ,text: record};
            if(csszMap.get("pc") == record){
                contains = true;
                value.selected = true;
            }
            data.push(value);
        }
        if(!contains){
            value = {value: csszMap.get("pc") ,text: csszMap.get("pc"),selected : true};
            data.push(value);
        }
        $('#combobox_pc').combobox("loadData",data);
    });
    m_sjcx.query_selectAll_scgd(pc,function (err,result) {
        if(err) throw err;
        var data = [];
        var contains =  false;
        var value = {value: "",text: "全部"};
        data.push(value);
        for( var i = 0; i < result.recordset.length; i++){
            var record = result.recordset[i].productionorder;
            value = {value: record ,text: record};
            if(csszMap.get("scgd") == record){
                contains = true;
                value.selected = true;
            }
            data.push(value);

        }
        if(!contains){
            value = {value: csszMap.get("scgd") ,text: csszMap.get("scgd"),selected : true};
            data.push(value);
        }
        $('#combobox_scgd').combobox("loadData",data);
    });
    m_sjcx.query_selectAll_ygh(pc,function (err,result) {
        if(err) throw err;
        var data = [];
        var value = {value: "",text: "全部"};
        data.push(value);
        for( var i = 0; i < result.recordset.length; i++){
            var record = result.recordset[i].workernum;
            value = {value: record ,text: record};
            data.push(value);
        }
        $('#combobox_ygh').combobox("loadData",data);
    });
    var data1 = [
        {value: "", text: "全部",selected: true},
        {value: "NG1", text: "NG1(扫码不良)"},
        {value: "NG2", text: "NG2(电压异常)"},
        {value: "NG3", text: "NG3(内阻异常)"},
        {value: "NG4", text: "NG4(容量信息不匹配)"},
        {value: "NG5", text: "NG5(△V不良)"}
    ];
    $('#combobox_ngyy').combobox("loadData",data1);
    m_sjcx.query_select(ng_reason, pc,scgd,ygh,kssj,jjsj, function (error, result) {
        if (error) {
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
    var scgd = $('#combobox_scgd').combobox('getValue');
    var ygh = $('#combobox_ygh').combobox('getValue');
    var kssj = $('#dd_star').datetimebox('getValue');
    var jjsj = $('#dd_end').datetimebox('getValue');
    m_sjcx.query_select(ng_reason, batch,scgd,ygh,kssj,jjsj, function (error, result) {
        if (error) {
            console.log(error);
            return;
        }
        dataGrid_Init(result.recordset);
    });
}

/* datagrid 初始化  */
function dataGrid_Init(dataArr) {
    $('#ng_table').datagrid({loadFilter:pagerFilter}).datagrid({
        columns: [[
            {field:'batch',title:'批次'},
            {field:'cellnum',title:'电芯条码'},
            {field:'volume',title:'容量'+"("+csszMap.get('rlfw').replace(";","-")+")"},
            {field:'resistance',title:'内阻'+"("+csszMap.get('nzfw').replace(";","-")+")"},
            {field:'voltage',title:'电压'+"("+csszMap.get('dyfw').replace(";","-")+")"},
            {field:'ocv4',title:'ocv4'},
            {field:'voltagedifference',title:'电压差'+"("+csszMap.get('dycfw').replace(";","-")+")"},
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
    var property = JSON.parse(fs.readFileSync('app/config/config_filesave.json', 'utf8'));
    var cxTime = new Date();
    var date=cxTime.getFullYear()+"_"+(cxTime.getMonth()+1)+"_"+cxTime.getDate()+"_"+cxTime.getHours()+"_"+cxTime.getMinutes()+"_"+cxTime.getSeconds();
    var ng_reason = $('#combobox_ngyy').combobox('getValue');
    var batch = $('#combobox_pc').combobox('getValue');
    var scgd = $('#combobox_scgd').combobox('getValue');
    var ygh = $('#combobox_ygh').combobox('getValue');
    var kssj = $('#dd_star').datetimebox('getValue');
    var jjsj = $('#dd_end').datetimebox('getValue');
    m_sjcx.query_select(ng_reason, batch,scgd,ygh,kssj,jjsj, function (error, result) {
        if (error) {
            console.log(error);
            return;
        }
        var str = "电芯条码" + "," + "设备号" + "," + "操作人员工号" + "," + "生产工单" + "," + "批次" + "," + "电压" + "," + "内阻" + ","  + "容量" + "," + "Ocv4" + "," + "电压差" + "," + "等级" +  "," + "创建时间" + "," + "NG原因" + "," + "检测次数" + "\n";
        var dcbatch = result.recordset[0].batch;
        for (var i = 0; i < result.recordset.length; i++) {
            for (var key in result.recordset[i]) {
                str = str + (result.recordset[i][key]) + ",";
            }
            str = str + "\n";
            if(batch == ""){
                dcbatch= "";
            }
        }
        var fileNameArr = [dcbatch,date];
        var filePath = path.join(property.FILESAVE_PATH, (fileNameArr.join("_")+".csv"));
        fs.writeFile(filePath, str, function (err) {
            if (err) throw err;
            alert('数据导出成功');
        });
    });
}
