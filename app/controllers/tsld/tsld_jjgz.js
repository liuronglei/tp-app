/**
 * Created by lenovo on 2017/6/3.
*/
var m_tsld = require('../../models/m_tsld');
var _aqyd = 100;
var _aqyd_q;
$(document).ready(function(){
    gzlxOptionInit();
    gzsbOptionInit();
    $('#btn_aqyd').click(aqydClick);
    $('#btn_ksmngz').click(startSbgz);
    $('#btn_zbktrxkz').click(softControl);
});

function aqydClick() {
    //doNewWinEvent('html/tsld/tsld_aqyd.html', 1000, 700);
    $('#win').window({
        title:'安全裕度',
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:1000,
        height:700,
        modal:false
    });;
    $('#win').window('refresh', '../../views/tsld/tsld_aqyd.html');
}

function gzsbOptionInit() {
    m_tsld.querySbList(function (error, results, fields) {
        if (error) throw error;
        var data = new Array();
        for(var i=0; i<results.length; i++) {
            data[data.length] = {value:results[i].sbid,text:results[i].bdzmc + results[i].sbmc,selected:i==0};
            if(results[i].aqyd < _aqyd) {
                _aqyd = results[i].aqyd;
            }
        }
        $('#gzsbSelect').combobox("loadData",data);
        setAqyd(_aqyd);
    });
}

function gzlxOptionInit() {
    var data = [{value:1,text:'供电能力下降20%'},{value:2,text:'供电能力下降40%'},{value:3,text:'供电能力下降50%',selected:true},
        {value:4,text:'供电能力下降60%'},{value:5,text:'供电能力下降80%'},{value:6,text:'停止供电'}];
    $('#gzlxSelect').combobox("loadData",data);
}

function inputBlur() {
    $('#radio_0').attr("checked",true);
}

function startSbgz() {
    $('#descDiv').css('visibility','hidden');
    $('#resultDiv').css('visibility','hidden');
    $('#pieDiv').css('visibility','hidden');
    var radioValue = $('input:radio:checked').val();
    if(radioValue == 0) {
        radioValue = $('#timeInput').combobox('getText');
    }
    $('#span_sbmc').text($('#gzsbSelect').combobox('getText'));
    $('#span_gzlx').text($('#gzlxSelect').combobox('getText'));
    $('#span_gzcxsj').text(radioValue + '分钟');
    $('#span_aqyd').text();
    _aqyd_q = getRandomAqyd(40,50);
    setTimeout("$('#descDiv').css('visibility','visible');setAqyd(" + _aqyd_q + ")",700);
}

function getRandomAqyd(m, n) {
    return randomInt(m, n) + '.' + randomInt(10,99);
}

function setAqyd(aqyd) {
    $('#span_aqyd').text(aqyd + '%');
}

function softControl() {
    creatPie();
    var _aqyd_h = getRandomAqyd(80,85);
    $('#resultDiv').css('visibility','visible');
    $('#pieDiv').css('visibility','visible');
    $('#span_aqyd_q').text(_aqyd_q + '%');
    $('#span_aqyd_h').text(_aqyd_h + '%');
    setAqyd(_aqyd_h);
}

function creatPie() {
    m_tsld.queryJjgz(function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var rbhdglbh_qArr = new Array();
        var rbhdglbh_hArr = new Array();
        var xtglbh_qArr = new Array();
        var xtglbh_hArr = new Array();
        for(var i=0; i<results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            rbhdglbh_qArr[rbhdglbh_qArr.length] = results[i].rbhdglbh_q;
            rbhdglbh_hArr[rbhdglbh_hArr.length] = results[i].rbhdglbh_h;
            xtglbh_qArr[xtglbh_qArr.length] = results[i].xtglbh_q;
            xtglbh_hArr[xtglbh_hArr.length] = results[i].xtglbh_h;
        }
        buildSimpleChart({
            pieId: 'pie_rbkt',
            title: '',
            xName: '时段',
            yName: ['调节前','调节后'],
            unit: UNIT_TITLE.gl,
            lineColor: ['#ff4c7b','#33c0eb'],
            xData: sjdArr,
            seriesData: [rbhdglbh_qArr,rbhdglbh_hArr],
            needLegend: true,
            yTitle: '热泵空调耗电功率'
        });
        buildSimpleChart({
            pieId: 'pie_xtgl',
            title: '',
            xName: '时段',
            yName: ['调节前','调节后'],
            unit: UNIT_TITLE.gl,
            lineColor: ['#ff4c7b','#33c0eb'],
            xData: sjdArr,
            seriesData: [xtglbh_qArr,xtglbh_hArr],
            needLegend: true,
            yTitle: '系统功率变化'
        });
    });
}