

DLG_CREATOR[ID_DlgGameRule] = function() {
	return new DlgGameRule();
};

var DlgGameRule = DlgBase.extend({
	ctor: function(){
		this.gamekind = 100;
		this.gamestatus = true;
			//红中麻将 100 血战麻将 101 四人通比牛牛 200 斗地主300 十三水 400 漳浦麻将 t100 龙岩麻将 t101 龙海麻将 t102 贪吃蛇t900
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		cc.spriteFrameCache.addSpriteFrames(res.dlgPublic_Plist);
		var json = ccs.load(res.dlgRule_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this._rootWidget.setGlobalZOrder(1000);

		this.Panel_background = this._rootWidget.getChildByName('Panel_background');
		this.Panel_background.setVisible(true);

		this.Image_bg = this._rootWidget.getChildByName('Image_bg');

		//返回
		this.Button_return = this.Image_bg.getChildByName('Button_return');
		this.Button_return.addTouchEventListener(this.onClickEvent, this);

		this.Image_rule = this.Image_bg.getChildByName('Image_rule');
		this.Text_rulemess = this.Image_rule.getChildByName('Text_rulemess');
		this.Text_rulemess.setVisible(false);
		this.Text_rulemess.setFontSize(60);
		this.Panel_background.setVisible(false);	
	
		//淡入
		this.Image_bg.setOpacity(0)
		this.Image_bg.runAction(cc.fadeIn(0.4));
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_return":
				UIMgr.getInstance().closeDlg(ID_DlgGameRule);
				break;
				
			default:
				break;
			}
		}
	},
	
	onWhichplatform : function() {
		//检查网络情况
		if(this.gamestatus == true){
			var gamekind = this.gamekind;
			if(gamekind == 0){
				gamekind = 100;
			}
			cc.log('on==== ' + cc.sys.os);
			if(cc.sys.os != "Windows"){
				this.onOpenWebRule(gamekind);
			}
			else{
				this.Text_rulemess.setVisible(true);
			}
		}
		else{
			this.Text_rulemess.setVisible(true);
		}
	},
	
	onSetTextString:function(str){
		this.Text_rulemess.setVisible(true);
		this.Text_rulemess.setString(str);
		this.Text_rulemess.setColor(cc.color(0,0,0,0)); 
		this.Text_rulemess.setFontSize(20);
	},
	
	onOpenWebRule: function(gamekind){
		this.Webview = new ccui.SCWebView();
		var webSize = this.Image_rule.getSize();
		this.Webview.setContentSize(webSize);
		this.Webview.attr({
			x: webSize.width / 2,
			y: webSize.height / 2,
			anchorX: 0.5,
			anchorY: 0.5
		});
		this.Webview.setScalesPageToFit(true);
		this.Image_rule.addChild(this.Webview);
        this.Webview.visitURL("http://guize.lolqp.cn/?gid="+this.gamekind);
        this.Webview.setScalesPageToFit(true);
       
	}

});
