DLG_CREATOR[ID_DlgCNPokeBegin] = function() {
	return new DlgCNPokeBegin();
};

var DlgCNPokeBegin = DlgBase.extend({
	ctor: function () {
		
	},

	onCreate: function() {
		this.init();

	},

	onClose: function() {

	},

	init: function(){
		
		cc.spriteFrameCache.addSpriteFrames(res.dlgCNPoke_plist);
		var json = ccs.load(res.dlgCNPokeBegin_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);	

		this.Panel_NPlayer = this._rootWidget.getChildByName('Panel_NPlayer');

		this.Button_Invfriend = this.Panel_NPlayer.getChildByName('Button_Invfriend');
		this.Button_Invfriend.addTouchEventListener(this.onClickBtnEvent, this);
		this.Button_Invfriend.setVisible(false);

		this.Button_dissroom = this.Panel_NPlayer.getChildByName('Button_dissroom');
		this.Button_dissroom.setVisible(false);
		
		this.Button_begin = this.Panel_NPlayer.getChildByName('Button_begin');
		this.Button_begin.addTouchEventListener(this.onClickBtnEvent, this);
		this.BeginPosX = this.Button_begin.x;
		this.BeginPosY  = this.Button_begin.y;
	},
	
	onSetInvfriendbtn:function(status){
		if(status!=null){
			this.Button_Invfriend.setVisible(status);
		}
	},
	//设置开始按钮位置
	setReadyButPos:function(status){
		if(status == null){
			this.Button_begin.x = this.BeginPosX;
			this.Button_begin.y = this.BeginPosY;
		}
		else{
			this.Button_begin.x = this.BeginPosX + 250;
			this.Button_begin.y = this.BeginPosY - 90;
		}
	},
	
	onClickBtnEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_begin":	
				if (ccui.Widget.TOUCH_ENDED == type) {
					SoundMgr.getInstance().playEffect("game_start", 0, false);
					var PlayerCN = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
					PlayerCN.PlayerReady[0].setVisible(false);
					PlayerCN.setPlayerReadystatus(0,true);
					PlayerCN.onResetPlayer();
					PlayerCN.resetHandCardOnPanelcardBox();
					PlayerCN.removeCardShow();
					nSssGameModel.gameComping = false;
					GameFrameMsg.getInstance().sendReady();
					g_objHero.setStatus(US_READY);

					UIMgr.getInstance().closeDlg(ID_DlgCNPokeBegin);
				}
				break;
			case "Button_dissroom":
				if (ccui.Widget.TOUCH_ENDED == type) {
					OpenRoomMsg.getInstance().sendCancelRoom();
				}
				break;
			case "Button_Invfriend":
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
				break;
			default:
				break;
			}
		}
	},
});
