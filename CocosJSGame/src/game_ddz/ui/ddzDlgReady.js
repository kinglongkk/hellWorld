 

DLG_CREATOR[ID_DdzDlgReady] = function() {
	return new DdzDlgReady();
};

var DdzDlgReady = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		
		cc.log("斗地主，player加载");
		
	 	var json = ccs.load(res.dlgReady_ddz_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.ButtonInvfriend = this._rootWidget.getChildByName("Button_Invfriend");
		this.ButtonInvfriend.addTouchEventListener(this.onClickReady, this);
		
		this.Buttondissroom = this._rootWidget.getChildByName("Button_dissroom");
		this.Buttondissroom.addTouchEventListener(this.onOpendeal, this);
		
		this.Buttonbegin = this._rootWidget.getChildByName("Button_begin");
		this.Buttonbegin.addTouchEventListener(this.onClickInviteFriend, this);
//		//绝对布局
//		this.PanelReady = this._rootWidget.getChildByName('PanelReady');
//
//		this.BtnChangeTable = this.PanelReady.getChildByName('Button_Invfriend');
//		this.BtnChangeTable.setPressedActionEnabled(true);
//		this.BtnChangeTable.addTouchEventListener(this.onClickChangeTable, this);
//
//		this.BtnReady = this.PanelReady.getChildByName('BtnReady');
//		this.BtnReady.setPressedActionEnabled(true);
//		this.BtnReady.addTouchEventListener(this.onClickReady, this);
//		 
	},
	
	onClickReady: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			SoundMgr.getInstance().playEffect("game_start", 0, false);
			var game = ClientData.getInstance().getGame();
			var plaza = ClientData.getInstance().getPlaza();
			if (plaza && game) {
				var kindID = plaza.getCurKindID();
				if (kindID == CMD_DDZ.KIND_ID) {
					DdzUIMgr.getInstance().againGame();
				} else if (kindID == CMD_NIUNIU_TB.KIND_ID) {
					if (game.getPlayMode() == 0x10) {
						NiuniuTBUIMgr.getInstance().againGame();
					}
				}
			}
			UIMgr.getInstance().closeDlg(ID_DdzDlgReady);
			GameFrameMsg.getInstance().sendReady();
			
		}
	},
	onOpendeal:function(sender, type){
		if (ccui.Widget.TOUCH_ENDED == type) {
			SoundMgr.getInstance().playEffect("game_start", 0, false);
			var game = ClientData.getInstance().getGame();
			var plaza = ClientData.getInstance().getPlaza();
			if (plaza && game) {
				var kindID = plaza.getCurKindID();
				if (kindID == CMD_DDZ.KIND_ID) {
					DdzUIMgr.getInstance().againGame();
				} else if (kindID == CMD_NIUNIU_TB.KIND_ID) {
					if (game.getPlayMode() == 0x10) {
						NiuniuTBUIMgr.getInstance().againGame();
					}
				}
			}
			UIMgr.getInstance().closeDlg(ID_DdzDlgReady);
			GameFrameMsg.getInstance().sendReady();
		}
	},
	onClickInviteFriend: function (sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var target = WXShare.SHARE_TARGET_FRIEND;
			var url = _CONFIG_.URL_PART1_INVITE + _CONFIG_.WX_NINVITECHANNEL +g_objHero.getUserId()+"-"+"room-"+g_objHero.getRoomID()+_CONFIG_.URL_PART2;
			var title = "一起搓几局，麻雀家乡见！";
			var description = "老牌友在等你（房号："+g_objHero.getRoomID()+"），点击立即加入，一起搓个天昏地暗！";
			WXShare.getInstance().shareURL(target, url, title, description,function(){
				cc.log("----邀请成功---");
				WXShare.getInstance().showSysTip("---邀请成功---");
			});
		}
	},
	
//	onClickChangeTable: function(sender, type) {
//		if (ccui.Widget.TOUCH_ENDED == type) {
//			// cc.log('onClickChangeTable');
//			GameKindMgr.getInstance().getGameUIMgr().changeTable();
//
//			UIMgr.getInstance().closeDlg(ID_NnTbDlgReady);
//		}
//	},

//	onClickReady: function(sender, type) {
//		if (ccui.Widget.TOUCH_ENDED == type) {
//			// cc.log('onClickReady');
//			SoundMgr.getInstance().playEffect("game_start", 0, false);
//
//			GameFrameMsg.getInstance().sendReady();
//
//			this.BtnReady.setEnabled(false);
//			this.BtnReady.setVisible(false);
//		}
//	},
});