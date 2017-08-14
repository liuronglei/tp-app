
$(document).ready(function(){
    $('#yzxDiv').hide();
    drawSvg("../../../public/svg/factory.svg","canvas-1");
    drawSvg("../../../public/svg/zjxt_ww.svg","canvas-2");
    //事件绑定
    $('#btn_gwcz').click(doGwcz);
});

var viewer = new BeePower.Svg.Viewer();
function drawSvg(path,id){
    viewer.load({path:path,id:id});
}

function doGwcz() {
    if($('#wzxDiv').is(':hidden')){
        $('#wzxDiv').show();
    } else{
        $('#wzxDiv').hide();
    }
    if($('#yzxDiv').is(':hidden')){
        $('#yzxDiv').show();
    } else{
        $('#yzxDiv').hide();
    }
}
