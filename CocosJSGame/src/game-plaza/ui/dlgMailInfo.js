

DLG_CREATOR[ID_DlgMailInfo] = function() {
	return new DlgMailInfo();
};

var DlgMailInfo = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgMailInfo_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');
		
		this.ImgTitleBg = this.ImgBg.getChildByName('ImgTitleBg');
		this.LabTitle = this.ImgTitleBg.getChildByName('LabTitle');

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
			//var url = _CONFIG_.WEB_IP + "/Views/Phone/Carousel.html";
			//this.webView.visitURL(url);
			this.webView.setScalesPageToFit(false);
			this.PanelWeb.addChild(this.webView, 10);
		}

		this.BtnOK = this.ImgBg.getChildByName('BtnOK');
		this.BtnOK.addTouchEventListener(this.onClickEvent, this);
		
		//this.addActionNodeMB(this.ImgBg);
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
			case "BtnOK":
				UIMgr.getInstance().closeDlg(ID_DlgMailInfo);
				break;
			default:
				break;
			}
		}
	},
	
	setTitle: function(str){
		this.LabTitle.string = str;
	},
	
	setBody: function(strHtml){
		if(cc.sys.os != cc.sys.OS_WINDOWS){
			this.webView.loadHTMLString(strHtml, '');
			//var url = _CONFIG_.WEB_IP + "/Views/Phone/Carousel.html";
			//this.webView.visitURL(url);
			//this.webView.setScalesPageToFit(false);
			//this.PanelWeb.addChild(this.webView, 10);
		}
	},
});