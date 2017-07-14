

DLG_CREATOR[ID_DlgBind] = function() {
	return new DlgBind();
};

var DlgBind = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
		
		this.bGetVerifyCode = false; //获得验证码
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgBindScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);

		this.PanelBind = this.ImgBg.getChildByName('PanelBind');
		this.PanelBind.setVisible(true);

		this.EditMobile = this.PanelBind.getChildByName('EditMobile');
		this.EditMobile.addEventListener(this.editMobileEvent,this);

		this.EditVerify = this.PanelBind.getChildByName('EditVerify');
		this.EditVerify.addEventListener(this.editVerifyEvent,this);

		this.BtnVerify = this.PanelBind.getChildByName('BtnVerify');
		this.BtnVerify.addTouchEventListener(this.onClickEvent, this);

		this.LabVerify = this.PanelBind.getChildByName('LabVerify');
		this.LabVerify.setVisible(false);
		
		this.BtnBind = this.PanelBind.getChildByName('BtnBind');
		this.BtnBind.addTouchEventListener(this.onClickEvent, this);

		this.PanelBindSucc = this.ImgBg.getChildByName('PanelBindSucc');
		this.LabBindMb = this.PanelBindSucc.getChildByName('LabBindMb');
		this.PanelBindSucc.setVisible(false);
		
		this.addActionNodeMB(this.ImgBg);

		this.updateDlg();
	},

	updateDlg: function(){
		var strMb = g_objHero.getBindMb();
		if(strMb){
			this.bindSucc(strMb);
		}else{
			this.PanelBind.setVisible(true);
			this.PanelBindSucc.setVisible(false);
		}
	},

	setGetVerifyCode: function(){
		this.bGetVerifyCode = true;//获得验证码
	},

	//绑定成功
	bindSucc: function(strMb){
		this.PanelBind.setVisible(false);
		this.PanelBindSucc.setVisible(true);
		this.LabBindMb.string = strMb;
	},

	checkMbEdit: function(){
		var strMb = this.EditMobile.string;

		if(strMb === ""){
			DlgTip.openSysTip("手机号码不能为空，请输入11位手机号码！");
			return false;
		}

		var regExp = new RegExp("^1[0-9]{10}$");
		if(!regExp.test(strMb)){
			DlgTip.openSysTip("手机号码输入有误，请输入11位手机号！！");
			return false;
		}
		
		return true;
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgBind);
				break;
			case "BtnVerify":
				if(!this.checkMbEdit()){
					return;
				}

				var mobile = this.EditMobile.string;
				LogonMsgHandler.getInstance().connect(function(){
					UserServerMsg.getInstance().sendGetMbValidate(mobile, function(){
						var dlgBind = UIMgr.getInstance().getDlg(ID_DlgBind);
						if(dlgBind){
							dlgBind.setGetVerifyCode();
						}
					});
				});

				this.LabVerify.string = "5秒后重试";
				this.LabVerify.setVisible(true);
				this.BtnVerify.setVisible(false);
				var time = 5;
				var self = this;
				var funTime = function(){
					time--;
					if(time <= 0){
						self.LabVerify.setVisible(false);
						self.BtnVerify.setVisible(true);
					}else{
						self.LabVerify.setVisible(true);
						self.BtnVerify.setVisible(false);
						var strTime = time + "秒后重试";
						self.LabVerify.string = strTime;
					}
				};
				var actions = [];
				for(var i=0; i<5; i++){
					actions.push(cc.delayTime(1));
					actions.push(cc.callFunc(funTime, this));
				}
				this.LabVerify.runAction(cc.sequence(actions));
				break;
			case "BtnBind":
				if(this.bGetVerifyCode){
					var mobile = this.EditMobile.string;
					var verify = this.EditVerify.string;
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().sendBindMb(mobile, verify, function(strMb){
							var dlgBind = UIMgr.getInstance().getDlg(ID_DlgBind);
							if(dlgBind){
								g_objHero.setBindMb(strMb);
								dlgBind.bindSucc(strMb);
							}
						});
					});
				}else{
					DlgTip.openSysTip("请点击【验证】按钮，获取短信验证码！发送请求后，请耐心等待！");
				}
				
				break;
			default:
				break;
			}
		}
	},

	editMobileEvent: function (sender, type) {
		switch (type) {
		case ccui.TextField.EVENT_ATTACH_WITH_IME:
			cc.log("editMobileEvent: attach with IME");
			break;
		case ccui.TextField.EVENT_DETACH_WITH_IME:
			cc.log("editMobileEvent: detach with IME");
			break;
		case ccui.TextField.EVENT_INSERT_TEXT:
			cc.log("editMobileEvent: insert words");
			break;
		case ccui.TextField.EVENT_DELETE_BACKWARD:
			cc.log("editMobileEvent: delete word");
			break;
		default:
			break;
		}
	},

	editVerifyEvent: function (sender, type) {
		switch (type) {
		case ccui.TextField.EVENT_ATTACH_WITH_IME:
			cc.log("editVerifyEvent: attach with IME");
			break;
		case ccui.TextField.EVENT_DETACH_WITH_IME:
			cc.log("editVerifyEvent: detach with IME");
			break;
		case ccui.TextField.EVENT_INSERT_TEXT:
			cc.log("editVerifyEvent: insert words");
			break;
		case ccui.TextField.EVENT_DELETE_BACKWARD:
			cc.log("editVerifyEvent: delete word");
			break;
		default:
			break;
		}
	},


});