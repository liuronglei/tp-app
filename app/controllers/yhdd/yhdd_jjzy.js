var m_yhdd = require('../../models/m_yhdd');
var sjcd_long = 96;
var sjcd_short = 16;
var currentClfs = 'sy';
var isOptimised = false;
$(document).ready(function () {
    sjcdOptionInit();
    creatPie_right();
    createcdpercent();
    createcdpercent1();
    getSimplePie();
    changeClfs(currentClfs);
    //事件绑定
    $('#btn_jjzy_zx').click(doOptimize);
    $("a[id^='btn_clfs_']").click(clfsClick);
});
function clfsClick(){
    var clfs = this.id.substr(9);
    if(isOptimised || clfs == 'sy' || clfs == 'xtfhbh') {
        changeClfs(clfs);
    }
}
function sjcdOptionInit() {
    var data = [{value:96,text:'日前优化',selected:true},{value:16,text:'日内优化'}];
    $('#combobox_sjcd').combobox("loadData",data);
}
function changeClfs(field) {
    currentClfs = field;
    creatPie_line();
}
function doOptimize() {
    isOptimised = true;
    creatPie_right();
    creatPie_line();
}
function creatPie_right() {
    creatPie('gffdcl');
    creatPie('fjcl');
}
function creatPie(clfs){
    var currentSjcd = parseInt($('#combobox_sjcd').combobox('getValue'));
    var startNum = 1;
    var endNum = currentSjcd;
    if(currentSjcd != sjcd_long) {
        startNum = getCurrentSjd();
        endNum = startNum + currentSjcd;
    }
    m_yhdd.queryClyc_right(startNum, endNum, clfs, function (error, results, fields) {
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
            pieId: 'pie_' + clfs,
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
                pieId: 'pie_' + clfs,
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
                pieId: 'pie_' + clfs,
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

function creatPie_line() {
    var currentSjcd = parseInt($('#combobox_sjcd').combobox('getValue'));
    var startNum = 1;
    var endNum = currentSjcd;
    if(currentSjcd != sjcd_long) {
        startNum = getCurrentSjd();
        endNum = startNum + currentSjcd;
    }
    if("sy" == currentClfs) {
        m_yhdd.querySy(isOptimised, function (error, results, fields) {
            if (error) throw error;
            var sjdArr = new Array();
            var gainArr = new Array();
            var gain_ycArr = new Array();
            for(var i=0; i<results.length; i++) {
                sjdArr[sjdArr.length] = results[i].sjd;
                gainArr[gainArr.length] = results[i].gain;
                gain_ycArr[gain_ycArr.length] = results[i].gain_yc;
            }
            var unit = getUnitByClfs(currentClfs);
            var clfsTitle = getTitleByClfs(currentClfs);
            buildSimpleChart({
                pieId: 'pieDiv',
                title: '',
                xName: '时段',
                yName: ['优化前','优化后'],
                unit: unit,
                lineColor: ['#ff4c7b','#33c0eb'],
                xData: sjdArr,
                seriesData: [gainArr,gain_ycArr],
                needLegend: true,
                yTitle: clfsTitle,
                lineType: PIE_LINE_TYPE.bar
            });
        });
    } else {
        m_yhdd.queryCdyh_line(startNum, endNum, currentClfs, function (error, results, fields) {
            if (error) throw error;
            var sjdArr = new Array();
            var clfs_qArr = new Array();
            var clfs_hArr = new Array();
            for(var i=0; i<results.length; i++) {
                sjdArr[sjdArr.length] = results[i].sjd;
                if("xtfhbh" == currentClfs) {
                    clfs_qArr[clfs_qArr.length] = results[i][currentClfs + CLFS_SUFFIX.before];
                    clfs_hArr[clfs_hArr.length] = results[i][currentClfs + CLFS_SUFFIX.after];
                } else {
                    clfs_hArr[clfs_hArr.length] = results[i][currentClfs];
                }
            }
            var unit = getUnitByClfs(currentClfs);
            var clfsTitle = getTitleByClfs(currentClfs);
            if(currentClfs == 'xtfhbh') {
                if(isOptimised) {
                    buildSimpleChart({
                        pieId: 'pieDiv',
                        title: '',
                        xName: '时段',
                        yName: ['优化前', '优化后'],
                        unit: unit,
                        lineColor: ['#ff4c7b', '#33c0eb'],
                        xData: sjdArr,
                        seriesData: [clfs_qArr, clfs_hArr],
                        needLegend: true,
                        yTitle: clfsTitle
                    });
                } else {
                    buildSimpleChart({
                        pieId: 'pieDiv',
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
            } else {
                buildSimpleChart({
                    pieId: 'pieDiv',
                    title: '',
                    xName: '时段',
                    yName: clfsTitle,
                    unit: unit,
                    lineColor: '#ff4c7b',
                    xData: sjdArr,
                    seriesData: clfs_hArr,
                    needLegend: true
                });
            }
        });
    }
}

function createcdpercent() {
    var option = {
        title: {
            text: ''
        },
        legend: {
            show:false,
            data:['已冲', '未充']
        },
        xAxis: {
            data: [],
            type:'value',
            show:false,
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            show:false,
            axisTick: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            name:'人工',
            data:[80],
            z: 1,
            barGap: '-100%',
            barWidth: 8,
            itemStyle: {
                normal: {
                    barBorderRadius:[25, 25, 25, 25],
                    color:'#09b4dc'    // 颜色
                },
                emphasis: {
                    barBorderRadius: [25, 25, 25, 25],
                },
            },
            label: {
                normal: {
                    show: false,
                    position: 'inside',
                    formatter: '{c}%',
                }
            }
        },{
            type:'bar',
            name:'自动',
            data:[100],
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
                normal: {
                    barBorderRadius:[5, 5, 5, 5],
                    color:'#09b4dc'
                }
            },
            label: {
                normal: {
                    show: false,
                    position: 'inside',
                    formatter: '{c}%',
                }
            }
        }]
    };
    var pieChart = document.getElementById('parcent-cngl');
    var echart = echarts.init(pieChart);
    echart.setOption(option, true);
}

function createcdpercent1() {
    var option = {
        title: {
            text: ''
        },
        legend: {
            show:false,
            data:['已冲', '未充']
        },
        xAxis: {
            data: [],
            type:'value',
            show:false,
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            show:false,
            axisTick: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            name:'人工',
            data:[80],
            z: 3,
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
                normal: {
                    barBorderRadius:[25, 25, 25, 25],
                    color:'#4ae64e'    // 颜色
                },
                emphasis: {
                    barBorderRadius: [25, 25, 25, 25],
                },
            },
            label: {
                normal: {
                    show: false,
                    position: 'inside',
                    formatter: '{c}%',
                }
            }
        },{
            type:'bar',
            name:'自动',
            data:[100],
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
                normal: {
                    barBorderRadius:[5, 5, 5, 5],
                    color:'white'
                }
            },
            label: {
                normal: {
                    show: false,
                    position: 'inside',
                    formatter: '{c}%',
                }
            }
        }]
    };
    var pieChart = document.getElementById('parcent-cdz');
    var echart = echarts.init(pieChart);
    echart.setOption(option, true);
}

function getSimplePie() {

    var option = {
        title: {
            text: '充电桩',
            subtext: '  15',
            x: '44%',
            y: '35%',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 14,
                color:'#fff'
            },
            subtextStyle: {
                color:'#1CFF97',
                fontSize: 16
            }
        },
        color: ['#82e3ff', '#09b4dc'],        //设置环的颜色
        tooltip:
            {
                trigger: 'item',
                formatter: function(params, ticket, callback) {
                    var res = params.seriesName;
                    res += params.percent + '%';
                    return res;
                }
            },
        legend: {
            show: false,
            orient: 'vertical',
            right:'0%',
            bottom:'0%',
            data:['使用', '未使用'],
            itemWidth:20,
            itemHeight:10
        },
        color:['#1CFF97','#29F2FF','#C2C2C2'],
        series: [{
            name: '',
            type: 'pie',
            selectedMode: 'single',
            radius: ['50%', '70%'],    //内半径,外半径
            center: ['57%', '45%'],
            label: {
                normal: {
                    show:false,
                    position: 'inner',
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 6,
                name: '充电中'
            },{
                value: 5,
                name: '待机中'
            },{
                value: 4,
                name: '已离线'
            }]
        }]
    };
    var pieChart = document.getElementById('pie-cdz');
    var echart = echarts.init(pieChart);
    echart.setOption(option, true);
}