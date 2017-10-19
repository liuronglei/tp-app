/**
 * Created by Administrator on 2017/10/9 0009.
 */
//dxth => 电芯替换
var c_page = require('../../controllers/c_page');
var m_sjcx = require('../../models/m_sjcx');

$(document).ready(function () {
  dataGrid_Init();
  fillTextbox();
  $('#dxth_query_old').click(selectAll);
  $('#dxth_query_new').click(selectAll);
  $('#dxth_change').click(changeBarcode);
  $('#dxth_reset').click(resetTextbox);
});

//datagrid初始化表头
function dataGrid_Init() {
  $('#dxth_oldBarcode').datagrid({
    columns: [[
      {field:'cellnum',title:'电芯条码',width:180},
      {field:'productionorder',title:'生产工单',width:150},
      {field:'batch',title:'批次',width:150},
      {field:'casenum',title:'箱号',width:90},
      {field:'volume',title:'容量',width:90},
      {field:'resistance',title:'内阻',width:90},
      {field:'voltage',title:'电压',width:90},
      {field:'ocv4',title:'ocv4',width:90},
      {field:'voltagedifference',title:'电压差',width:90},
      {field:'binningnum',title:'装箱数',width:90},
      {field:'equiptmentnum',title:'设备号',width:90},
      {field:'workernum',title:'操作人员工号',width:90},
      {field:'checknum',title:'检测次数',width:90},
      {field:'checkindex',title:'探针序号',width:90},
      {field:'creattime',title:'创建时间',width:150}
    ]]
  });
  $('#dxth_newBarcode').datagrid({
    columns: [[
      {field:'cellnum',title:'电芯条码',width:180},
      {field:'productionorder',title:'生产工单',width:150},
      {field:'batch',title:'批次',width:150},
      {field:'casenum',title:'箱号',width:90},
      {field:'volume',title:'容量',width:90},
      {field:'resistance',title:'内阻',width:90},
      {field:'voltage',title:'电压',width:90},
      {field:'ocv4',title:'ocv4',width:90},
      {field:'voltagedifference',title:'电压差',width:90},
      {field:'binningnum',title:'装箱数',width:90},
      {field:'equiptmentnum',title:'设备号',width:90},
      {field:'workernum',title:'操作人员工号',width:90},
      {field:'checknum',title:'检测次数',width:90},
      {field:'checkindex',title:'探针序号',width:90},
      {field:'creattime',title:'创建时间',width:150}
    ]]
  });
}

//填充textbox内容
function fillTextbox() {
  c_page.regScanBarCode(function (arg) {
    var Barcode = arg;
    var oldBarcode = $('#dxth_textbox_oldBarcode').textbox('getValue');
    if(oldBarcode != '' && oldBarcode != 'undefined' && oldBarcode != null){
      $('#dxth_textbox_newBarcode').textbox('setValue',Barcode);
      selectAll();
    }
    else{
      $('#dxth_textbox_oldBarcode').textbox('setValue',Barcode);
      selectAll();
    }
  })
}

//查询并导入界面
function selectAll() {
  var oldBarcode = $('#dxth_textbox_oldBarcode').textbox('getValue');
  var newBarcode = $('#dxth_textbox_newBarcode').textbox('getValue');
  var barcode = oldBarcode;
  var isNew = false;
  if(newBarcode != '' && newBarcode != 'undefined'){
    barcode = newBarcode;
    isNew = true;
  }
  m_sjcx.select_all(barcode,function (error,result) {
    if(error) throw error;
    if(isNew){
      $('#dxth_newBarcode').datagrid('loadData',result.recordset);
    }
    else{
      $('#dxth_oldBarcode').datagrid('loadData',result.recordset);
    }
  })
}

//进行电芯替换
function changeBarcode(){
  if(window.confirm('确定要进行电芯替换吗？')) {
    var oldBarcode = $('#dxth_textbox_oldBarcode').textbox('getValue');
    var newBarcode = $('#dxth_textbox_newBarcode').textbox('getValue');
    var json_oldBarcodeReplace = {
      cellnum : oldBarcode,
      casenum : '00000000X',
      productionorder : '00000000X',
      batch : '00000000X'
    };
    m_sjcx.select_all(oldBarcode,function (error,result) {
      if(error) throw error;
      var json_newBarcodeReplace = {
        cellnum : newBarcode,
        casenum : result.recordset[0].casenum,
        productionorder : result.recordset[0].productionorder,
        batch :  result.recordset[0].batch,
        binningnum: result.recordset[0].binningnum,
        checknum: result.recordset[0].checknum,
        checkindex: result.recordset[0].checkindex,
        creattime: result.recordset[0].creattime
      };
      m_sjcx.updateBarcode(json_newBarcodeReplace,function (error) {
        if(error) throw error;
        m_sjcx.updateBarcode(json_oldBarcodeReplace,function (error) {
          if(error) throw error;
          alert('电芯替换成功');
        });
      })
    });
  }
}

//重置textbox内容
function resetTextbox() {
  $('#dxth_textbox_oldBarcode').textbox('setValue','');
  $('#dxth_textbox_newBarcode').textbox('setValue','');
  $('#dxth_oldBarcode').datagrid('loadData',{ rows: [] });
  $('#dxth_newBarcode').datagrid('loadData',{ rows: [] });
}
