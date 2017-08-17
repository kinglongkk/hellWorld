

DLG_CREATOR[ID_DlgTimingGift] = function() {
	return new DlgTimingGift();
};

var DlgTimingGift = DlgBase.extend({
	ctor: function(){
		this._timingGiftId = 0;
		this._addScore = 0;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgTimingGift_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		
		this.LabTime_1 = this.ImgBg.getChildByName('LabTime_1');
		this.LabTime_2 = this.ImgBg.getChildByName('LabTime_2');
		this.LabGold = this.ImgBg.getChildByName('LabGold');

		this.BtnOk = this.ImgBg.getChildByName('BtnOk');
		this.BtnOk.addTouchEventListener(this.onClickEvent, this);

		this.addActionNodeMB(this.ImgBg);
	},
	
	setTimingGiftInfo: function(info){
		this._timingGiftId = info.dwTimingId;
		this._addScore = info.dwAddScore;
		
		this.LabGold.string = '+' + info.dwAddScore;
		
		var timingGiftInfo = ClientData.getInstance().getTimingGiftInfo();
		var strTime_1 = timingGiftInfo.getStrTimeById(info.dwTimingId);
		this.LabTime_1.string = strTime_1;
		
		var strTime_2 = '';
		if(info.dwTimingId == 3){
			strTime_2 = '今日已领完！';
		}
		var id = info.dwTimingId + 1;
		strTime_2 = timingGiftInfo.getStrTimeById(id);
		this.LabTime_2.string = strTime_2;
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgTimingGift);
				break;
			case "BtnOk":
				var self = this;
				//领取
				LogonMsgHandler.getInstance().connect(function(){
					UserServerMsg.getInstance().sendGetTimingGift(self._timingGiftId, self._addScore);
				});
				
				UIMgr.getInstance().closeDlg(ID_DlgTimingGift);
				break;
			default:
				break;
			}
		}
	},
});