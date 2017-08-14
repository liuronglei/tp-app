/**
 * Created by lenovo on 2017/6/3.
 */
var c_page = require('../../controllers/c_page');
$(document).ready(function(){
    drawSvg("../../../public/svg/jfkc2fpdswwzjxt.svg");
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
        }]
    });
}

function iduClick(id, clfs) {
    if(isEmptyStr(clfs)) return;
    c_page.doNewWinEvent({url:'views/simple_line.views?clfs=' + clfs, width:700, height:500});
}