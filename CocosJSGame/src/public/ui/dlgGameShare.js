
DLG_CREATOR[ID_DlgGameShare] = function() {
	return new DlgGameShare();
};

var DlgGameShare = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgShareScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this.Panel_root = this._rootWidget.getChildByName('Panel_root');
		
		this.Panel_root.addTouchEventListener(this.onClickClose, this);
		var Button_close = this.Panel_root.getChildByName('Button_close');
		Button_close.addTouchEventListener(this.onClickClose, this);
		
		var Button_shareFriendZone = this.Panel_root.getChildByName('Button_shareFriendZone');
		Button_shareFriendZone.addTouchEventListener(this.onClickToShare, this);
		
		var Button_shareFriend = this.Panel_root.getChildByName('Button_shareFriend');
		Button_shareFriend.addTouchEventListener(this.onClickToShare, this);

		this._rootWidget.setLocalZOrder(50);
	},
	
	shareSet: function(shareType, shareCB, title, description, url){
		this.shareType = shareType || WXShare.SHARE_TYPE_NOMAL;
		this.shareCB = shareCB;
		this.url = url;
		this.title = title;
		this.description = description;
	},

	onClickToShare: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var senderName = sender.getName();
			if(senderName=="Button_shareFriend"){
				//分享给好友
				var target = WXShare.SHARE_TARGET_FRIEND;
				if(this.shareType==WXShare.SHARE_TYPE_CAPTURESCREEN){
                    var self = this;
                    var seq = cc.sequence(
                        cc.delayTime(0.01),
                        cc.CallFunc(function(){
                            WXShare.getInstance().shareCaptureScreen(target, function(){
                                WXShare.getInstance().showSysTip("---分享成功---");
                                self.Panel_root.setVisible(true);
                                if(self.shareCB)
                                    self.shareCB();
                            });
                        }, this)
                    );
                    this.Panel_root.setVisible(false);
                    this.Panel_root.runAction(seq);
				}
				else{
                    var url = this.url || (_CONFIG_.URL_PART1_INVITE+g_objHero.getUserId()+"-"+"room-"+g_objHero.getRoomID()+_CONFIG_.URL_PART2);
                    var title = this.title || ("麻雀家乡，玩你所享！");
                    var description = this.description || "全国人民都在玩的神秘游戏，女人对它着迷，男人对它疯狂，就差你啦！快来玩吧！";
                    WXShare.getInstance().shareURL(target, url, title, description,function(){
                        cc.log("----分享成功---");
                        WXShare.getInstance().showSysTip("---分享成功---");
                        if(this.shareCB)
                            this.shareCB();
                    });
				}
			}
			else{
				//分享到朋友圈
				var target = WXShare.SHARE_TARGET_CIRCLE;

                if(this.shareType==WXShare.SHARE_TYPE_CAPTURESCREEN){
                    var self = this;
                    var seq = cc.sequence(
                        cc.delayTime(0.01),
                        cc.CallFunc(function(){
                            WXShare.getInstance().shareCaptureScreen(target, function(){
                                WXShare.getInstance().showSysTip("---分享成功---");
                                self.Panel_root.setVisible(true);
                                if(self.shareCB)
                                    self.shareCB();
                            });
                        }, this)
                    );
                    this.Panel_root.setVisible(false);
                    this.Panel_root.runAction(seq);
                }
                else{
                    var url = this.url || (_CONFIG_.URL_PART1_INVITE+g_objHero.getUserId()+"-"+"room-"+g_objHero.getRoomID()+_CONFIG_.URL_PART2);
                    var title = this.title || ("麻雀家乡，玩你所享！");
                    //var description = this.description || ("老牌友在等你（房号："+g_objHero.getRoomID()+"），点击立即加入，一起搓个天昏地暗！");
                    var description = this.description || "全国人民都在玩的神秘游戏，女人对它着迷，男人对它疯狂，就差你啦！快来玩吧！";
					WXShare.getInstance().shareURL(target, url, title, description,function(){
                        cc.log("----分享成功---");
                        WXShare.getInstance().showSysTip("---分享成功---");
                        if(this.shareCB)
                            this.shareCB();
                    });
				}
			}
			
		}
	},
	
	onClickClose: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			UIMgr.getInstance().closeDlg(ID_DlgGameShare);
		}
	}
	
});