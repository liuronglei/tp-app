/**
 * Created by lenovo on 2017/6/3.
*/

$(document).ready(function(){
    drawSvg("../../../public/svg/10kVhhsyt.svg");
    //事件绑定
    $('#btn_hhjy').click(doHhjy);
});

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
                if(!kg_switch_state[201] && kg_switch_state[202] && kg_switch_state[245] && objId == kg_text_id[202]) {
                    //此处做特殊处理，把201的有功加成到202上去
                    var baseText = initContentMap.get(objId);
                    if(baseText == null) {
                        baseText = pTextRange[randomInt(0,4)];
                        initContentMap.put(objId, baseText);
                    }
                    var _p = getFluctuatedValue(baseText,0) + initContentMap.get(kg_text_id[201]);
                    var _u = 10;
                    var _i = getIByPU(_p,_u).toFixed(2);
                    return [
                        '有功:' + _p + UNIT_TITLE.gl,
                        '电压:' + _u + UNIT_TITLE.dy_k,
                        '电流:' + _i + UNIT_TITLE.dl
                    ];
                } else {
                    return getSvgContent(initContentMap, obj, 10, p_empty);
                }
            }
        },{
            text: 'transformer_10kV',
            content: function(obj) {
                return getSvgContent(initContentMap, obj, 10, false);
            }
        }]
    });
}

var kg_id = {
    201 : 'path4330-0-8-2-4',
    245 : 'path4330-0-8-2-4-0',
    202 : 'path6304'
};

var kg_text_id = {
    201 : 'text8194',
    245 : 'text52237',
    202 : 'text52211'
};

var kg_d_close = {
    201 : 'm -165.00372,330.08386 c 0,181.43777 0,181.43777 0,181.43777 l 0,0',
    245 : 'm -165.00372,330.08386 c 0,181.43777 0,181.43777 0,181.43777 l 0,0',
    202 : 'm -165.00372,330.08386 c 0,181.43777 0,181.43777 0,181.43777 l 0,0'
};

var kg_d_open = {
    201 : 'm -245.37307,336.71226 c 41.4275,91.95437 80.36935,174.80937 80.36935,174.80937 l 0,0',
    245 : 'm -244.54715,486.90887 c 36.45839,-78.20018 78.71751,-164.6747 78.71751,-164.6747 l 0,0',
    202 : 'm -245.37307,336.71226 c 41.4275,91.95437 80.36935,174.80937 80.36935,174.80937 l 0,0'
};

var kg_switch_state = {
    201 : true,
    245 : false,
    202 : true
};

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
        $('#div_' + type).attr("class", "state-close");
        $('#span_' + type).text('闭合');
    } else {
        $('#div_' + type).attr("class", "state-open");
        $('#span_' + type).text('断开');
        $('#div_hh').attr('class', 'state-hh');
    }
}

function checkDescShow() {
    if(kg_switch_state[201] && kg_switch_state[202] && !kg_switch_state[245] && !isChecked) {
        $('#start_1').hide();
        $('#start_2').hide();
        $('#start_3').hide();
        $('#initDesc').slideDown('slow');
        $('#div_hh').attr('class', 'state-hh-no');
    } else if(kg_switch_state[201] && kg_switch_state[202] && !kg_switch_state[245] && isChecked) {
        $('#initDesc').hide();
        $('#start_1').hide();
        $('#start_2').hide();
        $('#start_3').hide();
        $('#start_1').show();
        setTimeout("$('#start_2').slideDown('slow');$('#div_hh').attr('class', 'state-hh')",1500);
    } else if(kg_switch_state[201] && kg_switch_state[202] && kg_switch_state[245]) {
        $('#initDesc').hide();
        $('#start_1').hide();
        $('#start_2').hide();
        $('#start_3').hide();
        $('#start_3').slideDown('slow');
    } else if(!kg_switch_state[201]) {
    }
}

function switchClick(type) {
    if(type == 202) return;
    switchChange(type);
    checkDescShow();
    //刷新数据
    viewer.refreshData();
}

var isChecked = false;
function doHhjy() {
    isChecked = true;
    checkDescShow();
}