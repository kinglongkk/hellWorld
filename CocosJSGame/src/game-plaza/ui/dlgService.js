

DLG_CREATOR[ID_DlgService] = function() {
	return new DlgService();
};

var DlgService = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgServiceScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		
		this.TextDescribe_0 = this.ImgBg.getChildByName('TextDescribe_0');
		//6条提示
		this.TextDescribe_1 = this.ImgBg.getChildByName('TextDescribe_1');
		this.TextDescribe_2 = this.ImgBg.getChildByName('TextDescribe_2');
		this.TextDescribe_3 = this.ImgBg.getChildByName('TextDescribe_3');
		this.TextDescribe_4 = this.ImgBg.getChildByName('TextDescribe_4');
		this.TextDescribe_5 = this.ImgBg.getChildByName('TextDescribe_5');
		this.TextDescribe_6 = this.ImgBg.getChildByName('TextDescribe_6');
		
		this.TextDescribe_7 = this.ImgBg.getChildByName('TextDescribe_7');
		this.TextDescribe_8 = this.ImgBg.getChildByName('TextDescribe_8');
		//电话
		this.TextPhone = this.ImgBg.getChildByName('TextPhone');
		this.TextPhone.string = _CONFIG_.CONTACT_PHONE;
		
		//不显示
		this.TextDescribe_7.setVisible(false);
		this.TextDescribe_8.setVisible(false);
		this.TextPhone.setVisible(false);
		
		this.addActionNodeMB(this.ImgBg);
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgService);
				break;
			default:
				break;
			}
		}
	},
});
