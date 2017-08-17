

DLG_CREATOR[ID_DlgActivity] = function() {
	return new DlgActivity();
};

var DlgActivity = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgActivityScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnBack = this._rootWidget.getChildByName('BtnBack');
		this.BtnBack.setPressedActionEnabled(true);
		this.BtnBack.addTouchEventListener(this.onClickEvent, this);
		
		this.PanelWeb = this._rootWidget.getChildByName('PanelWeb');
		var size = this.PanelWeb.getSize();

		if(cc.sys.os != cc.sys.OS_WINDOWS){
			this.webView = new ccui.SCWebView();
			this.webView.setContentSize(size);
			this.webView.attr({
				x: size.width / 2,
				y: size.height / 2,
				anchorX: 0.5,
				anchorY: 0.5
			});
			var url = _CONFIG_.WEB_IP + "/Views/Phone/Carousel.html";
			this.webView.visitURL(url);
			this.webView.setScalesPageToFit(false);
			this.PanelWeb.addChild(this.webView, 10);
		}
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnBack":
				UIMgr.getInstance().closeDlg(ID_DlgActivity);
				break;
			default:
				break;
			}
		}
	},
});