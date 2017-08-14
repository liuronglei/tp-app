/**
 * Created by lenovo on 2017/6/3.
 */

window.onload = function(){
    drawSvg("../../../public/svg/jfkc2fpdswwzjxt.svg");
};

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