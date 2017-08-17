
//var ID_DlgGiveMoneyResult = 1009;

DLG_CREATOR[ID_DlgGiveMoneyResult] = function() {
	return new DlgGiveMoneyResult();
};

var DlgGiveMoneyResult = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		this._rootWidget = ccs.uiReader.widgetFromJsonFile(res.dlgGiveMoneyResult_json);
		this._rootWidget.addTouchEventListener(this.onClickClose, this);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.LabRecordId = this.ImgBg.getChildByName('LabRecordId');
		this.LabSourceNick = this.ImgBg.getChildByName('LabSourceNick');
		this.LabSourceId = this.ImgBg.getChildByName('LabSourceId');
		this.LabTargetNick = this.ImgBg.getChildByName('LabTargetNick');
		this.LabTargetId = this.ImgBg.getChildByName('LabTargetId');
		this.LabScore = this.ImgBg.getChildByName('LabScore');
		this.LabStrMoney = this.ImgBg.getChildByName('LabStrMoney');
		this.LabDate = this.ImgBg.getChildByName('LabDate');
	},

	setRecordId: function(value){
		this.LabRecordId.string = value;
	},
	setSourceNick: function(value){
		this.LabSourceNick.string = value;
	},
	setSourceId: function(value){
		this.LabSourceId.string = value;
	},
	setTargetNick: function(value){
		this.LabTargetNick.string = value;
	},
	setTargetId: function(value){
		this.LabTargetId.string = value;
	},
	setScore: function(value){
		this.LabScore.string = value;
	},
	setStrMoney: function(value){
		this.LabStrMoney.string = value;
	},
	setDate: function(value){
		this.LabDate.string = value;
	},

	onClickClose: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			UIMgr.getInstance().closeDlg(ID_DlgGiveMoneyResult);
		}
	},
});