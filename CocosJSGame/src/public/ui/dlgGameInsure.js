
//var ID_DlgGameInsure = 4999;

DLG_CREATOR[ID_DlgGameInsure] = function() {
	return new DlgGameInsure();
};

var DlgGameInsure = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		this._rootWidget = ccs.uiReader.widgetFromJsonFile(res.dlgGameInsure_json);
		this._rootWidget.addTouchEventListener(this.onClickClose, this);

		this._rootWidget.setLocalZOrder(10);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');
		
		this.BtnUpdate = this.ImgBg.getChildByName('BtnUpdate');
		this.BtnUpdate.setPressedActionEnabled(true);
		this.BtnUpdate.addTouchEventListener(this.onClickUpdate, this);
		
		this.BtnTake = this.ImgBg.getChildByName('BtnTake');
		this.BtnTake.setPressedActionEnabled(true);
		this.BtnTake.addTouchEventListener(this.onClickTake, this);
		
		this.LabMoney = this.ImgBg.getChildByName('LabMoney');
		this.LabInsureMoney = this.ImgBg.getChildByName('LabInsureMoney');
		
		this.editMoney = this.ImgBg.getChildByName('editMoney');
		this.editMoney.addEventListener(this.editEvent,this);
		this.editPass = this.ImgBg.getChildByName('editPass');
		this.editPass.addEventListener(this.editEvent,this);
		
		this.sendQueryInsureInfo();
	},
	
	editEvent: function (sender, type) {
		switch (type) {
		case ccui.TextField.EVENT_ATTACH_WITH_IME:
			cc.log("attach with IME");
			UIMgr.getInstance().keyboardShow(this.ImgBg, sender);
			break;
		case ccui.TextField.EVENT_DETACH_WITH_IME:
			cc.log("detach with IME");
			UIMgr.getInstance().keyboardHide(this.ImgBg, sender);
			break;
		case ccui.TextField.EVENT_INSERT_TEXT:
			cc.log("insert words");
			break;
		case ccui.TextField.EVENT_DELETE_BACKWARD:
			cc.log("delete word");
			break;
		default:
			break;
		}
	},
	
	setScore: function(score, insureScore){
		this.LabMoney.string = score;
		this.LabInsureMoney.string = insureScore;
	},

	onClickClose: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			cc.log('onClickClose');

			UIMgr.getInstance().closeDlg(ID_DlgGameInsure);
		}
	},
	
	sendQueryInsureInfo: function(){
		GameUserInsureMsg.getInstance().sendQueryInsureInfo();
	},
	
	onClickUpdate: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			cc.log('onClickUpdate');

			this.sendQueryInsureInfo();
		}
	},
	
	onClickTake: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			cc.log('onClickTake');
			
			var score = this.editMoney.string;
			
			var password = this.editPass.string;
			var md5Pass = CryptoUtil.md5(password);

			GameUserInsureMsg.getInstance().sendUserTakeScore(score, md5Pass);
		}
	},
});