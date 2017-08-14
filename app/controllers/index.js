/**
 * Created by lenovo on 2017/6/3.
 */
var tab;
var c_page = require('../app/controllers/c_page');
$(document).ready(function(){
    temp();
    initMenu();
    c_page.regPageToEvent(function(arg){pageTo(arg.title, arg.url);}); //注册新建页签事件监听
    c_page.regNewWinEvent(function(arg){openNewWin(arg.url, arg.width, arg.height);}); //注册打开新页面事件监听
    //$(".logoimg").bind("click", c_page.pageLink('http://www.wankeauto.com'));
});

/*
 * 页面跳转，打开新页签
 */
function pageTo(title, url) {
    tab.addTab(title, url);
}

/*
 * 初始化菜单
 */
function initMenu() {
    //内容初始化
    /*
    var menu = [{
        title:'首页',
        url:'views/sy/sy_yizhuang.html'
    },{
        title:'运行监视',
        url:'views/yxjs/yxjs_zjxt.html'
    },{
        title:'拓扑调节',
        children:[{
            title:'快切示范',
            url:'views/tptj/tptj_kqsf.html'
        }, {
            title:'合环示范',
            url:'views/tptj/tptj_hhsf.html'
        }]
    },{
        title:'多源协同',
        url:'views/dyxt/dyxt_dyxt.html'
    },{
        title:'态势联动',
        children:[{
            title:'紧急故障',
            url:'views/tsld/tsld_jjgz.html'
        }, {
            title:'倒送消纳',
            url:'views/tsld/tsld_dsxn.html'
        }]
    }];
    */
    var menu = [{
        title:'首页',
        url:'views/wwsy/wwsy_sy.html'
    },{
        title:'微网概览',
        url:'views/wwgl/wwgl_wwgl.html'
    },{
        title:'实时监控',
        url:'views/ssjk/ssjk_ssjk.html'
    },{
        title:'优化调度',
        children:[{
            title:'经济最优',
            url:'views/yhdd/yhdd_jjzy.html'
        }, {
            title:'园区削峰',
            url:'views/yhdd/yhdd_yqxf.html'
        },{
            title:'倒送消纳',
            url:'views/yhdd/yhdd_dsxn.html'
        }]
    },{
        title:'态势感知',
        children:[{
            title:'数据预测',
            url:'views/tsgz/tsgz_sjyc.html'
        },{
            title:'安全评估',
            url:'views/tsgz/tsgz_aqpg.html'
        }]
    },{
        title:'运行控制',
        url:'views/yxkz/yxkz_yxkz.html'
    }];
    for(var key in menu) {
        var menu_id = 'menu_' + key;
        $('#nav').append('<li id="' + menu_id + '_li"><a id="' + menu_id + '" href="#">' + menu[key].title + '</a></li>');
        if(menu[key].url) {
            $('#' + menu_id).click(function(e){
                var thisKey = this.id.split('_')[1];
                pageTo(menu[thisKey].title, menu[thisKey].url);
            });
        }
        if(menu[key].children) {
            $('#' + menu_id + '_li').append('<ul id="' + menu_id + '_ul"></ul>');
            for(var child in menu[key].children) {
                var menu_child_id = 'menu_' + key + '_' + child;
                $('#' + menu_id + '_ul').append('<li><a id="' + menu_child_id + '" href="#">' + (menu[key].children)[child].title + '</a></li>');
                if((menu[key].children)[child].url) {
                    $('#' + menu_child_id).click(function(e){
                        var thisKey = this.id.split('_')[1];
                        var thisChild = this.id.split('_')[2];
                        pageTo((menu[thisKey].children)[thisChild].title, (menu[thisKey].children)[thisChild].url);
                    });
                }
            }
        }
    }
    //样式初始化
    $('#nav li').hover(function() {
        $('ul', this).slideDown(200);
        $(this).children('a:first').addClass("hov");
    },function() {
        $('ul', this).slideUp(100);
        $(this).children('a:first').removeClass("hov");
    });
    $('#menuDiv,.tabs-header').mouseleave(function(){hideMenu();});
    $('#menuDiv,.tabs-header').mouseenter(function(){showMenu();});
    $('#menuDiv').css('z-index', '99');
    $('.tabs-header').css('z-index', '98');
    $('.tabs-header').offset({ top: $('#menuDiv').height(), left: 0 })
    hideMenu();

    //初始化菜单首页
    tab = new SimpleTab();
    tab.init({renderTo:'tabDiv',homeTitle:menu[0].title,homeUrl:menu[0].url}); //初始化首页页签
}

/*
 * 浮动菜单，包括tabs头的浮动
 */
function hideMenu() {
    $('#menuDiv, .tabs-header').hide();
}

/*
 * 浮动菜单，包括tabs头的浮动
 */
function showMenu() {
    $('#menuDiv, .tabs-header').show();
}
function temp() {
    var InDataSet = {
        "Table1":[
            {
                "RltBillNo": "SXTZ004339",
                "CaseNo": "02265133",
                "CapSubGrade": "9,6",
                "PdtGrade": "A5X",
                "MachineNo": "1#",
                "WorkerNo": "0055;8888;"
            }
        ]
    }


    $.ajax({
         url: "http://221.178.135.214:8099/Service1.asmx?op=MESWebService",
        data: {
            Key : '',
            Role : '',
            TransactionType : 'SX_CHECK',
            StartDate : '',
            EndDate : '',
            InDataSet:InDataSet
            },
         type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: 'jsonp',
        jsonp: 'jsoncallback',//和服务端对应，如果没有此函数，则默认执行success的函数
        success: function (data) {
            var r = data; //此处data为json结构的服务端返回数据结果，而非执行代码
            alert(r);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(XMLHttpRequest.status);
            //alert(XMLHttpRequest.readyState);
            //alert(textStatus);
        },
        complete: function (XMLHttpRequest, textStatus) {

        }
    });
}

/*
function temp() {
    $.ajax({
            url: "http://域名/服务名.asmx/方法名",
            data: {},
            type: 'post',
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'jsonp',
            jsonp: 'jsoncallback',//和服务端对应，如果没有此函数，则默认执行success的函数
            success: function (data) {
                var r = data; //此处data为json结构的服务端返回数据结果，而非执行代码
                alert(r);
            },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(XMLHttpRequest.status);
            //alert(XMLHttpRequest.readyState);
            //alert(textStatus);
        },
        complete: function (XMLHttpRequest, textStatus) {

        }
    });
}
    */

