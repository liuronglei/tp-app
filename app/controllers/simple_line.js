/**
 * Created by lenovo on 2017/6/3.
 */
var m_yxjs = require('../../models/m_yxjs');
$(document).ready(function(){
    creatPie();
});

/*
 * 开始创建图形
 */
function creatPie() {
    var currentClfs = window.parent.currentClfs;//getQueryString('clfs');
    var isHistory = window.parent.isHistory;
    var startNum = 1;
    var endNum = 96;
    if(!isHistory) {
        endNum = getCurrentSjd();
    }
    m_yxjs.queryYxjs(startNum, endNum, currentClfs, function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var clfsArr = new Array();
        for(var i=0; i<results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            clfsArr[clfsArr.length] = results[i][currentClfs];
        }
        var clfsTitle = getTitleByClfs(currentClfs);
        var unit = getUnitByClfs(currentClfs);
        buildSimpleChart({
                pieId: 'simple_pieDiv',
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