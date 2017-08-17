/*
请求退出房间
* */
DLG_CREATOR[ID_DdzDlgQuit] = function() {
	return new DdzDlgQuit();
};

var DdzDlgQuit = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgQuit_ddz_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		 
	}
});