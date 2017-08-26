var fs = require("fs");
var m_sjcx_normal = require('../../models/m_sjcx_normal');
var csszMap = require('electron').remote.getGlobal('sharedObject').csszMap;

$(document).ready(function () {
    window.setTimeout('comboboxInit();',500);
    $('#btn_qd_normal').click(select_All);
    $('#btn_dc_normal').click(dcCsv);
});

/* 下拉框初始化 */
function comboboxInit() {
    // 批次中含有多个箱号
    m_sjcx_normal.query_selectAll_batch(function (err,result) {
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
        $('#combobox_pc_normal').combobox("loadData",data);
    });
    var pc = csszMap.get("pc");
    m_sjcx_normal.query_selectAll_casenum(pc,function (err,result) {
        if(err) throw err;
        var data = [];
        var value = {value: "",text: "全部"};
        data.push(value);
        for( var i = 0; i < result.recordset.length; i++){
            var record = result.recordset[i].casenum;
            var value = {value: record ,text: record};
            data.push(value);
        }
        $('#combobox_xh_normal').combobox("loadData",data);
    });
    var xh = $('#combobox_xh_normal').combobox("getValue");
    m_sjcx_normal.query_select( pc,xh, function (error, result) {
        if (error) {
            console.log(error);
            return;
        }
        dataGrid_Init(result.recordset);
    });
}

/* 查询数据 */
function select_All(){
    var batch =$('#combobox_pc_normal').combobox('getValue');
    var casenum = $('#combobox_xh_normal').combobox('getValue');
    m_sjcx_normal.query_selectAll_casenum(batch,function (err,result) {
        if(err) throw err;
        var data = [];
        var value = {value: "",text: "全部"};
        data.push(value);
        for( var i = 0; i < result.recordset.length; i++){
            var record = result.recordset[i].casenum;
            var value = {value: record ,text: record};
            data.push(value);
        }
        $('#combobox_xh_normal').combobox("loadData",data);
    });
    m_sjcx_normal.query_select(batch,casenum, function (error, result) {
        if (error) {
            console.log(error);
            return;
        }
        dataGrid_Init(result.recordset);
    });
}

/* datagrid 初始化  */
function dataGrid_Init(dataArr) {
    $('#normal_table').datagrid({loadFilter:pagerFilter}).datagrid({
        columns: [[
            {field:'batch',title:'批次'},
            {field:'casenum',title:'箱号'},
            {field:'cellnum',title:'电芯条码'},
            {field:'volume',title:'容量'+"("+csszMap.get('rlfw').replace(";","-")+")"},
            {field:'resistance',title:'内阻'+"("+csszMap.get('nzfw').replace(";","-")+")"},
            {field:'voltage',title:'电压'+"("+csszMap.get('dyfw').replace(";","-")+")"},
            {field:'ocv4',title:'ocv4'},
            {field:'volumedifference',title:'电压差'+"("+csszMap.get('dycfw').replace(";","-")+")"},
            {field:'checknum',title:'检测次数'},
            {field:'binningnum',title:'装箱数'},
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
    var casenum = $('#combobox_xh_normal').combobox('getValue');
    var batch = $('#combobox_pc_normal').combobox('getValue');
    m_sjcx_normal.query_select(casenum, batch, function (error, result) {
        if (error) {
            console.log(error);
            return;
        }
        var str = "箱号"+","+"电芯条码" + "," + "设备号" + "," + "操作人员工号" + "," + "生产工单" + "," + "批次" + "," + "电压" + "," + "内阻" + ","  + "容量" + "," + "Ocv4" + "," + "电压差" + "," + "等级" + "," +"装箱数"+  "," + "创建时间"   + "," + "检测次数" + "\n";
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
