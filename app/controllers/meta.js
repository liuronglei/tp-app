const path = require('path')
var __rootdir = require('electron').remote.getGlobal('sharedObject').rootdir;
document.write('<link rel="stylesheet" type="text/css" href="' + path.join(__rootdir, 'public/js/easyui/themes/wanke_swj/easyui.css') + '">');
document.write('<link rel="stylesheet" type="text/css" href="' + path.join(__rootdir, 'public/js/easyui/themes/icon.css') + '">');
document.write('<link rel="stylesheet" type="text/css" href="' + path.join(__rootdir, 'public/css/TianPeng.css') + '">');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/jquery.min.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/echarts.min.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/easyui/jquery.easyui.min.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/easyui/locale/easyui-lang-zh_CN.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/dthree/Long.min.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/dthree/ByteBufferAB.min.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/dthree/ProtoBuf.min.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/dthree/mqttws31.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/dthree/d3.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'public/js/dthree/bputils.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'app/controllers/base.js') + '"></script>');
document.write('<script type="text/javascript" src="' + path.join(__rootdir, 'app/controllers/SimpleTab.js') + '"></script>');

/*
var __rootdir = "E:/WebStormProjects/psvisual/bjadn/";
document.write('<link rel="stylesheet" type="text/css" href="' + __rootdir + 'public/js/easyui/themes/wanke_red/easyui.css' + '">');
document.write('<link rel="stylesheet" type="text/css" href="' + __rootdir +  'public/js/easyui/themes/icon.css' + '">');
document.write('<link rel="stylesheet" type="text/css" href="' + __rootdir +  'public/css/new.css' + '">');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/jquery.min.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/echarts.min.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/easyui/jquery.easyui.min.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/easyui/locale/easyui-lang-zh_CN.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/dthree/Long.min.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/dthree/ByteBufferAB.min.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/dthree/ProtoBuf.min.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/dthree/mqttws31.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/dthree/d3.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'public/js/dthree/bputils.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'app/controllers/base.js' + '"></script>');
document.write('<script type="text/javascript" src="' + __rootdir +  'app/controllers/SimpleTab.js' + '"></script>');
*/