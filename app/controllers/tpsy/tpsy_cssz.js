var m_cssz = require('../../models/m_cssz');
var HashMap = require('../../utils/hashmap');
var c_page =require("../../controllers/c_page");
$(document).ready(function () {
    csszInit();
    $('#btn_qd').click(csszSave);
    $('#btn_qx').click(CloseWin);
});

function csszSave() {
    var hashMap = new HashMap.Map();
    $('input').each(function() {
        var type = $(this).attr('type');
        var name = '\'' + $(this).attr('name') + '\'';
        var value = $(this).val();
        if(hashMap.containsKey(name)) {
            var oldValue = hashMap.get(name).replace('\'', '').replace('\'', '');
            value = oldValue + ";" + value;
        }
        if(type == 'checkbox') {
            value = $(this).attr("checked") ? 1 : 0;
        }
        hashMap.put(name, '\'' + value + '\'');
    });
    m_cssz.csszSave(hashMap.keySet(),hashMap.values(),function (error) {
        if (error){
            alert(error);
            return;
        }
        c_page.updateCssz();
        alert("参数设置成功！");
        window.parent.sycsInit();
        window.parent.closeCsszWin();
    });
    var csszMap = require('electron').remote.getGlobal('sharedObject').csszMap;
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

function csszInit(){
    m_cssz.query_csszInit(function (err,result) {
       if(err){
           console.log(err);
           return;
       }
       for(var i = result.recordset.length-1; i >= 0; i--){
           var record = result.recordset[i];
           var value = record.value;
           if(record.type == 1 || record.type == 2){
               if(value == null){
                   $('#cssz_div').prepend('<div class="line-div">\n' +
                       '<span class="cssz-text" id="'+record.name+'">'+record.title+'：</span>\n' +
                       '<div class="text-div">\n' +
                       '<input name="'+record.name+'" id="'+record.name+'" value=" " class="easyui-textbox" style="width:150px;height:25px;" />\n' +
                       '</div>\n' +
                       '</div>');
               }
               else{
                   $('#cssz_div').prepend('<div class="line-div">\n' +
                       '<span class="cssz-text" id="'+record.name+'">'+record.title+'：</span>\n' +
                       '<div class="text-div">\n' +
                       '<input name="'+record.name+'" id="'+record.name+'" value="' + value + '" class="easyui-textbox" style="width:150px;height:25px;" />\n' +
                       '</div>\n' +
                       '</div>');
               }
           }
           else if(record.type == 3){
               if(value == null){
                   $('#cssz_div').prepend('<div class="line-div">\n' +
                       '<span class="cssz-text" id="'+record.name+'">'+record.title+'：</span>\n' +
                       '<div class="textbox-div">\n' +
                       '<input name="'+record.name+'" id="'+record.name+'_min" value=" " class="easyui-textbox" style="width:60px;height:25px;" />\n' +
                       '</div>\n' +
                       '<hr class="level-hr"/>\n' +
                       '<div class="textbox-div" style="float:none">\n' +
                       '<input name="'+record.name+'" id="'+record.name+'_max" value=" " class="easyui-textbox" style="width:60px;height:25px;" />\n' +
                       '</div>\n' +
                       '</div>');
               }
               else{
                   var valueArr =  value.split(";");
                   $('#cssz_div').prepend('<div class="line-div" id="' + record.title + '">\n' +
                       '<span class="cssz-text" id="'+record.name+'">' + record.title + '：</span>\n' +
                       '<div class="textbox-div">\n' +
                       '<input name="' + record.name + '" id="' + record.name + '_min" value="' + valueArr[0] + '" class="easyui-textbox" style="width:60px;height:25px;" />\n' +
                       '</div>\n' +
                       '<hr class="level-hr"/>\n' +
                       '<div class="textbox-div" style="float:none">\n' +
                       '<input name="' + record.name + '" id="' + record.name + '_max" value="' + valueArr[1] + '" class="easyui-textbox" style="width:60px;height:25px;" />\n' +
                       '</div>\n' +
                       '</div>');
               }
           }
           else if(record.type == 4){
               $('#cssz_div').prepend('<div class="checkbox">\n' +
                   '<input name="'+record.name+'" id="'+record.name+'" type="checkbox" onclick=isChecked() name="checkbox" ' + (value == 1 ? 'checked' : '') + '/>'+record.title+' \n' +
                   '</div>');
           }
       }
        var check_ocv = $('#sjsx').attr("checked") ? 1 : 0;
        if(check_ocv == 0){
            $('#dycfw').css({color:"#ddd"});
            $('#rlfw').css({color:"#ddd"});
            $('#djfw').css({color:"#ddd"});
        }
    });
}

function CloseWin(){
    window.parent.closeCsszWin();
}


function isChecked(){
    var isChecked = $('#sjsx').attr('checked') ? 1 : 0;
    if(isChecked){
        $('#dycfw').css({color:"black"});
        $('#rlfw').css({color:"black"});
        $('#djfw').css({color:"black"});
        $('#rld').css({color:"black"});
    }
    else{
        $('#dycfw').css({color:"#ddd"});
        $('#rlfw').css({color:"#ddd"});
        $('#djfw').css({color:"#ddd"});
        $('#rld').css({color:"black"});
    }
}
