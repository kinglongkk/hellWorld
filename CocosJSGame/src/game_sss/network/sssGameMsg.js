/*
 sxh 消息处理类，用来处理
 发送
 接收
 * */
var SssGameMsg = GameMsg.extend({

	ctor: function(){
        cc.log("---------- SSSGameMsg. 消息中转器被建创--------------------")
        this.setName("SSSGameMsg 消息中转器")
	},

	//判断是否当前运行游戏
	isCurRunGame: function(){

		var kindId = 0;
		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			kindId = plaza.getCurKindID();
			cc.log("AAAkind=%d"+kindId);
			cc.log("bbbAkind"+CMD_SSS.KIND_ID);
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

        var game = ClientData.getInstance().getGame();

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
            var game = ClientData.getInstance().getGame();
			g_outcome.reset();
			for(chairId=0; chairId<CMD_SSS.GAME_PLAYER; chairId++){
				var player = table.getPlayerByChairID(chairId);
				pos = SssUIMgr.getInstance().getPlayerPosByChairId(chairId); 
				if(player == null){
					if(game.playerDatas[pos]){
						player=game.playerDatas[pos].nPlayer;
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
			game.gameoverFlag = true;
			break;
			
		case CMD_SSS.SUB_S_USEREXIT:
			cc.log("SSS玩家退出");
			var flag = false;
			if(game){
				if(game.gameComping == true){
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
	onSssGameFreeScene: function(data){
		if(!this.isCurRunGame()){
			cc.log("场景存在-");
			return;
		}
        cc.log("*****************进入十三水场景**************");
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

        //设置玩家人数
        cc.log("设置玩家人数"+data.playerCount);
        SssUIMgr.getInstance().setPlayerCount(data.playerCount);

       	//UIMgr.getInstance().getDlg(ID_DlgUserInfo);
        //UIMgr.getInstance().openDlg(ID_DlgGameSet);

		var gameStatus = table.getGameStatus();

		var i=0;

		switch (gameStatus) {
		case CMD_SSS.GS_TK_FREE:{

			cc.log("#### 游戏场景消息， （十三水游戏命令 ）等待开始");
            cc.log("CMD_SSS.GS_TK_FREE");
			game.gameComping == false
		}
		break;
		case CMD_SSS.GS_TK_CALL:{}
			cc.log("CMD_SSS.GS_TK_CALL");
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
				game.gameComping = true;
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
			game.reset();
			game.cellScore = parseData.lCellScore;
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
					game.playerDatas[pos].card = parseData.bHandCardData;
				}
				game.playerDatas[pos].bPlay = parseData.bFinishSegment[chairId];
				game.playerDatas[pos].cardone = [parseData.bSegmentCard[chairId][0],parseData.bSegmentCard[chairId][1],parseData.bSegmentCard[chairId][2]];
				game.playerDatas[pos].cardtwo = [parseData.bSegmentCard[chairId][5],parseData.bSegmentCard[chairId][6],parseData.bSegmentCard[chairId][7],
				                                          parseData.bSegmentCard[chairId][8],parseData.bSegmentCard[chairId][9]];
				game.playerDatas[pos].cardthree = [parseData.bSegmentCard[chairId][10],parseData.bSegmentCard[chairId][11],parseData.bSegmentCard[chairId][12],
				                                            parseData.bSegmentCard[chairId][13],parseData.bSegmentCard[chairId][14]];
				game.playerDatas[pos].addScore = parseData.sGameEnd.lGameScore[chairId];
				game.playerDatas[pos].nSpecial = parseData.sGameEnd.bSpecialCard[chairId];
				game.playerDatas[pos].cardResult = parseData.sGameEnd.cbCompareResult[chairId];

				for(var num =0;num<3;num++){
					cc.log("SssGameModel.playerDatas[pos].cardone"+game.playerDatas[pos].cardone[num]);
				}
				for(var num =0;num<5;num++){
					cc.log("SssGameModel.playerDatas[pos].cardtwo"+game.playerDatas[pos].cardtwo[num]);
				}
				for(var num =0;num<5;num++){
					cc.log("SssGameModel.playerDatas[pos].cardthree"+game.playerDatas[pos].cardthree[num]);
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

        var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
        if(dlgLoader){
            dlgLoader.setProgress(100);
        }
	},
    //游戏空闲场景
    onSssGameFreeScene: function(data) {
        cc.log("*****************进入空闲十三水场景**************");
        //设置游戏场景 注意：只有这边设置了，发送房间后完成后，才能用这个场景运行
        GameKindMgr.getInstance().setNewGameSceneFun(function () {
            var gameScene = new SssGameScene();
            return gameScene;
        });

		cc.log("1");
        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }
        cc.log("2");
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        cc.log("3");

        //设置玩家人数
		cc.log("设置玩家人数"+data.playerCount);
        SssUIMgr.getInstance().setPlayerCount(data.playerCount);
		//设置当前局数
        game.setCurentCount(data.currentPlayCount);
		//设置总局数
        game.setDrawCountLimit(data.maxPlayCount);
        //比牌界面为假（控制开始层）
        game.gameComping == false


        SssUIMgr.getInstance().onUpdateAllPlayerInfo(CMD_SSS.GS_TK_FREE);
        // //更新sss玩家数据
        // var table = ClientData.getInstance().getTable();
        // g_outcome.reset();
        // for(var chairId=0; chairId<data.playerCount; chairId++){
        //     var player = table.getPlayerByChairID(chairId);
        //     var pos = SssUIMgr.getInstance().getPlayerPosByChairId(chairId);
        //     if(player == null){
        //         if(SssGameModel.playerDatas[pos]){
        //             player=SssGameModel.playerDatas[pos].nPlayer;
        //         }
        //     }
        //     g_outcome.playerDatas[pos].nPlayer = player;
        //     for(var num=0;num<parseData.nCount;num++){
        //         g_outcome.playerDatas[pos].gNumPoint[num] = parseData.lDetailScore[chairId*32+num];
        //         var temp = chairId*32+num;
        //         cc.log("pos="+pos+"temp="+temp);
        //         cc.log("pos="+ parseData.lDetailScore[chairId*32+num]);
        //     }
        // }

        var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
        if(dlgLoader){
            dlgLoader.setProgress(100);
        }
    },
    //游戏在玩场景
    onSssGamePlayScene: function(data) {

        // //游戏状态
        // type G2C_SSS_StatusPlay struct {
        //     WCurrentUser       int             `json:"wCurrentUser"`       //当前玩家
        //     LCellScore         int             `json:"lCellScore"`         //单元底分
        //     NChip              []int           `json:"nChip"`              //下注大小
        //     BHandCardData      []int           `json:"bHandCardData"`      //扑克数据
        //     BSegmentCard       [][]int         `json:"bSegmentCard"`       //分段扑克
        //     BFinishSegment     []bool          `json:"bFinishSegment"`     //完成分段
        //     WUserToltalChip    int             `json:"wUserToltalChip"`    //总共金币
        //     BOverTime          []bool          `json:"bOverTime"`          //超时状态
        //     BSpecialTypeTable1 []bool          `json:"bSpecialTypeTable1"` //是否特殊牌型
        //     BDragon1           []bool          `json:"bDragon1"`           //是否倒水
        //     BAllHandCardData   [][]int         `json:"bAllHandCardData"`   //所有玩家的扑克数据
        //     SGameEnd           G2C_SSS_COMPARE `json:"sGameEnd"`           //游戏结束数据
        //     PlayerCount        int             `json:"playerCount"`        //实际人数
        //     CurrentPlayCount   int             `json:"currentPlayCount"`   //当前局数
        //     MaxPlayCount       int             `json:"maxPlayCount"`       //总局数
        //     Laizi              []int           `json:"Laizi"`              //癞子牌
        //     PublicCards        []int           `json:"PublicCards"`        //公共牌
        //	   Record             G2C_SSS_Record  `json:"Record"`             //结算数据
        // }

        cc.log("*****************进入在玩十三水场景**************");
        //设置游戏场景 注意：只有这边设置了，发送房间后完成后，才能用这个场景运行
        GameKindMgr.getInstance().setNewGameSceneFun(function () {
            var gameScene = new SssGameScene();
            return gameScene;
        });

        cc.log("1");
        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }
        cc.log("2");
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        cc.log("3");

        cc.log("data"+JSON.stringify(data,null,2));
        //设置玩家人数
        cc.log("设置玩家人数"+data.playerCount);
        SssUIMgr.getInstance().setPlayerCount(data.playerCount);
        //设置当前局数
        game.setCurentCount(data.currentPlayCount);
        //设置总局数
        game.setDrawCountLimit(data.maxPlayCount);
        //比牌界面为假（控制开始层）
        game.gameComping = false
		//玩家手牌背景显示
        //var playerInfo = UIMgr.getInstance().openDlg(ID_DlgSSSPlayerData);
        // playerInfo.showPlayerCardBg();
        //更新sss玩家数据
        var table = ClientData.getInstance().getTable();

        var bGameEnd = true;
        for(var chairId=0; chairId<data.playerCount; chairId++){
            var player = table.getPlayerByChairID(chairId);
            var pos = SssUIMgr.getInstance().getPlayerPosByChairId(chairId);
            if(player == null){
                if(game.playerDatas[pos]){
                    player=game.playerDatas[pos].nPlayer;
                }
            }

            //如果都为真进入比牌界面
			cc.log("data.bFinishSegment[pos]"+data.bFinishSegment[pos]+"pos"+pos);
			if(data.bFinishSegment[pos] == false){
                bGameEnd = false;
			}else{
                // //背景手牌换成组牌完成
                // playerInfo.ShowPlayerCardOverBg(pos);
                game.playerDatas[pos].bOverCard = true;
			}
            //如果是我自己的组牌数据
			if(data.bFinishSegment[pos] == false && pos == 0){
                game.playerDatas[pos].bPlay = true;
			}
            cc.log("SssGameModel.playerDatas[pos].bPlay  = " + game.playerDatas[pos].bPlay+"pos:"+pos);
            cc.log("SssGameModel.playerDatas[pos].bOverCard  = " + game.playerDatas[pos].bOverCard);
        }

        cc.log("玩家重新登入手牌数据"+data.bHandCardData);
        //发牌数据（癞子牌 公共牌 大小王 手牌）;
        game.playerDatas[0].card = data.bHandCardData;
        game.PublicCards = data.PublicCards;
        game.Laizi = data.Laizi;

        if(bGameEnd == true){//如果都组牌完成进入游戏比牌
			cc.log("data.sGameEnd"+JSON.stringify(data.sGameEnd,null,2));
            SssGameMsg.getInstance().onGameoverMsg(data.sGameEnd);

            //玩家断线战绩
			if(data.currentPlayCount >= data.maxPlayCount){
				this.onGameMsgRecord(data.Record);
			}
		}

        SssUIMgr.getInstance().onUpdateAllPlayerInfo(CMD_SSS.SSS_SCENE);
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
        var game = ClientData.getInstance().getGame();
		game.playerDatas[pos].cardone=parseData.bFrontCard;
		game.playerDatas[pos].cardtwo=parseData.bMidCard;
		game.playerDatas[pos].cardthree=parseData.bBackCard;
		//game.playerDatas[pos].bPlay = true;
		game.playerDatas[pos].nSpecial = parseData.bSpecialType;
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
	//玩家显示组牌界面
    onPlayerShowCombin : function(data) {

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
        var game = ClientData.getInstance().getGame();
        game.playerDatas[pos].cardone=parseData.bFrontCard;
        game.playerDatas[pos].cardtwo=parseData.bMidCard;
        game.playerDatas[pos].cardthree=parseData.bBackCard;
        //game.playerDatas[pos].bPlay = true;
        game.playerDatas[pos].nSpecial = parseData.bSpecialType;
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
	//游戏比牌
	onGameoverMsg: function(data){
		cc.log("### 游戏服务器， （十三水游戏命令 ）游戏比牌 ");
		var dataParser = new DataParser();

        var parseData =  data;

        // //模拟数据
        // var lGameTax = 0;	//游戏税收
        // var lGameEveryTax = [0,0,0,0]//每个玩家的税收
        // var lGameScore = [-26,-28,-30,84];//游戏积分
        // var bEndMode = 0; //结束方式
        // var cbCompareResult= [
        // 	[-1,1,-5],
			// [1,-1.-7],
			// [-3,-3,-3],
			// [3,3,15]
        // ];//每一道比较结果
        // var cbSpecialCompareResult = [0,0,0,0]; //特殊牌型比较结果
        // var cbCompareDouble = [ -7, -7, -7, 21];   //翻倍的道数
        // var cbUserOverTime = [0,0,0,0];  //玩家超时得到的道数
        // var bCardData= [
        //     [
        //         54,
        //         41,
        //         9,
        //         18,
        //         60,
        //         59,
        //         11,
        //         52,
        //         53,
        //         24,
        //         40,
        //         39,
        //         1
        //     ],
        //     [
        //         45,
        //         55,
        //         35,
        //         51,
        //         37,
        //         28,
        //         20,
        //         17,
        //         21,
        //         42,
        //         2,
        //         12,
        //         13
        //     ],
        //     [
        //         29,
        //         23,
        //         22,
        //         10,
        //         44,
        //         33,
        //         34,
        //         36,
        //         56,
        //         38,
        //         19,
        //         8,
        //         49
        //     ],
        //     [
        //         3,
        //         43,
        //         4,
        //         7,
        //         61,
        //         5,
        //         26,
        //         25,
        //         6,
        //         50,
        //         58,
        //         57,
        //         27
        //     ]
        // ];
        // var bUnderScoreDescribe= [
        //     [
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0
        //     ],
        //     [
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0
        //     ],
        //     [
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0
        //     ],
        //     [
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0,
        //         0
        //     ]
        // ]; //底分描述
        // var bCompCardDescribe = [];
        // var bCompCardDescribe = [];  //牌比描述
        // var bToltalWinDaoShu = [
        //     -26,
        //     -28,
        //     -30,
        //     84
        // ];//总共道数
        // var lUnderScore= 0;	//底注分数
        // var bAllDisperse= [false,false,false,false];  //所有散牌
        // var bOverTime= [false,false,false,false];     //超时状态
        // var bUserLeft= [false,false,false,false];	//玩家逃跑
        // var bLeft = false;
        // //var LeftszName = "dgag";
        // var LeftChairID = [
        // 	0,
        //     0,
        //     0,
        //     0
        // ];
        // var bAllLeft = false;
        // var LeftScore = [100,2000,300,15];
        // var bSpecialCard = [false,false,false,false]; //是否为特殊牌
        // var bAllSpecialCard = false;//全是特殊牌
        // var nTimer = 0;//结束后比牌、打枪时间
        // var ShootState = [
        //     0,
        //     0,
        //     0,
        //     0,
        //     0,
        //     0,
        //     0,
        //     0,
        //     0,
        //     0,
        //     0,
        //     0
        // ];//赢的玩家,输的玩家 2为赢的玩家，1为全输的玩家，0为没输没赢的玩家
        // var nXShoot = 0; //几家打枪
        // var cbThreeKillResult = [
        //     0,
        //     0,
        //     0,
        //     0
        // ];//全垒打加减分
        //
        // var parseData = {
			// "lGameTax": lGameTax,
			// "lGameEveryTax":  lGameEveryTax,
			// "lGameScore":  lGameScore,
			// "bEndMode":  bEndMode,
			// "cbCompareResult":  cbCompareResult,
			// "cbSpecialCompareResult":  cbSpecialCompareResult,
			// "cbCompareDouble":  cbCompareDouble,
			// "cbUserOverTime":  cbUserOverTime,
			// "bCardData":  bCardData,
			// "bUnderScoreDescribe":  bUnderScoreDescribe,
			// "bCompCardDescribe":  bCompCardDescribe,
			// "bCompCardDescribe":  bCompCardDescribe,
			// "bToltalWinDaoShu":  bToltalWinDaoShu,
			// "lUnderScore":  lUnderScore,
			// "bAllDisperse":  bAllDisperse,
			// "bOverTime":  bOverTime,
			// "bUserLeft":  bUserLeft,
			// "bLeft":  bLeft,
			// "LeftChairID":  LeftChairID,
			// "bAllLeft":  bAllLeft,
			// "LeftScore":  LeftScore,
			// "bSpecialCard":  bSpecialCard,
			// "bAllSpecialCard":  bAllSpecialCard,
			// "nTimer":  nTimer,
			// "ShootState":  ShootState,
			// "nXShoot":  nXShoot,
			// "cbThreeKillResult":  cbThreeKillResult,
			// "bEnterExit":  bEnterExit,
			// "wAllUser":  wAllUser,
        // };

        //dataParser.init(data);
        // var parseData = dataParser.parse([
        //                                   ["lGameTax", 		"LONGLONG"],	//游戏税收
        //                                   ["lGameEveryTax", "LONGLONG[]",4],//每个玩家的税收
        //                                   ["lGameScore", 	"LONGLONG[]",4],//游戏积分
        //                                   ["bEndMode",    	"BYTE"],  //结束方式
        //                                   ["cbCompareResult", 	"INT[][]",4,3],   //每一道比较结果
        //                                   ["cbSpecialCompareResult", 	"INT[]",4],  //特殊牌型比较结果
        //                                   ["cbCompareDouble", 	"INT[]",4],   //翻倍的道数
        //                                   ["cbUserOverTime", 	"INT[]",4],  //玩家超时得到的道数
        //                                   ["bCardData", 	"BYTE[][]",4,13],	   //扑克数据
        //                                   ["bUnderScoreDescribe", 	"BYTE[][]",4,30], //底分描述
        //                                   ["bCompCardDescribe", 	"STRUCT[]",[
        //                                                         	            ["bCompCardDescribe", 	"BYTE[][]",3,30]],
        //                                                         	            4],  //牌比描述
        //                                   ["bToltalWinDaoShu", 	"INT[]",4],   //总共道数
        //                                   ["lUnderScore", 		"LONG"],	//底注分数
        //                                   ["bAllDisperse", 	"BOOL[]",4],   //所有散牌
        //                                   ["bOverTime", 	"BOOL[]",4],     //超时状态
        //                                   ["bUserLeft", 	"BOOL[]",4], 	//玩家逃跑
        //                                   ["bLeft", 	"BOOL"],
        //                                   ["LeftszName", 	"TCHAR[]",1040],
        //                                   ["LeftChairID", 	"INT[]",4],
        //                                   ["bAllLeft", 	"BOOL"],
        //                                   ["LeftScore", "LONGLONG[]",4],
        //                                   ["bSpecialCard", 	"BOOL[]",4],   //是否为特殊牌
        //                                   ["bAllSpecialCard", 	"BOOL"],  //全是特殊牌
        //                                   ["nTimer", 	"INT"],		//结束后比牌、打枪时间
        //                                   ["ShootState", "INT[]",12],//赢的玩家,输的玩家 2为赢的玩家，1为全输的玩家，0为没输没赢的玩家
        //                                   ["nXShoot", 	"BYTE"],  //几家打枪
        //                                   ["cbThreeKillResult", "INT[]",4],//全垒打加减分
        //                                   ["bEnterExit", "BOOL"],//是否一进入就离开
        //                                   ["wAllUser", 	"WORD"],  //全垒打用户
        //                                   ]);

        var bEnterExit = false;//是否一进入就离开
        var wAllUser = 0;  //全垒打用户
        cc.log("玩家开始比牌数据parseData = " + JSON.stringify(parseData,null,2));
		var table = ClientData.getInstance().getTable();
        var game = ClientData.getInstance().getGame();
		var bCardData = [];
		var chairId = 0;
		var cbCompareResult = [];
		var lGameScore = [];
		cc.log("cbVonpareResult:"+parseData.cbCompareResult);
        cc.log(parseData.cbCompareResult[chairId][0]);
        var playerCount = SssUIMgr.getInstance().getPlayerCount();
        cc.log("99player:"+playerCount);

		// for(chairId=0; chairId<playerCount; chairId++){
		// 	cc.log("chairId:"+chairId);
         //    var pos = SssUIMgr.getInstance().getPlayerPosByChairId(chairId);
		// 	SssGameModel.playerDatas[pos].score = parseData.cbCompareResult[chairId][0]+parseData.cbCompareResult[chairId][1]+parseData.cbCompareResult[chairId][2];
		// 	SssGameModel.playerDatas[pos].addScore = parseData.lGameScore[chairId];
		// 	SssGameModel.playerDatas[pos].nSpecialScore = parseData.cbSpecialCompareResult[chairId];
		// 	// bCardData[pos]=SssGameModel.playerDatas[pos].cardone;
		// 	// bCardData[pos]=bCardData[pos].concat(SssGameModel.playerDatas[pos].cardtwo);
		// 	// bCardData[pos]=bCardData[pos].concat(SssGameModel.playerDatas[pos].cardthree);
		// 	bCardData[pos].push(parseData.cbCardData[chairId]);
		// 	SssGameModel.playerDatas[pos].cardResult = parseData.cbCompareResult[chairId];
		// 	cc.log("玩家开始比牌数据SssGameModel.playerDatas[pos].cardResult= " + JSON.stringify(SssGameModel.playerDatas[pos].cardResult));
		// 	cbCompareResult[pos].push(parseData.cbCompareResult[chairId]);
		// 	lGameScore[pos]=SssGameModel.playerDatas[pos].addScore;
		// 	////SssGameModel.playerDatas[pos].bPlay = false;
        //
		// };

		SssUIMgr.getInstance().onUpdateAllPlayerInfo(CMD_SSS.SSS_GAMEMSG);
		var dlgPlayer = UIMgr.getInstance().getDlg(ID_DlgSSSPlayerData);
		if(dlgPlayer){
			dlgPlayer.setPlayerBoxStatus(false);
		}
		cc.log("玩家开始比牌数据bCardData= " + JSON.stringify(parseData.cbCardData));
		
		var bPlaynum = 0;
		for(var temp = 0;temp<playerCount;temp++){
			cc.log("SssGameModel.playerDatas[temp].bPlay="+game.playerDatas[temp].bPlay);
			//if(SssGameModel.playerDatas[temp].bPlay ==  true){  //这个判断有问题
				bPlaynum=bPlaynum+1;
			//}
		}
		
		cc.log("开始比牌bPlaynumbPlaynum ="+bPlaynum);
		if(bPlaynum>=playerCount){
			game.gameComping = true;
			SoundMgr.getInstance().playEffect("sss_compare", 0, false);
			var calcul0 = function(bCardData,cbCompareResult,lGameScore,playerCount){
				return function(){
					cc.log("开始比牌");
					SssUIMgr.getInstance().onCompareResult(bCardData, cbCompareResult,lGameScore,playerCount);
				}
			};

			cc.log("cbCompareResult"+cbCompareResult+"lGameScore"+lGameScore+"playerCount"+ playerCount);
			setTimeout(calcul0(parseData.cbCardData,parseData.cbCompareResult,parseData.lGameScore,playerCount), 1500);
		}		
	},

	//游戏开始 100
	onGameMsgGameStart : function(data){
		cc.log("### 游戏服务器， （十三水游戏命令 ）游戏开始 100");
		// var dataParser = new DataParser();
		// dataParser.init(data);
		// var parseData = dataParser.parse([
		//                                   ["wCurrentUser", 		"WORD"],		//当前玩家
		//                                   ["bAllHandCardData",    	"BYTE[][]",4,13],	    //所有玩家的扑克数据
		//                                   ["bCardData", 	"BYTE[]",13],	    //手上扑克
		//                                   ["CellScore", 	"LONG"],  		//游戏底分
		//                                   ]);
        //
		// cc.log("开始发牌数据parseData = " + JSON.stringify(parseData));

		// //发送扑克
		//         type G2C_SSS_SendCard struct {
		//             //wCurrentUser int   //当前玩家
		//             CardData    []int //手上扑克
		//             Laizi       []int //癞子牌
		//             PublicCards []int //公共牌
		//             CellScore   int   //游戏底分
		//         }
        var parseData = data;
		///////////////////////////////////先数据处理//////////////////////////////////////////

		//关闭开始页面
		UIMgr.getInstance().closeDlg(ID_DlgSSSBegin);
        // cc.log("玩家开始数据= " +JSON.stringify(data));
        // cc.log("玩家分数= " +parseData.CellScore);
		var gamePoint = UIMgr.getInstance().getDlg(ID_DlgSSSMainScene);
		if(gamePoint){
			gamePoint.onSetBasePoint(parseData.CellScore);
		}

		//设置开始状态
		var table = ClientData.getInstance().getTable();
		if(table){
			table.setGameStatus(CMD_SSS.GS_TK_PLAYING);
		}

		//设置游戏局数
        var game = ClientData.getInstance().getGame();
		cc.log("游戏开始设置游戏局数:"+game.getCurentCount());
		cc.log(1);
		if(game){
			game.setCurentCount(game.getCurentCount()+1);
		}
        cc.log(2);
		game.reset();

        cc.log("开始发牌= " +JSON.stringify(parseData.CardData));
        cc.log("公共牌牌= " +JSON.stringify(parseData.PublicCards));
        cc.log("癞子牌= " +JSON.stringify(parseData.Laizi));
        //发牌数据（癞子牌 公共牌 大小王 手牌）;
        game.playerDatas[0].card = parseData.CardData;
        game.PublicCards = parseData.PublicCards;
        game.Laizi = parseData.Laizi;

        var playerCount = SssUIMgr.getInstance().getPlayerCount();
		for(chairID=0; chairID<playerCount; chairID++){
			var pos = SssUIMgr.getInstance().getPlayerPosByChairId(chairID);
            cc.log("SssGameModel.playerDatas[pos].bPlay  = " + game.playerDatas[pos].bPlay+"POS:"+pos);
		}
		//玩家发牌动画后进入组牌
        game.gameComping == false;
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

	//组完牌消息 103
	onGameMsgGetConbinCard: function(data){

		cc.log("### 游戏服务器， （十三水游戏命令 ）组完牌消息 103");

        // var dataParser = new DataParser();
        // dataParser.init(data);
        // var parseData = dataParser.parse([
        //                                   ["cbCardData", "BYTE[][]", CMD_SSS.GAME_PLAYER, CMD_SSS.MAXCOUNT],	//用户扑克
        //                                   ]);

        // //用户摊牌
        // type G2C_SSS_Open_Card struct {
        //     CurrentUser int //当前玩家
        // }
		var parseData = data;
        cc.log("parseData = " + JSON.stringify(parseData));

		///////////////////////////////////先数据处理//////////////////////////////////////////
		// var game = ClientData.getInstance().getGame();
		// if(game){
		// 	game.setAllPlayerCards(parseData.cbCardData);
		// }

		var table = ClientData.getInstance().getTable();
		if(table){
			table.setGameStatus(CMD_SSS.GS_TK_PLAYING);
		}
		/////////////////////////////////后UI处理 //////////////////////////////////////////
		SssUIMgr.getInstance().onGetCardReady(parseData.CurrentUser);
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

	//战绩页面
    onGameMsgRecord:function (data) {
        // // 结算
        // type G2C_SSS_Record struct {
        //     AllResult [][]int `json:"allResult"` //每一局总分
        //     AllScore  []int   `json:"allScore"`  //总分
        //     Reason    int     //结束原因
        // }
        // const (
        // //结束原因
        // GER_NORMAL  = 0 //常规结束
        // GER_DISMISS = 1 //游戏解散
        // USER_LEAVE  = 2 //玩家请求解散
        // )

		var recordData = data;//allResult[][]

		cc.log("战绩界面:数据"+JSON.stringify(data,null,2));

        //战绩
        if (ID_DlgGameRecordCenter!=undefined)
        {
            //打开战绩界面
            var dlgGameRecordCenter = UIMgr.getInstance().openDlg(ID_DlgGameRecordCenter);
            dlgGameRecordCenter.getDlgWidget().setVisible(false);
			//积分记录列表
            var recordInfo = {
                //每局积分[局数][玩家数 最大6人]
            	"DetailScore" : recordData.allResult,
                //总积分[玩家数 最大6人]
           	 	"AllScore": recordData.allScore,
            	//玩家结算原因
            	"Reason" : recordData.Reason
            };

            //设置积分记录列表 及 三个按钮的回调函数
            dlgGameRecordCenter.setInit(recordInfo, function(){
                cc.log("++++++战绩中心界面----退出房间++++++");
                //返回大厅
                GameKindMgr.getInstance().backPlazaScene();

            }, function(){
                cc.log("++++++战绩中心界面----分享成功回调++++++");

            }, function(){
                cc.log("++++++战绩中心界面----续费成功回调++++++");
            });

        }
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
