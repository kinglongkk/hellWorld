DLG_CREATOR[ID_DlgNnFpAddChip] = function() {
	return new NnFpDlgAddChip();
};

var NnFpDlgAddChip = DlgBase.extend({
	ctor: function(){
		this.btn = [];
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {},

	init: function() {
		var json = ccs.load(res.nnFpAddChip_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

        this.Panel = this._rootWidget.getChildByName("Panel_RobBanker");
        for (var i = 0; i < this.Panel.children.length; i++) {
            this.btn[i] = this.Panel.getChildByName("Button_" + (i + 1));
            this.btn[i].addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    cc.log("这里是加注按钮");
                    cc.log(sender.getTag());
                    UIMgr.getInstance().closeDlg(ID_DlgNnFpAddChip);
                    //向服务端发送加注消息
                    // if (g_gameSocket.status === SOCKET_STATUS._SS_CONNECTED) {
                        NiuniuFPGameMsg.getInstance().addScore(sender.getTag());
                        UIMgr.getInstance().closeDlg(ID_DlgNnFpAddChip);
                        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                        if (dlg) {
                            var pos = NiuniuFPUIMgr.getInstance().getPlayerPosByChairId(g_objHero.getChairID());
                            dlg.showAddChipMultiple(pos, sender.getTag());
                        }
                    // }
                }
            });
        }

	}
});