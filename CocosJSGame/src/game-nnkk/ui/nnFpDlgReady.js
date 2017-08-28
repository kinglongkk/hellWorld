/*
* 准备按钮
* */
DLG_CREATOR[ID_NnFpDlgReady] = function() {
	return new NnFpDlgReady();
};

var NnFpDlgReady = DlgBase.extend({
	ctor: function(){
		this.time = 0;
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {},

	init: function() {
		var json = ccs.load(res.dlgNnFpReady_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		//绝对布局
		this.PanelReady = this._rootWidget.getChildByName('PanelReady');

/*		this.BtnCancel = this.PanelReady.getChildByName('BtnCancel');
        this.BtnCancel.setVisible(false);
        this.BtnCancel.setPressedActionEnabled(true);
        this.BtnCancel.addTouchEventListener(this.onClickCancel, this);*/
		
		this.BtnStart = this.PanelReady.getChildByName('BtnStart');
		this.BtnStart.setPressedActionEnabled(true);
		this.BtnStart.addTouchEventListener(this.onClickReady, this);

		this.BtnInvite = this.PanelReady.getChildByName("BtnInviteFriend");
		this.BtnInvite.setVisible(true);
		this.BtnInvite.setPressedActionEnabled(true);
		this.BtnInvite.addTouchEventListener(this.onClickInviteFriend, this);

        this._rootWidget.schedule(this.update.bind(this));

	},

	setReadBtbPosition: function () {
		this.setInviteFriend(false);
        this.BtnStart.setPositionX(cc.winSize.width * 72 / 100);
        this.BtnInvite.setPositionX(cc.winSize.width * 72 / 100);
    },

	onClickChangeTable: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED === type) {
			GameKindMgr.getInstance().getGameUIMgr().changeTable();
			UIMgr.getInstance().closeDlg(ID_NnFpDlgReady);
		}
	},

/*    onClickCancel: function () {
        if (ccui.Widget.TOUCH_ENDED === type) {
            // SoundMgr.getInstance().playEffect("game_start", 0, false);

            if (g_gameSocket.status === SOCKET_STATUS._SS_CONNECTED) {
                GameFrameMsg.getInstance().nntbSendReady(US_SIT);
                //设置按钮的显示隐藏
                // UIMgr.getInstance().closeDlg(ID_NnFpDlgReady);
                this.showBtn(false);
            }
        }
    },*/
	
	onClickReady: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED === type) {
			SoundMgr.getInstance().playEffect("game_start", 0, false);

            if (g_gameSocket.status === SOCKET_STATUS._SS_CONNECTED) {
                GameFrameMsg.getInstance().nntbSendReady(US_READY);
                UIMgr.getInstance().closeDlg(ID_NnFpDlgReady);
                // this.showBtn(true);
            }
		}
	},

	// 解散房间
	onClickBreakRoom: function (sender, type) {
		if (ccui.Widget.TOUCH_ENDED === type) {
			//添加用户主动解散房间标志
			var game = ClientData.getInstance().getGame();
			if (game.setCancelRoomSign) game.setCancelRoomSign(true);
            DlgTip.openGameTip("解散房间","是否强行解散房间！", function(){
                OpenRoomMsg.getInstance().sendDissumeTalbe();
            });
        }
    },

	// 邀请朋友
	onClickInviteFriend: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED === type) {
            var target = WXShare.SHARE_TARGET_FRIEND;
            var url = _CONFIG_.URL_PART1_INVITE+g_objHero.getUserId()+"-"+"room-"+g_objHero.getRoomID()+_CONFIG_.URL_PART2;
            var title = "一起搓几局，麻雀家乡见！";
            var description = "老牌友在等你（房号："+g_objHero.getRoomID()+"），点击立即加入，一起搓个天昏地暗！";
            WXShare.getInstance().shareURL(target, url, title, description,function(){
                cc.log("----邀请成功---");
                WXShare.getInstance().showSysTip("---邀请成功---");
            });
        }
    },
	//邀请好友在房间满员时不显示
    setInviteFriend: function (isShow) {
        this.BtnInvite.setVisible(isShow);
    },

	showBtn: function (isShow) {
        this.BtnCancel.setVisible(isShow);
        this.BtnStart.setVisible(!isShow);
    },

    update: function (dt) {
		this.time += dt;
		if (this.time > 3) {
            var table = ClientData.getInstance().getTable();
            if (table && table.getPlayers().length > 3) this.setInviteFriend(false);
            else this.setInviteFriend(true);
			this.time = 0;
		}
    }
});