var C_TAB_NAME = {
	sy			: '首页',
	bxsfq		: '博兴示范区',
	zjxt		: '博兴拓扑图',
	hhsyt		: '10kV合环',
	kqsft		: '10kV快切',
	jfwdw		: '金风微电网'
};
var UNIT_TITLE = {
	gl		: 'kW',
	gl_m	: 'MW',
	bfb		: '%',
	dy		: 'V',
	dy_k	: 'kV',
	dl		: 'A',
	rmb		: '元'
};
var CLFS_SUFFIX = {
	before:	'_q',
	after:	'_h'
};
var PIE_LINE_TYPE = {
	simple	:1,
	area	:2,
	bar		:3
};
/*
 有功功率取值阶梯范围
 */
var pTextRange = [6000, 8000, 10000, 14000, 18000];
function getSvgContent(initContentMap, obj, u, p_empty) {
	var _p = 0;
	var objId = $.trim(obj.attr("id"));
	if(p_empty) {
	} else {
		var baseText = initContentMap.get(objId);
		if(baseText == null) {
			baseText = pTextRange[randomInt(0,4)];
			initContentMap.put(objId, baseText);
		}
		_p = getFluctuatedValue(baseText,0);
	}
	var _u = getFluctuatedValue(u, 2);
	var _i = getIByPU(_p,_u).toFixed(2);
	return [
		'有功:' + _p + UNIT_TITLE.gl,
		'电压:' + _u + UNIT_TITLE.dy_k,
		'电流:' + _i + UNIT_TITLE.dl
	];
}

function getIByPU(p,u) {
	return p/u/Math.sqrt(3);
}

function getTitleByClfs(clfs) {
	var title = '';
	if(clfs.indexOf('cn_soc')!=-1) {
		title = '储能SOC';
	} else if(clfs.indexOf('rqljcl')!=-1) {
		title = '燃气轮机出力';
	} else if(clfs.indexOf('ljfsfd')!=-1) {
		title = '垃圾焚烧发电出力';
	} else if(clfs.indexOf('ljtmfd')!=-1) {
		title = '垃圾填埋发电出力';
	} else if(clfs.indexOf('cdzcfdgl')!=-1) {
		title = '充电桩充放电功率';
	} else if(clfs.indexOf('gffdcl')!=-1) {
		title = '光伏发电出力';
	} else if(clfs.indexOf('dchdzt')!=-1) {
		title = '电池荷电状态';
	} else if(clfs.indexOf('dccfdgl')!=-1) {
		title = '电池充放电功率';
	} else if(clfs.indexOf('gydjcl')!=-1) {
		title = '感应电机出力';
	} else if(clfs.indexOf('fjcl')!=-1) {
		title = '风机出力';
	} else if(clfs.indexOf('fhyc')!=-1 || clfs.indexOf('lsfh')!=-1) {
		title = '负荷功率';
	} else if(clfs.indexOf('cn_lstl')!=-1) {
		title = '磷酸铁锂储能';
	} else if(clfs.indexOf('cn_fyl')!=-1) {
		title = '钒液流储能';
	} else if(clfs.indexOf('cncfdgl')!=-1) {
		title = '储能充放电功率';
	} else if(clfs.indexOf('xtfhbh')!=-1) {
		title = '系统负荷';
	}  else if(clfs.indexOf('xbcglgl')!=-1) {
		title = '蓄冰槽供冷功率';
	} else if(clfs == 'sy') {
		title = '收益';
	}
	return title;
}

function getUnitByClfs(clfs) {
	var unit;
	if(clfs.indexOf('cn_soc')!=-1 || clfs.indexOf('dchdzt')!=-1) {
		unit = UNIT_TITLE.bfb;
	} else if(clfs == 'sy') {
		unit = UNIT_TITLE.rmb;
	} else {
		unit = UNIT_TITLE.gl;
	}
	return unit;
}

function randomInt(m, n) {
	return parseInt(Math.random()*(n-m+1)+m);
}

function processK2M(num) {
	return (num/1000).toFixed(2);
}

function processFluctuate(num) {
	return (num/1000).toFixed(2);
}

function getCurrentSjd() {
	var d = new Date();
	return parseInt((d.getHours()*60 + d.getMinutes())/15) + 1;
}

function isWeekend(offset) {
	var dt = new Date();
	var currentDay = dt.getDay() + offset;
	var _day = currentDay%7;
	if(_day == 6 || _day == 0 || _day == -1) {
		return true;
	} else {
		return false;
	}
}

function isEmptyStr(str) {
	if(typeof str == 'undefined' || str == null || str == '') {
		return true;
	}
	return false;
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
	var context = "";
	if (r != null)
		context = r[2];
	reg = null;
	r = null;
	return context == null || context == "" || context == "undefined" ? "" : context;
}

function openNewWin(url, width, height) {
	/*
	 const BrowserWindow = require('electron').remote.BrowserWindow;
	 const path = require('path');
	 const url = require('url');
	 var win = new BrowserWindow({
	 width: 700, height: 500, show: false,autoHideMenuBar :true,minimizable:false,maximizable:false
	 });
	 win.setMenu(null);
	 win.on('closed', function () { win = null })
	 win.loadURL(url.format({
	 pathname: path.join(__dirname, 'simple_line.html'),
	 protocol: 'file:',
	 slashes: true
	 }))
	 win.show();
	 */
	window.open(url,'','width=' + width + ',height=' + height + ',menubar=no,scrollbars=no,toolbar=no,status=no,resizable=no');
}

/*
option = {
		pieId: ,
		title: ,
		xName: ,
		yName: ,
		unit: ,
		lineColor:',
		xData: ,
		seriesData: ,
		needLegend: ,
		yTitle: ,
		lineType: ,
};
 */
function buildSimpleChart(option) {
	var pieChart = document.getElementById(option.pieId);
	var echart = echarts.init(pieChart);
	echart.setOption(getSimpleLineOption(option), true);
}

function getSimpleLineOption(option) {
	var _lineColor = '#ff4c7b';
	var _title = '';
	var _xName = '';
	var _yName = '';
	var _unit = '';
	var _yTitle = option.yTitle;
	var _lineType = PIE_LINE_TYPE.simple;
	var _needLegend = false;
	if(!isEmptyStr(option.lineColor)) _lineColor = option.lineColor;
	if(!isEmptyStr(option.title)) _title = option.title;
	if(!isEmptyStr(option.xName)) _xName = option.xName;
	if(!isEmptyStr(option.yName)) _yName = option.yName;
	if(!isEmptyStr(option.unit)) _unit = option.unit;
	if(!isEmptyStr(option.needLegend)) _needLegend = option.needLegend;
	if(!isEmptyStr(option.lineType)) _lineType = option.lineType;
	if(!_yTitle) _yTitle = _yName;
	var pieOption = {
		title: {
			text: _title,
			left: '',
			textStyle: {
				fontWeight: 'normal',
				fontSize: 14
			}
		},
		color: _lineColor instanceof Array ? _lineColor : [_lineColor],
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			top: '12%',
			left: '4%',
			right: '7%',
			bottom: '9%',
			containLabel: true
		},
		xAxis: [{
			name: _xName,
			nameTextStyle:{
				color: '#fff'
			},
			type: 'category',
			boundaryGap : _lineType == PIE_LINE_TYPE.bar,
			axisTick: {
				alignWithLabel: true
			},
			axisLine : {
				lineStyle : {
					color : ''
				}
			},
			axisLabel: {
				textStyle : {
					color : '#fff'
				}
			},
			data: option.xData
		}],
		yAxis: [{
			type: 'value',
			name: !isEmptyStr(_yTitle) && !isEmptyStr(_unit) ? _yTitle + '(' + _unit + ')' : _yTitle,
			nameTextStyle:{
				color: '#fff'
			},
			position: 'left',
			axisLine : {
				lineStyle : {
					color : ''
				}
			},
			axisLabel: {
				textStyle : {
					color : '#fff'
				},
				formatter: '{value} '
			}
		}]
	};
	if(_yName instanceof Array) {
		var seriesArr = new Array(_yName.length);
		for(var i=0; i<_yName.length; i++) {
			var series = getSeries(_yName[i], option.seriesData[i], _lineColor[i], _lineType);
			seriesArr[i] = series;
		}
		pieOption.series = seriesArr;
	} else {
		pieOption.series = getSeries(_yName, option.seriesData, _lineColor, _lineType);
	}
	if(_needLegend) {
		var legendData;
		if(_yName instanceof Array) {
			legendData = _yName;
		} else {
			legendData = [_yName];
		}
		pieOption.legend = {
			left: 'center',
			icon: 'rect',
			itemWidth: 30,
			itemHeight: 10,
			itemGap: 13,
			data: legendData,
			right: '4%',
			textStyle: {
				fontSize: 12,
				color: '#fff'
			},
			top: 'bottom',
			padding:5
		};
	}
	return pieOption;
}

function getSeries(seriesName, seriesData, lineColor, lineType) {
	var series = {
		name: seriesName,
		type: lineType == PIE_LINE_TYPE.bar ? 'bar' : 'line',
		showSymbol: false,
		label: {
		normal: {
				show: false,
					position: 'top',
			}
		},
		lineStyle: {
			normal: {
				color : lineColor,
					width: 2,
					shadowColor: 'rgba(0,0,0,0.4)',
					shadowBlur: 10,
					shadowOffsetY: 10
			}
		},
		data:seriesData
	}
	if(lineType == PIE_LINE_TYPE.area) {
		series.areaStyle = {
			normal: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					offset: 0,
					color: lineColor
				}, {
					offset: 0.8,
					color: lineColor
				}], false),
					shadowColor: 'rgba(0, 0, 0, 0.1)',
					shadowBlur: 10
			}
		};
	}
	return series;
}

function getFluctuatedValue(num, radixPoint) {
	if(num == 0) {
		return num;
	} else {
		var _radixPoint = 2;
		if(typeof radixPoint != 'undefined') {
			_radixPoint = radixPoint;
		}
		if(_radixPoint == 0) {
			return parseInt(parseFloat(num) * randomInt(980,1020)/1000);
		} else {
			return (parseFloat(num) * randomInt(980,1020)/1000).toFixed(_radixPoint);
		}
	}
}
function isFluctuatedValueRange(num, fluctuatedValue, radixPoint) {
	var _radixPoint = 2;
	if(radixPoint) {
		_radixPoint = radixPoint;
	}
	var _fluctuatedValue_s = (parseFloat(num) * 0.9).toFixed(_radixPoint);
	var _fluctuatedValue_e = (parseFloat(num) * 1.1).toFixed(_radixPoint);
	if(fluctuatedValue >=  _fluctuatedValue_s && fluctuatedValue <= _fluctuatedValue_e) {
		return true;
	} else {
		return false;
	}
}