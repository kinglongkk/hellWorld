

DLG_CREATOR[ID_DlgExAward] = function() {
	return new DlgExAward();
};

var DlgExAward = DlgBase.extend({
	ctor: function(){
		this._exAwardInfo = null;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgExAward_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		
		this.ImgPic = this.ImgBg.getChildByName('ImgPic');
		this.LabName = this.ImgBg.getChildByName('LabName');
		this.LabTicket = this.ImgBg.getChildByName('LabTicket');

		this.BtnOK = this.ImgBg.getChildByName('BtnOK');
		this.BtnOK.addTouchEventListener(this.onClickEvent, this);

		this.addActionNodeMB(this.ImgBg);
	},
	
	setExAwardInfo: function(info){
		this._exAwardInfo = info;
		
		var id = info['id'];
		//this.ImgPic
		
		var strTitle = info['PrizeTile'];
		this.LabName.string = strTitle;
		
		var strPrice = info['PrizeValue'] + '张';
		this.LabTicket.string = strPrice;
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgExAward);
				break;
			case "BtnOK":
				if(this._exAwardInfo){
					var exAwardId = this._exAwardInfo['id'];
					var exAwardPrice = this._exAwardInfo['PrizeValue'];
					ExAwardHttp.getInstance().requestExchange(exAwardId, exAwardPrice);
				}
				
				UIMgr.getInstance().closeDlg(ID_DlgExAward);
				break;
			default:
				break;
			}
		}
	},
});