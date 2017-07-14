var DdzMainLayer = cc.Layer.extend({
	init: function () {
		// 从文件载入
		
		var json = ccs.load(res.ddzLandlordScene_json);
		this._rootWidget = json.node;
		this.addChild(this._rootWidget);

		cc.log("Panel_main="+this._rootWidget.getChildByName("Panel_main"));
		// 文本
		this.Text_Num = this._rootWidget.getChildByName("Panel_main").getChildByName("Panel_gnum").getChildByName("Text_gnum");
		this.Text_node = this._rootWidget.getChildByName("Panel_main").getChildByName("Text_BaseScore");
		this.Text_roomNum = this._rootWidget.getChildByName("Panel_main").getChildByName("Panel_room").getChildByName("Text_room");



		this.Text_roomNum.string = g_objHero.getRoomID();

		g_objHero.setBackPlazaSign(false);

		var game = ClientData.getInstance().getGame();
		if(game){
			this.Text_node.string =  game.getCellScore();
			this.allNum = game.getGameCount() || game.getDrawCountLimit();
			this.curentNum = game.getPlayCount(); // 当前局数
			if (this.curentNum <= this.allNum) {
				this.Text_Num.string = this.curentNum + "/" + this.allNum ;
				game.setCurentCount(this.curentNum);
			}
		}
	},

	onClickHelp: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var plaza = ClientData.getInstance().getPlaza();
			var gamekind = 200;
			if (plaza) {
				var kindID = plaza.getCurKindID();
				if (kindID == CMD_DDZ.KIND_ID) {
					gamekind = 300;
				} else if (kindID == CMD_NIUNIU_TB.KIND_ID) {
					gamekind = 200;
				}
			}

			var dlgRule =UIMgr.getInstance().openDlg(ID_DlgGameRule);
			dlgRule.gamekind = gamekind;
			dlgRule.gamestatus = true;
			dlgRule.onWhichplatform();
		}
	},
	soundsEnd: function (type) {
		// 结束录音
		//关闭录音动画
		var tempAmrPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "record.amr");
		showSoundAnimation(false);
		if(cc.sys.isNative){
			if(cc.sys.os == cc.sys.OS_IOS) {
				//jsb.reflection.callStaticMethod("HFAudio", "stopRecord");
			}
			else if(cc.sys.os == cc.sys.OS_ANDROID) {
				// jsb.reflection.callStaticMethod(
				//     "org/cocos2dx/javascript/HFAudio",
				//     "stopRecord",
				//     "()V"
				// );
				// 停止呀呀录音
				//yayaSdkMgr.getInstance().stopRecord();
			}
			else
			{
				// yayaSdkMgr.getInstance().stopRecord();
			}
		}

		if (ccui.Widget.TOUCH_CANCELED == type) {
			cc.log("录音结束重新设置声音 = ");
			SoundMgr.getInstance().setPlayMusic(LocalStorageMgr.getInstance().getMusicItem());
		} else {
			// 发送录音
			if (jsb.fileUtils.isFileExist(tempAmrPath)) {
				//  GameFrameMsg.getInstance().sendVoiceReq(tempAmrPath);
			}
			else {
				cc.log("没有找到目录"+tempAmrPath);
			}

			var bMusic = LocalStorageMgr.getInstance().getMusicItem();
			cc.log("录音结束重新设置声音 = " + bMusic);
			//SoundMgr.getInstance().setPlayMusic(bMusic);
			yayaSdkMgr.getInstance().stopRecord();
		}
	},
	// 更新已玩局数
	updateNode: function () {
		this.curentNum++;
		if (this.curentNum <= this.allNum) {
			this.Text_Num.string = this.curentNum + "/" + this.allNum;
			var game = ClientData.getInstance().getGame();
			if (game) {
				game.setCurentCount(this.curentNum);
			}
		}
	},
	//掉线后显示局数
	resetNumberOfGames: function () {
		var game = ClientData.getInstance().getGame();
		if (game) {
			this.Text_Num.string = game.getCurentCount() + "/" + this.allNum;
			this.curentNum = game.getCurentCount();
		}
	},

	resetRounds: function () {
		this.curentNum = 0;
		this.Text_Num.string = this.curentNum + "/" + this.allNum;
	},

	// 是否局数到了
	isFinished: function () {
		return this.curentNum >= this.allNum;
	}
});


var NiuniuTBScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new NiuniuTBMainLayer();
		this.addChild(this.layer);
		this.layer.init();

		//游戏管理
		var gameUIMgr = NiuniuTBUIMgr.getInstance();
		GameKindMgr.getInstance().setGameUIMgr(gameUIMgr);
	},

	onEnter: function () {
		this._super();
	},

	onEnterTransitionDidFinish:function () {
		this._super();

		this.sceneName = "NiuniuTBScene";

		ClientData.getInstance().setReplaceScene(false);

		UIMgr.getInstance().init(this.layer);
		NiuniuTBUIMgr.getInstance().init(this.layer);
	},

	getSceneName: function(){
		return this.sceneName;
	},

	isPlazaScene: function(){
		return false;
	},

	isGameScene: function(){
		return true;
	},

	onExit : function () {
		cc.Scene.prototype.onExit.call(this);

		SoundMgr.getInstance().stopMusic();
	},

	// 更新位置信息
	updateLoaction: function () {
		var dlg = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
		if (dlg) {
			dlg.updatePlayersLocation();
		}
	},

	// 战绩中心
	showResult: function () {
		var game = ClientData.getInstance().getGame();
		if (game && !(game.getCurentCount() === 0)) {
			NiuniuTBGameMsg.getInstance().sendOpenResult();
			g_objHero.setBackPlazaSign(true);
		} else {
			GameUserMsg.getInstance().sendStandUp(true);
			GameKindMgr.getInstance().backPlazaScene();
		}
	},
});




var DdzGameScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();

		this.layer = new DdzMainLayer();
		this.addChild(this.layer);
		this.layer.init();

		//游戏管理
		var gameUIMgr = DdzUIMgr.getInstance();
		GameKindMgr.getInstance().setGameUIMgr(gameUIMgr);
	},

	onEnter: function () {
		this._super();
	},

	onEnterTransitionDidFinish:function () {
		this._super();

		this.sceneName = "DdzGameScene";

		ClientData.getInstance().setReplaceScene(false);

		cc.log("DdzGameScene onEnterTransitionDidFinish");
		UIMgr.getInstance().init(this.layer);
		DdzUIMgr.getInstance().init(this.layer);
	},

	getSceneName: function(){
		return this.sceneName;
	},

	isPlazaScene: function(){
		return false;
	},

	isGameScene: function(){
		return true;
	},

	onExit : function () {
		cc.Scene.prototype.onExit.call(this);

		SoundMgr.getInstance().stopMusic();
	},

    // 更新位置信息
    updateLoaction: function (data) {
        var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
        if (dlg) {
            dlg.updatePlayersLocation();
        }
    },

	// 战绩中心
	showResult: function (data) {
		var game = ClientData.getInstance().getGame();
		if (game) {
			game.setGameEnd(true);
		}
		if (game) {
					if (game.getPlayCount() > 0 && game.getGameEnd()) {
						// 游戏已开始并且结束了，弹战绩页
						UIMgr.getInstance().openDlg(ID_DlgResult);
						return false;
					}
				}
		//var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgResult);
		//if (!dlg) {
		//	cc.log("我......498498489")
         //   UIMgr.getInstance().openDlg(ID_DlgResult);
		//}

    },
	
//	// 解散房间结果
//	breakRoomResult: function () {
//		cc.log("解散房间结果+++++++++++s")
//        var dlg = UIMgr.getInstance().openDlg(ID_DlgDialogScene);
//        if (dlg) {
//            dlg.setCloseFunc(function () {
//                var game = ClientData.getInstance().getGame();
//                if (game && game.getGameEnd()) {
//                    UIMgr.getInstance().openDlg(ID_DlgResult);
//                } else {
//                	GameUserMsg.getInstance().sendStandUp(true);
//                    GameKindMgr.getInstance().backPlazaScene();
//                }
//            });
//
//        }
//    }
});
