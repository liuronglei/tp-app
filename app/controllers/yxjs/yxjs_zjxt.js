/**
 * Created by lenovo on 2017/6/3.
 */
var c_page = require('../../controllers/c_page');
$(document).ready(function(){
    drawSvg("../../../public/svg/zjxt.svg");
    initSwitchButton();
});

var viewer = new BeePower.Svg.Viewer();
var initContentMap = new BeePower.Map();
function drawSvg(path){
    viewer.load({
        path: path,
        id: "canvas",
        refreshTime: 5000,
        refreshOption: [{
            text: 'transformer_10kV',
            content: function(obj) {
                return getSvgContent(initContentMap, obj, 10, false);
            }
        },{
            text: 'transformer_110kV',
            content: function(obj) {
                return getSvgContent(initContentMap, obj, 110, false);
            }
        }]
    });
}

function blockClick(type) {
    if(type == 2) {
        c_page.doPageToEvent({title:'监视_' + C_TAB_NAME.jfwdw, url:'views/yxjs/yxjs_jfkc2fpdswwzjxt.html'});
    }
}

var currentClfs;
var isHistory;
function iduClick(id, clfs) {
    if(isEmptyStr(clfs)) return;
    //doNewWinEvent('html/simple_line.html?clfs=' + clfs, 700, 500);
    //初始化是否是实时、出力方式
    isHistory = getIsHistory();
    currentClfs = clfs;
    $('#win').window({
        title:getTitleByClfs(currentClfs),
        collapsible:false,
        minimizable:false,
        maximizable:false,
        closable:true,
        width:700,
        height:500,
        modal:false
    });
    //$("#win").panel({title:getTitleByClfs(currentClfs)});
    $('#win').window('refresh', '../../views/simple_line.html');
}

function initSwitchButton() {
    $("[switchbuttonName='dataType']").switchbutton("check");
}

function getIsHistory() {
    return $("[switchbuttonName='dataType']").switchbutton("options").checked;
}