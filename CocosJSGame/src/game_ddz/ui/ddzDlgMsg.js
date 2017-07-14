
DLG_CREATOR[ID_DdzDlgMsg] = function() {
	return new DdzDlgMsg();
};

var DdzDlgMsg = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgMsg_ddz_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

//		this.PanelOpen = this._rootWidget.getChildByName('PanelOpen');
//
//		this.BtnOpen = this.PanelOpen.getChildByName('BtnOpen');
//		this.BtnOpen.setPressedActionEnabled(true);
//		this.BtnOpen.addTouchEventListener(this.onClickOpenCard, this);
		 
	},

//	onClickOpenCard: function(sender, type) {
//		if (ccui.Widget.TOUCH_ENDED == type) {
//	 
//			var game = ClientData.getInstance().getGame();
//			var cardType = game.getCardTypeByChairId(g_objHero.getChairID());
//			var bOx = false;
//			if(cardType != NiuNiuTB.CardType.OX_VALUE0){
//				bOx = true;
//			}
//
//			var cardData = [0,0,0,0,0];
//			if (bOx) { 
//				cardData = game.getOxCardByChairId(g_objHero.getChairID());
//			} else {
//				cardData = game.getHandCardValues(g_objHero.getChairID());
//			};
//
//			NiuniuTBGameMsg.getInstance().sendOpenCard(bOx, cardData);
//
//			UIMgr.getInstance().closeDlg(ID_NnTbDlgOpen);
//		}
//	},
});