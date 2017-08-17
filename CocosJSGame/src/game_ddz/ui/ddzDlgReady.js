 

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

		//this.Buttondissroom = this._rootWidget.getChildByName("Button_dissroom");
		//this.Buttondissroom.setVisible(false);
		//this.Buttondissroom.addTouchEventListener(this.onOpendeal, this);
		
		this.Buttonbegin = this._rootWidget.getChildByName("Button_begin");
		this.Buttonbegin.addTouchEventListener(this.onClickInviteFriend, this);

		var table = ClientData.getInstance().getTable();
		var Number = table.getPlayers().length;
		this.setGameplayer(Number);
	},
	setGameplayer:function(Number){
		cc.log(Number+"人数");
		if(Number == 3){
			this.Buttonbegin.setVisible(false);
			this.ButtonInvfriend.x = 667;
		}else{
			this.Buttonbegin.setVisible(true);
		}
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
			//UIMgr.getInstance().closeDlg(ID_DdzDlgReady);
			GameFrameMsg.getInstance().sendReady();
			this.ButtonInvfriend.setVisible(false);
			this.Buttonbegin.x = 667;
			//this.Buttondissroom.setVisible(true);
		}
	},
	//onOpendeal:function(sender, type){
	//	if (ccui.Widget.TOUCH_ENDED == type) {
	//		DdzGameMsg.getInstance().sendDeals();
	//		this.Buttondissroom.setVisible(false);
	//	}
	//},
	onClickInviteFriend: function (sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var target = WXShare.SHARE_TARGET_FRIEND;
			var url = _CONFIG_.URL_PART1_INVITE+g_objHero.getUserId()+"-"+"room-"+g_objHero.getRoomID()+_CONFIG_.URL_PART2;
			var title = "一起搓几局，麻雀家乡见！";
			var description = "老牌友在等你（房号："+g_objHero.getRoomID()+"），点击立即加入，一起搓个天昏地暗！";
			WXShare.getInstance().shareURL(target, url, title, description,function(){
				cc.log("----邀请成功---");
				WXShare.getInstance().showSysTip("---邀请成功---");
			});
		}
	}
});