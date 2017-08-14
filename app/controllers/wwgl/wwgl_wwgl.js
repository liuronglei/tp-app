var m_yhdd = require('../../models/m_yhdd');
$(document).ready(function () {
    creatPie();
    createcdpercent();
    getSimplePie();
});
function creatPie(){
    m_yhdd.queryFydgl(function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var fdglArr = new Array();
        var ydglArr = new Array();
        for(var i=0; i<results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            fdglArr[fdglArr.length] = results[i].fdgl;
            ydglArr[ydglArr.length] = results[i].ydgl;
        }
        buildSimpleChart({
            pieId: 'pie_ssyfdgl',
            title: '',
            xName: '时段',
            yName: ['发电功率','用电功率'],
            unit: UNIT_TITLE.gl,
            lineColor: ['#82e3ff','#cccccc'],
            xData: sjdArr,
            seriesData: [fdglArr,ydglArr],
            needLegend: true,
            yTitle: '发用电功率',
            lineType: PIE_LINE_TYPE.area
        });
    });
    m_yhdd.querySsfdgl(function (error, results, fields) {
        if (error) throw error;
        var sjdArr = new Array();
        var gffdclArr = new Array();
        var fjclArr = new Array();
        for(var i=0; i<results.length; i++) {
            sjdArr[sjdArr.length] = results[i].sjd;
            gffdclArr[gffdclArr.length] = results[i].gffdcl_q;
            fjclArr[fjclArr.length] = results[i].fjcl_q;
        }
        buildSimpleChart({
            pieId: 'pie_fbsfddyssyfdgl',
            title: '',
            xName: '时段',
            yName: ['光伏发电','风机'],
            unit: UNIT_TITLE.gl,
            lineColor: ['yellow','green'],
            xData: sjdArr,
            seriesData: [gffdclArr,fjclArr],
            needLegend: true,
            yTitle: '发用电功率'
        });
    });
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
    var pieChart = document.getElementById('pie-cdpercent');
    var echart = echarts.init(pieChart);
    echart.setOption(option, true);
}

function getSimplePie() {

    var option = {
        title: {
            text: '总数\n15',
            subtext: '使用率\n73%',
            x: 'center',
            y: '50px',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 14,
                color:'#fff'
            },
            subtextStyle: {
                color:'#fff'
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
        series: [{
            name: '',
            type: 'pie',
            color:['#1CFF97','#C1E532','#C2C2C2'],
            selectedMode: 'single',
            radius: ['60%', '90%'],    //内半径,外半径
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
    var pieChart = document.getElementById('pie-syl');
    var echart = echarts.init(pieChart);
    echart.setOption(option, true);
}
