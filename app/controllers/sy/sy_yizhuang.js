/**
 * Created by lenovo on 2017/6/3.
 */
var m_sy = require('../../models/m_sy');
var c_page = require('../../controllers/c_page');
$(document).ready(function(){
    drawSvg("../../../public/svg/yizhuang.svg");
});

var viewer = new BeePower.Svg.Viewer();
function drawSvg(path){
    m_sy.queryYxjsBySjd(getCurrentSjd(), function (error, results, fields) {
        if (error) throw error;
        if(results.length == 1) {
            viewer.load({
                path: path,
                id: "canvas",
                refreshTime: 5000,
                refreshOption: [{
                    text: 'fhyc',
                    content: function() {return getFluctuatedValue(results[0].fhyc_zm_h) + UNIT_TITLE.gl}
                },{
                    text: 'rqljcl',
                    content: function() {return getFluctuatedValue(results[0].rqljcl) + UNIT_TITLE.gl}
                },{
                    text: 'ljfsfd',
                    content: function() {return getFluctuatedValue(results[0].ljfsfd) + UNIT_TITLE.gl}
                },{
                    text: 'ljtmfd',
                    content: function() {return getFluctuatedValue(results[0].ljtmfd) + UNIT_TITLE.gl}
                },{
                    text: 'gffdcl',
                    content: function() {return getFluctuatedValue(results[0].gffdcl) + UNIT_TITLE.gl}
                },{
                    text: 'fjcl',
                    content: function() {return getFluctuatedValue(results[0].fjcl) + UNIT_TITLE.gl}
                },{
                    text: 'cdzcfdgl',
                    content: function() {return getFluctuatedValue(results[0].cdzcfdgl) + UNIT_TITLE.gl}
                },{
                    text: 'cn_soc',
                    content: function() {return getFluctuatedValue(results[0].cn_soc_h) + UNIT_TITLE.bfb}
                },{
                    text: 'kkxzb',
                    content: function() {return 99.999 + UNIT_TITLE.bfb}
                }]
            });
        }
    });
}

function yizhuangLink() {
    c_page.doPageToEvent({title:C_TAB_NAME.bxsfq, url:'views/sy/sy_boxing.html'});
}

var currentClfs;
var isHistory = false;
function imgMouseOver(event,type) {
    if(type == '') return;
    currentClfs = type;
    //显示窗口
    $('#win').window({
        title:'', //getTitleByClfs(currentClfs),
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:false,
        width:500,
        height:400,
        modal:false
    });
    //刷新窗口数据
    $('#win').window('refresh', '../../views/simple_line.html');
    //设置窗口位置
    var left = event.x + 10;
    if(event.x > $(window).width() - $('#win').width()) {
        left = left - $('#win').width() - 50;
    }
    var top = event.y + 10;
    if(top > $(window).height() - $('#win').height()) {
        top = top - $('#win').height() - 50;
    }
    $('#win').window({left:left, top:top});
}

function imgMouseOut(event,type) {
    if(type == '') return;
    $('#win').window('close');
}