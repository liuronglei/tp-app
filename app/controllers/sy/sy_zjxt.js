/**
 * Created by lenovo on 2017/6/3.
 */
var c_page = require('../../controllers/c_page');
$(document).ready(function(){
    drawSvg("../../../public/svg/zjxt.svg");
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
    if(type == 1) {
        c_page.doPageToEvent({title:C_TAB_NAME.hhsyt, url:'views/sy/sy_10kVhhsyt.html'});
    } else if(type == 2) {
        c_page.doPageToEvent({title:'首页_' + C_TAB_NAME.jfwdw, url:'views/sy/sy_jfkc2fpdswwzjxt.html'});
    } else if(type == 3) {
        c_page.doPageToEvent({title:C_TAB_NAME.kqsft, url:'views/sy/sy_10kVkqsft.html'});
    }
}