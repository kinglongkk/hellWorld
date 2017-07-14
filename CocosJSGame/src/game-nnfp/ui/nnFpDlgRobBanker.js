DLG_CREATOR[ID_DlgNnFpRobBanker] = function() {
	return new NnFpDlgRobBanker();
};

var NnFpDlgRobBanker = DlgBase.extend({
	ctor: function(){
		this.btn = [];
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {},

	init: function() {
		var json = ccs.load(res.nnFpRobBanker_json);
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
					//显示自己抢庄图片
                	//向服务端发送抢庄消息
                    // if (g_gameSocket.status === SOCKET_STATUS._SS_CONNECTED) {
                    	cc.log("点击抢庄按钮倍数显示");
                    	cc.log(sender.getTag());
                        NiuniuFPGameMsg.getInstance().callScore(sender.getTag());
                        UIMgr.getInstance().closeDlg(ID_DlgNnFpRobBanker);
                        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                        if (dlg) {
                        	var pos = NiuniuFPUIMgr.getInstance().getPlayerPosByChairId(g_objHero.getChairID());
                        	dlg.showCallScore(pos, sender.getTag());
						}
                    // }
                }
            });
		}
	}
});