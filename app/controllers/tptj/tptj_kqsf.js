/**
 * Created by lenovo on 2017/6/3.
*/

$(document).ready(function(){
    drawSvg("../../../public/svg/10kVkqsft.svg");
    //事件绑定
    $('#btn_zxkq').click(doKqcz);
});

var kg_id = {
    201 : 'path11020-1',
    202 : 'path5454'
};
var kg_text_id = {
    201 : 'text10584',
    202 : 'text8194'
};
var kg_d_close = {
    201 : 'm 153.31392,506.66162 c -1.39663,-24.35697 -1.39663,-24.35697 -1.39663,-24.35697 l 0,0',
    202 : 'm 613.30564,506.63042 c -1.55073,-25.31044 -1.55073,-25.31044 -1.55073,-25.31044 l 0,0'
};
var kg_d_open = {
    201 : 'm 153.01714,506.35251 c -6.91272,-22.50713 -6.91272,-22.50713 -6.91272,-22.50713 l 0,0',
    202 : 'm 613.01714,506.35251 c -6.91272,-22.50713 -6.91272,-22.50713 -6.91272,-22.50713 l 0,0'
};
var kg_switch_state = {
    201 : true,
    202 : false
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
                var p_empty = (objId == kg_text_id[201] && !kg_switch_state[201]) || (objId == kg_text_id[202] && !kg_switch_state[202]);
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

//执行快切操作（点击按钮控制开关状态）
function doKqcz() {
    $('.span-kqcz').css('visibility','visible');
    $('#descDiv').hide();
    $('#completeDiv').css('visibility','hidden');
    $('#startDiv').slideDown('slow');
    switchChange('201');
    switchChange('202');
    var time = randomInt(50,150);
    $('#timeSpan').text(time + 'ms');
    window.setTimeout("$('#completeDiv').css('visibility','visible');$('#startDiv').hide();$('#descDiv').slideDown('slow')",1500);
    //刷新数据
    viewer.refreshData();
}

function switchChange(type) {
    var switch_id = kg_id[type];
    var closedD = kg_d_close[type];
    var openedD = kg_d_open[type];
    var switch_id_attr_d_curr = d3.select("#" + switch_id).attr('d');
    if(switch_id_attr_d_curr == closedD) {
        d3.select("#" + switch_id).attr('d', openedD);
        setSwitchState(type, false);
    } else {
        d3.select("#" + switch_id).attr('d', closedD);
        setSwitchState(type, true);
    }
}

function setSwitchState(type, state) {
    kg_switch_state[type] = state;
    if(state) {
        $('#closeSpan').text(type);
    } else {
        $('#openSpan').text(type);
    }
}