

DLG_CREATOR[ID_DlgModifyPass] = function() {
	return new DlgModifyPass();
};

var DlgModifyPass = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgModifyPassScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);

		this.EditScrPassword = this.ImgBg.getChildByName('EditScrPassword');
		this.EditScrPassword.addEventListener(this.editScrPasswordEvent,this);

		this.EditDesPassword = this.ImgBg.getChildByName('EditDesPassword');
		this.EditDesPassword.addEventListener(this.editDesPasswordEvent,this);

		this.BtnModifyPassword = this.ImgBg.getChildByName('BtnModifyPassword');
		this.BtnModifyPassword.addTouchEventListener(this.onClickEvent, this);
		
		this.addActionNodeMB(this.ImgBg);
	},

	checkModifyPassword: function(strOld, strNew){
		if(strOld === ""){
			DlgTip.openSysTip("请输入旧密码！");
			return false;
		}
		if(strNew === ""){
			DlgTip.openSysTip("请输入新密码！");
			return false;
		}

		if(strOld == strNew){
			DlgTip.openSysTip("您输入的新密码和原密码一致，请重新修改！");
			return false;
		}

		var regExp = new RegExp("^[a-zA-Z_0-9]{6,15}$");
		if(!regExp.test(strNew)){
			DlgTip.openSysTip("请输入6-15位字母、数字或下划线！");
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
				UIMgr.getInstance().closeDlg(ID_DlgModifyPass);
				break;
			case "BtnModifyPassword":
				var strDes = this.EditDesPassword.string;
				var strScr = this.EditScrPassword.string;
				var bCheck = this.checkModifyPassword(strScr, strDes);
				if(bCheck){
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().sendModifyPassword(strDes, strScr);
					});
				}
				break;
			default:
				break;
			}
		}
	},

	editScrPasswordEvent: function (sender, type) {
		switch (type) {
		case ccui.TextField.EVENT_ATTACH_WITH_IME:
			cc.log("editScrPasswordEvent: attach with IME");
			break;
		case ccui.TextField.EVENT_DETACH_WITH_IME:
			cc.log("editScrPasswordEvent: detach with IME");
			break;
		case ccui.TextField.EVENT_INSERT_TEXT:
			cc.log("editScrPasswordEvent: insert words");
			break;
		case ccui.TextField.EVENT_DELETE_BACKWARD:
			cc.log("editScrPasswordEvent: delete word");
			break;
		default:
			break;
		}
	},

	editDesPasswordEvent: function (sender, type) {
		switch (type) {
		case ccui.TextField.EVENT_ATTACH_WITH_IME:
			cc.log("editDesPasswordEvent: attach with IME");
			break;
		case ccui.TextField.EVENT_DETACH_WITH_IME:
			cc.log("editDesPasswordEvent: detach with IME");
			break;
		case ccui.TextField.EVENT_INSERT_TEXT:
			cc.log("editDesPasswordEvent: insert words");
			break;
		case ccui.TextField.EVENT_DELETE_BACKWARD:
			cc.log("editDesPasswordEvent: delete word");
			break;
		default:
			break;
		}
	},


});