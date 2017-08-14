/**
 * Created by lenovo on 2017/6/3.
 */
var c_page = require('../../controllers/c_page');
var m_tsld = require('../../models/m_yxkz');

$(document).ready(function(){
     btInit();
     paramInit();
     showSvg();
     tableInit();
    $("#dy_tbody").FixedHead({ tableLayout: "fixed" });

});
//
function btInit(){
    $('#btn_clfs_cn_soc').click(okPl);
    $('#btn_clfs_ljfsfd').click(okPl);
    $('#btn_clfs_cdzcfdgl').click(okPl);
    $('#btn_clfs_cn_soc3').click(okDy);
    $('#btn_clfs_ljfsfd3').click(okDy);
}
var isPlOk = false;
function okPl(){
    isPlOk = true;
    pldata();
}
var isDyOk = false;
function okDy(){
    isDyOk = true;
    dydata();
}

var currentKz="01";
var currentTimer;
function paramInit() {
    var data = [{value:1,text:'并网模式', selected:true},{value:2,text:'孤网模式'}];
    $('#msSelect').combobox("loadData",data);
    var data1 = [{value:1,text:'频率稳定',selected:true},{value:2,text:'电压稳定'}];
    $('#kzSelect').combobox("loadData",data1);
    $("#kzSelect").combobox({
            onSelect: function (record) {
                if(record.value == 2){
                    $('#plwddiv').hide();
                    $('#dywddiv').show();
                   $('#table1div').hide();
                    $('#table2div').show();
                    currentKz = "02";
                      if(currentTimer){
                         window.clearInterval(currentTimer);
                      }
                     currentTimer = window.setInterval(dydata, 15*1000);
                }else if(record.value == 1){
                     $('#plwddiv').show();
                      $('#dywddiv').hide();
                       $('#table1div').show();
                        $('#table2div').hide();
                         currentKz = "01";
                           if(currentTimer){
                                  window.clearInterval(currentTimer);
                               }
                              currentTimer = window.setInterval(pldata,5*1000);
                }
            }
        })
        $('#msSelect').combobox('select',data[0].value);
        $('#kzSelect').combobox('select',data[0].value);
}


function showSvg() {
    drawSvg("../../../public/svg/zjxt_ww.svg");
}

var viewer = new BeePower.Svg.Viewer();
function drawSvg(path){
    viewer.load({path:path,id:"zhexian2"});
}
var plresult;
var dyresult;
function tableInit() {
    m_tsld.querySbList("01","",function (error, results, fields) {
        if (error) throw error;
        plresult = results;
        for(var i=0; i<results.length; i++) {
            var re = getPlState(results[i].value);
            var cStyle=""
            if(re !== "正常"){
                 cStyle="\"color:red\"";
            }
            jQuery("<tr style="+ cStyle+"><td>" + results[i].sbid
                + "</td><td nowrap>" + results[i].value.toFixed(2)
                + "</td><td>" + re
                + "</td></tr>").appendTo("#dy_tbody");

        }
        if(currentTimer){
             window.clearInterval(currentTimer);
          }
         currentTimer = window.setInterval(pldata, 5*1000);
    });
     m_tsld.querySbList("02","",function (error, results, fields) {
            if (error) throw error;
            dyresult = results;
            for(var i=0; i<results.length; i++) {
             var re = getDyState(results[i].value);
            var cStyle=""
            if(re !== "正常"){
                cStyle="\"color:red\"";
            }
            jQuery("<tr style="+ cStyle+"><td>" + results[i].sbid
                + "</td><td nowrap>" + results[i].value.toFixed(1) + "%"
                + "</td><td>" + re
                + "</td></tr>").appendTo("#dl_tbody");

            }

        });
}



//频率为49.80-50.20Hz时，状态为“正常”；
//频率低于49.80Hz时，状态为“偏低”；
//频率高于50.20Hz时，状态为“偏高”。

function getPlState(value) {
   if(value >= 49.80 && value<=50.20){
    return "正常";
   }else if(value < 49.80){
    return "偏低";
   }else if(value > 50.20){
    return "偏高";
   }
}
//电压偏移为-7.0%-+7.0%时，状态为“正常”；
//电压偏移低于-7.0%时，状态为“偏低”；
//电压偏移高于+7.0%时，状态为“偏高”。

function getDyState(value) {
   if(value >= -7 && value<= 7){
    return "正常";
   }else if(value < -7){
    return "偏低";
   }else if(value > 7){
    return "偏高";
   }
}

function searchId(value) {
   m_tsld.querySbList(currentKz,value,function (error, results, fields) {
           if (error) throw error;
           var currentTable;
           var addStr='';
           var c=1;
           if(currentKz =="01"){
                 currentTable = "#dy_tbody";
                 c = 2;
           }else if(currentKz == "02"){
                 currentTable = "#dl_tbody";
                 addStr = "%";
           }
           $(currentTable).html("");
           for(var i=0; i<results.length; i++) {
               var re = getState(results[i].value);
              var cStyle=""
              if(re !== "正常"){
                   cStyle="\"color:red\"";
              }
                    jQuery("<tr style="+ cStyle+"><td>" + results[i].sbid
                   + "</td><td nowrap>" + results[i].value.toFixed(c)+addStr
                   + "</td><td>" + re
                   + "</td></tr>").appendTo(currentTable);

           }
           if(currentTimer){
                window.clearInterval(currentTimer);
             }
             if(currentKz =="01"){
                    plresult = results;
                  currentTimer = window.setInterval(pldata, 5*1000);
            }else if(currentKz == "02"){
                dyresult = results;
                  currentTimer = window.setInterval(dydata, 15*1000);
            }

       });
}
//
function getState(value) {
   if(currentKz=="01"){
        return getPlState(value);
   }else{
        return getDyState(value);
   }
}
//49.75Hz-50.25Hz
function pldata() {
$("#dy_tbody").html("");
  for(var i=0; i<plresult.length; i++) {
      var pl = (Math.random()*0.5 + 49.75).toFixed(2);
      if(isPlOk){
        pl = (Math.random()*0.4 + 49.8).toFixed(2);
      }

      var re = getPlState(pl);
      var cStyle=""
      if(re !== "正常"){
           cStyle="\"color:red\"";
      }
      jQuery("<tr style="+ cStyle+"><td>" + plresult[i].sbid
          + "</td><td nowrap>" + pl
          + "</td><td>" + re
          + "</td></tr>").appendTo("#dy_tbody");

  }
}


function dydata() {
  $("#dl_tbody").html("");
    for(var i=0; i<dyresult.length; i++) {
        var dy = (Math.random()*15 + (-7.5)).toFixed(1);
         if(isDyOk){
                dy = (Math.random()*14 + (-7.0)).toFixed(1);
          }
        var re = getDyState(dy);
        var cStyle=""
        if(re !== "正常"){
             cStyle="\"color:red\"";
        }
        jQuery("<tr style="+ cStyle+"><td>" + dyresult[i].sbid
            + "</td><td nowrap>" + dy+"%"
            + "</td><td>" + re
            + "</td></tr>").appendTo("#dl_tbody");

    }
}