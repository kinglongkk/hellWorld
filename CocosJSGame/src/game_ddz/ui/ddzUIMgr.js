var s_sharedDdzUIMgr = null;

var DdzUIMgr = GameUIMgr.extend({
	resetData: function () {
		this._bDealGameScene = false;
		this._endPhase = false;
		this.CardSign = null;
	},

	startGame: function () {
		
		cc.log("#### DdzUIMgr startGame ");
		
		this.resetData();
		//设置游戏人数
		this.setPlayerCount(CMD_DDZ.GAME_PLAYER);
		var sizeDir = cc.director.getWinSize();

		//发牌
		var sendCardLayer = SendCardMgr.getInstance().getSendCardLayer();
		this._uiLayer.addChild(sendCardLayer, 10);
		var startPt = cc.p(sizeDir.width / 2, sizeDir.height / 2);
		var parameter = {
				sendTime : 0.2,  //一张牌时间
				interval : 0.3, //设置发牌间隔（秒）
				startPt : startPt,
				startR : 0,
				startS : 0.3, //初始大小
				endR : 0, //旋转圈，360为1圈
		};
		SendCardMgr.getInstance().setParameter(parameter);

		//场景
		UIMgr.getInstance().openDlg(ID_DdzDlgSence);

		//人物属性
	    UIMgr.getInstance().openDlg(ID_DdzDlgPlayer);

		//人物聊天
		var dlgChatScene = UIMgr.getInstance().openDlg(ID_DlgChatScene);
		dlgChatScene.setChatPos(-50, 185);

		//UIMgr.getInstance().openDlg(ID_ddzDlgOpenCard);
		this.onUpdateAllPlayerInfo();

		if(!this._bDealGameScene){
			cc.log("ddzUiMgr.on game scene");
			this.onGameScene();
		}
		SoundMgr.getInstance().playMusic("ddz_bg", 0, true);
	},

	////////////////////////////////////实现父类中包含的函数/////////////////////////////////////////////

	//更新所有玩家
	onUpdateAllPlayerInfo: function(){

		if(!this._bInit){
			return;
		}

		if(this._endPhase){
			//return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var pos;
		for(pos = 0; pos < CMD_DDZ.GAME_PLAYER; pos++){
			var chairId = this.getChairIdByPlayerPos(pos);
			var bPlay = game.isPlayByChairId(chairId);
			if(this._endPhase && bPlay){
				continue;
			}

			var player = table.getPlayerByChairID(chairId);
			var dlgPlayer = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
			if (dlgPlayer) {
				dlgPlayer.updatePlayerInfo(pos, player);
			}
		}

		// 玩家对象存入战绩页
        var table = ClientData.getInstance().getTable();
		for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
            var player = table.getPlayerByChairID(i);
            if (player) g_outcome.setPlayerByChairId(i, player);  // 玩家对象加入战绩页

		}

		//得到玩家人数
		var Number = table.getPlayers().length;
		var Gameplayer = UIMgr.getInstance().getDlg(ID_DdzDlgReady);
		if(Gameplayer){
			Gameplayer.setGameplayer(Number);
		}
		// //准备界面
        // cc.log("自己在游戏中的状态"+g_objHero.getStatus());
		// switch (g_objHero.getStatus()) {
		// 	case US_NULL:
		// 		break;
		// 	case US_FREE:
         //        UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
		// 		UIMgr.getInstance().openDlg(ID_NnTbDlgReady);
		// 		break;
		// 	case US_SIT:
		// 		break;
		// 	case US_READY:
         //        UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
         //        UIMgr.getInstance().closeDlg(ID_NnTbDlgReady);
		// 		break;
		// 	case US_LOOKON:
		// 		break;
		// 	case US_PLAYING: {
		// 		var game = ClientData.getInstance().getGame();
		// 		if (!game) return;
        //
		// 		if (game.getCurrentUser() == g_objHero.getChairID()) {
         //            var table = ClientData.getInstance().getTable();
         //            if(!table){
         //                return;
         //            }
        //
         //            var gameStatus = table.getGameStatus();
         //            switch (gameStatus) {
         //                case CMD_DDZ.GS_TK_FREE:
         //                    // 空闲
         //                    this.onCallScore();
         //                    break;
         //                case CMD_DDZ.GS_TK_CALL:
         //                    //叫庄
         //                    UIMgr.getInstance().openDlg(ID_DdzDlgCallScore);
         //                    break;
         //                case CMD_DDZ.GS_TK_PLAYING:
         //                    // 游戏进行中
         //                    this.onGamePlaying();
         //                    break;
         //                default:
         //                    break;
         //            }
         //
		// 		}
		// 	}
        //
		// 		break;
		// 	case US_OFFLINE:
		// 		break;
		// 	default:
		// 		break;
		// }
		//
		// if(g_objHero.getStatus() >= US_READY){
		// 	this.closeTimer("ready");
		// 	UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
		// 	UIMgr.getInstance().closeDlg(ID_NnTbDlgReady);
		// }

	},

	openTimer: function(strId, subTime){

		if(!this._bInit){
			return;
		}

		var heroStatus = g_objHero.getStatus();
 

		var time = 15;
		var callBack = function(){};

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var gameStatus = table.getGameStatus();

		switch (strId) {
		case "ready":
			time = 15;
			if(subTime){
				time -= subTime;
			}

			callBack = function(){
				GameKindMgr.getInstance().backPlazaScene();
			};
			break;
		case "callScore": //叫分
			time = 10;

			callBack = function() {
				GameKindMgr.getInstance().backPlazaScene();
			};

			break;
		case "callBanker":

			break;
		case "bet":
		

			break;
		case "open":
			if(gameStatus == CMD_DDZ.GS_TK_PLAYING){
				time = 60;
				callBack = function(){
					var game = ClientData.getInstance().getGame();
					var cardType = game.getCardTypeByChairId(g_objHero.getChairID());
					var bOx = false;
					if(cardType > 0){
						bOx = true;
					}
					DdzGameMsg.getInstance().sendOpenCard(bOx);
					/* SXH
					UIMgr.getInstance().closeDlg(ID_NnTbDlgOpen);
					*/
				};
			}

			break;
		default:
			break;
		}
		/* SXH
		UIMgr.getInstance().closeDlg(ID_NnTbDlgClock);
		UIMgr.getInstance().openDlg(ID_NnTbDlgClock);

		var dlgClock = UIMgr.getInstance().getDlg(ID_NnTbDlgClock);
		if(dlgClock){
			dlgClock.openTimer(time, callBack);
			dlgClock.setTimerName(strId);
		}
		 */

	},

	closeTimer: function(strId){
/*		var dlgClock = UIMgr.getInstance().getDlg(ID_NnTbDlgClock);
		if(!dlgClock){
			return;
		}

		var timerName = dlgClock.getTimerName();
		if(strId == timerName){
			UIMgr.getInstance().closeDlg(ID_NnTbDlgClock);
		}
		*/
	},

	//换桌成功
	onChangeTableSucc: function(){

	},

	///////////////////////////////////////////////////////////////

	//设置底注
	onCallScore: function() {

		if (!this._bInit) {
			return;
		}

		UIMgr.getInstance().openDlg(ID_DdzDlgReady);

	},

	onCallBanker: function(){
/*	
		if(!this._bInit){
			return;
		}

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
		if(bPlayHero){
			UIMgr.getInstance().closeDlg(ID_NnTbDlgReady);
		}

		var bFirst = game.isFirstTimesCallBanker();
		var callBanker = game.getCallBankerChairId();

		var pos = this.getPlayerPosByChairId(callBanker);
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
		if(dlgPlayer){
			dlgPlayer.setBanker(pos);
		}

		cc.log("onCallBanker  ------ 5" + g_objHero.getChairID());

		this.openTimer("callBanker");

		//自己抢庄
		if(callBanker == g_objHero.getChairID()){
			if(bFirst){
				SoundMgr.getInstance().playEffect("nndz_push_bank", 0, false);
			}

	 
		}
		*/
	},

	onSetBanker: function(){
		if(!this._bInit){
			return;
		}

		var game = ClientData.getInstance().getGame();
		if(!game) {
			return;
		}

        var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		cc.log(dlg)
		dlg.callScore();
		var wCurrentUser = game.getCurrentUser();
		if (wCurrentUser != CMD_DDZ.INVALID) {
			UIMgr.getInstance().openDlg(ID_ddzDlgOpenCard);
            if(wCurrentUser == g_objHero.getChairID()){

                UIMgr.getInstance().closeDlg(ID_DdzDlgReady);
                UIMgr.getInstance().openDlg(ID_DdzDlgCallScore);
				//UIMgr.getInstance().openDlg(ID_ddzDlgOpenCard);
            } else {
                UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
				//UIMgr.getInstance().closeDlg(ID_ddzDlgOpenCard);
            }
            var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(wCurrentUser);
            cc.log("叫庄用户UserID="+wCurrentUser+"位置="+pos);

            dlg.setClockUI(pos);
		}
		else {
			dlg.setClockUI(CMD_DDZ.INVALID);
            UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
			UIMgr.getInstance().closeDlg(ID_ddzDlgOpenCard);
		}
	},

	//玩家加注
	onAddScore: function(chairId, addScore){
	/*
		if(!this._bInit){
			return;
		}

		var table = ClientData.getInstance().getTable();

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
		if(bPlayHero){
			UIMgr.getInstance().closeDlg(ID_NnDzDlgReady);

			if(chairId == g_objHero.getChairID()){
				UIMgr.getInstance().closeDlg(ID_NnTbDlgClock);
			}
		}

		UIMgr.getInstance().closeDlg(ID_NnDzDlgCallBanker);
		if(chairId == g_objHero.getChairID()){
			UIMgr.getInstance().closeDlg(ID_NnDzDlgBet);
		}

		cc.log("### chair [" + chairId + "] 加注 " + addScore);
		var pos = this.getPlayerPosByChairId(chairId);

		var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
		if(dlgPlayer){
			var player = table.getPlayerByChairID(chairId);
			if (player) {
				var leaveMoney = player.getMoney() - addScore;
				dlgPlayer.betValue(pos, addScore, leaveMoney);
			}
		}
		*/
	},

	//发牌
	onSendCard: function(){
		if(!this._bInit){
			return;
		}

		// 游戏开始，去掉准备界面
		UIMgr.getInstance().closeDlg(ID_DdzDlgReady);

		var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		// 展示牌
		dlg.updateCards();
		//叫庄位置
		this.onSetBanker();
		var game = ClientData.getInstance().getGame();
		game.getonTopen();
		// 更新局数
		if (cc.director.getRunningScene().layer)
        	cc.director.getRunningScene().layer.updateNode();
		cc.log("发牌---发牌---发牌---发牌---发牌---");
	},

	heroSendEnd: function(){
/*		
		if(!this._bInit){
			return;
		}

		UIMgr.getInstance().openDlg(ID_NnTbDlgGetType);
		UIMgr.getInstance().openDlg(ID_NnTbDlgOpen);
		this.openTimer("open");

		var table = ClientData.getInstance().getTable();

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}		

		var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
		if(dlgPlayer){
			var heroChairId = g_objHero.getChairID();
			var tipCardValue = game.getOxCardByChairId(heroChairId);
			if(tipCardValue){
				dlgPlayer.tipCard(0, tipCardValue);
			}
		}		

		// cc.log("@@@@@发牌结束"+game.getCellScore());
		for(var i=0; i<CMD_NIUNIU_TB.GAME_PLAYER; i++){
			var chairId = this.getChairIdByPlayerPos(i);
			var bPlay = game.isPlayByChairId(chairId);
			if(bPlay){
				var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnTbDlgPlayer);
				if(dlgPlayer){
					var player = table.getPlayerByChairID(chairId);
					var addScore = game.getCellScore();
					var leaveMoney = player.getMoney() - addScore;
					if(leaveMoney < 0){
						leaveMoney = 0;
					}
					dlgPlayer.betValue(i, addScore, leaveMoney);
				}
			}
		}
		*/
	},

	onOpenCard: function(){

		var game = ClientData.getInstance().getGame();

        // 判断是否是炸弹，需要翻倍
        var nType = game.getCardDatatype(game.getLastSendCardUser());

        if ((nType&0XF00) == DdzCardType.CT_BOMB_CARD ) {
            game.setBombCount(game.getBombCount() + 1);
            var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
            if (dlg) {
				dlg.Bombanimation();
                dlg.updateMultiple();
            }
        }
		//飞机带翅膀
		if((nType&0XF00) == DdzCardType.CT_THREE_LINE_TAKE){
			var craft = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
			craft.ddzAircraft();
		}
		var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		if (dlg) {
			// 判断是否是王炸
			if ((nType&0XF00) == DdzCardType.CT_KING) {
				// 清空所有人出牌区
				var sKing = nType & 0xF;	// xiaowang
				var lKing = (nType & 0xF0) >> 4;	// dawang
				if( sKing + lKing == 2 ){
					cc.log("大小王加2倍");
					game.setBankerScore(game.getBankerScore() * 2);
				}if(sKing + lKing == 3){
					cc.log("大小王加3倍");
					game.setBankerScore(game.getBankerScore() * 3);
				}if(sKing + lKing == 4){
					cc.log("大小王加4倍");
					game.setBankerScore(game.getBankerScore() * 4);
				}if(sKing + lKing == 5){
					cc.log("大小王加5倍");
					game.setBankerScore(game.getBankerScore() * 5);
				}if(sKing + lKing == 6){
					cc.log("大小王加6倍");
					game.setBankerScore(game.getBankerScore() * 6);
				}if(sKing + lKing == 7){
					cc.log("大小王加7倍");
					game.setBankerScore(game.getBankerScore() * 7);
				}if(sKing + lKing == 8){
					cc.log("大小王加16倍");
					game.setBankerScore(game.getBankerScore() * 16);
				}
				for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
					var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(i);
                    dlg.clearPlayerOpenCard(pos);
				}
				var dl = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
				dl.updateMultiple();
				dl.Wanganimation();
			}
			// 更新出牌区域
			if (game) {
				var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(game.getLastSendCardUser());
				dlg.updateOpenCard(pos, game.getTurnCardData(game.getLastSendCardUser()));
				var pos1 = DdzUIMgr.getInstance().getPlayerPosByChairId(game.getCurrentUser());
				dlg.showTextSore(false, pos1);
			}
			// 更新所有人的牌
			dlg.updateCards();
            // 更新玩家状态
            dlg.updatePlayerStatus();
		}
	},

	// 地主信息回来了
	onBankerInfo: function () {
		UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
		UIMgr.getInstance().closeDlg(ID_ddzDlgOpenCard);
		UIMgr.getInstance().closeDlg(ID_DdzDlgReady);

		// 更新底牌
        var handDlg = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
        if (handDlg) {
            handDlg.updateHandCard();

            var game = ClientData.getInstance().getGame();
            if (game) {
            	handDlg.updateBaseScore(game.getCellScore());
            	handDlg.updateMultiple();
			}
        }

		// 更新玩家界面
		var ddzPlayerDlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		if (ddzPlayerDlg) {
			ddzPlayerDlg.updateWithBankerInfoMsg();
			// 地主确定了，隐藏叫分信息
			for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
				ddzPlayerDlg.showTextSore(false, i);
			}
		}
    },

	// 过
	onPassCard: function () {
		var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		if (dlg) {
            // 更新玩家状态
            dlg.updatePlayerStatus();
            // 清空出牌区域
			var game = ClientData.getInstance().getGame();
			if (game) {
                var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(game.getLastPassCardUser());
                dlg.clearPlayerOpenCard(pos);
                var pos1 = DdzUIMgr.getInstance().getPlayerPosByChairId(game.getCurrentUser());
                dlg.showTextSore(false, pos1);
			}
		}
    },

	// 托管
	onTrustee: function (data) {
		var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		if (dlg) {
			dlg.onTrusteeto(data);
		}
	},
	//明牌
	//setonTopen:function(type){
	//	cc.log(type+"明牌的");
	//	this.CardSign = type;
	//},
	//getonTopen:function(){
	//	cc.log(this.CardSign+"type值")
	//	var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
	//	if (dlg) {
	//		cc.log("数据")
	//		dlg.ddzMingcar(this.CardSign);
	//	}
	//},
	onTopen: function (data) {
		var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		if (dlg) {
			dlg.ddzMingcard(data);
		}
	},
	// 作弊扑克（干嘛用的？）
	onCheatCard: function (data) {

    },

	// 游戏进行时
	onGamePlaying: function (data) {
		cc.log("游戏进行");
        var game = ClientData.getInstance().getGame();

        var handDlg = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
        if (handDlg) {
            // 底牌
            handDlg.updateHandCard();

            if (game) {
                // 底分
				handDlg.updateBaseScore(game.getCellScore());
				// 倍数
				handDlg.updateMultiple();
			}
        }

        var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
        if (dlg) {
            // 谁是地主
            dlg.updateLandHead();
            // 更新牌
			dlg.updateCards();
			// 更新玩家状态
			dlg.updatePlayerStatus();

			if (game) {
                // 更新已出的牌
				var lastChairId = game.getLastSendCardUser();
                dlg.updateOpenCard(DdzUIMgr.getInstance().getPlayerPosByChairId(lastChairId), game.getTurnCardData(lastChairId));
			}
        }

		//重连明牌
		game.getonTopen();
		//断线托管
		DdzGameMsg.getInstance().sendTrustee(false);
		//for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++){
		//	var chairId = DdzUIMgr.getInstance().getPlayerPosByChairId(i);
		//	if(data[chairId] ==true){
		//		UIMgr.getInstance().openDlg(ID_DdzDlgState);
		//	}
		//}
    },

	onGameEnd: function(RecordInfo,Reason){
        if(!this._bInit){
            return;
        }

        this._endPhase = true;

        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }


		//清除托管
		UIMgr.getInstance().closeDlg(ID_DdzDlgState);

		// 结束战绩页
		var PanelReady = new DdzResultButtonLayer();
		PanelReady.showResult(RecordInfo,Reason);

        var dlgPlayer = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
        if (dlgPlayer){
            // 更新每个人积分

            dlgPlayer.scoreValue();
            dlgPlayer.updateCards();
        }

        // 所有人明牌
		for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
            var cardArr = game.getTurnCardData(i);
            if (dlgPlayer) {
            	dlgPlayer.updateOpenCard(DdzUIMgr.getInstance().getPlayerPosByChairId(i), cardArr);
			}
		}
        // 弹结束页
		if( RecordInfo == null ){
			UIMgr.getInstance().openDlg(ID_DdzDlgResult);
		}

        // 更新倍数
        var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
        if (dlg) {
            dlg.updateMultiple();
        }

	},

	againGame: function(){
        var game = ClientData.getInstance().getGame();
        if (game) {
            game.againGame();
        }

        var dlgPlayer = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
        if (dlgPlayer) {
			dlgPlayer.ddzMing();//明牌清除
            for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
                // 清空明牌区域
                dlgPlayer.updateOpenCard(i, []);
                // 隐藏不出的标签
                dlgPlayer.showTextSore(false, i);
            }
            
            for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
            	//地主标记清除
            	dlgPlayer.IconLand[i].setVisible(false);
            }
            // 清空手牌区域
            dlgPlayer.updateCards();
        }
        
        //倍数重置
        var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
        dlg.updateMultiple();

        // 清空底牌
        var dlgDdz = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
        if (dlgDdz) {
            dlgDdz.updateHandCard(true);
        }
	},

	// 初始化所有
	resetGame: function () {
		var game = ClientData.getInstance().getGame();
		game.reset();


		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
		if (dlgPlayer) {
			dlgPlayer.ddzMing();//明牌清除
			for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
				// 清空明牌区域
				dlgPlayer.updateOpenCard(i, []);
				// 隐藏不出的标签
				dlgPlayer.showTextSore(false, i);
			}

			for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
				//地主标记清除
				dlgPlayer.IconLand[i].setVisible(false);
			}
			// 清空手牌区域
			dlgPlayer.updateCards();
		}

		//倍数重置
		var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
		dlg.updateMultiple();

		// 清空底牌
		var dlgDdz = UIMgr.getInstance().getDlg(ID_DdzDlgSence);
		if (dlgDdz) {
			dlgDdz.updateHandCard(true);
		}
    },

	onGameScene: function(data){
		cc.log("ddzUimgr.js onGameScene");
		if(!this._bInit){
			return;
		}
		cc.log("1")
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		cc.log("2")
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		cc.log("3")
		var i;
		var gameStatus = table.getGameStatus();
		cc.log("onGameScenepp"+gameStatus);
		switch (gameStatus) {
		case CMD_DDZ.GS_TK_FREE:
			// 空闲
			this.onCallScore();
			break;
		case CMD_DDZ.GS_TK_CALL:
			//叫庄
            this.onSendCard();
			break;
		case CMD_DDZ.GS_TK_PLAYING:
			// 游戏进行中
			this.onGamePlaying(data);
			break;
		default:
			break;
		}

		this._bDealGameScene = true;
	},
});

DdzUIMgr.getInstance = function() {
	if (!s_sharedDdzUIMgr) {
		s_sharedDdzUIMgr = new DdzUIMgr();
	}
	return s_sharedDdzUIMgr;
};
