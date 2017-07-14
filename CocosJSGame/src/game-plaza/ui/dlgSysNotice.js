

DLG_CREATOR[ID_DlgSysNotice] = function() {
	return new DlgSysNotice();
};

var DlgSysNotice = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgSysNoticeScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');
		
		this.BtnOk = this.ImgBg.getChildByName('BtnOk');
		this.BtnOk.setPressedActionEnabled(true);
		this.BtnOk.addTouchEventListener(this.onClickEvent, this);
		
		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		
		this.PanelWeb = this.ImgBg.getChildByName('PanelWeb');
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
			var url = _CONFIG_.WEB_IP + "/News/Notice";
			this.webView.visitURL(url);
			this.webView.setScalesPageToFit(true);
			this.PanelWeb.addChild(this.webView, 10);
		}
			
		this.addActionNodeMB(this.ImgBg);
		
//		this.webView = new ccui.SCWebView();
//		this.webView.setContentSize(cc.size(600, size.height-20));
//		this.webView.attr({
//		x: size.width / 2,
//		y: size.height / 2,
//		anchorX: 0.5,
//		anchorY: 0.5
//		});
//		this.webView.visitURL("http://www.baidu.com")
//		this.webView.setScalesPageToFit(true);
//		this.addChild(this.webView, 10);
	},
	
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
			case "BtnOk":
				UIMgr.getInstance().closeDlg(ID_DlgSysNotice);
				break;
			default:
				break;
			}
		}
	},
});
