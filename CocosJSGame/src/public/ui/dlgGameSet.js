
DLG_CREATOR[ID_DlgGameSet] = function() {
	return new DlgGameSet();
};

var DlgGameSet = DlgBase.extend({
	ctor: function(){},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgSetScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

        this.Panel_waitTip = this._rootWidget.getChildByName('Panel_waitTip');
		
		this.Panel_root = this._rootWidget.getChildByName('Panel_root');
		this.Panel_root.addTouchEventListener(this.onClickClose, this);
		var Button_close = this.Panel_root.getChildByName('Button_close');
		Button_close.addTouchEventListener(this.onClickClose, this);

        var runScene = cc.director.getRunningScene();
		var isGameSceneRunning = (runScene && runScene.isGameScene && runScene.isGameScene());
		var resFile = isGameSceneRunning?"default/dating0006b.png":"default/dating0006e.png";
        //游戏中
        var game = ClientData.getInstance().getGame();
        var table = ClientData.getInstance().getTable();
        var status = g_objHero.getStatus();
        var players = table.getPlayers();

        var Button_operation = this.Panel_root.getChildByName('Button_operation');
        var Image_times = Button_operation.getChildByName('Image_times');
        var Text_times = Button_operation.getChildByName('Text_times');
        if(isGameSceneRunning && (status == US_PLAYING || status == US_OFFLINE || game.getPlayCount()>0)) {
            //游戏中
            resFile = "default/dating0005h.png";
            //
            var lastTimes = LocalStorageMgr.getInstance().getLeaveTimes() || 0;
            var curTimes = Math.floor(new Date().getTime()/1000);
            var curCounts = LocalStorageMgr.getInstance().getLeaveCounts() || 0;
            var arrTimes = [30, 60, 120, 120, 300, 300, 300, 300, 300, 300];
            cc.log("---lastTimes---"+lastTimes+"---curTimes---"+curTimes+"---curCounts---"+curCounts+"---(curTimes-lastTimes)--"+(curTimes-lastTimes));
            if(curCounts<10 && (curTimes-lastTimes)<arrTimes[curCounts]){
                Image_times.setVisible(true);
                Text_times.setVisible(true);
                var leftTimes = arrTimes[curCounts]-(curTimes-lastTimes);
                Text_times.string = String(leftTimes);

                var self = this;
                var seq = cc.sequence(
                    cc.delayTime(1),
                    cc.CallFunc(function(){
                        leftTimes--;
                        Text_times.string = String(leftTimes);

                        if(leftTimes==0){
                            Button_operation.setTouchEnabled(true);
                            Button_operation.setColor(cc.color(255,255,255,255));
                            Text_times.setVisible(false);
                        }
                    }, this)
                );
                Text_times.stopAllActions();
                Text_times.runAction(seq.repeat(leftTimes || 20));
            }
        }
        else{
            Image_times.setVisible(false);
            Text_times.setVisible(false);
        }
        Button_operation.getChildByName('Image_text').loadTexture(resFile, ccui.Widget.PLIST_TEXTURE);
        Button_operation.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                if (isGameSceneRunning) {
                    //游戏中
                    if (status == US_PLAYING || status == US_OFFLINE || game.getPlayCount() > 0) {
                        var lastTimes = LocalStorageMgr.getInstance().getLeaveTimes() || 0;
                        var curTimes = Math.floor(new Date().getTime()/1000);
                        var curCounts = LocalStorageMgr.getInstance().getLeaveCounts() || 0;
                        var arrTimes = [30, 60, 120, 120, 300, 300, 300, 300, 300, 300];
                        if(curCounts<10 && (curTimes-lastTimes)>arrTimes[curCounts]){
                            DlgTip.openLeaveRoomTip("系统提示","游戏已经开始，\r\n 现在解散房间，钻石无法返还！",null,function (target) {
                                cc.log("游戏中---sendCancelRoom");
                                OpenRoomMsg.getInstance().send_C2G_LeaveRoom();
                                LocalStorageMgr.getInstance().setLeaveCounts(curCounts+1);
                                LocalStorageMgr.getInstance().setLeaveTimes(curTimes);
                                target.closeTip();
                            },"default/dating0006.png","default/dating0006a.png","default/dating0005.png","default/dating0005h.png");
                        }
                        else{
                            DlgTip.openSysTip("请求过于频繁，请稍候再试");
                        }
                    }
                    //未开始牌局
                    else {
                        //起立
                        GameUserMsg.getInstance().sendStandUp(true);
                    }

                    LocalStorageMgr.getInstance().setMusicVolumeItem(this.Slider_music.getPercent());
                    LocalStorageMgr.getInstance().setSoundVolumeItem(this.Slider_effect.getPercent());
                    UIMgr.getInstance().closeDlg(ID_DlgGameSet);
                }
                else {
                    //切换账号
                    LogonMsgHandler.getInstance().close();
                    MsgMgr.getInstance().closeGameSocketForce(true);
                    ClientData.getInstance().setReplaceScene(true);
                    _dlg_table_ = {};

                    if (cc.sys.isNative) {
                        var scene = new cc.TransitionPageTurn(0.5, new LoginScene(), false);
                        cc.director.runScene(scene);
                    }
                    else {
                        cc.director.runScene(new LoginScene());
                    }
                }
            }
        }, this);

		this._rootWidget.setLocalZOrder(50);
		
		//slider
		this.Slider_music = this.Panel_root.getChildByName("Slider_music");
		this.Slider_music.addEventListener(this.sliderEvent,this);
		this.Slider_effect = this.Panel_root.getChildByName("Slider_effect");
		this.Slider_effect.addEventListener(this.sliderEvent,this);

		this.curMusicPercent = 0;
		this.curEffectPercent = 0;
		
		this.updateData();
	},

	updateData: function(){
		var musicVolume = LocalStorageMgr.getInstance().getMusicVolumeItem();
		var soundVolume = LocalStorageMgr.getInstance().getSoundVolumeItem();

        this.curMusicPercent = musicVolume;
        this.curEffectPercent = soundVolume;

        if(this.curMusicPercent<10){
            this.Slider_music.loadSlidBallTextureNormal("default/dating0045b.png",ccui.Widget.PLIST_TEXTURE);
        }
        if(this.curEffectPercent<10){
            this.Slider_effect.loadSlidBallTextureNormal("default/dating0045b.png",ccui.Widget.PLIST_TEXTURE);
        }

        cc.log("curMusicPercent-------------"+this.curMusicPercent);
        cc.log("curEffectPercent-------------"+this.curEffectPercent);

		this.Slider_music.setPercent(musicVolume);
		SoundMgr.getInstance().setMusicVolume(musicVolume/100.0);
		this.Slider_effect.setPercent(soundVolume);
		SoundMgr.getInstance().setEffectsVolume(soundVolume/100.0);
	},
	
	sliderEvent: function (sender, type) {
		switch (type) {
		case ccui.Slider.EVENT_PERCENT_CHANGED:
			var slider = sender;
			var percent = slider.getPercent();
			var sliderName = sender.getName();
			if(sliderName=="Slider_music"){
				//Slider_music
				SoundMgr.getInstance().setMusicVolume(percent/100.0);
				if(this.curMusicPercent>0 && percent==0){
					slider.loadSlidBallTextureNormal("default/dating0045b.png",ccui.Widget.PLIST_TEXTURE);
				}
				else if(this.curMusicPercent==0 && percent>0){
                    slider.loadSlidBallTextureNormal("default/dating0045.png",ccui.Widget.PLIST_TEXTURE);
				}

                this.curMusicPercent = percent;
			}
			else{
				//Slider_effect
				SoundMgr.getInstance().setEffectsVolume(percent/100.0);

                if(this.curEffectPercent>0 && percent==0){
                    slider.loadSlidBallTextureNormal("default/dating0046b.png",ccui.Widget.PLIST_TEXTURE);
                }
                else if(this.curEffectPercent==0 && percent>0){
                    slider.loadSlidBallTextureNormal("default/dating0046.png",ccui.Widget.PLIST_TEXTURE);
                }

                this.curEffectPercent = percent;
			}

            cc.log("curMusicPercent-------------"+this.curMusicPercent);
            cc.log("curEffectPercent-------------"+this.curEffectPercent);
			break;
		default:
			break;
		}
	},

    showLeavRoomWaiting: function(isShow, times){
        this.Panel_root.setVisible(false);
        this.Panel_waitTip.setVisible(true);

        if(!isShow){

            cc.log("-----------showLeavRoomWaiting（false） 时的调用")
            var self = this;
            var seq = cc.sequence(
                cc.delayTime(1),
                cc.CallFunc(function(){
                    self.Panel_waitTip.stopAllActions();
                    UIMgr.getInstance().closeDlg(ID_DlgGameSet);
                }, this)
            );
            this.Panel_waitTip.runAction(seq.repeat(3));
            return;
        }

        //初始化玩家状态
        var Panel_playerStatus = this.Panel_waitTip.getChildByName("Panel_playerStatus");
        var table = ClientData.getInstance().getTable();
        var players = table.getPlayers();
        var curPosY = 200;
        for(var index=0; index<players.length; ++index){
            var player = players[index];
            var userID = player.getUserId();
            if(userID==g_objHero.getUserId())
                continue;

            var item = Panel_playerStatus.clone();
            var Text_nickName = item.getChildByName("Text_nickName");
            var Text_status = item.getChildByName("Text_status");
            Text_nickName.string = player.getNickName();

            item.setName("Panel_playerStatus_"+userID);
            item.setPosition(cc.p(0,curPosY));
            item.setVisible(true);
            this.Panel_waitTip.addChild(item);

            curPosY -= 30;
        }

        var Text_titleTimes = this.Panel_waitTip.getChildByName("Text_titleTimes");
        //倒数计时
        var self = this;
        var curTimes = times;
        cc.log("curTimescurTimescurTimes---"+curTimes);
        var seq = cc.sequence(
            cc.delayTime(1),
            cc.CallFunc(function(){
                curTimes--;
                cc.log("curTimescurTimescurTimes---"+curTimes);
                Text_titleTimes.string = "等待计时("+curTimes+"s)"

                if(curTimes==0){
                    UIMgr.getInstance().closeDlg(ID_DlgGameSet);
                    self.Panel_waitTip.stopAllActions();
                    // DlgTip.openSysTip("操作超时，请稍候在试", function(target){
                    //     target.closeTip();
                    // }, false);
                }
            }, this)
        );
        this.Panel_waitTip.runAction(seq.repeat(times || 20));
    },
    setWaitingStatus: function(userID, isAgree){
        var Panel_playerStatus = this.Panel_waitTip.getChildByName("Panel_playerStatus_"+userID);
        if(Panel_playerStatus){
            var Text_status = Panel_playerStatus.getChildByName("Text_status");
            if(isAgree==true){
                Text_status.string = "同意";
                Text_status.setColor(cc.color(255,255,255,255));
            }
            else{
                Text_status.string = "不同意";
                Text_status.setColor(cc.color(255,0,0,255));
            }
        }
    },

	onClickClose: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			cc.log('onClickClose');
            LocalStorageMgr.getInstance().setMusicVolumeItem(this.Slider_music.getPercent());
            LocalStorageMgr.getInstance().setSoundVolumeItem(this.Slider_effect.getPercent());
			UIMgr.getInstance().closeDlg(ID_DlgGameSet);
		}
	}
});

//网络等待界面 使用
var showLeavRoomWaiting = function(isShow, times){
    if(isShow==true){
        UIMgr.getInstance().closeDlg(ID_DlgGameSet);
    }
    cc.log("---------------进入请求离开房间请求等待-----------------")
    var dlgWinting = UIMgr.getInstance().openDlg(ID_DlgGameSet);
    if(dlgWinting){
        dlgWinting.showLeavRoomWaiting(isShow, times||20);
    }
}