/*
 sxh 消息处理类，用来处理
 发送
 接收
 * */
var SssGameMsg = GameMsg.extend({

	ctor: function(){
		cc.log("SSSGameMsg 被创建");
	},

	//判断是否当前运行游戏
	isCurRunGame: function(){

		var kindId = 0;
		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			kindId = plaza.getCurKindID();
			cc.log("AAAkind=%d"+kindId);
			cc.log("bbbbb"+CMD_SSS.KIND_ID);
			if(kindId == CMD_SSS.KIND_ID){
				return true;
			}
			else {
				cc.log(" 错误 kind=%d"+kindId);
				
			}
		}
		cc.log("isCurRunGame kindId=%d ",kindId);

		return false;
	},

	onGameStatus: function(){
		cc.log("十三水 onGameStatus 消息");
		if(!this.isCurRunGame()){
			return;
		}
		//set game
		var game = new SssGameModel();
		ClientData.getInstance().setGame(game);
	},

	//十三水游戏命令
	onGameMsg: function(subCmd, data){

		cc.log("十三水 onGameMsg 消息");

		if(!this.isCurRunGame()){
			return;
		}

		switch (subCmd) {
		/* 响应
		 SUB_S_GAME_START:				100,									//游戏开始 发送扑克
		 SUB_S_CALL_SCORE:				101,									//设置分段
		 SUB_S_BANKER_INFO:				102,									//庄家信息
		 SUB_S_OUT_CARD:				103,									//用户出牌
		 SUB_S_PASS_CARD:				104,									//放弃出牌
		 SUB_S_GAME_CONCLUDE:			105,									//游戏结束
		 SUB_S_SET_BASESCORE:			106,									//设置基数
		 * */
		//游戏开始，马上获取自己的牌
		case CMD_SSS.SUB_S_SEND_CARD:
			this.onGameMsgGameStart(data);
			break;

		case CMD_SSS.SUB_S_SETSEGMENT:
			cc.log("SSS设置分段");
			
			break;

		case CMD_SSS.SUB_S_SHOW_CARD:
			cc.log("SSS玩家摊牌");
			this.onPlayerShowCard(data);
			break;
			
		case CMD_SSS.GS_TK_PLAYERECORD:{
			cc.log("#### 游戏场景消息， （十三水游戏命令 ）返回玩家之前记录数据");
			var dataParser = new DataParser();
			dataParser.init(data);
			var parseData = dataParser.parse([	
			                                  ["nCount", 		"BYTE"],		//局数
			                                  ["lDetailScore", 	"SCORE[]",128],										//操作标志
			                                  ]);

			cc.log("parseData = " + JSON.stringify(parseData));
			var table = ClientData.getInstance().getTable();
			g_outcome.reset();
			for(chairId=0; chairId<CMD_SSS.GAME_PLAYER; chairId++){
				var player = table.getPlayerByChairID(chairId);
				pos = SssUIMgr.getInstance().getPlayerPosByChairId(chairId); 
				if(player == null){
					if(nSssGameModel.playerDatas[pos]){
						player=nSssGameModel.playerDatas[pos].nPlayer;
					}				
				}
				g_outcome.playerDatas[pos].nPlayer = player;
				for(var num=0;num<parseData.nCount;num++){
					g_outcome.playerDatas[pos].gNumPoint[num] = parseData.lDetailScore[chairId*32+num];
					var temp = chairId*32+num;
					cc.log("pos="+pos+"temp="+temp);
					cc.log("pos="+ parseData.lDetailScore[chairId*32+num]);
				}		
//				var game = ClientData.getInstance().getGame();
//				if(game){
//					if(parseData.nCount>=game.getDrawCountLimit()){
//						var dlg = UIMgr.getInstance().openDlg(ID_DlgResult);
//						dlg.onIsMaster(g_objHero.getUserId() == game.getTableOwnerUserID());
//						g_outcome.reset();
//					}
//				}
			}
		}

		break;

		case CMD_SSS.SUB_S_GAME_END:
			cc.log("SSS游戏结束 数据长度="+data.byteLength);
			this.onGameoverMsg(data);
			break;

		case CMD_SSS.SUB_S_GAME_COMPARE:
			cc.log("SSS游戏比牌");
			break;

		case CMD_SSS.SUB_S_PLAYER_LEFT:
			cc.log("SSS玩家强退");
			break;

		case CMD_SSS.SUB_S_SCORE_RESULT:
			cc.log("SSS游戏结算");
			nSssGameModel.gameoverFlag = true;
			break;
			
		case CMD_SSS.SUB_S_USEREXIT:
			cc.log("SSS玩家退出");
			var flag = false;
			if(nSssGameModel){
				if(nSssGameModel.gameComping == true){
					flag = true;
				}
			}
			if(flag == false){
				this.onPlayerExit(data);
			}			
			break;
			
		case CMD_SSS.SUB_S_AMDIN_COMMAND:
			cc.log("SSS管理员命令");
			break;
			
		case 103:
			cc.log("SSS游戏状态：游戏重连");
			break;


		default:
		{
			cc.log("命令 %d 未处理!",subCmd);
		}
			break;
		}
	},

	//游戏场景消息 进入房间后，会发送，
	onGameSceneMsg: function(data){
		cc.log("十三水 onGameSceneMsg 消息");
		if(!this.isCurRunGame()){
			return;
		}

		//设置游戏场景 注意：只有这边设置了，发送房间后完成后，才能用这个场景运行
		GameKindMgr.getInstance().setNewGameSceneFun(function(){
			var gameScene = new SssGameScene();
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

		var i=0;

		switch (gameStatus) {
		case CMD_SSS.GS_TK_FREE:{

			cc.log("#### 游戏场景消息， （十三水游戏命令 ）等待开始");
			nSssGameModel.gameComping == false
		}
		break;
		case CMD_SSS.GS_TK_CALL:{}

		break
		case CMD_SSS.GS_TK_PLAYING:{


			cc.log("#### 游戏场景消息， （十三水游戏命令 ）游戏进行");

			var dataParser = new DataParser();
			dataParser.init(data);
			var parseData = dataParser.parse([
			                                  ["lCellScore",			"LONGLONG"],									//基础积分
			                                  ["cbPlayStatus", 			"BYTE[]", 		CMD_SSS.GAME_PLAYER],		//用户状态
			                                  ["cbDynamicJoin", 		"BYTE"],										//动态加入
			                                  ["lTurnMaxScore", 		"LONGLONG"],									//最大下注
			                                  ["lTableScore", 			"LONGLONG[]", 	CMD_SSS.GAME_PLAYER],		//下注数目（玩家下注值）
			                                  ["wBankerUser", 			"WORD"],										//庄家用户
			                                  //扑克信息
			                                  ["cbHandCardData", 		"BYTE[][]", 	CMD_SSS.GAME_PLAYER, CMD_SSS.MAXCOUNT],//桌面扑克
			                                  ["bOxCard", 				"BYTE[]", 		CMD_SSS.GAME_PLAYER],		//牛牛数据
			                                  //历史积分
			                                  ["lTurnScore", 			"LONGLONG[]", 	CMD_SSS.GAME_PLAYER],		//积分信息
			                                  ["lCollectScore", 		"LONGLONG[]", 	CMD_SSS.GAME_PLAYER],		//积分信息
			                                  ["szGameRoomName", 		"TCHARS", 		CMD_SSS.SERVER_LEN],		//房间名称
			                                  ["cbCtrFlag", 			"BYTE"],										//操作标志
			                                  ["wMaxScoreTimes", 		"WORD"],										//最大倍数
			                                  ["lAndroidMaxCellScore", 	"LONG"],										//机器人可设置的最大底注
			                                  ["lAndroidMinCellScore", 	"LONG"],										//机器人可设置的最小底注
			                                  ]);

			cc.log("parseData = " + JSON.stringify(parseData, null, 2));
			game.setCellScore(parseData.lCellScore);
			game.setTurnMaxScore(parseData.lTurnMaxScore);
			game.setBankerChairId(parseData.wBankerUser);
			game.setAllPlayerCards(parseData.cbHandCardData);
			game.setCtrlFlag(parseData.cbCtrFlag);
			game.setAndroidMinCellScore(parseData.lAndroidMinCellScore);
			game.setAndroidMaxCellScore(parseData.lAndroidMaxCellScore);
			game.setMaxScoreTimes(parseData.wMaxScoreTimes);

			for(i=0; i<CMD_SSS.GAME_PLAYER; i++){
				// cc.log("@@@@@@@@@ cbPlayStatus" + parseData.cbPlayStatus[i]);
				game.setPlayByChairId(i, parseData.cbPlayStatus[i]);
				game.setAddScore(i, parseData.lTableScore[i]);
				game.setTurnScore(i, parseData.lTurnScore[i]);
				game.setCollectScore(i, parseData.lCollectScore[i]);

				if(parseData.bOxCard[i] != 0xFF){
					game.openCard(i, parseData.cbHandCardData[i]);
				}

				//用户名字
				var player = table.getPlayerByChairID(i);
				if(player){
					var nick = player.getNickName();
					game.setNick(i, nick);
				}
			}
		}
		break;
		
		case CMD_SSS.GS_TK_CARD:{
			cc.log("#### 游戏场景消息， （十三水游戏命令 ）游戏断线重连");

			var dataParser = new DataParser();
			dataParser.init(data);
			var parseData = dataParser.parse([
			                                  ["wCurrentUser",			"WORD"],			//当前玩家
			                                  ["lCellScore", 			"LONGLONG"],		//单元底分
			                                  ["nChip", 			"LONGLONG[]",4],		//下注大小
			                                  ["bHandCardData", 		"BYTE[]",13],		//扑克数据
			                                  ["bSegmentCard", 			"BYTE[][]",4,15],		//分段扑克
			                                  ["bFinishSegment", 		"BOOL[]",4],		//完成分段
			                                  ["wUserToltalChip", 		"LONGLONG"],		//总共金币
			                                  ["bOverTime", 			"BOOL[]",4],		//超时状态
			                                  ["bSpecialTypeTable1", 	"BOOL[]",4],		//是否特殊牌型
			                                  ["bDragon1", 				"BOOL[]",4],		//是否倒水
			                                  ["bAllHandCardData", 		"BYTE[][]",4,13],	//所有玩家的扑克数据
			                                  ["sGameEnd", 		"STRUCT",[
			                                               		          ["lGameTax", 		"LONGLONG"],	//游戏税收
			                                               		          ["lGameEveryTax", "LONGLONG[]",4],//每个玩家的税收
			                                               		          ["lGameScore", 	"LONGLONG[]",4],//游戏积分
			                                               		          ["bEndMode",    	"BYTE"],  //结束方式
			                                               		          ["cbCompareResult", 	"INT[][]",4,3],   //每一道比较结果
			                                               		          ["cbSpecialCompareResult", 	"INT[]",4],  //特殊牌型比较结果
			                                               		          ["cbCompareDouble", 	"INT[]",4],   //翻倍的道数
			                                               		          ["cbUserOverTime", 	"INT[]",4],  //玩家超时得到的道数
			                                               		          ["bCardData", 	"BYTE[][]",4,13],	   //扑克数据
			                                               		          ["bUnderScoreDescribe", 	"BYTE[][]",4,30], //底分描述
			                                               		          ["bCompCardDescribe", 	"STRUCT[]",[
			                                               		                                	            ["bCompCardDescribe", 	"BYTE[][]",3,30]],
			                                               		                                	            4],  //牌比描述
			                                               		                                	            ["bToltalWinDaoShu", 	"INT[]",4],   //总共道数
			                                               		                                	            ["lUnderScore", 		"LONG"],	//底注分数
			                                               		                                	            ["bAllDisperse", 	"BOOL[]",4],   //所有散牌
			                                               		                                	            ["bOverTime", 	"BOOL[]",4],     //超时状态
			                                               		                                	            ["bUserLeft", 	"BOOL[]",4], 	//玩家逃跑
			                                               		                                	            ["bLeft", 	"BOOL"], 
			                                               		                                	            ["LeftszName", 	"TCHAR[]",1040], 
			                                               		                                	            ["LeftChairID", 	"INT[]",4], 
			                                               		                                	            ["bAllLeft", 	"BOOL"],  
			                                               		                                	            ["LeftScore", "LONGLONG[]",4],
			                                               		                                	            ["bSpecialCard", 	"BOOL[]",4],   //是否为特殊牌
			                                               		                                	            ["bAllSpecialCard", 	"BOOL"],  //全是特殊牌
			                                               		                                	            ["nTimer", 	"INT"],		//结束后比牌、打枪时间
			                                               		                                	            ["ShootState", "INT[]",12],//赢的玩家,输的玩家 2为赢的玩家，1为全输的玩家，0为没输没赢的玩家
			                                               		                                	            ["nXShoot", 	"BYTE"],  //几家打枪
			                                               		                                	            ["cbThreeKillResult", "INT[]",4],//全垒打加减分
			                                               		                                	            ["bEnterExit", "BOOL"],//是否一进入就离开
			                                               		                                	            ["wAllUser", 	"WORD"],  //全垒打用户
			                                               		          ]],	//游戏结束数据
			                                  ]);
			
			cc.log("parseData = " + JSON.stringify(parseData));
			if(parseData.sGameEnd.lGameScore[0]>0){
				nSssGameModel.gameComping = true;
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
			nSssGameModel.reset();
			nSssGameModel.cellScore = parseData.lCellScore;
			for(chairId=0; chairId<CMD_SSS.GAME_PLAYER; chairId++){
				pos = SssUIMgr.getInstance().getPlayerPosByChairId(chairId);   
				cc.log("重连pos= "+pos);
				cc.log("重连chairId= "+chairId);
				var player = table.getPlayerByChairID(chairId);
				var userID = 0;
				var ready = 0;
				var isMe = false;
				if(player){
					var userID = player.getUserId();
					cc.log("userID= "+userID);
					if(userID == g_objHero.getUserId()){
						isMe = true;
						cc.log("我的pos = "+pos);
					}
					
					ready= player.getStatus();
				}
				for(var num =0;num<15;num++){
					cc.log("parseData.bSegmentCard[chairId]["+num+"]"+parseData.bSegmentCard[pos][num]);
				}
				if(isMe == true){
					nSssGameModel.playerDatas[pos].card = parseData.bHandCardData;
				}
				nSssGameModel.playerDatas[pos].bPlay = parseData.bFinishSegment[chairId];
				nSssGameModel.playerDatas[pos].cardone = [parseData.bSegmentCard[chairId][0],parseData.bSegmentCard[chairId][1],parseData.bSegmentCard[chairId][2]];
				nSssGameModel.playerDatas[pos].cardtwo = [parseData.bSegmentCard[chairId][5],parseData.bSegmentCard[chairId][6],parseData.bSegmentCard[chairId][7],
				                                          parseData.bSegmentCard[chairId][8],parseData.bSegmentCard[chairId][9]];
				nSssGameModel.playerDatas[pos].cardthree = [parseData.bSegmentCard[chairId][10],parseData.bSegmentCard[chairId][11],parseData.bSegmentCard[chairId][12],
				                                            parseData.bSegmentCard[chairId][13],parseData.bSegmentCard[chairId][14]];
				nSssGameModel.playerDatas[pos].addScore = parseData.sGameEnd.lGameScore[chairId];
				nSssGameModel.playerDatas[pos].nSpecial = parseData.sGameEnd.bSpecialCard[chairId];
				nSssGameModel.playerDatas[pos].cardResult = parseData.cbCompareResult[chairId];
				
				for(var num =0;num<3;num++){
					cc.log("nSssGameModel.playerDatas[pos].cardone"+nSssGameModel.playerDatas[pos].cardone[num]);
				}
				for(var num =0;num<5;num++){
					cc.log("nSssGameModel.playerDatas[pos].cardtwo"+nSssGameModel.playerDatas[pos].cardtwo[num]);
				}
				for(var num =0;num<5;num++){
					cc.log("nSssGameModel.playerDatas[pos].cardthree"+nSssGameModel.playerDatas[pos].cardthree[num]);
				}

			}
//			if(g_outcome.playerDatas[0].gNumPoint.length>=game.getDrawCountLimit()){
//				SssUIMgr.getInstance().onUnscheduleAllSelectors();
//				var dlg = UIMgr.getInstance().openDlg(ID_DlgResult);
//				dlg.onIsMaster(g_objHero.getUserId() == game.getTableOwnerUserID());
//				g_outcome.reset();
//			}
//			else{
				SssUIMgr.getInstance().onUpdateAllPlayerInfo(CMD_SSS.SSS_GAMEMSG);
//			}
						
			break;
		}
		
		default:
			break;
		}

		///////////////////////////////////后UI处理 //////////////////////////////////////////
		SssUIMgr.getInstance().onGameScene();
	},
	
	onPlayerShowCard : function(data) {
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wCurrentUser", 		"WORD"],		//当前玩家
		                                  ["bFrontCard",    	"BYTE[]",3],	    //前墩扑克
		                                  ["bMidCard", 	"BYTE[]",5],	    //中墩扑克
		                                  ["bBackCard", 	"BYTE[]",5],	    //后墩扑克
		                                  ["bCanSeeShowCard", 	"BOOL"],  		//能否看牌
		                                  ["bSpecialType", 	"BOOL"],  		//是否是特殊牌
		                                  ["btSpecialData", 	"BYTE[]",13],  		//特殊扑克
		                                  ["wShowUser", 	"WORD"],  		//摊牌的玩家
		                                  ["bDragon", 	"BOOL"],  		//是否乌龙
		                                  ]);

		cc.log("玩家组牌完成parseData = " + JSON.stringify(parseData));

		///////////////////////////////////先数据处理//////////////////////////////////////////
		var pos = SssUIMgr.getInstance().getPlayerPosByChairId(parseData.wShowUser);   
		cc.log("玩家组牌完成pos = " + pos);
		nSssGameModel.playerDatas[pos].cardone=parseData.bFrontCard;
		nSssGameModel.playerDatas[pos].cardtwo=parseData.bMidCard;
		nSssGameModel.playerDatas[pos].cardthree=parseData.bBackCard;
		nSssGameModel.playerDatas[pos].bPlay = true;
		nSssGameModel.playerDatas[pos].nSpecial = parseData.bSpecialType;
		var table = ClientData.getInstance().getTable();
		if(parseData.wShowUser!=g_objHero.getUserId()){
			SoundMgr.getInstance().playEffect("sss_cardover", 0, false);
		}
		if(table){
			var player = table.getPlayerByChairID(parseData.wShowUser);
			table.setGameStatus(CMD_SSS.GS_TK_PLAYING);
		}
		SssUIMgr.getInstance().onUpdateAllPlayerInfo(CMD_SSS.SSS_GAMEMSG);
	},
	
	onGameoverMsg: function(data){
		cc.log("### 游戏服务器， （十三水游戏命令 ）游戏比牌 ");
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["lGameTax", 		"LONGLONG"],	//游戏税收
		                                  ["lGameEveryTax", "LONGLONG[]",4],//每个玩家的税收
		                                  ["lGameScore", 	"LONGLONG[]",4],//游戏积分
		                                  ["bEndMode",    	"BYTE"],  //结束方式
		                                  ["cbCompareResult", 	"INT[][]",4,3],   //每一道比较结果
		                                  ["cbSpecialCompareResult", 	"INT[]",4],  //特殊牌型比较结果
		                                  ["cbCompareDouble", 	"INT[]",4],   //翻倍的道数
		                                  ["cbUserOverTime", 	"INT[]",4],  //玩家超时得到的道数
		                                  ["bCardData", 	"BYTE[][]",4,13],	   //扑克数据
		                                  ["bUnderScoreDescribe", 	"BYTE[][]",4,30], //底分描述
		                                  ["bCompCardDescribe", 	"STRUCT[]",[
		                                                        	            ["bCompCardDescribe", 	"BYTE[][]",3,30]],
		                                                        	            4],  //牌比描述
		                                  ["bToltalWinDaoShu", 	"INT[]",4],   //总共道数
		                                  ["lUnderScore", 		"LONG"],	//底注分数
		                                  ["bAllDisperse", 	"BOOL[]",4],   //所有散牌
		                                  ["bOverTime", 	"BOOL[]",4],     //超时状态
		                                  ["bUserLeft", 	"BOOL[]",4], 	//玩家逃跑
		                                  ["bLeft", 	"BOOL"], 
		                                  ["LeftszName", 	"TCHAR[]",1040], 
		                                  ["LeftChairID", 	"INT[]",4], 
		                                  ["bAllLeft", 	"BOOL"],  
		                                  ["LeftScore", "LONGLONG[]",4],
		                                  ["bSpecialCard", 	"BOOL[]",4],   //是否为特殊牌
		                                  ["bAllSpecialCard", 	"BOOL"],  //全是特殊牌
		                                  ["nTimer", 	"INT"],		//结束后比牌、打枪时间
		                                  ["ShootState", "INT[]",12],//赢的玩家,输的玩家 2为赢的玩家，1为全输的玩家，0为没输没赢的玩家
		                                  ["nXShoot", 	"BYTE"],  //几家打枪
		                                  ["cbThreeKillResult", "INT[]",4],//全垒打加减分
		                                  ["bEnterExit", "BOOL"],//是否一进入就离开
		                                  ["wAllUser", 	"WORD"],  //全垒打用户		
		                                  ]);
		
		cc.log("玩家开始比牌数据parseData = " + JSON.stringify(parseData));
		var table = ClientData.getInstance().getTable();
		var bCardData = [];
		var chairId = 0;
		var cbCompareResult = [];
		var lGameScore = [];
		for(chairId=0; chairId<CMD_SSS.GAME_PLAYER; chairId++){
			var pos = SssUIMgr.getInstance().getPlayerPosByChairId(chairId); 	
			nSssGameModel.playerDatas[pos].score = parseData.cbCompareResult[chairId][0]+parseData.cbCompareResult[chairId][1]+parseData.cbCompareResult[chairId][2];
			nSssGameModel.playerDatas[pos].addScore = parseData.lGameScore[chairId];
			nSssGameModel.playerDatas[pos].nSpecialScore = parseData.cbSpecialCompareResult[chairId];
			bCardData[pos]=nSssGameModel.playerDatas[pos].cardone;
			bCardData[pos]=bCardData[pos].concat(nSssGameModel.playerDatas[pos].cardtwo);
			bCardData[pos]=bCardData[pos].concat(nSssGameModel.playerDatas[pos].cardthree);
			nSssGameModel.playerDatas[pos].cardResult = parseData.cbCompareResult[chairId];
			cc.log("玩家开始比牌数据nSssGameModel.playerDatas[pos].cardResult= " + JSON.stringify(nSssGameModel.playerDatas[pos].cardResult));
			cbCompareResult[pos] = parseData.cbCompareResult[chairId];
			lGameScore[pos]=nSssGameModel.playerDatas[pos].addScore;
//			nSssGameModel.playerDatas[pos].bPlay = false;
		};
		var game = ClientData.getInstance().getGame();
		var gameNum = game.getPlayCount();
//		game.setPlayCount(gameNum+1);
		SssUIMgr.getInstance().onUpdateAllPlayerInfo(CMD_SSS.SSS_GAMEMSG);
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgCNPokePlayer);
		if(dlgPlayer){
			dlgPlayer.setPlayerBoxStatus(false);
		}
		cc.log("玩家开始比牌数据bCardData= " + JSON.stringify(nSssGameModel.playerDatas));
		
		var bPlaynum = 0;
		for(var temp = 0;temp<4;temp++){
			cc.log("nSssGameModel.playerDatas[num].bPlay="+nSssGameModel.playerDatas[temp].bPlay);
			if(nSssGameModel.playerDatas[temp].bPlay ==  true){
				bPlaynum=bPlaynum+1;
			}
			
		}
		
		cc.log("开始比牌bPlaynumbPlaynum ="+bPlaynum);
		if(bPlaynum>=4){
			nSssGameModel.gameComping = true;
			SoundMgr.getInstance().playEffect("sss_compare", 0, false);
			var calcul0 = function(bCardData,cbCompareResult,lGameScore){
				return function(){
					cc.log("开始比牌");
					SssUIMgr.getInstance().onCompareResult(bCardData, cbCompareResult,lGameScore);			
				}
			};

			setTimeout(calcul0(bCardData,cbCompareResult,lGameScore), 1500);
		}		
	},

	//游戏开始 100
	onGameMsgGameStart : function(data){

		cc.log("### 游戏服务器， （十三水游戏命令 ）游戏开始 100");
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wCurrentUser", 		"WORD"],		//当前玩家
		                                  ["bAllHandCardData",    	"BYTE[][]",4,13],	    //所有玩家的扑克数据
		                                  ["bCardData", 	"BYTE[]",13],	    //手上扑克
		                                  ["lCellScore", 	"LONG"],  		//游戏底分
		                                  ]);

		cc.log("开始发牌数据parseData = " + JSON.stringify(parseData));

		///////////////////////////////////先数据处理//////////////////////////////////////////
		UIMgr.getInstance().closeDlg(ID_DlgCNPokeBegin);
				
		var gamePoint = UIMgr.getInstance().getDlg(ID_DlgCNGameStart);
		if(gamePoint){
			gamePoint.onSetBasePoint(parseData.lCellScore);
		}
		var table = ClientData.getInstance().getTable();
		if(table){
			table.setGameStatus(CMD_SSS.GS_TK_PLAYING);
		}
		var game = ClientData.getInstance().getGame();
		if(game){
			game.setPlayCount(game.getPlayCount()+1);
		}
		nSssGameModel.reset();
		for(chairID=0; chairID<CMD_SSS.GAME_PLAYER; chairID++){
			var pos = SssUIMgr.getInstance().getPlayerPosByChairId(chairID);
			cc.log("开始发牌pos = " + pos);
			cc.log("parseData.bAllHandCardData[pos] = " + JSON.stringify(parseData.bAllHandCardData[pos]));
			nSssGameModel.playerDatas[pos].card = parseData.bAllHandCardData[chairID];
			nSssGameModel.playerDatas[pos].bPlay = false;
			
			var player =  table.getPlayerByChairID(chairID);
//			player.setStatus(US_PLAYING);
		}
		SssUIMgr.getInstance().onUpdateAllPlayerInfo(CMD_SSS.SSS_GAMEMSG);
		
	},

	//加注结果 101
	onGameMsgAddScore: function(data){},

	//用户强退 102
	onGameMsgPlayerExit: function(data){

		cc.log("### 游戏服务器， （十三水游戏命令 ）用户强退 102");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wPlayerID", "WORD"],	//退出用户
		                                  ]);

		 cc.log("parseData = " + JSON.stringify(parseData));
	},
	onPlayerExit:function(data){
		cc.log("### 游戏服务器， （十三水游戏命令 ）用户退出 102");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["nLeftChairID", "WORD"],	//退出用户
		                                  ]);
		
		cc.log("parseData = " + JSON.stringify(parseData));
		
		var table = ClientData.getInstance().getTable();
		if(table){
			var players = table.getPlayers();
			var playernum = players.length;
			if(players&&playernum){
				for(var num = 0;num<playernum;num++){
					if(players[num]){
						var chairID =  players[num].getChairID();
						if(chairID == parseData.nLeftChairID){
							table.removePlayerByChairID(chairID);
						}
					}
				}
			}	
		}
	},

	//发牌消息 103
	onGameMsgSendCard: function(data){

		cc.log("### 游戏服务器， （十三水游戏命令 ）发牌消息 103");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbCardData", "BYTE[][]", CMD_SSS.GAME_PLAYER, CMD_SSS.MAXCOUNT],	//用户扑克
		                                  ]);

		// cc.log("parseData = " + JSON.stringify(parseData));

		///////////////////////////////////先数据处理//////////////////////////////////////////
		var game = ClientData.getInstance().getGame();
		if(game){
			game.setAllPlayerCards(parseData.cbCardData);
		}

		var table = ClientData.getInstance().getTable();
		if(table){
			table.setGameStatus(CMD_SSS.GS_TK_PLAYING);
		}
		///////////////////////////////////后UI处理 //////////////////////////////////////////
		SssUIMgr.getInstance().onSendCard();
	},

	//游戏结束 104
	onGameMsgGameEnd: function(data){

		cc.log("### 游戏服务器， （通比牛牛游戏命令 ）游戏结束 104");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["lGameTax", 		"LONGLONG[]", 	CMD_SSS.GAME_PLAYER],	 //游戏税收
		                                  ["lGameScore", 		"LONGLONG[]", 	CMD_SSS.GAME_PLAYER],  //游戏得分
		                                  ["cbCardData", 		"BYTE[]", 		CMD_SSS.GAME_PLAYER],  //用户扑克
		                                  ["AllbCardValue", 	"BYTE[]", 		CMD_SSS.GAME_PLAYER],
		                                  ["MMcbCardData", 	"BYTE[][]", 	CMD_SSS.GAME_PLAYER, CMD_SSS.MAXCOUNT],  //用户扑克
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData, null, 2));

		///////////////////////////////////先数据处理//////////////////////////////////////////
		var game = ClientData.getInstance().getGame();
		if(game){
			game.gameEnd(parseData);
		}

		var table = ClientData.getInstance().getTable();
		if(table){
			table.setGameStatus(CMD_SSS.GS_TK_FREE);
		}
		///////////////////////////////////后UI处理 //////////////////////////////////////////
		SssUIMgr.getInstance().onGameEnd();
	},

	//用户摊牌 105
	onGameMsgOpenCard: function(data){

		cc.log("### 游戏服务器， （通比牛牛游戏命令 ）用户摊牌 105");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wPlayerID", 	"WORD"],	//摊牌用户
		                                  ["bOpen", 		"BYTE"],  	//摊牌标志，
		                                  ["cbCardData", 	"BYTE[][]",	CMD_SSS.GAME_PLAYER, CMD_SSS.MAXCOUNT],  //牌数据
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		///////////////////////////////////先数据处理//////////////////////////////////////////
		var game = ClientData.getInstance().getGame();
		if(game){
			game.openCard(parseData.wPlayerID, parseData.cbCardData[parseData.wPlayerID]);
		}

		///////////////////////////////////后UI处理 //////////////////////////////////////////
		SssUIMgr.getInstance().onOpenCard(parseData.wPlayerID);
	},

	//用户叫庄  106
	onGameMsgCallBanker: function(data){

		cc.log("### 游戏服务器， （通比牛牛游戏命令 ）用户叫庄 ");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["bQiang_Start",	"BOOL"],	//开始抢 false
		                                  ["wCallBanker", 	"WORD"],	//叫庄用户
		                                  ["bFirstTimes", 	"BOOL"],  	//首次叫庄
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData, null, 2));

		///////////////////////////////////先数据处理//////////////////////////////////////////
		var table = ClientData.getInstance().getTable();
		if(table){
			//刚开始游戏
			if(parseData.bFirstTimes){
				// table.startGame();
			}

			var game = ClientData.getInstance().getGame();
			if(game){
				game.setFirstTimesCallBanker(parseData.bFirstTimes);
				game.setCallBankerChairId(parseData.wCallBanker);
			}

			table.setGameStatus(CMD_SSS.GS_TK_CALL);

			if (parseData.bQiang_Start) {

			} else {
				// 		m_wBankerUser=pCallBanker->wCallBanker;
				// //庄家标志
				// WORD wID=m_wViewChairID[m_wBankerUser];
				// m_GameClientView.SetBankerUser(wID);

				// //m_GameClientView.m_bShowSmallBank=true;//1.29
				if (g_objHero.getChairID() == parseData.wCallBanker) {
					this.sendCallBanker(true);
				};
			}
		}

		///////////////////////////////////后UI处理 //////////////////////////////////////////
		SssUIMgr.getInstance().onCallBanker();
	},

	//发牌控制 107 not used
	onGameMsgAllCard: function(data){

		cc.log("### 游戏服务器， （通比牛牛游戏命令 ）发牌控制 107");

		//只发给机器人
	},

	//设置底注
	onGameMsgSetBaseCore: function(data) {

		cc.log("### 游戏服务器， （通比牛牛游戏命令 ）设置底注 ");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["lBaseScore",	"LONG"],
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData, null, 2));

		var game = ClientData.getInstance().getGame();
		game.setCellScore(parseData.lBaseScore);
	},

	/////////////////////////////////C - > S///////////////////////////////////////

	/**
	 * 设置用户底注
	 * @param cbCallScore 底注
	 */
	sendCallCellScore: function(cbCallScore) {
		cc.log("@@@@发送设置底注"+cbCallScore);
		var dataBuilder = new DataBuilder();
		dataBuilder.init(4);
		dataBuilder.build([
		                   ["cbCallScore", "LONG", cbCallScore],
		                   ]);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_gameSocket.sendData(MDM_GF_GAME, CMD_SSS.SUB_C_CALL_CELLSCORE, dataBuilder.getData());
		}
	},

//	//用户叫庄
//	sendCallBanker: function(bBanker){
//		cc.log("斗地主 sendCallBanker 消息");
//		var bCall = 0;
//		if(bBanker){
//			bCall = 1;
//		}
//
//		// var bStuff1 = 1;
//		// var bStuff2 = Math.floor(Math.random() * 100);
//
//		var dataBuilder = new DataBuilder();
//		dataBuilder.init(1);
//		dataBuilder.build([
//		                   ["bBanker", "BYTE", bCall],		//做庄标志
//		                   ]);
//
//		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
//			g_gameSocket.sendData(MDM_GF_GAME, CMD_SSS.SUB_C_CALL_BANKER, dataBuilder.getData());
//		}
//	},

	//用户加注
	sendAddScore: function(addMoney){

		cc.log("斗地主 sendAddScore 消息");
		var bStuff = 0;

		var dataBuilder = new DataBuilder();
		dataBuilder.init(8);
		dataBuilder.build([
		                   ["lScore", "INT64_NUMBER", addMoney],//加注数目
		                   ]);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_gameSocket.sendData(MDM_GF_GAME, CMD_SSS.SUB_C_ADD_SCORE, dataBuilder.getData());
		}
	},

	//用户摊牌
	sendOpenCard: function(bOX, cardData){
		cc.log("斗地主 sendOpenCard 消息");
		// var bStuff = [0, 0];
		var cbOX = bOX ? 1 : 0;
		cc.log("@@@@@@@@@@@@ sendOpenCard" + bOX + " " + cbOX + " " + cardData);
		var dataBuilder = new DataBuilder();
		dataBuilder.init(6);
		dataBuilder.build([
		                   ["bOX", "BYTE", cbOX],//牛牛标志
		                   ["cbCardData",	"BYTE[]", cardData, CMD_SSS.MAXCOUNT],
		                   ]);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_gameSocket.sendData(MDM_GF_GAME, CMD_SSS.SUB_C_OPEN_CARD, dataBuilder.getData());
		}
	},

});


var g_SssGameMsg = null

SssGameMsg.getInstance = function(){
	if(g_SssGameMsg == null){
		g_SssGameMsg = new SssGameMsg();
	}
	return g_SssGameMsg;
}

GameMsgMgr.getInstance().addGameMsgInstance(SssGameMsg.getInstance());
