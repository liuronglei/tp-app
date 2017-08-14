/**
 * Created by lenovo on 2017/6/3.
 */
var m_yhdd = require('../../models/m_yhdd');
$(document).ready(function(){
    creatPie();
});

function creatPie() {
    m_yhdd.queryDsxn_jg(function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var cncfdgl_qArr = new Array();
        var cncfdgl_hArr = new Array();
        var cdzcfdgl_qArr = new Array();
        var cdzcfdgl_hArr = new Array();
        var fhyc_zmArr = new Array();
        var fhyc_zm_hArr = new Array();
        var gffdclArr = new Array();
        for(var i=0; i<results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            cncfdgl_qArr[cncfdgl_qArr.length] = results[i].cncfdgl_q;
            cncfdgl_hArr[cncfdgl_hArr.length] = results[i].cncfdgl_h;
            cdzcfdgl_qArr[cdzcfdgl_qArr.length] = results[i].cdzcfdgl_q;
            cdzcfdgl_hArr[cdzcfdgl_hArr.length] = results[i].cdzcfdgl_h;
            fhyc_zmArr[fhyc_zmArr.length] = results[i].fhyc_zm;
            fhyc_zm_hArr[fhyc_zm_hArr.length] = results[i].fhyc_zm_h;
            gffdclArr[gffdclArr.length] = results[i].gffdcl;
        }
        buildSimpleChart({
            pieId: 'pie_fhyc',
            title: '',
            xName: '时段',
            yName: ['消纳前','消纳后'],
            unit: getUnitByClfs('fhyc_zm'),
            lineColor: ['#ff4c7b','#33c0eb'],
            xData: sjdArr,
            seriesData: [fhyc_zmArr,fhyc_zm_hArr],
            needLegend: true,
            yTitle: getTitleByClfs('fhyc_zm')
        });
        buildSimpleChart({
            pieId: 'pie_cncfdgl',
            title: '',
            xName: '时段',
            yName: ['消纳前','消纳后'],
            unit: getUnitByClfs('cncfdgl_q'),
            lineColor: ['#ff4c7b','#33c0eb'],
            xData: sjdArr,
            seriesData: [cncfdgl_qArr,cncfdgl_hArr],
            needLegend: true,
            yTitle: getTitleByClfs('cncfdgl_q')
        });
        buildSimpleChart({
            pieId: 'pie_cdzcfdgl',
            title: '',
            xName: '时段',
            yName: ['消纳前','消纳后'],
            unit: getUnitByClfs('cdzcfdgl_q'),
            lineColor: ['#ff4c7b','#33c0eb'],
            xData: sjdArr,
            seriesData: [cdzcfdgl_qArr,cdzcfdgl_hArr],
            needLegend: true,
            yTitle: getTitleByClfs('cdzcfdgl_q')
        });
        buildSimpleChart({
            pieId: 'pie_gffdcl',
            title: '',
            xName: '时段',
            yName: getTitleByClfs('gffdcl'),
            unit: getUnitByClfs('gffdcl'),
            lineColor: '#ff4c7b',
            xData: sjdArr,
            seriesData: gffdclArr,
            needLegend: true,
            yTitle: getTitleByClfs('gffdcl')
        });
    });
}