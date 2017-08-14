var m_tsgz = require('../../models/m_tsgz');
var sjdArr = new Array();
var fdglArr = new Array();

$(document).ready(function () {
    creatPie();
});

function creatPie() {
    var isJjkzCompleted = window.parent.isJjkzCompleted;
    m_tsgz.queryGzqx(function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var dyArr = new Array();
        for (var j = 0; j < results.length; j++) {
            sjdArr[sjdArr.length] = results[j].sjd;
            dyArr[dyArr.length] = results[j].dy;
        }
        var gzqArr = new Array();
        var gzzArr = new Array();
        var kzhArr = new Array();
        if(isJjkzCompleted) {
            for(var i=0; i<sjdArr.length; i++) {
                gzqArr[gzqArr.length] = sjdArr[i]<=80 ? dyArr[i] : '-';
                gzzArr[gzzArr.length] = sjdArr[i]>=80 && sjdArr[i]<=200 ? dyArr[i] : '-';
                kzhArr[kzhArr.length] = sjdArr[i]>=200 ? dyArr[i] : '-';
            }
            buildSimpleChart({
                pieId: 'pie_gzcxqx',
                title: '',
                xName: '时段',
                yName: ['故障前','故障中','控制后'],
                unit: UNIT_TITLE.dy,
                lineColor: ['#ff4c7b','#33c0eb','#3ed2b0'],
                xData: sjdArr,
                seriesData: [gzqArr, gzzArr, kzhArr],
                needLegend: true,
                yTitle: '电压',
                lineType: PIE_LINE_TYPE.line
            });
        } else {
            var _sjdArr = new Array();
            for(var i=0; i<sjdArr.length; i++) {
                if(sjdArr[i]>200) break;
                _sjdArr[_sjdArr.length] = sjdArr[i];
                gzqArr[gzqArr.length] = sjdArr[i]<=80 ? dyArr[i] : '-';
                gzzArr[gzzArr.length] = sjdArr[i]>=80 && sjdArr[i]<=200 ? dyArr[i] : '-';
            }
            buildSimpleChart({
                pieId: 'pie_gzcxqx',
                title: '',
                xName: '时段',
                yName: ['故障前','故障中'],
                unit: UNIT_TITLE.dy,
                lineColor: ['#ff4c7b','#33c0eb'],
                xData: _sjdArr,
                seriesData: [gzqArr, gzzArr],
                needLegend: true,
                yTitle: '电压',
                lineType: PIE_LINE_TYPE.line
            });
        }
    });
}
