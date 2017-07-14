DLG_CREATOR[ID_NnFpDlgOpen] = function() {
	return new NnFpDlgOpen();
};

var NnFpDlgOpen = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {},

	init: function() {
		var json = ccs.load(res.dlgNnFpOpen_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.PanelOpen = this._rootWidget.getChildByName('PanelOpen');
		
		this.BtnOpen = this.PanelOpen.getChildByName('BtnOpen');
		this.BtnOpen.setPressedActionEnabled(true);
		this.BtnOpen.addTouchEventListener(this.onClickOpenCard, this);

		this.Btn_Warning = this.PanelOpen.getChildByName('Btn_Warning');
		this.Btn_Warning.setVisible(false);
		/*this.Btn_Warning.setPressedActionEnabled(false);
		this.Btn_Warning.addTouchEventListener(this.onClickOpenCard, this);*/
	},

	onClickOpenCard: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED === type) {
            var game = ClientData.getInstance().getGame();
            if (!game) return;
            var cardData = game.getResultCardsAndTypeByChairId(g_objHero.getChairID());
            cc.log("用户亮牌 给服务端的牌");
            cc.log(JSON.stringify(cardData, null, 2));

            // if (g_gameSocket.status === SOCKET_STATUS._SS_CONNECTED) {
                NiuniuFPGameMsg.getInstance().sendOpenCard(cardData);
                UIMgr.getInstance().closeDlg(ID_NnFpDlgOpen);
            // }
		}
	}
});