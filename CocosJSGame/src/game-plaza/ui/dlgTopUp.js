

DLG_CREATOR[ID_DlgTopUp] = function() {
	return new DlgTopUp();
};

var DlgTopUp = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgTopUpScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ImgBg = this._rootWidget.getChildByName('ImgBg');

		this.BtnClose = this.ImgBg.getChildByName('BtnClose');
		this.BtnClose.setPressedActionEnabled(true);
		this.BtnClose.addTouchEventListener(this.onClickEvent, this);
		//微信支付
		this.BtnTopUpWx = this.ImgBg.getChildByName('BtnTopUpWx');
		this.BtnTopUpWx.setPressedActionEnabled(true);
		this.BtnTopUpWx.addTouchEventListener(this.onClickEvent, this);
		//支付宝支付
		this.BtnTopUpAlipay = this.ImgBg.getChildByName('BtnTopUpAlipay');
		this.BtnTopUpAlipay.setPressedActionEnabled(true);
		this.BtnTopUpAlipay.addTouchEventListener(this.onClickEvent, this);
		this.BtnTopUpAlipay.setVisible(false);
		//网银
		this.BtnTopUpBank = this.ImgBg.getChildByName('BtnTopUpBank');
		this.BtnTopUpBank.setPressedActionEnabled(true);
		this.BtnTopUpBank.addTouchEventListener(this.onClickEvent, this);
		this.BtnTopUpBank.setVisible(false);
		//卡密激活
		this.BtnTopUpCard = this.ImgBg.getChildByName('BtnTopUpCard');
		this.BtnTopUpCard.setPressedActionEnabled(true);
		this.BtnTopUpCard.addTouchEventListener(this.onClickEvent, this);
		this.BtnTopUpCard.setVisible(false);
		//更多
		this.BtnTopUpMore = this.ImgBg.getChildByName('BtnTopUpMore');
		this.BtnTopUpMore.setPressedActionEnabled(true);
		this.BtnTopUpMore.addTouchEventListener(this.onClickEvent, this);
		this.BtnTopUpMore.setVisible(false);
		this.addActionNodeMB(this.ImgBg);
	},

	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "BtnClose":
				UIMgr.getInstance().closeDlg(ID_DlgTopUp);
				break;
				//微信
			case "BtnTopUpWx":
				
				break;
			case "BtnTopUpAlipay":

				break;
			case "BtnTopUpBank":

				break;
			case "BtnTopUpCard":
				//UIMgr.getInstance().openDlg(ID_DlgPay);
				break;
			case "BtnTopUpMore":

				break;
			default:
				break;
			}
		}
	},
});
