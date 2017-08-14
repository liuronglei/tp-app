/**
 * Created by lenovo on 2017/6/3.
 */
var m_yhdd = require('../../models/m_yhdd');
var c_page = require('../../controllers/c_page');
var firstClickFhycDiv = true;
$(document).ready(function(){
    changeTime(-1);
    drawSvg("../../../public/svg/dsxn_ww.svg");
    //事件绑定
    //$("a[id^='btn_tab_']").click(function(e){changeTab(this.id.substr(8));});
    $('#fhycDiv').click(fhycInit);
    $('#btn_zxdsxn').click(startDsxn);
    $("a[id^='btn_dsxn_']").click(function(e){changeTime(parseInt(this.id.substr(9).replace('q','-').replace('h','')));});

    $('#topTabs').tabs({
        onSelect:function(title,index){
            if(index == 1 && firstClickFhycDiv) {
                firstClickFhycDiv = false;
                changeTime(1);
            }
        }
    });
});

var viewer = new BeePower.Svg.Viewer();
function drawSvg(path){
    viewer.load({path:path,id:"canvas"});
}

function creatPie(pieId, clfs, startNum, endNum) {
    m_yhdd.queryDsxn(startNum, endNum, clfs, function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var clfsArr = new Array();
        for(var i=0; i<results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            clfsArr[clfsArr.length] = getFluctuatedValue(results[i][clfs]);
        }
        var clfsTitle = getTitleByClfs(clfs);
        var unit = getUnitByClfs(clfs);
        buildSimpleChart({
            pieId: pieId,
            title: '',
            xName: '时段',
            yName: clfsTitle,
            unit: unit,
            lineColor: '',
            xData: sjdArr,
            seriesData: clfsArr,
            needLegend: true,
            yTitle: clfsTitle
        });
    });
}
function changeTab(type) {
}

var firstClickFhycDiv = true;
function fhycInit() {
    if(firstClickFhycDiv) {
        firstClickFhycDiv = false;
        changeTime(1);
    }
}
function changeTime(time) {
    var startNum = 1;
    var endNum = 96;
    var clfs = '';
    var pieId = '';
    if(time < 0) {
        pieId = 'pie_lsfh';
        if(isWeekend(time)) {
            clfs = 'lsfh_zm';
        } else{
            clfs = 'lsfh_gzr';
        }
    } else {
        pieId = 'pie_fhyc';
        if(time == 2) {
            clfs = 'fhyc_zm';
            startNum = getCurrentSjd();
            endNum = startNum + 16;
        } else{
            clfs = 'fhyc_gzr';
        }
    }
    creatPie(pieId, clfs, startNum, endNum);
}

function startDsxn() {
    c_page.doPageToEvent({title:'执行倒送消纳', url:'views/yhdd/yhdd_dsxn_jg.html'});
}