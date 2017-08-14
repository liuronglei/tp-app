
var m_tsgz = require('../../models/m_tsgz');
var isJjkzCompleted = false;

$(document).ready(function () {
    $('#center_hr').hide();
    $('#div_aqpg_jjkz').hide();
    $('#btn_aqpg_jjkz').hide();
    paramInit();
    showSvg();
    $("#btn_aqpg-zx").bind('click',yxsgAction);
    $('#btn_aqpg_jjkz').bind('click',jjkzAction);
    $('#btn_dycx').bind('click',searchIdDy);
    $('#btn_dlcx').bind('click',searchIdDl);
});

function paramInit() {
    cxsjInit();
    yxsgInit();
}

function cxsjInit() {
    var data = new Array();
    for(var i=0; i<5; i++) {
        data[data.length] = {value:i+1,text:(i+1)+'分钟',selected:i==1};
    }
    $('#combobox_gzsj').combobox("loadData",data);
    $('#combobox_gzsj').combobox('select',data[1].value);
}

function yxsgInit() {
    var data = [{value:1,text:'光伏逆变器故障',selected:true},{value:2,text:'储能故障'},{value:3,text:'线路短路'},{value:4,text:'其他'}];
    $('#combobox_yxsg').combobox("loadData",data);
}

function kzcsInit() {
    var data = [{value:1,text:'双电流闭环控制',selected:true},{value:2,text:'故障限流器控制'},{value:3,text:'逆变器控制'},{value:4,text:'储能控制'},{value:4,text:'电压分层控制'}];
    $('#combobox_kzcs').combobox("loadData",data);
}

function yxsgAction(){
    kzcsInit();
    changeSvgColor();
    $('#center_hr').show();
    $('#div_aqpg_jjkz').show();
    $('#btn_aqpg_jjkz').show();
}

function showSvg() {
    drawSvg("../../../public/svg/zjxt_ww.svg");
}

var viewer = new BeePower.Svg.Viewer();
function drawSvg(path){
    viewer.load({path:path,id:"canvas"});
}
// 点击执行按钮时，SCG图边框变红
function changeSvgColor(){
    rect_id='rect9800-1-9';
    stroke_color=d3.select("#" + rect_id);
    stroke_color.style('stroke','red');
}
// 点击执行按钮时，SCG图边框变回白色
function jjkzAction(){
    isJjkzCompleted = true;
    stroke_color.style('stroke','white');
}

function iduClick() {
    $('#gzcxqx').window({
        title:'故障持续曲线',
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:700,
        height:500,
        modal:false
    });
    $('#gzcxqx').window('refresh', '../../views/tsgz/tsgz_small.html');
}

function searchIdDy(value) {
    searchId('dy', 'pie_gjddyqxt', '电压', UNIT_TITLE.dy);
}

function searchIdDl(value) {
    searchId('dl', 'pie_gjddlqxt', '电流', UNIT_TITLE.dl);
}

function searchId(jdbh, pieId, title, unit){
    m_tsgz.queryJddyt(jdbh, function(error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var jdbhArr = new Array();
        for (var i = 0; i < results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            jdbhArr[jdbhArr.length] = results[i][jdbh];
        }
        buildSimpleChart({
            pieId: pieId,
            title: '',
            xName: '时段',
            yName: title,
            unit: unit,
            lineColor: '#5098e0',
            xData: sjdArr,
            seriesData: jdbhArr,
            needLegend: true,
            lineType: PIE_LINE_TYPE.line
        });
    });
}
