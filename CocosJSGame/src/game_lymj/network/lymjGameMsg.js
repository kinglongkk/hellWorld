var LymjGameMsg = GameMsg.extend({
	ctor: function(){},

	// 判断是否当前运行游戏
	isCurRunGame: function(){
		var kindId = 0;
		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			kindId = plaza.getCurKindID();

			if(kindId == CMD_LYMJ.KIND_ID){
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
		var game = new LymjGame();
		ClientData.getInstance().setGame(game);
	},

	// 游戏命令
	onGameMsg: function(subCmd, data){
		if(!this.isCurRunGame()){
			return;
		}
		cc.log("subCmd"+subCmd);
		switch (subCmd) {
		case CMD_LYMJ.SUB_S_GAME_START:		// 游戏开始
			this.OnSubGameStart(data);
			cc.log("-------------------!!游戏开始");
			break;
        case CMD_LYMJ.SUB_S_DISPATCH_FLOWER:
        	this.OnSubDispatchFlower(data);
        	cc.log("-------------------!!开局or抓牌 ------补花");
        	break;
		case CMD_LYMJ.SUB_S_GOLD_MEDAL:
			this.OnSubGoldMedal(data);
			cc.log("-------------------!!翻金");
			break;
		case CMD_LYMJ.SUB_S_SEVEN_FLOWER:
			/*
			 * 说明 7花可查 只有系统发牌后，发现是花，同时该用户去补花，后台判断有7花用户，就会返回这个结果告诉，补牌用户，他的出牌权力被剥夺
			 * 同时，后台会重新把这张牌发给7花用户，7花用户再进行补花；
			 */
			this.OnSevenFlower();
            cc.log("-------------------!!补花，发现是7花可查");
			break;
		case CMD_LYMJ.SUB_S_OUT_CARD:		// 用户出牌
			/*
			 * 说明 收到用户出牌
			 */
			this.OnSubOutCard(data);
            cc.log("-------------------!!收到用户出牌");
			break;		
		case CMD_LYMJ.SUB_S_SEND_CARD:		// 发牌消息
			/*
			 * 说明 如果所有玩家都没有操作提示 则收到发牌消息 指针指向发牌的人
			 */
			this.OnSubSendCard(data);
			cc.log("-------------------!!后台发牌消息");
			break;		
		case CMD_LYMJ.SUB_S_OPERATE_NOTIFY:	// 操作提示
			/*
			 * 说明 操作提示 自己有操作才会收到操作提示 此时显示操作提示面板
			 */
			this.OnSubOperateNotify(data);
			cc.log("-------------------!!操作提示");
			break;
		case CMD_LYMJ.SUB_S_OPERATE_RESULT:	// 操作结果（吃碰杠胡）
			/*
			 * 说明 操作结果 某个玩家 选择 某个操作 比如 碰 此时需等待那个玩家的操作 指针指向那个玩家
			 */
			this.OnSubOperateResult(data);
			cc.log("-------------------!!操作结果");
			break;

		case CMD_LYMJ.SUB_S_LISTEN: // 听牌的操作结果（听）
			cc.log("-------------------!!其他用户（包括自己）告诉我，他听牌 操作结果");
			this.OnSubListenOperat(data);
			break;

		case CMD_LYMJ.SUB_S_HU_CARD:
			cc.log("-------------------!!后台系统告诉我 听牌=====>>>>胡牌数据");
			this.OnTingHuCard(data);
			break;

		case CMD_LYMJ.SUB_S_GAME_END:		// 游戏结束
			this.OnSubGameEnd(data);
			cc.log("-------------------!!游戏结束");
			break;		
		case CMD_LYMJ.SUB_S_CONFIG_CELLSCORE:  // 配置底注
			this.OnUserConfigCellScore(data);
			break;
		case CMD_LYMJ.SUB_S_MAKESURE:		// 用户坐下
			this.OnUserMakesure(data);
			cc.log("-------------------!!用户坐下");
			break;
		case CMD_LYMJ.SUB_S_USEREXIST:		// 用户退出
			this.OnUserExist(data);
			cc.log("!!用户退出");
			break;
		case CMD_LYMJ.SUB_S_USERCLOSEWIN:	// 关闭窗口
			this.OnUserExist(data);
			cc.log("!!关闭窗口");
			break;
		default:
			break;
		}		
	},

	// 游戏场景消息
	onGameSceneMsg: function(data){
		if(!this.isCurRunGame()){
			return;
		}
		
		// 设置游戏场景
		GameKindMgr.getInstance().setNewGameSceneFun(function(){
			var gameScene = new LymjScene();
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
		
		cc.log("龙岩麻将 游戏场景消息-gameStatus-"+gameStatus);

		switch (gameStatus) {
		case CMD_LYMJ.GS_MJ_FREE:  // 空闲状态
			cc.log("龙岩麻将 游戏场景消息--空闲状态");
			var dataParser = new DataParser();
			dataParser.init(data);			  
			var parseData = dataParser.parse([			                                      
			                                  ["lCellScore", "INT"], // 基础金币
			                                  // 时间信息
			                                  ["cbTimeOutCard", "BYTE"], // 出牌时间
			                                  ["cbTimeOperateCard", "BYTE"],  // 操作时间
			                                  ["cbTimeStartGame", "BYTE"], // 开始时间
			                                  // 历史积分
			                                  ["lTurnScore", "SCORE[]",CMD_LYMJ.GAME_PLAYER],// 积分信息
			                                  ["lCollectScore", "SCORE[]",CMD_LYMJ.GAME_PLAYER],// 积分信息
			                                  ["cbPlayerCount", "BYTE"], 
			                                  ["cbMaCount", "BYTE"],
			                                  ["cbCountLimit", "BYTE"],// 局数限制
			                                  ]);
			cc.log("游戏场景消息 = " + JSON.stringify(parseData));
			// /////////////////////////////////先数据处理//////////////////////////////////////////
			table.setGameStatus(CMD_LYMJ.GS_MJ_FREE);
			game.setCellScore(parseData.lCellScore);
			game.setTimeOutCard(parseData.cbTimeOutCard);
			game.setTimeOperateCard(parseData.cbTimeOperateCard);
			game.setTimeStartGame(parseData.cbTimeStartGame);
			game.setTurnScore(parseData.lTurnScore);
			game.setCollectScore(parseData.lCollectScore);
			game.setPlayerCount(parseData.cbPlayerCount);
			game.setMaCount(parseData.cbMaCount);
			game.setPlayCount(0);
			game.setDrawCountLimit(parseData.cbCountLimit);
			
			// 获取历史记录
            LymjUIMgr.getInstance().getGameInfo();
			break;
			case CMD_LYMJ.GS_MJ_PLAY:  // 游戏状态
			cc.log("龙岩麻将 游戏场景消息--游戏状态   ");
			var dataParser = new DataParser();
			dataParser.init(data); 
			cc.log("111状态改变 = " + JSON.stringify(data));
			var parseData = dataParser.parse([
			              					// 时间信息
			              					["cbTimeOutCard", "BYTE"], // 出牌时间
			              					["cbTimeOperateCard", "BYTE"], // 操作时间
			              					["cbTimeStartGame", "BYTE"], // 开始倒计时
			              					
			              					// 游戏变量
			              					["lCellScore", "SCORE"],  // 单元积分
			              					["wBankerUser", "WORD"],  // 庄家用户
			              					["wCurrentUser", "WORD"], // 当前用户
			              					["cbMagicIndex", "BYTE"], // 财神索引--暂时无用到
			              					["cbPlayerCount", "BYTE"],// 当前玩家个数
			              					["cbMaCount", "BYTE"],// 码数

			              					// 状态变量
			              					["cbActionCard", "BYTE"],   // 动作扑克
			              					["cbActionMask", "BYTE"],   // 动作掩码
			              					["cbLeftCardCount", "BYTE"],    // 剩余数目
			              					["bTrustee", "BOOL[]",CMD_LYMJ.GAME_PLAYER],       // 是否托管--暂时无用到
			              					["bTing", "BOOL[]",CMD_LYMJ.GAME_PLAYER],       // 是否听牌--暂时无用到
			              					// 出牌信息
			              					["wOutCardUser", "WORD"],  // 出牌用户
			              					["cbOutCardData", "BYTE"],      // 出牌扑克
			              					["cbDiscardCount", "BYTE[]",CMD_LYMJ.GAME_PLAYER], // 丢弃数目--出牌--出牌
			              					["cbDiscardCard", "BYTE[][]",CMD_LYMJ.GAME_PLAYER,60],  // 丢弃记录
			              					// 扑克数据
			              					["cbCardCount", "BYTE[]",CMD_LYMJ.GAME_PLAYER],        // 扑克数目
			              					["cbCardData", "BYTE[]",CMD_LYMJ.MAX_COUNT],    // 扑克列表--自己的
			              					["cbSendCardData", "BYTE"],                     // 发送扑克
			              					
			              					// 组合扑克
			              					["cbWeaveItemCount", "BYTE[]",CMD_LYMJ.GAME_PLAYER], // 组合数目
			                                ["WeaveItemArray", "STRUCT[][]",[
			                                                                 ["cbWeaveKind","BYTE"],                 // 组合类型
																			 ["cbCenterCard","BYTE"],                // 中心扑克(杠)
																			 ["cbPublicCard","BYTE"],                // 类型标志
																			 ["wProvideUser","WORD"],                // 供应用户
																			 ["cbCardData","BYTE[]",4],              // 麻将数据
																			],CMD_LYMJ.GAME_PLAYER,4],          							 // 组合扑克
			                                                                   
			                                 // 堆立信息
											 ["wHeapHead","WORD"],                           // 堆立头部
											 ["wHeapTail","WORD"],                           // 堆立尾部
											 ["cbHeapCardInfo","BYTE[][]",CMD_LYMJ.GAME_PLAYER,2],   // 堆牌信息
																			
											 // 用于提示听牌
											 ["cbHuCardCount", "BYTE[]",CMD_LYMJ.MAX_COUNT],
											 ["cbHuCardData", "BYTE[][]",CMD_LYMJ.MAX_COUNT,28],
											 ["cbOutCardCount", "BYTE"],
											 ["cbOutCardDataEx", "BYTE[]",CMD_LYMJ.MAX_COUNT],
			                                 // 历史积分
											 ["lTurnScore","SCORE[]",CMD_LYMJ.GAME_PLAYER],                     // 积分信息
											 ["lCollectScore","SCORE[]",CMD_LYMJ.GAME_PLAYER],                   // 积分信息
                							 ["cbGoldCard", "BYTE"],//游戏金牌
                							 ["cbReocrdFlower", "BYTE[]",CMD_LYMJ.GAME_PLAYER],	//用户补花记录
			                                  ]);
			cc.log("断线重连 = " + JSON.stringify(parseData));

			// 设定相关信息
			// 游戏状态
			table.setGameStatus(CMD_LYMJ.GS_MJ_PLAY);
			// 时间信息
			game.setTimeOutCard(parseData.cbTimeOutCard);
			game.setTimeOperateCard(parseData.cbTimeOperateCard);
			game.setTimeStartGame(parseData.cbTimeStartGame);
			
			// 游戏变量
			game.setCellScore(parseData.lCellScore);
			game.setBanker(parseData.wBankerUser);
			game.setMeBankNums(parseData.wBankerUser);
			game.setCurrentUser(parseData.wCurrentUser);
			game.setPlayerCount(parseData.cbPlayerCount);
			game.setMaCount(parseData.cbMaCount);
			
			// 状态变量
			game.setActionCard(parseData.cbActionCard);
			game.setAcionMasks(parseData.cbActionMask);
			// 是否托管
			game.setTrustee(parseData.bTrustee);
			// 听牌表现
			game.setHearStatus(parseData.bTing);
			game.setLeftCardCount(parseData.cbLeftCardCount);
			// 出牌信息
			game.setOutCardUser(parseData.wOutCardUser);
			game.setOutCardData(parseData.cbOutCardData);
			game.setDiscardCount(parseData.cbDiscardCount);
			game.setDiscardCard(parseData.cbDiscardCard);
			// 扑克数据
			game.setCardCount(parseData.cbCardCount);
			game.setCardData(parseData.cbCardData);
			game.setPlayersCards(parseData.cbCardData);
			game.setSendCardData(parseData.cbSendCardData);
			// 组合扑克
			game.setWeaveCount(parseData.cbWeaveItemCount);
			game.setWeaveItemArray(parseData.WeaveItemArray);
			
			// 堆立信息
			game.setHeapInf(parseData.wHeapHead,parseData.wHeapTail);
			game.setUserHeapCardInfo(parseData.cbHeapCardInfo);
			
			// 历史积分
			game.setTurnScore(parseData.lTurnScore);	// 本轮分数
			game.setCollectScore(parseData.lCollectScore);// 历史积分

			// 金牌+补花记录
			game.setGoldCard(parseData.cbGoldCard);
			game.setFlowerRecords(parseData.cbReocrdFlower);

			 

			// /////////////////////////////////
			// 获取历史记录
			LymjUIMgr.getInstance().getGameInfo();
			
			var runScene = cc.director.getRunningScene();
			if(runScene && runScene.isGameScene && runScene.isGameScene()){
				cc.log("LymjUIMgr.getInstance().onBreak()");
				LymjUIMgr.getInstance().onBreak();
			}
			
			break;
		default:
			break;
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
		
		cc.log("龙岩麻将 游戏场景消息--游戏开始--");

		table.startGame();
		// 接收数据包
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([

		                                  ["wBankerUser", "WORD"],         // 庄家
		                                  ["wReplaceUser", "WORD"],        // 补牌用户
		                                  ["wSiceCount", "WORD"],          // 骰子点数
		                                  ["wHeapHead", "WORD"],           // 堆立牌头
		                                  ["wHeapTail", "WORD"],           // 堆立牌尾
		                                  ["cbMagicIndex", "BYTE"],        // 财神索引
		                                  ["cbHeapCardInfo", "BYTE[][]",CMD_LYMJ.GAME_PLAYER,2],                // 堆立信息[4][2]
		                                  ["cbUserAction", "BYTE"],        // 用户动作
		                                  ["cbCardData", "BYTE[]",CMD_LYMJ.MAX_COUNT],   // 麻将列表
		                                  ]);

		cc.log("开始parseData = " + JSON.stringify(parseData));
		// /////////////////////////////////先数据处理//////////////////////////////////////////

		table.setGameStatus(CMD_LYMJ.GS_MJ_PLAY);
		game.setUserAction(parseData.cbUserAction);
		game.setMeBankNums(parseData.wBankerUser);// 设置连庄用户
		game.setBanker(parseData.wBankerUser);
		game.setMeBankNums(parseData.wBankerUser);
		game.setReplaceUser(parseData.wReplaceUser); // 补牌用户？？？ sxh
		game.setLeftCardCount(CMD_LYMJ.FULL_COUNT-52);
		// game.setSiceCount(parseData.lSiceCount);
		// game.setCurrentUser(parseData.wCurrentUser);
		game.setPlayersCards(parseData.cbCardData);
		game.setPlayCount(game.getPlayCount()+1);//
		
		// ///////////////////
		LymjUIMgr.getInstance().onGameStart();
		
		// 更新历史记录
		LymjUIMgr.getInstance().updateGameInfo();
	},

    // 补花  还是所有用户需要补花的都会收到
    OnSubDispatchFlower:function (data) {
        cc.log( "----补花--");
        // 接收数据包
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wReplaceUser", "WORD"],        	// 补牌用户
            ["cbReplaceCard", "BYTE"],       	// 补牌扑克
            ["cbNewCard", "BYTE"],        	// 补完扑克
            ["isInitFlower", "BOOL"],        	// true 为开局补花
        ]);
        cc.log("补花 parseData = " + JSON.stringify(parseData));

        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        game.setReplaceUser(parseData.wReplaceUser);
        game.setReplaceCard(parseData.cbReplaceCard);
        game.setReplaceNewCard(parseData.cbNewCard);
		game.setIsInisFlower(parseData.isInitFlower);

		//  更新补花记录
        var flowerRecords = game.getFlowerRecords();
        flowerRecords[parseData.wReplaceUser] += 1;
		
        LymjUIMgr.getInstance().replaceCard();  // 得区分是开局补花还是，抓牌补花

        game.setLeftCardCount( game.getLeftCardCount() - 1);
    },

    OnSevenFlower:function (data) {
    	cc.log( "补花失败----因为遇到7花可查");
    	// 接收数据包
    	var dataParser = new DataParser();
    	dataParser.init(data);
    	var parseData = dataParser.parse([
    	                                  ["wOldUser", "WORD"],        		// 补牌用户
    	                                  ["wReplaceUser", "WORD"],       	// 7花用户 
    	                                  ["cbReplaceCard", "BYTE"],        // 补牌扑克
    	                                  ]);
    	cc.log("补花失败----7花可查 parseData = " + JSON.stringify(parseData));

    	var game = ClientData.getInstance().getGame();
    	if(!game){
    		return;
    	}
    	game.setReplaceUser(parseData.wOldUser);
    	game.setReplaceCard(parseData.cbReplaceCard);
    	
    	LymjUIMgr.getInstance().replaceCard_7Flower();

    	game.setLeftCardCount( game.getLeftCardCount() - 1);
    },

    
    // 翻金
    OnSubGoldMedal:function (data) {
        cc.log( "----翻金--");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["GoldCard", "BYTE"],        // 补牌扑克
			["FlowerCount", "BYTE"],        //出现花牌数量
			["LastFlowerCard", "BYTE"],        // 最后一张花牌值
        ]);
        cc.log("翻金 parseData = " + JSON.stringify(parseData));

        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }

        var cbUpdateGold =  function () {
            game.setGoldCard(parseData.GoldCard);
            LymjUIMgr.getInstance().updateGoldMedal();
            game.setLeftCardCount( game.getLeftCardCount() - 1 );
        };

        if (parseData.FlowerCount) {
            game.setReplaceUser(0);
            game.setGoldCard(parseData.LastFlowerCard); // 花当金
            LymjUIMgr.getInstance().updateGoldMedal();

            var flowerRecords = game.getFlowerRecords();
            flowerRecords[0] += parseData.FlowerCount;    // 庄家
            LymjUIMgr.getInstance().updateFloweNum(0);
            game.setLeftCardCount( game.getLeftCardCount() - parseData.FlowerCount);

            // 0.5秒后变真金牌
            LymjUIMgr.getInstance().schedule(cbUpdateGold, 0.5, false, this);
		}
		else {
            cbUpdateGold();
		}

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

		cc.log("龙岩麻将 游戏场景消息--用户出牌--");
		
		table.startGame();
		// 接收数据包
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wOutCardUser", "WORD"],        // 出牌用户
		                                  ["cbOutCardData", "BYTE"],        // 出牌扑克
		                                  ["bSysOut", "BOOL"],        // 托管系统出牌
		                                  ]);
		cc.log("用户出牌parseData = " + JSON.stringify(parseData));
		// /////////////////////////////////先数据处理//////////////////////////////////////////
		game.setOutCardUser(parseData.wOutCardUser);
		game.setOutCardData(parseData.cbOutCardData);

		LymjUIMgr.getInstance().onOutCard();
	},
	// 发牌消息
	OnSubSendCard:function(data){
		cc.log("龙岩麻将 游戏场景消息--发牌消息--");
		// ----------//
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		// 接收数据包
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbCardData", "BYTE"],         	 // 扑克数据
		                                  ["cbActionMask", "BYTE"],       	// 动作掩码
		                                  ["wCurrentUser", "WORD"],      	// 当前用户
		                                  ["wSendCardUser", "WORD"],       	// 发牌用户--无用
		                                  ["wReplaceUser", "WORD"],       	// 补牌用户--无用
		                                  ["bTail", "BOOL"],       	 		// 末尾发牌
		                                  ]);
		cc.log("发牌消息parseData = " + JSON.stringify(parseData));
		// /////////////////////////////////先数据处理//////////////////////////////////////////
		cc.log("parseData.wSendCardUser:"+parseData.wSendCardUser+"   getMeChairId:"+game.getMeChairId());
		
		game.setSendCard(parseData.cbCardData);
		game.setAcionMasks(parseData.cbActionMask);
		game.setCurrentUser(parseData.wCurrentUser);
		// game.setReplaceUser(parseData.wReplaceUser);
		game.setSendCardUser(parseData.wSendCardUser);
		game.setTail(parseData.bTail);
		
		game.setLeftCardCount(game.getLeftCardCount()-1);
		cc.log("+++++设置剩余张数  "+game.getLeftCardCount()-1);
		LymjUIMgr.getInstance().onSendCard();

		// 补花
		if (parseData.wCurrentUser == game.getMeChairId() && parseData.cbCardData>= 0x51 && parseData.cbCardData<= 0x58)
		{
            cc.log("抓牌 ========进行补花 " + parseData.cbCardData);

            var data={
                cbCardData:parseData.cbCardData,
            };
            this.sendReplaceCard(data);
		}
	},
	// 操作提示
	OnSubOperateNotify:function(data){
		cc.log("龙岩麻将 游戏场景消息--操作提示--");
		// -----------//
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		// 接收数据包
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbActionMask", "BYTE"],       	  // 动作掩码
		                                  ["cbActionCard", "BYTE"],      	  // 动作扑克
		                                  ]);
		
		cc.log("操作提示parseData = " + JSON.stringify(parseData));
		
		if(parseData.cbActionMask !=0)
		{
			game.setAcionMasks(parseData.cbActionMask);
			game.setActionCard(parseData.cbActionCard);
			
			// 打开提示面板
			cc.log("--打开操作提示面板--");
			LymjUIMgr.getInstance().onOperatorTip();
		}
	},
	// 操作结果
	OnSubOperateResult:function(data){
		cc.log("龙岩麻将 游戏场景消息--操作结果--");
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		// 接收数据包
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wOperateUser", "WORD"],         	 // 操作用户
		                                  ["cbActionMask", "BYTE"],         	 // 动作掩码
		                                  ["wProvideUser", "WORD"],       	  // 供应用户
		                                  ["cbOperateCode", "BYTE"],      	  // 操作代码
		                                  ["cbOperateCard", "BYTE[]",3],      // 操作扑克

		                                  ]);

		cc.log("操作结果parseData = " + JSON.stringify(parseData));
		
		game.setOperateUser(parseData.wOperateUser);
		game.setProvideUser(parseData.wProvideUser);
		game.setOperateCode(parseData.cbOperateCode);
		game.setOperateCard(parseData.cbOperateCard);

		LymjUIMgr.getInstance().onOperateResult();
	},

    // 广播 听牌的操作结果
    OnSubListenOperat:function (data) {
        cc.log("龙岩麻将 游戏场景消息--《《听牌》》操作结果--");
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }

        // 接收数据包
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wListenUser", "WORD"],         	 // /听牌用户
            ["bListen", "BOOL"],         	 // 是否听牌
            ["cbHuCardCount", "BYTE"],      	  // 胡几张牌
            ["cbHuCardData", "BYTE[]",CMD_LYMJ.MAX_INDEX],      // 胡牌数据
        ]);

        cc.log("广播听牌操作结果parseData = " + JSON.stringify(parseData));

        game.setListenOperateUser(parseData.wListenUser);
        var hearStatus = game.getHearStatus();
        hearStatus[parseData.wListenUser] = 1;

        LymjUIMgr.getInstance().onListenOperateResult(); // 播听语音，并附上状态
    },

    // 听牌 数据
    OnTingHuCard:function (data) {
        cc.log("龙岩麻将 听牌湖牌数据 --");
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }

        // 接收数据包
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            //出哪几张能听
			["cbOutCardCount", "BYTE"],// 暂时没用
            ["cbOutCardData", "BYTE[]",CMD_HZMJ.MAX_COUNT],
            //听后能胡哪几张牌
            ["cbHuCardCount", "BYTE[]",CMD_HZMJ.MAX_COUNT],// 暂时没用
            ["cbHuCardData", "BYTE[][]",CMD_LYMJ.MAX_COUNT,28], // 暂时没用
            //胡牌剩余数
            ["cbHuCardRemainingCount", "BYTE[][]",CMD_LYMJ.MAX_COUNT,28]// 暂时没用
        ]);

        cc.log("听牌胡牌数据结果parseData = " + JSON.stringify(parseData));

        game.setTingOutCards(parseData.cbOutCardData);

   		LymjUIMgr.getInstance().TingHuCard(); // 显示操作按钮
    },
	// 游戏结束
	OnSubGameEnd:function(data){
		cc.log("龙岩麻将 游戏场景消息--游戏结束--");
		
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		// 接收数据包
		var dataParser = new DataParser();
		dataParser.init(data);

		var parseData = dataParser.parse([
		                                  ["lCellScore", "LONG"],         	 // 单元积分底分-无用
		                                  ["lGameScore", "SCORE[]",CMD_LYMJ.GAME_PLAYER],         // 游戏积分-本局积分
		                                  ["lRevenue", "SCORE[]",CMD_LYMJ.GAME_PLAYER],         	 // 税收积分-无用
		                                  ["lGangScore", "SCORE[]",CMD_LYMJ.GAME_PLAYER],         	 // 本局杠输赢分-无用
		                                  
		                                  ["wProvideUser", "WORD"],       	  // 供应用户-无用
		                                  ["cbProvideCard", "BYTE"],      	  // 供应扑克-无用
		                                  ["cbSendCardData", "BYTE"],      	  // 最后发牌
		                                  
		                                  ["dwChiHuKind", "DWORD[]",CMD_LYMJ.GAME_PLAYER],        // 胡牌类型
		                                  ["dwChiHuRight", "DWORD[]",CMD_LYMJ.GAME_PLAYER],        // 胡牌类型-无用
		                                  ["wLeftUser", "WORD"],       	  // 玩家逃跑
		                                  ["wLianZhuang", "WORD"],       	  // 连庄
		                                  ["cbCardCount", "BYTE[]",CMD_LYMJ.GAME_PLAYER],         // 扑克数目
		                                  ["cbHandCardData", "BYTE[][]",CMD_LYMJ.GAME_PLAYER,14],     // 扑克数据
		                                  ["cbMaCount", "BYTE[]",CMD_LYMJ.GAME_PLAYER],         // 码数
		                                  ["cbMaData", "BYTE[]",7],         // 码数据-牌数据
		                                  ]);

		cc.log("游戏结束parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgLymjCardsInfo);
		if(!dlgCardsInf) return;


		// 本局结果
		var result = {};
		result.lGameScore = parseData.lGameScore;	// 本局积分
		result.dwChiHuKind = parseData.dwChiHuKind;// 胡
		result.wLianZhuang = parseData.wLianZhuang;// 庄家
		result.cbCardCount = parseData.cbCardCount;// 扑克数目
		result.cbSendCardData = parseData.cbSendCardData;
		result.cbHandCardData = parseData.cbHandCardData;// 剩余扑克数据
		result.cbMaCount = parseData.cbMaCount;// 码数
		result.cbMaData = parseData.cbMaData;// 码数据-牌数据
		
		var game = ClientData.getInstance().getGame();
		
		// 碰杠数据
		result.cbBpBgCardData = [];
		for(var i=0; i<CMD_LYMJ.GAME_PLAYER; ++i){
			if(game.getMeChairId()==i){
				result.cbBpBgCardData[i] = dlgCardsInf.openFCardData;
			}
			else{
				result.cbBpBgCardData[i] = dlgCardsInf.openTCardData[i];
			}
		}
		
		// 战绩中心数据
		// 备份积分信息
		var plaza = ClientData.getInstance().getPlaza();
		var curGameType = plaza.getCurGameType();	// 设置游戏类型 1：房卡 其他：金币
		var table = ClientData.getInstance().getTable();
		for(var i=0;i<CMD_LYMJ.GAME_PLAYER;i++)
		{// 积分信息
	
			game.addSettleScore(i,parseData.lGameScore[i]);
			
			var player=table.getPlayerByChairID(i);
			if(curGameType==GAME_GENRE_PERSONAL){
				// 房卡更新积分
				cc.log("更新玩家积分 ChairID "+i+" --更新前积分 "+player.getScore());
				player.setScore(player.getScore()+parseData.lGameScore[i]);
				cc.log("更新玩家积分 ChairID "+i+" --更新后积分 "+player.getScore());
			}
			else{
				// 金币更新金币
				cc.log("更新玩家积分 ChairID "+i+" --更新前积分 "+player.getMoney());
				player.setMoney(player.getMoney()+parseData.lGameScore[i]);
				cc.log("更新玩家积分 ChairID "+i+" --更新后积分 "+player.getMoney());
			}
		}
		
		// 胡牌动画后游戏结束界面
		dlgCardsInf.onGameEnd(result);
		
		// 更新历史记录
		LymjUIMgr.getInstance().updateGameInfo();
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
		var dlgUserInf=UIMgr.getInstance().getDlg(ID_DlgLymjUserInf);
		if(!dlgUserInf) return;
		dlgUserInf.SetCellInf(parseData.lCellScore,game.getMeBankNums());
		if(parseData.wConfigUser == game.getMeChairId())
		{
			game.setMakesureUser(parseData.wConfigUser);

			// 发送命令
			var dataBuilder = new DataBuilder();
			dataBuilder.init(0);
			g_gameSocket.sendData(MDM_GF_GAME,CMD_LYMJ.SUB_C_MAKESURE,dataBuilder.getData());
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

		var dlgUserInf=UIMgr.getInstance().getDlg(ID_DlgLymjUserInf);
		if(!dlgUserInf) return;
		dlgUserInf.updataScore();
		LymjUIMgr.getInstance().update();

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
		
		LymjUIMgr.getInstance().update();
	},

	// //////////////////////////////////////////////客户端发送消息/////////////////////////////
	// 出牌消息
	sendOutCard:function(data){
		// 发送消息
		var dataBuilder = new DataBuilder();
		dataBuilder.init(1);
		dataBuilder.build([		                  	
		                   ["cbCardData;", "BYTE", data.cbCardData],	
		                   ]);
		g_gameSocket.sendData(MDM_GF_GAME,CMD_LYMJ.SUB_C_OUT_CARD,dataBuilder.getData());
	},	

	// 操作命令
	sendOperateCard:function(data){
		// 发送消息
		cc.log("发送操作命令");
		var dataBuilder = new DataBuilder();
		dataBuilder.init(4);
		dataBuilder.build([		                  	
		                   ["cbOperateCode;", "BYTE", data.cbOperateCode],	
		                   ["cbOperateCard;", "BYTE[]", data.cbOperateCard,3],	
		                   ]);

		g_gameSocket.sendData(MDM_GF_GAME,CMD_LYMJ.SUB_C_OPERATE_CARD,dataBuilder.getData());
	},

    // 听牌操作命令
    sendTingOperateCard:function(){
        // 发送消息
        cc.log("发送听牌操作命令");
        var dataBuilder = new DataBuilder();
        dataBuilder.init(1);
        dataBuilder.build([
            ["bListenCard;", "BOOL", true],
        ]);
        g_gameSocket.sendData(MDM_GF_GAME,CMD_LYMJ.SUB_C_LISTEN,dataBuilder.getData());
    },

	// 抓到花牌通知后台说要补花
    sendReplaceCard:function(data){
        // 发送消息
        cc.log("发送操作命令-补花");
        var dataBuilder = new DataBuilder();
        dataBuilder.init(1);
        dataBuilder.build([
            ["cbCardData;", "BYTE", data.cbCardData],
        ]);
        g_gameSocket.sendData(MDM_GF_GAME,CMD_LYMJ.SUB_C_REPLACE_CARD,dataBuilder.getData());
    },

});

var g_LymjGameMsg = null;

LymjGameMsg.getInstance = function(){
	if(g_LymjGameMsg == null){
		g_LymjGameMsg = new LymjGameMsg();
	}
	return g_LymjGameMsg;
}

GameMsgMgr.getInstance().addGameMsgInstance(LymjGameMsg.getInstance());
