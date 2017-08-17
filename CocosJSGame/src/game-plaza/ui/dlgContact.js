
//var ID_DlgContact = 1005;

DLG_CREATOR[ID_DlgContact] = function() {
	return new DlgContact();
};

var DlgContact = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		this._rootWidget = ccs.uiReader.widgetFromJsonFile(res.help);
		this._rootWidget.addTouchEventListener(this.onClickClose, this);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');
		
		this.LabQQ = this.ImgBg.getChildByName('LabQQ');
		this.LabPhone = this.ImgBg.getChildByName('LabPhone');
		
		this.setContact();
	},

	setContact: function(){
		if(_CONFIG_){
			this.LabQQ.string = _CONFIG_.CONTACT_QQ;
			this.LabPhone.string = _CONFIG_.CONTACT_PHONE;
		}
	},

	onClickClose: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			UIMgr.getInstance().closeDlg(ID_DlgContact);
		}
	},
});
