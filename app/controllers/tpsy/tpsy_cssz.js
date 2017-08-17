var m_cssz = require('../../controllers/tpsy/m_cssz');
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
    var dataObj_toPlc = {
        sjsx : hashMap.get("'sjsx'").replace('\'', '').replace('\'', ''),
        rlfw : hashMap.get("'rlfw'").replace('\'', '').replace('\'', ''),
        dyfw : hashMap.get("'dyfw'").replace('\'', '').replace('\'', ''),
        dycfw : hashMap.get("'dycfw'").replace('\'', '').replace('\'', ''),
        nzfw : hashMap.get("'nzfw'").replace('\'', '').replace('\'', ''),
        djfw : hashMap.get("'djfw'").replace('\'', '').replace('\'', '')
    };
    c_page.doValue_fw(dataObj_toPlc);
    m_cssz.csszSave(hashMap.keySet(),hashMap.values(),function (error) {
        if (error){
            alert(error);
            return;
        }
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
                   $('#cssz_div').prepend('<div class="line-div">\n' +
                       '<span class="cssz-text">'+record.title+'：</span>\n' +
                       '<div class="text-div">\n' +
                       '<input name="'+record.name+'" id="'+record.name+'" value=" " class="easyui-textbox" style="width:150px;height:25px;" />\n' +
                       '</div>\n' +
                       '</div>');
               }
               else{
                   $('#cssz_div').prepend('<div class="line-div">\n' +
                       '<span class="cssz-text">'+record.title+'：</span>\n' +
                       '<div class="text-div">\n' +
                       '<input name="'+record.name+'" id="'+record.name+'" value="' + value + '" class="easyui-textbox" style="width:150px;height:25px;" />\n' +
                       '</div>\n' +
                       '</div>');
               }
           }
           else if(record.type == 3){
               if(value == null){
                   $('#cssz_div').prepend('<div class="line-div">\n' +
                       '<span class="cssz-text">'+record.title+'：</span>\n' +
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
                       '<span class="cssz-text">' + record.title + '：</span>\n' +
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
                   '<input name="'+record.name+'" id="'+record.name+'" type="checkbox" name="checkbox" ' + (value == 1 ? 'checked' : '') + '/>'+record.title+'\n' +
                   '</div>');
           }
           var check_ocv = $('#sjsx').attr("checked") ? 1 : 0;
           if(check_ocv == 0){
               $('#电压差范围').css({color:"#ddd"});
               $('#容量范围').css({color:"#ddd"});
               $('#等级范围').css({color:"#ddd"});
           }
       }
    });
}





function CloseWin(){
    window.parent.closeCsszWin();
}