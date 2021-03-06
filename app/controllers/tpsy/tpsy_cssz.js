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
                   value = "";
               }
               $('#cssz_div').prepend('<div class="line-div">\n' +
                   '<span class="cssz-text" id="'+record.name+'_">'+record.title+'：</span>\n' +
                   '<div class="text-div">\n' +
                   '<input name="'+record.name+'" id="'+record.name+'" value="' + value + '" class="easyui-textbox" style="width:150px;height:25px;" />\n' +
                   '</div>\n' +
                   '</div>');
           }
           else if(record.type == 3){
               if(value == null){
                   value = "";
               }
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
           else if(record.type == 4){
               $('#cssz_div').prepend('<div class="checkbox">\n' +
                   '<label for="'+record.name+'">'+record.title+'</label> \n' +
                   '<input name="'+record.name+'" id="'+record.name+'" type="checkbox" onclick=isChecked() name="checkbox" ' + (value == 1 ? 'checked' : '') + '/>'+
                   '</div>');
           }
       }
        var check_ocv = $('#sjsx').attr("checked") ? 1 : 0;
        if(check_ocv == 0){
            $('#dycfw').css({color:"#ddd"});
            $('#dycfw_min').attr('readonly',true);
            $('#dycfw_max').attr('readonly',true);
            $('#rlfw').css({color:"#ddd"});
            $('#rlfw_min').attr('readonly',true);
            $('#rlfw_max').attr('readonly',true);
            $('#djfw').css({color:"#ddd"});
            $('#djfw_min').attr('readonly',true);
            $('#djfw_max').attr('readonly',true);
            $('#rld_').css({color:"#ddd"});
            $('#rld').attr('readonly',true);
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
        $('#dycfw_min').attr('readonly',false);
        $('#dycfw_max').attr('readonly',false);
        $('#rlfw').css({color:"black"});
        $('#rlfw_min').attr('readonly',false);
        $('#rlfw_max').attr('readonly',false);
        $('#djfw').css({color:"black"});
        $('#djfw_min').attr('readonly',false);
        $('#djfw_max').attr('readonly',false);
        $('#rld_').css({color:"black"});
        $('#rld').attr('readonly',false);
    }
    else{
        $('#dycfw').css({color:"#ddd"});
        $('#dycfw_min').attr('readonly',true);
        $('#dycfw_max').attr('readonly',true);
        $('#rlfw').css({color:"#ddd"});
        $('#rlfw_min').attr('readonly',true);
        $('#rlfw_max').attr('readonly',true);
        $('#djfw').css({color:"#ddd"});
        $('#djfw_min').attr('readonly',true);
        $('#djfw_max').attr('readonly',true);
        $('#rld_').css({color:"#ddd"});
        $('#rld').attr('readonly',true);
    }
}
