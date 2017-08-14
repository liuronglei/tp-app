/**
 * Created by lenovo on 2017/6/3.
 */

window.onload = function(){
    drawSvg("../../../public/svg/10kVhhsyt.svg");
};

var kg_text_id = {
    201 : 'text8194',
    245 : 'text52237',
    202 : 'text52211'
};

var kg_switch_state = {
    201 : true,
    245 : false,
    202 : true
};

var viewer = new BeePower.Svg.Viewer();
var initContentMap = new BeePower.Map();
function drawSvg(path){
    viewer.load({
        path: path,
        id: "canvas",
        refreshTime: 5000,
        refreshOption: [{
            text: 'switch',
            content: function(obj) {
                var objId = $.trim(obj.attr("id"));
                var p_empty = (objId == kg_text_id[201] && !kg_switch_state[201]) || (objId == kg_text_id[202] && !kg_switch_state[202]) || (objId == kg_text_id[245] && !kg_switch_state[245]);
                return getSvgContent(initContentMap, obj, 10, p_empty);
            }
        },{
            text: 'transformer_10kV',
            content: function(obj) {
                return getSvgContent(initContentMap, obj, 10, false);
            }
        }]
    });
}