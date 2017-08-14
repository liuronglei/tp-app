﻿function SimpleLeftMenu() {
	this.init = function(option) {
		this.renderTo = option.renderTo;
		$('#' + this.renderTo).tabs({tabPosition:'left',tabWidth:300});
		$('.tabs-panels').css('width','0');
		$('.tabs-wrap,.tabs-header,.tabs').css('width','300px');
	};
}