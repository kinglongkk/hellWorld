

DLG_CREATOR[ID_DlgTimingGiftList] = function() {
	return new DlgTimingGiftList();
};

var DlgTimingGiftList = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgTimingGiftList_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		
		this.LabMaxGold = this.ImgBg.getChildByName('LabMaxGold');
		this.LabTime_0 = this.ImgBg.getChildByName('LabTime_0');
		this.LabTime_1 = this.ImgBg.getChildByName('LabTime_1');
		this.LabTime_2 = this.ImgBg.getChildByName('LabTime_2');
		
		this.LabState_0 = this.ImgBg.getChildByName('LabState_0');
		this.LabState_1 = this.ImgBg.getChildByName('LabState_1');
		this.LabState_2 = this.ImgBg.getChildByName('LabState_2');

		this.BtnOk = this.ImgBg.getChildByName('BtnOk');
		this.BtnOk.addTouchEventListener(this.onClickEvent, this);
		
		this.updateDlg();

		this.addActionNodeMB(this.ImgBg);
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
			case "BtnOk":
				UIMgr.getInstance().closeDlg(ID_DlgTimingGiftList);
				break;
			default:
				break;
			}
		}
	},
	
	updateDlg: function(){
		var timingGiftInfo = ClientData.getInstance().getTimingGiftInfo();
		var addScore_1 = timingGiftInfo.getAddScoreById(1);
		var addScore_2 = timingGiftInfo.getAddScoreById(2);
		var addScore_3 = timingGiftInfo.getAddScoreById(3);
		var maxGold = addScore_1;
		
		if(addScore_2 > maxGold){
			maxGold = addScore_2;
		}
		
		if(addScore_3 > maxGold){
			maxGold = addScore_3;
		}
		
		var strMaxGold = maxGold + '金币';
		this.LabMaxGold.string = strMaxGold;
		
		var strTime_1 = timingGiftInfo.getStrTimeById(1);
		var strTime_2 = timingGiftInfo.getStrTimeById(2);
		var strTime_3 = timingGiftInfo.getStrTimeById(3);
		
		this.LabTime_0.string = strTime_1;
		this.LabTime_1.string = strTime_2;
		this.LabTime_2.string = strTime_3;
		
		var state_1 = timingGiftInfo.getState(1);
		var state_2 = timingGiftInfo.getState(2);
		var state_3 = timingGiftInfo.getState(3);
		
		var strState_1 = '未领取';
		var strState_2 = '未领取';
		var strState_3 = '未领取';
		
		if(state_1 != 0){
			strState_1 = '已领取';
		}
		
		if(state_2 != 0){
			strState_2 = '已领取';
		}
		
		if(state_3 != 0){
			strState_3 = '已领取';
		}
		
		this.LabState_0.string = strState_1;
		this.LabState_1.string = strState_2;
		this.LabState_2.string = strState_3;
	},
});