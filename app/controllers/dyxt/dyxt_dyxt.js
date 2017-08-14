/**
 * Created by lenovo on 2017/6/3.
 */
var m_dyxt = require('../../models/m_dyxt');
var c_page = require('../../controllers/c_page');
var sjcd_long = 96;
var sjcd_short = 16;
var currentSjcd = sjcd_long;
var currentClfs = 'cn_soc';
var isOptimised = false;
$(document).ready(function(){
    fillData();
    creatPie_line();
    creatPie_cover();
    //事件绑定
    $('#btn_sjcd_long').click(function(e){changeSjcd(sjcd_long);});
    $('#btn_sjcd_short').click(function(e){changeSjcd(sjcd_short); });
    $('#btn_zxyh').click(doOptimize);
    $("a[id^='btn_clfs_']").click(function(e){changeClfs(this.id.substr(9));});
});

function creatPie_line() {
    var startNum = 1;
    var endNum = currentSjcd;
    if(currentSjcd != sjcd_long) {
        startNum = getCurrentSjd();
        endNum = startNum + currentSjcd;
    }
    m_dyxt.queryCdyh_line(startNum, endNum, currentClfs, function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var clfs_qArr = new Array();
        var clfs_hArr = new Array();
        for(var i=0; i<results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            clfs_qArr[clfs_qArr.length] = results[i][currentClfs + CLFS_SUFFIX.before];
            clfs_hArr[clfs_hArr.length] = results[i][currentClfs + CLFS_SUFFIX.after];
        }
        var unit = getUnitByClfs(currentClfs);
        var clfsTitle = getTitleByClfs(currentClfs);
        if(isOptimised && currentClfs != 'ljfsfd') {
            buildSimpleChart({
                pieId: 'zhexian1',
                title: '',
                xName: '时段',
                yName: ['优化前','优化后'],
                unit: unit,
                lineColor: ['#ff4c7b','#33c0eb'],
                xData: sjdArr,
                seriesData: [clfs_qArr,clfs_hArr],
                needLegend: true,
                yTitle: clfsTitle
            });
        } else {
            buildSimpleChart({
                pieId: 'zhexian1',
                title: '',
                xName: '时段',
                yName: clfsTitle,
                unit: unit,
                lineColor: '#ff4c7b',
                xData: sjdArr,
                seriesData: clfs_qArr,
                needLegend: true
            });
        }
    });
}

function creatPie_cover() {
    var startNum = 1;
    var endNum = currentSjcd;
    if(currentSjcd != sjcd_long) {
        startNum = getCurrentSjd();
        endNum = startNum + sjcd_short - 1;
    }
    m_dyxt.queryCdyh_cover(startNum, endNum, function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var xtfhbh_qArr = new Array();
        var xtfhbh_hArr = new Array();
        var xtfhbh_cArr = new Array();
        for(var i=0; i<results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            xtfhbh_qArr[xtfhbh_qArr.length] = results[i].xtfhbh_q;
            xtfhbh_hArr[xtfhbh_hArr.length] = results[i].xtfhbh_h;
            xtfhbh_cArr[xtfhbh_cArr.length] = results[i].xtfhbh_c;
        }
        if(isOptimised) {
            buildSimpleChart({
                pieId: 'zhexian2',
                title: '',
                xName: '时段',
                yName: ['优化前', '优化后', '负荷变化量'],
                unit: UNIT_TITLE.gl,
                lineColor: ['#d46b79','#56cded','#d5d5d5'],
                xData: sjdArr,
                seriesData: [xtfhbh_qArr,xtfhbh_hArr,xtfhbh_cArr],
                needLegend: true,
                yTitle: '系统负荷',
                lineType: PIE_LINE_TYPE.area
            });
        } else {
            buildSimpleChart({
                pieId: 'zhexian2',
                title: '',
                xName: '时段',
                yName: '系统负荷',
                unit: UNIT_TITLE.gl,
                lineColor: '#d46b79',
                xData: sjdArr,
                seriesData: xtfhbh_qArr,
                needLegend: true,
                yTitle: '系统负荷',
                lineType: PIE_LINE_TYPE.area
            });
        }
    });
}

function fillData() {
    m_dyxt.queryDataBySjd(getCurrentSjd(), function (error, results, fields) {
	  if (error) throw error;
	  for(var key in results[0]) {
	  	var itemSpan = $('#span_' + key);
	  	if(itemSpan) {
            itemSpan.text(results[0][key] + getUnitByClfs(key));
	  	}
	  }
	});
}

function changeSjcd(num) {
    isOptimised = false;
    currentSjcd = num;
    fillData();
    creatPie_line();
    creatPie_cover();
}

function changeClfs(field) {
    currentClfs = field;
    creatPie_line();
}

function doOptimize() {
    isOptimised = true;
    creatPie_line();
    creatPie_cover();
}