var m_tsgz = require('../../models/m_tsgz');
var isOptimised = false;

$(document).ready(function () {
    $('#dataDiv').hide();
    $("#btn_tsgz-clyc").bind('click',clycClick);
    $("#btn_tsgz-fhyc").bind('click',fhycClick);
});

function clycClick() {
    $('#dataDiv').show();
    $('#tsgz-lx-div').text('分布式电源类型：');
    isOptimised = true;
    fillValue(1);
    creatPie($('#search_sbbh').searchbox('getValue'));
}

function fhycClick() {
    $('#dataDiv').show();
    $('#tsgz-lx-div').text('用电类型：');
    isOptimised = true;
    fillValue(2);
    creatPie($('#search_sbbh').searchbox('getValue'));
}

function searchId(value){
    isOptimised = false;
    $('#dataDiv').hide();
    creatPie(value);
}

function fillValue(type){
    //填充预测时间
    var cxTime=new Date();
    var t1=cxTime.getFullYear()+"/"+(cxTime.getMonth()+1)+"/"+cxTime.getDate();
    $('#tsgz-ycsj-div').text(t1);
    //填充出力方式标题
    var str=$('#search_sbbh').searchbox('getValue');
    var clfs = str;
    var clfsTitle = '';
    if(type == 1) {
        clfsTitle = getTitleByClfs(clfs);
    } else {
        if(clfs.indexOf('2') != -1) {
            clfsTitle = '居民生活用电';
        } else if(clfs.indexOf('3') != -1) {
            clfsTitle = '工业用电';
        } else {
            clfsTitle = '商业用电';
        }
    }
    $('#tsgz-dylx-div').text(clfsTitle);
    //填充最大值、最小值、平均值
    m_tsgz.queryClycsj_Max(clfs, function (error, results, fields) {
        $('#tsgz-max-div').text(results[0].max + "/" + results[0].sjd);
        //$('#tsgz-max-div').text(results[0].sjd);
    });
    m_tsgz.queryClycsj_Min(clfs, function (error, results, fields) {
        $('#tsgz-min-div').text(results[0].min + "/" + results[0].sjd);
        //$('#tsgz-max-div').text(results[0].sjd);
    });
    m_tsgz.queryClycsj_Avg(clfs, function (error, results, fields) {
        $('#tsgz-avg-div').text(results[0].avg);
        //$('#tsgz-max-div').text(results[0].sjd);
    });
}

function creatPie(clfs) {
    m_tsgz.queryClycqx(clfs, function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var clfs_qArr = new Array();
        var clfs_hArr = new Array();
        for (var i = 0; i < results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            clfs_qArr[clfs_qArr.length] = results[i][clfs + CLFS_SUFFIX.before];
            clfs_hArr[clfs_hArr.length] = results[i][clfs + CLFS_SUFFIX.after];
        }
        buildSimpleChart({
            pieId: 'pie_clycqx',
            title: '',
            xName: '时段',
            yName: getTitleByClfs(clfs),
            unit: UNIT_TITLE.gl,
            lineColor: '#ff4c7b',
            xData: sjdArr,
            seriesData: clfs_hArr,
            needLegend: true,
            yTitle: '',
            lineType: PIE_LINE_TYPE.line
        });
        /*
        if(isOptimised) {
            buildSimpleChart({
                pieId: 'pie_clycqx',
                title: '',
                xName: '时段',
                yName: ['实际值','预测值'],
                unit: UNIT_TITLE.gl,
                lineColor: ['#ff4c7b','#33c0eb'],
                xData: sjdArr,
                seriesData: [clfs_qArr, clfs_hArr],
                needLegend: true,
                yTitle: getTitleByClfs(clfs),
                lineType: PIE_LINE_TYPE.line
            });
        } else {
            buildSimpleChart({
                pieId: 'pie_clycqx',
                title: '',
                xName: '时段',
                yName: getTitleByClfs(clfs),
                unit: UNIT_TITLE.gl,
                lineColor: '#ff4c7b',
                xData: sjdArr,
                seriesData: clfs_qArr,
                needLegend: true,
                yTitle: '',
                lineType: PIE_LINE_TYPE.line
            });
        }
        */
    });
}