/*
 * 红中麻将 网络交互 事件处理
 * Author: 	xjn 
 * Date:	2017.4.8
 * 
 * 功能：
 * 网络交互 事件处理
 * */
var HzmjGameMsg = GameMsg.extend({
	ctor: function(){},

	// 判断是否当前运行游戏
	isCurRunGame: function(){
		var kindId = 0;
		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			kindId = plaza.getCurKindID();

			if(kindId == CMD_HZMJ.KIND_ID){
				return true;
			}
		}
		return false;
	},
	// 游戏状态
	onGameStatus: function(){
		if(!this.isCurRunGame()){
			return;
		}

		// set game
		var game = new HzmjGame();
		ClientData.getInstance().setGame(game);
	},

	// 游戏命令
	onGameMsg: function(subCmd, data){
		if(!this.isCurRunGame()){
			return;
		}
		cc.log("subCmd"+subCmd);
		switch (subCmd) {
		case CMD_HZMJ.SUB_S_GAME_START:		// 游戏开始
			this.OnSubGameStart(data);
			cc.log("-------------------!!游戏开始");
			break;	
		case CMD_HZMJ.SUB_S_OUT_CARD:		// 用户出牌
			this.OnSubOutCard(data);
			/*说明
			 *收到用户出牌 
			 */
			break;		
		case CMD_HZMJ.SUB_S_SEND_CARD:		// 发牌消息
			this.OnSubSendCard(data);
			/*说明
			 *如果所有玩家都没有操作提示  则收到发牌消息 指针指向发牌的人
			 */
			cc.log("-------------------!!发牌消息");
			break;		
		case CMD_HZMJ.SUB_S_OPERATE_NOTIFY:	// 操作提示
			this.OnSubOperateNotify(data);
			/*说明
			 *操作提示  自己有操作才会收到操作提示   此时显示操作提示面板  
			 */
			cc.log("-------------------!!操作提示");
			break;		
		case CMD_HZMJ.SUB_S_OPERATE_RESULT:	// 操作结果
			this.OnSubOperateResult(data);
			/*说明
			 *操作结果   某个玩家 选择 某个操作 比如 碰   此时需等待那个玩家的操作  指针指向那个玩家
			 */
			cc.log("-------------------!!操作结果");
			break;		
		case CMD_HZMJ.SUB_S_GAME_END:		// 游戏结束
			this.OnSubGameEnd(data);
			cc.log("-------------------!!游戏结束");
			break;		
		case CMD_HZMJ.SUB_S_CONFIG_CELLSCORE:  // 配置底注
			this.OnUserConfigCellScore(data);
			break;
		case CMD_HZMJ.SUB_S_MAKESURE:		// 用户坐下
			this.OnUserMakesure(data);
			cc.log("-------------------!!用户坐下");
			break;
		case CMD_HZMJ.SUB_S_USEREXIST:		// 用户退出
			this.OnUserExist(data);
			cc.log("!!用户退出");
			break;
		case CMD_HZMJ.SUB_S_USERCLOSEWIN:	// 关闭窗口
			this.OnUserExist(data);
			cc.log("!!关闭窗口");
			break;
		default:
			break;
		}		
	},

	// 游戏场景消息
	onGameSceneMsg: function(data, isPlay){
		cc.log("aaaaaaaaaaaa ", isPlay)
		if(!this.isCurRunGame()){
			return;
		}
		
		// 设置游戏场景
		GameKindMgr.getInstance().setNewGameSceneFun(function(){
			var gameScene = new HzmjScene();
			return gameScene;
		});

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		
		var gameStatus = table.getGameStatus();
		
		cc.log("红中麻将 游戏场景消息-gameStatus-"+gameStatus);

		if (!isPlay) {// 空闲状态
            cc.log("红中麻将 游戏场景消息--空闲状态");
            cc.log("游戏场景消息 = " + JSON.stringify(data));
            // /////////////////////////////////先数据处理//////////////////////////////////////////
            table.setGameStatus(CMD_HZMJ.GS_MJ_FREE);
            game.setCellScore(data.CellScore);
            game.setTimeOutCard(data.TimeOutCard);
            game.setTimeOperateCard(data.TimeOperateCard);
            game.setTimeStartGame(data.TimeStartGame);
            game.setTurnScore(data.TurnScore);
            game.setCollectScore(data.CollectScore);
            game.setPlayerCount(data.PlayerCount);
            game.setMaCount(data.MaCount);
            game.setPlayCount(0);
            game.setDrawCountLimit(data.CountLimit);

            //获取历史记录
            HzmjUIMgr.getInstance().getGameInfo();

        }else{ // 游戏状态
			cc.log("111断线重连 = " + JSON.stringify(data));

			// 设定相关信息
			//游戏状态
			table.setGameStatus(CMD_HZMJ.GS_MJ_PLAY);
			//时间信息
			game.setTimeOutCard(data.TimeOutCard);
			game.setTimeOperateCard(data.TimeOperateCard);
			game.setTimeStartGame(data.TimeStartGame);
			
			// 游戏变量
			game.setCellScore(data.CellScore);
			game.setBanker(data.BankerUser);
			game.setMeBankNums(data.BankerUser);
			game.setCurrentUser(data.CurrentUser);
			game.setPlayerCount(data.PlayerCount);
			game.setMaCount(data.MaCount);
			
			// 状态变量
			game.setActionCard(data.ActionCard);
			game.setAcionMasks(data.ActionMask);
			//是否托管
			game.setTrustee(data.Trustee);
			//听牌表现
			game.setHearStatus(data.Ting);
			game.setLeftCardCount(data.LeftCardCount+1);
			// 出牌信息
			game.setOutCardUser(data.OutCardUser);
			game.setOutCardData(data.OutCardData);
			game.setDiscardCount(data.DiscardCount);
			game.setDiscardCard(data.DiscardCard);
			// 扑克数据
			game.setCardCount(data.CardCount);
			game.setCardData(data.CardData);
			game.setPlayersCards(data.CardData);
			game.setSendCardData(data.SendCardData);
			// 组合扑克
			game.setWeaveCount(data.WeaveItemCount);
			game.setWeaveItemArray(data.WeaveItemArray);
			
			//堆立信息
			game.setHeapInf(data.HeapHead,data.HeapTail);
			game.setUserHeapCardInfo(data.HeapCardInfo);
			
			//历史积分
			game.setTurnScore(data.TurnScore);	//本轮分数
			game.setCollectScore(data.CollectScore);//历史积分
			
			///////////////////////////////////
			//获取历史记录
			HzmjUIMgr.getInstance().getGameInfo();
			
			var runScene = cc.director.getRunningScene();
			if(runScene && runScene.isGameScene && runScene.isGameScene()){
				cc.log("HzmjUIMgr.getInstance().onBreak()");
				HzmjUIMgr.getInstance().onBreak();
			}
		}
	},
	// 游戏开始
	OnSubGameStart:function(data){
		// ------------//
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		
		cc.log("红中麻将 游戏场景消息--游戏开始--");
		table.startGame();
		// /////////////////////////////////先数据处理//////////////////////////////////////////

		table.setGameStatus(CMD_HZMJ.GS_MJ_PLAY);
		game.setUserAction(data.UserAction);
		game.setMeBankNums(data.BankerUser);//设置连庄用户
		game.setBanker(data.BankerUser);
		game.setMeBankNums(data.BankerUser);
		game.setReplaceUser(data.ReplaceUser);
		game.setLeftCardCount(CMD_HZMJ.FULL_COUNT-52);
		//game.setSiceCount(data.SiceCount);
		//game.setCurrentUser(data.CurrentUser);
		game.setPlayersCards(data.CardData);
		game.setPlayCount(game.getPlayCount()+1);//
		
		// ///////////////////
		HzmjUIMgr.getInstance().onGameStart();
		
		//更新历史记录
		HzmjUIMgr.getInstance().updateGameInfo();
	},
	// 用户出牌
	OnSubOutCard:function(data){
		// ---------------//
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		cc.log("红中麻将 游戏场景消息--用户出牌--")
		table.startGame();

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		game.setOutCardUser(data.OutCardUser)
		game.setOutCardData(data.OutCardData)

		HzmjUIMgr.getInstance().onOutCard();
	},
	// 发牌消息
	OnSubSendCard:function(data){
		cc.log("红中麻将 游戏场景消息--发牌消息--");
		// ----------//
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		cc.log("parseData.wSendCardUser:"+data.SendCardUser+"   getMeChairId:"+game.getMeChairId());
		
		game.setSendCard(data.CardData);
		game.setAcionMasks(data.ActionMask);
		game.setCurrentUser(data.CurrentUser);
		//game.setReplaceUser(data.ReplaceUser);
		game.setSendCardUser(data.SendCardUser);
		game.setTail(data.Tail);
		
		game.setLeftCardCount(game.getLeftCardCount()-1);
		cc.log("+++++设置剩余张数  "+game.getLeftCardCount()-1);
		HzmjUIMgr.getInstance().onSendCard();

	},
	// 操作提示
	OnSubOperateNotify:function(data){
		cc.log("红中麻将 游戏场景消息--操作提示--");
		// -----------//
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		
		if(parseData.cbActionMask !=0)
		{
			game.setAcionMasks(data.ActionMask);
			game.setActionCard(data.ActionCard);
			
			//打开提示面板
			cc.log("--打开操作提示面板--");
			HzmjUIMgr.getInstance().onOperatorTip();
		}
	},
	// 操作结果
	OnSubOperateResult:function(data){
		cc.log("红中麻将 游戏场景消息--操作结果--");
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		
		game.setOperateUser(data.OperateUser);
		game.setProvideUser(data.ProvideUser);
		game.setOperateCode(data.OperateCode);
		game.setOperateCard(data.OperateCard);

		HzmjUIMgr.getInstance().onOperateResult();
	},
	// 游戏结束
	OnSubGameEnd:function(data){
		cc.log("红中麻将 游戏场景消息--游戏结束--");
		
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		if(!dlgCardsInf) return;
		
		//本局结果
		var result = {};
		result.lGameScore = data.GameScore;	//本局积分
		result.dwChiHuKind = data.ChiHuKind;//胡
		result.wLianZhuang = data.LianZhuang;//庄家
		result.cbCardCount = data.CardCount;//扑克数目
		result.cbSendCardData = data.SendCardData;
		result.cbHandCardData = data.HandCardData;//剩余扑克数据
		result.cbMaCount = data.MaCount;// 码数
		result.cbMaData = data.MaData;// 码数据-牌数据
		
		var game = ClientData.getInstance().getGame();
		
		//碰杠数据
		result.cbBpBgCardData = [];
		for(var i=0; i<CMD_HZMJ.GAME_PLAYER; ++i){
			if(game.getMeChairId()==i){
				result.cbBpBgCardData[i] = dlgCardsInf.openFCardData;
			}
			else{
				result.cbBpBgCardData[i] = dlgCardsInf.openTCardData[i];
			}
		}
		
		//战绩中心数据
		//备份积分信息
		var plaza = ClientData.getInstance().getPlaza();
		var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
		var table = ClientData.getInstance().getTable();
		for(var i=0;i<CMD_HZMJ.GAME_PLAYER;i++)
		{//积分信息
			game.addSettleScore(i,data.GameScore[i]);
			
			var player=table.getPlayerByChairID(i);
			if(curGameType==GAME_GENRE_PERSONAL){
				//房卡更新积分
				cc.log("更新玩家积分 ChairID "+i+" --更新前积分 "+player.getScore());
				player.setScore(player.getScore()+data.GameScore[i]);
				cc.log("更新玩家积分 ChairID "+i+" --更新后积分 "+player.getScore());
			}
			else{
				//金币更新金币
				cc.log("更新玩家积分 ChairID "+i+" --更新前积分 "+player.getMoney());
				player.setMoney(player.getMoney()+data.GameScore[i]);
				cc.log("更新玩家积分 ChairID "+i+" --更新后积分 "+player.getMoney());
			}
		}
		
		//胡牌动画后游戏结束界面
		dlgCardsInf.onGameEnd(result);
		
		//更新历史记录
		HzmjUIMgr.getInstance().updateGameInfo();
	},
	
	// 配置底注
	OnUserConfigCellScore:function(data){
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		
		// 接收参数
		var dataParser = new DataParser();
		dataParser.init(data);			  
		var parseData = dataParser.parse([			                                      
		                                  ["wConfigUser", "WORD"], // 确认用户
		                                  ["lCellScore", "SCORE"]  // 基础金币
		                                  ]);
		// ---------------------//
		cc.log("配置底注");
		game.setCellScore(parseData.lCellScore);
		var dlgUserInf=UIMgr.getInstance().getDlg(ID_DlgHzmjUserInf);
		if(!dlgUserInf) return;
		dlgUserInf.SetCellInf(parseData.lCellScore,game.getMeBankNums());
		if(parseData.wConfigUser == game.getMeChairId())
		{
			game.setMakesureUser(parseData.wConfigUser);

			// 发送命令
			var dataBuilder = new DataBuilder();
			dataBuilder.init(0);
			g_gameSocket.sendData(MDM_GF_GAME,CMD_HZMJ.SUB_C_MAKESURE,dataBuilder.getData());
		}	
	},

	// 用户坐下
	OnUserMakesure:function(data){
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		// 接收参数
		var dataParser = new DataParser();
		dataParser.init(data);	
		cc.log("用户坐下data"+data);
		var parseData = dataParser.parse([			                                      
		                                  ["wChairId", "WORD"] // 椅子号		                              
		                                  ]);
		cc.log("OnUserMakesure:"+parseData.wChairId.toString());
		game.setCurrentUser(INVALID_CHAIR);

		var dlgUserInf=UIMgr.getInstance().getDlg(ID_DlgHzmjUserInf);
		if(!dlgUserInf) return;
		dlgUserInf.updataScore();
		HzmjUIMgr.getInstance().update();

	},
	// 用户退出
	OnUserExist:function(data){
		cc.log("用户退出"+JSON.stringify(data));
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var removeID;
		if(game.getMeChairId() == 1)
			removeID=0;
		else
			removeID=1;
		table.removePlayerByChairID(removeID);
		
		HzmjUIMgr.getInstance().update();
	},

	// //////////////////////////////////////////////客户端发送消息/////////////////////////////
	// 出牌消息
	sendOutCard:function(data){
		g_gameSocket.sendData("C2G_HZMJ_HZOutCard", {
            CardData :data.cbCardData
		});
	},	

	// 操作命令
	sendOperateCard:function(data){
		// 发送消息
		cc.log("发送操作命令");
		g_gameSocket.sendData("C2G_HZMJ_OperateCard",{
            OperateCode :  data.cbOperateCode,
            OperateCard : data.cbOperateCard,
		});
	},
});

var g_HzmjGameMsg = null;

HzmjGameMsg.getInstance = function(){
	if(g_HzmjGameMsg == null){
		g_HzmjGameMsg = new HzmjGameMsg();
	}
	return g_HzmjGameMsg;
}

GameMsgMgr.getInstance().addGameMsgInstance(HzmjGameMsg.getInstance());
