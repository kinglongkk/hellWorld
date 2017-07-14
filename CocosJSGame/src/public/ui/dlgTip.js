
var DlgTip = DlgBase.extend({

	ctor: function (cfg) {
		this._cbBtnL = null;
		this._cbBtnR = null;
		this._cbBtnC = null;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
	},

	init: function() {
		var json = ccs.load(res.dlgTipScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this._rootWidget.setLocalZOrder(1000);

		this.PanelBg = this._rootWidget.getChildByName('PanelBg');
		this.Panel = this._rootWidget.getChildByName('Panel');

		this._LabTitle = this.Panel.getChildByName('LabTitle');
		this._LabContent = this.Panel.getChildByName('LabContent');
		this._LabContent.string = "";

		this._BtnL = this.Panel.getChildByName('BtnL');
		//this._BtnL.setPressedActionEnabled(true);
		this._BtnL.addTouchEventListener(this.onClickBtnL, this);
		this._BtnL.setVisible(false);

		this._BtnR = this.Panel.getChildByName('BtnR');
		//this._BtnR.setPressedActionEnabled(true);
		this._BtnR.addTouchEventListener(this.onClickBtnR, this);
		this._BtnR.setVisible(false);

		this._BtnC = this.Panel.getChildByName('BtnC');
		//this._BtnC.setPressedActionEnabled(true);
		this._BtnC.addTouchEventListener(this.onClickBtnC, this);
		this._BtnC.setVisible(false);
	},
	
	showWaitTip: function(){
		var size = this.PanelBg.getSize();
		
		var json = ccs.load(res.waitNode_json);
		var widget = json.node;
		var action = json.action;
		widget.x = size.width / 2;
		widget.y = size.height / 2;
		this.PanelBg.addChild(widget);
		widget.runAction(action);
		action.gotoFrameAndPlay(0, 60, true);
		
		this.Panel.setVisible(false);
	},

	onClickBg: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var bVisibleBtnL = this._BtnL.isVisible();
			var bVisibleBtnR = this._BtnR.isVisible();

			if(!bVisibleBtnL && !bVisibleBtnR){
				this.closeTip();
			}
		}
	},

	onClickBtnL: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			if(this._cbBtnL && typeof(this._cbBtnL) == "function"){
				this._cbBtnL(this);
			}else{
				this.closeTip();
			}
		}
	},

	onClickBtnR: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			if(this._cbBtnR && typeof(this._cbBtnR) == "function"){
				this._cbBtnR(this);
			}else{
				this.closeTip();
			}
		}
	},

	onClickBtnC: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			if(this._cbBtnC && typeof(this._cbBtnC) == "function"){
				this._cbBtnC(this);
			}else{
				this.closeTip();
			}
		}
	},

	closeTip: function(){
		this._rootWidget.removeFromParent(true);
	},

	//提示界面大小
	setShowSize: function(size){
		this.Panel.setSize(size);
		
		ccui.helper.doLayout(this._rootWidget);
	},

	//标题
	setTitle: function(strTitle){
		this._LabTitle.string = strTitle;
	},
	setTitleColor: function(color){
		this._LabTitle.setColor(color);
	},
	setTitleFontSize: function(fontSize){
		this._LabTitle.fontSize = fontSize;
	},

	//提示内容
	setContent: function(strContent){
		var strTip = "";

		if(cc.sys.os != cc.sys.OS_ANDROID){
			strTip += "      ";
		}

		strTip += strContent;

		this._LabContent.string = strTip;
	},
	setContentColor: function(color){
		this._LabContent.setColor(color);
	},
	setContentFontSize: function(fontSize){
		this._LabContent.fontSize = fontSize;
	},

	//按钮
	setEnabledBtnL: function(bEnable){
		this._BtnL.setEnabled(bEnable);
		this._BtnL.setVisible(bEnable);
	},
	setEnabledBtnR: function(bEnable){
		this._BtnR.setEnabled(bEnable);
		this._BtnR.setVisible(bEnable);
	},
	setEnabledBtnC: function(bEnable){
		this._BtnC.setEnabled(bEnable);
		this._BtnC.setVisible(bEnable);
	},
	setBtnL: function(normal, selected, disabled, texType){
		this._BtnL.loadTextures(normal, selected, disabled, texType);
	},
	setBtnR: function(normal, selected, disabled, texType){
		this._BtnR.loadTextures(normal, selected, disabled, texType);
	},
	setBtnC: function(normal, selected, disabled, texType){
		this._BtnC.loadTextures(normal, selected, disabled, texType);
	},
	setCallBackL: function(cb){
		this._cbBtnL = cb;
	},
	setCallBackR: function(cb){
		this._cbBtnR = cb;
	},
	setCallBackC: function(cb){
		this._cbBtnC = cb;
	},
});

/*
配置提示界面：
cfg = {
	size: cc.size(520, 320),
	title: "系统提示",
	titleColor: cc.color(255, 255, 255),
	titleSize: 36,
	content: "系统提示！",
	contentColor: cc.color(255, 255, 255),
	contentSize: 24,
	btnL_Enable: false,
	btnL_cb: function(target){target.closeTip();},
	btnR_Enable: false,
	btnR_cb: function(target){target.closeTip();},
	btnC_Enable: false,
	btnC_cb: function(target){target.closeTip();},
	texturesBtnL: ["xx.png", "xx.png", "xx.png", ccui.Widget.PLIST_TEXTURE],
	texturesBtnR: ["xx.png", "xx.png", "xx.png", ccui.Widget.PLIST_TEXTURE],
	texturesBtnC: ["xx.png", "xx.png", "xx.png", ccui.Widget.PLIST_TEXTURE],
}
 */
DlgTip.openTip = function(cfg, cb){
	var dlg = new DlgTip();
	dlg.onCreate();

	//提示界面大小
	if(cfg.size){
		dlg.setShowSize(cfg.size);
	}

	//标题
	if(cfg.title){
		dlg.setTitle(cfg.title);
	}

	if(cfg.titleColor){
		dlg.setTitleColor(cfg.titleColor);
	}

	if(cfg.titleSize){
		dlg.setTitleFontSize(cfg.titleSize);
	}

	//提示内容
	if(cfg.content){
		dlg.setContent(cfg.content);
	}

	if(cfg.contentColor){
		dlg.setContentColor(cfg.contentColor);
	}

	if(cfg.contentSize){
		dlg.setContentFontSize(cfg.contentSize);
	}

	//按钮
	if(cfg.btnL_Enable){
		dlg.setEnabledBtnL(cfg.btnL_Enable);
	}

	if(cfg.btnR_Enable){
		dlg.setEnabledBtnR(cfg.btnR_Enable);
	}

	if(cfg.btnC_Enable){
		dlg.setEnabledBtnC(cfg.btnC_Enable);
	}

	if(cfg.btnL_cb){
		dlg.setCallBackL(cfg.btnL_cb);
	}

	if(cfg.btnR_cb){
		dlg.setCallBackR(cfg.btnR_cb);
	}

	if(cfg.btnC_cb){
		dlg.setCallBackC(cfg.btnC_cb);
	}
	
	if(cb){
		dlg.setCallBackR(cb);
		dlg.setCallBackC(cb);
	}

	if(cfg.texturesBtnL){
		dlg.setBtnL(cfg.texturesBtnL[0], cfg.texturesBtnL[1], cfg.texturesBtnL[2], cfg.texturesBtnL[3]);
	}

	if(cfg.texturesBtnR){
		dlg.setBtnR(cfg.texturesBtnR[0], cfg.texturesBtnR[1], cfg.texturesBtnR[2], cfg.texturesBtnR[3]);
	}

	if(cfg.texturesBtnC){
		dlg.setBtnC(cfg.texturesBtnC[0], cfg.texturesBtnC[1], cfg.texturesBtnC[2], cfg.texturesBtnC[3]);
	}
	
	if(cfg.StrBtnL){
		dlg.setBtnL(cfg.texturesBtnL[0], cfg.texturesBtnL[1], cfg.texturesBtnL[2], cfg.texturesBtnL[3]);
	}

	if(cfg.StrBtnR){
		dlg.setBtnR(cfg.texturesBtnR[0], cfg.texturesBtnR[1], cfg.texturesBtnR[2], cfg.texturesBtnR[3]);
	}

	if(cfg.StrBtnC){
		dlg.setBtnC(cfg.texturesBtnC[0], cfg.texturesBtnC[1], cfg.texturesBtnC[2], cfg.texturesBtnC[3]);
	}

	UIMgr.getInstance()._uiLayer.addChild(dlg._rootWidget);

	return dlg;
};

DlgTip.openSysTip = function(str, cb){
	var cfg = {
			size: cc.size(520, 320),
			title: "系统提示",
			//titleColor: cc.color(255, 255, 255),
			titleSize: 36,
			content: str,
			//contentColor: cc.color(255, 255, 255),
			contentSize: 24,
			btnL_Enable: false,
			btnL_cb: function(target){target.closeTip();},
			btnR_Enable: false,
			btnR_cb: function(target){target.closeTip();},
			btnC_Enable: true,
			btnC_cb: function(target){target.closeTip();},
	};

	if(cb){
		cfg.btnC_cb = cb;
	}

	var dlg = DlgTip.openTip(cfg);

	return dlg;
};

DlgTip.openGameTip = function(title, str, rcb, cb){
	var cfg = {
			size: cc.size(520, 320),
			title: title,
			//titleColor: cc.color(255, 255, 255),
			titleSize: 32,
			content: str,
			//contentColor: cc.color(255, 255, 255),
			contentSize: 24,
			btnL_Enable: false,
			btnL_cb: function(target){target.closeTip();},
			btnR_Enable: false,
			btnR_cb: function(target){target.closeTip();},
			btnC_Enable: false,
			btnC_cb: function(target){target.closeTip();},
	};
	if(rcb){
		cfg.btnR_cb = function(target){
				rcb();
				target.closeTip();
			};
		cfg.btnR_Enable = true;
		cfg.btnL_Enable = true;
	}
	else if(cb){
		cfg.btnC_cb = function(target){
			cb();
			target.closeTip();
		};
		cfg.btnC_Enable = true;
	}

	var dlg = DlgTip.openTip(cfg);

	return dlg;
};

DlgTip.openWaitTip = function(){
	var dlg = new DlgTip();
	dlg.onCreate();
	dlg.showWaitTip();
	return dlg;
};

