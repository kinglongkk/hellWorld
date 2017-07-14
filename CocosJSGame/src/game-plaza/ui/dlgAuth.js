

DLG_CREATOR[ID_DlgAuth] = function() {
	return new DlgAuth();
};

var DlgAuth = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgAuthScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);

		this.EditName = this.ImgBg.getChildByName('EditName');
		this.EditName.addEventListener(this.editNameEvent,this);

		this.EditId = this.ImgBg.getChildByName('EditId');
		this.EditId.addEventListener(this.editIdEvent,this);
		
		this.BtnBind = this.ImgBg.getChildByName('BtnBind');
		this.BtnBind.addTouchEventListener(this.onClickEvent, this);
		
		this.addActionNodeMB(this.ImgBg);
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgAuth);
				break;
			case "BtnBind":
				var name = this.EditName.string;
				var id = this.EditId.string;
				if(!name || !id){
					DlgTip.openSysTip("身份验证信息不能为空！");
				}else{
					LogonMsgHandler.getInstance().connect(function(){
						UserServerMsg.getInstance().sendModifyAuth(name, id);
					});
				}
				break;
			default:
				break;
			}
		}
	},

	editNameEvent: function (sender, type) {
		switch (type) {
		case ccui.TextField.EVENT_ATTACH_WITH_IME:
			cc.log("editNameEvent: attach with IME");
			break;
		case ccui.TextField.EVENT_DETACH_WITH_IME:
			cc.log("editNameEvent: detach with IME");
			break;
		case ccui.TextField.EVENT_INSERT_TEXT:
			cc.log("editNameEvent: insert words");
			break;
		case ccui.TextField.EVENT_DELETE_BACKWARD:
			cc.log("editNameEvent: delete word");
			break;
		default:
			break;
		}
	},

	editIdEvent: function (sender, type) {
		switch (type) {
		case ccui.TextField.EVENT_ATTACH_WITH_IME:
			cc.log("editIdEvent: attach with IME");
			break;
		case ccui.TextField.EVENT_DETACH_WITH_IME:
			cc.log("editIdEvent: detach with IME");
			break;
		case ccui.TextField.EVENT_INSERT_TEXT:
			cc.log("editIdEvent: insert words");
			break;
		case ccui.TextField.EVENT_DELETE_BACKWARD:
			cc.log("editIdEvent: delete word");
			break;
		default:
			break;
		}
	},

	
});