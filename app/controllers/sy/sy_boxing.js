/**
 * Created by lenovo on 2017/6/3.
 */

var c_page = require('../../controllers/c_page');
$(document).ready(function(){
    drawSvg("../../../public/svg/boxing.svg");
});

var viewer = new BeePower.Svg.Viewer();
function drawSvg(path){
    viewer.load({path:path,id:"canvas"});
}

function boxingLink() {
    c_page.doPageToEvent({title:'首页_' + C_TAB_NAME.zjxt, url:'views/sy/sy_zjxt.html'});
}

function imgMouseOver(type) {

}