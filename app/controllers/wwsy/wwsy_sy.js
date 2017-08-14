var c_page = require('../../controllers/c_page');
$(document).ready(function () {
    //绑定事件
    $(".panel-title").click(function(e){titleClick(this);});
});
function titleClick(obj) {
    c_page.doPageToEvent({title:'微网概览', url:'views/wwgl/wwgl_wwgl.html'});
}