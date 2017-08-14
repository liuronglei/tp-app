﻿function SimpleTab() {
	this.init = function(option) {
		//$('#' + this.renderTo).attr("'class", "easyui-tabs");
		this.renderTo = option.renderTo;
		this.homeTitle = option.homeTitle;
		this.homeUrl = option.homeUrl;
		//var winHeight = $(window).height() - $('#menuDiv').height() - $('div.tabs-header').height();
		var content = '<webview src="'+this.homeUrl+'" style="width:100%;height:100%;position:fixed;" nodeintegration></webview>';
		$('#' + this.renderTo).tabs('add',{
			title:this.homeTitle,
			content:content,
			closable:false
		});
	};
	this.addTab = function(title, url) {
		if ($('#' + this.renderTo).tabs('exists', title)){
			$('#' + this.renderTo).tabs('select', title);
		} else {
			//var winHeight = $(window).height() - $('#menuDiv').height() - $('div.tabs-header').height();
			var content = '<webview src="'+url+'" style="width:100%;height:100%;position:fixed;" nodeintegration></webview>';
			//var contentId = "content" + randomInt(0,10000);
			//var content = '<div id="' + contentId + '" style="width:100%;height:100%;position:fixed;"></div>';
			$('#' + this.renderTo).tabs('add',{
				title:title,
				content:content,
				closable:true
			});
			//$('#' + contentId).load(url);
		}
	};
}