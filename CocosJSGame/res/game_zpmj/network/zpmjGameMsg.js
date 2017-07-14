var ZpmjGameMsg = GameMsg.extend({
	ctor: function(){},

	// 判断是否当前运行游戏
	isCurRunGame: function(){
		var kindId = 0;
		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			kindId = plaza.getCurKindID();

			if(kindId == CMD_ZPMJ.KIND_ID){
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
		var game = new ZpmjGame();
		ClientData.getInstance().setGame(game);
	},

	// 游戏命令（无用到）
	onGameMsg: function(subCmd, data){
		if(!this.isCurRunGame()){
			return;
		}
		cc.log("subCmd"+subCmd);
		switch (subCmd) {
		case CMD_ZPMJ.SUB_S_GAME_START:		// 游戏开始
			 this.OnSubGameStart(data);
			cc.log("-------------------!!游戏开始");
			break;

        case CMD_ZPMJ.SUB_S_DISPATCH_FLOWER:
        	this.OnSubDispatchFlower(data);
        	cc.log("-------------------!!开局or抓牌 ------补花");
        	break;

		case CMD_ZPMJ.SUB_S_GOLD_MEDAL:
			this.OnSubGoldMedal(data);
			cc.log("-------------------!!翻金");
			break;

		case CMD_ZPMJ.SUB_S_SEVEN_FLOWER:
			/*
			 * 说明 7花可查 只有系统发牌后，发现是花，同时该用户去补花，后台判断有7花用户，就会返回这个结果告诉，补牌用户，他的出牌权力被剥夺
			 * 同时，后台会重新把这张牌发给7花用户，7花用户再进行补花；
			 */
			this.OnSevenFlower();
            cc.log("-------------------!!补花，发现是7花可查");
			break;

		case CMD_ZPMJ.SUB_S_OUT_CARD:		// 用户出牌
			/*
			 * 说明 收到用户出牌
			 */

			this.OnSubOutCard(data);
            cc.log("-------------------!!收到用户出牌");
			break;

		case CMD_ZPMJ.SUB_S_SEND_CARD:		// 发牌消息
			/*
			 * 说明 如果所有玩家都没有操作提示 则收到发牌消息 指针指向发牌的人
			 */
			this.OnSubSendCard(data);
			cc.log("-------------------!!后台发牌消息");
			break;

		case CMD_ZPMJ.SUB_S_OPERATE_NOTIFY:	// 操作提示
			/*
			 * 说明
			 * 操作提示  自己有操作才会收到操作提示   此时显示操作提示面板  (后台说是别人打出一张牌的时候通知)
			 */
			this.OnSubOperateNotify(data);
			cc.log("-------------------!!操作提示"); // 这个地方应该也要广播才对，不能只发给特定的人；只有提示了，指针才能指向这个人，但是有个问题，如果提示了就暴露牌了
			break;

		case CMD_ZPMJ.SUB_S_OPERATE_RESULT:	// 操作结果（吃碰杠胡）
			/*
			 * 说明 操作结果 某个玩家 选择 某个操作 比如 碰 此时需等待那个玩家的操作 指针指向那个玩家
			 */
			this.OnSubOperateResult(data);
			cc.log("-------------------!!操作结果");
			break;

			case CMD_ZPMJ.SUB_S_LISTEN: // 听牌的操作结果（听）
			cc.log("-------------------!!其他用户（包括自己）告诉我，他听牌 操作结果");
			this.OnSubListenOperat(data);
			break;

		case CMD_ZPMJ.SUB_S_HU_CARD:
			cc.log("-------------------!!后台系统告诉我 听牌=====>>>>胡牌数据");
			this.OnTingHuCard(data);
			break;

		case CMD_ZPMJ.SUB_S_TRUSTEE:
			cc.log("-------------------!!用户托管or取消托管 操作");
			this.onGameTrustee(data);
			break;
		case CMD_ZPMJ.SUB_S_GAME_END:		// 游戏结束
			this.OnSubGameEnd(data);
			cc.log("-------------------!!游戏结束");
			break;		
		case CMD_ZPMJ.SUB_S_CONFIG_CELLSCORE:  // 配置底注
			this.OnUserConfigCellScore(data);
			break;
		case CMD_ZPMJ.SUB_S_MAKESURE:		// 用户坐下
			this.OnUserMakesure(data);
			cc.log("-------------------!!用户坐下");
			break;
		case CMD_ZPMJ.SUB_S_USEREXIST:		// 用户退出
			this.OnUserExist(data);
			cc.log("!!用户退出");
			break;
		case CMD_ZPMJ.SUB_S_USERCLOSEWIN:	// 关闭窗口
			this.OnUserExist(data);
			cc.log("!!关闭窗口");
			break;
		default:
			break;
		}		
	},

    // 游戏场景消息
    onGameSceneMsg: function(data, isPlay){
        cc.log("onGameSceneMsg ", isPlay)
        if(!this.isCurRunGame()){
            return;
        }

        // 设置游戏场景
        GameKindMgr.getInstance().setNewGameSceneFun(function(){
            var gameScene = new ZpmjScene();
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

        cc.log("漳浦麻将 游戏场景消息-gameStatus-"+gameStatus);

        if (!isPlay) {// 空闲状态
            cc.log("漳浦麻将 游戏场景消息--空闲状态");
            cc.log("游戏场景消息 = " + JSON.stringify(data));
            // /////////////////////////////////先数据处理//////////////////////////////////////////
            table.setGameStatus(CMD_ZPMJ.GS_MJ_FREE);
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
            game.setZhuaHuaCnt(data.ZhuaHuaCnt);
            cc.log("设置抓花数："+data.ZhuaHuaCnt);
            //获取历史记录
            ZpmjUIMgr.getInstance().getGameInfo();

        }
        else{ // 游戏状态
            cc.log("111断线重连 = " + JSON.stringify(data));

            // 设定相关信息
            //游戏状态
            table.setGameStatus(CMD_ZPMJ.GS_MJ_PLAY);
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

            // 补花记录 + 插花记录
            game.setFlowerRecords(data.BuHuaCnt);
            game.setInsertFlowerRecords(data.ChaHuaCnt); // 其他通过指令设置得到

            if(data.ZhuaHuaCnt!=undefined) {
                game.setZhuaHuaCnt(data.ZhuaHuaCnt);
                cc.log("设置抓花数："+data.ZhuaHuaCnt);
            }
       
            ///////////////////////////////////
            //获取历史记录
            ZpmjUIMgr.getInstance().getGameInfo();

            var runScene = cc.director.getRunningScene();
            if(runScene && runScene.isGameScene && runScene.isGameScene()){
                cc.log("ZpmjUIMgr.getInstance().onBreak()");
                ZpmjUIMgr.getInstance().onBreak();
            }
        }


    },

	// 等所有玩家准备后，后台通知客户端，显示插花界面，这个时候还不发牌 ，超时的话会直接发牌
	onSubNotifyShowInsertFlowerUI:function (data) {
        ZpmjUIMgr.getInstance().onShowInserFlowerUI(true);
    },

	// 广播各玩家设置了几个插花数
    OnSubInsetFlowerCount:function (data) {
        var parseData = data;
        cc.log("广播玩家 插花设置 parseData = " + JSON.stringify(parseData));

        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }

        game.setReplaceUser(parseData.Chair);

        if (parseData.Chair ==  game.getMeChairId()) {
            ZpmjUIMgr.getInstance().onShowInserFlowerUI(false); // 隐藏插花界面
		}

        //  更新玩家插花个数
        var insertFlowerRecords = game.getInsertFlowerRecords();
        insertFlowerRecords[parseData.Chair] = parseData.SetCount;
        ZpmjUIMgr.getInstance().updateInsertFlowerNum(parseData.Chair,false);
    },

	// 游戏开始
	OnSubGameStart:function(data){
	
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		
		cc.log("漳浦麻将 游戏场景消息--游戏开始--");

		table.startGame();
		// 接收数据包
		/*
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([

		                                  ["wBankerUser", "WORD"],         // 庄家
		                                  ["wReplaceUser", "WORD"],        // 补牌用户
		                                  ["wSiceCount", "WORD"],          // 骰子点数
		                                  ["wHeapHead", "WORD"],           // 堆立牌头
		                                  ["wHeapTail", "WORD"],           // 堆立牌尾
		                                  ["cbMagicIndex", "BYTE"],        // 财神索引
		                                  ["cbHeapCardInfo", "BYTE[][]",CMD_ZPMJ.GAME_PLAYER,2],                // 堆立信息[4][2]
		                                  ["cbUserAction", "BYTE"],        // 用户动作
		                                  ["cbCardData", "BYTE[]",CMD_ZPMJ.MAX_COUNT],   // 麻将列表
		                                  ]);

		*/

        var parseData = data; // 新后台已经是json数据

        cc.log("开始parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////

		table.setGameStatus(CMD_ZPMJ.GS_MJ_PLAY);
		game.setUserAction(parseData.UserAction);
		game.setMeBankNums(parseData.BankerUser);// 设置连庄用户
		game.setBanker(parseData.BankerUser);
		game.setMeBankNums(parseData.BankerUser);
		game.setReplaceUser(parseData.ReplaceUser); // 补牌用户？？？ sxh
        game.setLeftCardCount(CMD_ZPMJ.FULL_COUNT - (CMD_ZPMJ.MAX_COUNT-1)*4 - 16); // 16 是最用来摸花的牌
		// game.setSiceCount(parseData.lSiceCount);
		// game.setCurrentUser(parseData.wCurrentUser);
		game.setPlayersCards(parseData.CardData);
		game.setPlayCount(game.getPlayCount()+1);


		// ///////////////////
		ZpmjUIMgr.getInstance().onShowInserFlowerUI(false); // 游戏一开始 隐藏插花页面 没有插花的用户，就不在显示
		ZpmjUIMgr.getInstance().onGameStart();
		
		// 更新历史记录
		ZpmjUIMgr.getInstance().updateGameInfo();
	},

    // 补花  还是所有用户需要补花的都会收到
    OnSubDispatchFlower:function (data) {
        cc.log( "----补花--");
        // 接收数据包
       /* var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wReplaceUser", "WORD"],        	// 补牌用户
            ["cbReplaceCard", "BYTE"],       	// 补牌扑克
            ["cbNewCard", "BYTE"],        	// 补完扑克
            ["isInitFlower", "BOOL"],        	// true 为开局补花
        ]);

		*/

        var parseData = data;
        cc.log("补花 parseData = " + JSON.stringify(parseData));

        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        game.setReplaceUser(parseData.ReplaceUser);
        game.setReplaceCard(parseData.ReplaceCard);
        game.setReplaceNewCard(parseData.NewCard);
		game.setIsInisFlower(parseData.IsInitFlower);

		//  更新补花记录
        var flowerRecords = game.getFlowerRecords();
        flowerRecords[parseData.ReplaceUser] += 1;
		
        ZpmjUIMgr.getInstance().replaceCard();  // 得区分是开局补花还是，抓牌补花

        game.setLeftCardCount( game.getLeftCardCount() - 1);
    },

    // 补花失败回应 （漳浦麻将 无用 不改）
    OnSevenFlower:function (data) {
    	cc.log( "补花失败----因为遇到7花可查 ");
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
    	
    	ZpmjUIMgr.getInstance().replaceCard_7Flower();

    	game.setLeftCardCount( game.getLeftCardCount() - 1);
    },

    // 翻金 （漳浦麻将 无用 不改）
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
            ZpmjUIMgr.getInstance().updateGoldMedal();
            game.setLeftCardCount( game.getLeftCardCount() - 1 );
        };

        if (parseData.FlowerCount) {
            game.setReplaceUser(0);
            game.setGoldCard(parseData.LastFlowerCard); // 花当金
            ZpmjUIMgr.getInstance().updateGoldMedal();

            var flowerRecords = game.getFlowerRecords();
            flowerRecords[0] += parseData.FlowerCount;    // 庄家
            ZpmjUIMgr.getInstance().updateFloweNum(0);
            game.setLeftCardCount( game.getLeftCardCount() - parseData.FlowerCount);

            // 0.5秒后变真金牌
            ZpmjUIMgr.getInstance().schedule(cbUpdateGold, 0.5, false, this);
		}
		else {
            cbUpdateGold();
		}

    },

	// 用户出牌
	OnSubOutCard:function(data){

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		cc.log("漳浦麻将 游戏场景消息--用户出牌--");
		
		table.startGame();

		// 接收数据包
		/*
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wOutCardUser", "WORD"],         // 出牌用户
		                                  ["cbOutCardData", "BYTE"],        // 出牌扑克
		                                  ["bSysOut", "BOOL"],        		// 托管系统出牌
		                                  ]);

		*/
        var parseData = data;

        cc.log("用户出牌parseData = " + JSON.stringify(parseData));

        // /////////////////////////////////先数据处理//////////////////////////////////////////
		game.setOutCardUser(parseData.OutCardUser);
		game.setOutCardData(parseData.OutCardData);
        var trustee = game.getTrustee();
        trustee[parseData.wOutCardUser] = parseData.SysOut; // 更新托管状态 // 接口回来的数据错了，第一次托管返回的是bSysOut 返回的是 false 应该是true 才对

        // 更新UI托管标志
        ZpmjUIMgr.getInstance().onTrustee();

		// 界面显示
		ZpmjUIMgr.getInstance().onOutCard();

	},

	// 后台发牌消息
	OnSubSendCard:function(data){
		cc.log("漳浦麻将 游戏场景消息--发牌消息--");

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		// 接收数据包
		/*
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbCardData", "BYTE"],         	 // 扑克数据
		                                  ["cbActionMask", "BYTE"],       	// 动作掩码
		                                  ["wCurrentUser", "WORD"],      		// 当前用户
		                                  ["wSendCardUser", "WORD"],       	// 发牌用户--无用
		                                  ["wReplaceUser", "WORD"],       	// 补牌用户--无用
		                                  ["bTail", "BOOL"],       	 		// 末尾发牌
		                                  ]);

		*/
        var parseData = data;
        cc.log("发牌消息parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		cc.log("parseData.wSendCardUser:"+parseData.SendCardUser+"   getMeChairId:"+game.getMeChairId());
		
		game.setSendCard(parseData.CardData);
		game.setAcionMasks(parseData.ActionMask);
		game.setCurrentUser(parseData.CurrentUser);
		// game.setReplaceUser(parseData.ReplaceUser);
		game.setSendCardUser(parseData.SendCardUser);
		game.setTail(parseData.Tail);
		
		game.setLeftCardCount(game.getLeftCardCount()-1);
		cc.log("+++++设置剩余张数  "+game.getLeftCardCount()-1);
		ZpmjUIMgr.getInstance().onSendCard();

		// 补花
        if (parseData.CurrentUser == game.getMeChairId() &&
            parseData.CardData>= g_Zpmj_Hua_CardValue[0] &&
            parseData.CardData<= g_Zpmj_Hua_CardValue[7])
        {
            cc.log("抓牌 ========进行补花 " + parseData.CardData);
            var dataParam={
                cbCardData:parseData.CardData,
            };
            ZpmjGameMsg.getInstance().sendReplaceCard(dataParam); //  这边一直提示sendReplaceCard is not a function
		}
	},

	// 操作提示
	OnSubOperateNotify:function(data){
		cc.log("漳浦麻将 游戏场景消息--操作提示--");
		// -----------//
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}


		/*
		// 接收数据包
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbActionMask", "BYTE"],          // 动作掩码
		                                  ["cbActionCard", "BYTE"],      	  	// 动作扑克
		                                  ]);


		*/
        var parseData = data;
        cc.log("操作提示parseData = " + JSON.stringify(parseData));

        if(parseData.ActionMask !=0)
		{
			game.setAcionMasks(parseData.ActionMask);
			game.setActionCard(parseData.ActionCard);
			
			// 打开提示面板
			cc.log("--打开操作提示面板--");
			ZpmjUIMgr.getInstance().onOperatorTip();
		}
	},

	// 操作结果
	OnSubOperateResult:function(data){
		cc.log("漳浦麻将 游戏场景消息--操作结果--");
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		/*
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


		*/
        var parseData = data;
        cc.log("操作结果parseData = " + JSON.stringify(parseData));

		game.setOperateUser(parseData.OperateUser);
		game.setProvideUser(parseData.ProvideUser);
		game.setOperateCode(parseData.OperateCode);
		game.setOperateCard(parseData.OperateCard);

		ZpmjUIMgr.getInstance().onOperateResult();
	},

    // 广播 听牌的操作结果
    OnSubListenOperat:function (data) {
        cc.log("漳浦麻将  --《《听牌》》操作结果--");
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }
		/*
        // 接收数据包
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wListenUser", "WORD"],         	 // /听牌用户
            ["bListen", "BOOL"],         	 // 是否听牌
            ["cbHuCardCount", "BYTE"],      	  // 胡几张牌
            ["cbHuCardData", "BYTE[]",CMD_ZPMJ.MAX_INDEX],      // 胡牌数据
        ]);


		*/
        var parseData = data;
        cc.log("广播听牌操作结果parseData = " + JSON.stringify(parseData));
        game.setListenOperateUser(parseData.ListenUser);
        var hearStatus = game.getHearStatus();
        hearStatus[parseData.ListenUser] = 1;

        ZpmjUIMgr.getInstance().onListenOperateResult(); // 播听语音，并附上状态
    },

    // 听牌 湖牌数据
    OnTingHuCard:function (data) {
        cc.log("漳浦麻将 听牌湖牌数据 --");
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }
		/*
        // 接收数据包
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            //出哪几张能听
			["cbOutCardCount", "BYTE"],// 暂时没用
            ["cbOutCardData", "BYTE[]",CMD_HZMJ.MAX_COUNT],
            //听后能胡哪几张牌
            ["cbHuCardCount", "BYTE[]",CMD_HZMJ.MAX_COUNT],// 暂时没用
            ["cbHuCardData", "BYTE[][]",CMD_ZPMJ.MAX_COUNT,28], // 暂时没用
            //胡牌剩余数
            ["cbHuCardRemainingCount", "BYTE[][]",CMD_ZPMJ.MAX_COUNT,28]// 暂时没用
        ]);


		*/

        var parseData = data;
        cc.log("听牌胡牌数据结果parseData = " + JSON.stringify(parseData));

		game.setTingOutCards(parseData.OutCardData);

   		ZpmjUIMgr.getInstance().onTingHuCard(); // 显示操作按钮
    },

    // 托管
    onGameTrustee: function(data){
        cc.log("### 游戏服务器， （漳浦麻将游戏命令 ）托管消息");

        var parseData = data;
        cc.log("parseData = " + JSON.stringify(parseData));

        var game = ClientData.getInstance().getGame();
        if(!game){
        	return;
        }

        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        // 设置托管标志
        var trustees = game.getTrustee();
        trustees[parseData.ChairID] = parseData.Trustee;

        // 通知ui更新托管标志
        ZpmjUIMgr.getInstance().onTrustee();
    },

	// 游戏结束
	OnSubGameEnd:function(data){
		cc.log("漳浦麻将 游戏场景消息--游戏结束--");
		
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		/*
		// 接收数据包
		var dataParser = new DataParser();
		dataParser.init(data);

		var parseData = dataParser.parse([
		                                  ["lCellScore", "LONG"],         	 // 单元积分底分-无用
		                                  ["lGameScore", "SCORE[]",CMD_ZPMJ.GAME_PLAYER],         // 游戏积分-本局积分
		                                  ["lRevenue", "SCORE[]",CMD_ZPMJ.GAME_PLAYER],         	 // 税收积分-无用
		                                  ["lGangScore", "SCORE[]",CMD_ZPMJ.GAME_PLAYER],         	 // 本局杠输赢分-无用
		                                  
		                                  ["wProvideUser", "WORD"],       	  // 供应用户-无用
		                                  ["cbProvideCard", "BYTE"],      	  // 供应扑克-无用
		                                  ["cbSendCardData", "BYTE"],      	  // 最后发牌
		                                  
		                                  ["dwChiHuKind", "DWORD[]",CMD_ZPMJ.GAME_PLAYER],        // 胡牌类型
		                                  ["dwChiHuRight", "DWORD[]",CMD_ZPMJ.GAME_PLAYER],        // 胡牌类型-无用
		                                  ["wLeftUser", "WORD"],       	  // 玩家逃跑
		                                  ["wLianZhuang", "WORD"],       	  // 连庄
		                                  ["cbCardCount", "BYTE[]",CMD_ZPMJ.GAME_PLAYER],         // 扑克数目
		                                  ["cbHandCardData", "BYTE[][]",CMD_ZPMJ.GAME_PLAYER,CMD_ZPMJ.MAX_COUNT],     // 扑克数据
		                                  ["cbMaCount", "BYTE[]",CMD_ZPMJ.GAME_PLAYER],         // 码数
		                                  ["cbMaData", "BYTE[]",7],         // 码数据-牌数据
		                                  ]);


		*/
		// test
		data = {"CellScore":0,"GameScore":[65535,64,65532,65538],"Revenue":[0,0,0,0],"GangScore":[0,0,0,0],"ProvideUser":1,"ProvideCard":20,"SendCardData":20,"ChiHuKind":[64,0,64,64],"ChiHuRight":[0,134219521,0,0],"LeftUser":65535,"LianZhuang":0,"CardCount":[7,13,13,7],"HandCardData":[[1,1,20,21,22,37,38,0,0,0,0,0,0,0],[4,5,6,17,18,19,20,21,21,22,23,23,24,0],[5,5,17,17,19,33,33,33,35,36,37,38,38,0],[7,18,23,24,24,24,34,0,0,0,0,0,0,0]],"MaCount":[0,0,0,0],"MaData":[0,0,0,0,0,0,0]}

        var parseData = data;
        cc.log("游戏结束parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
		if(!dlgCardsInf) return;

		// 本局结果
		var result = {};
		result.lGameScore = parseData.GameScore;	// 本局积分
		result.wProvideUser = parseData.ProvideUser; // 供应用户（如果是自己表示自摸，如果不是自己就是点炮）
		result.cbProvideCard = parseData.ProvideCard; // 供牌扑克
		result.cbSendCardData = parseData.SendCardData;// 最后发牌
		result.dwChiHuKind = parseData.ChiHuKind;  // 胡
		result.wLianZhuang = parseData.LianZhuang;// 庄家
		result.cbCardCount = parseData.CardCount;// 扑克数目
		result.cbSendCardData = parseData.SendCardData;
		result.cbHandCardData = parseData.HandCardData;// 剩余扑克数据
		result.cbMaCount = parseData.MaCount;// 码数
		result.cbMaData = parseData.MaData;// 码数据-牌数据
		result.cbCatchFlowers = parseData.ZhuaHua; // 抓花数据
		
		var game = ClientData.getInstance().getGame();
		
		// 碰杠数据
		result.cbBpBgCardData = [];
		for(var i=0; i<CMD_ZPMJ.GAME_PLAYER; ++i){
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
		for(var i=0;i<CMD_ZPMJ.GAME_PLAYER;i++)
		{// 积分信息
			game.addSettleScore(i,parseData.GameScore[i]);
			var player=table.getPlayerByChairID(i);
			if(player!=undefined)
			{
                if(curGameType==GAME_GENRE_PERSONAL){
                    // 房卡更新积分
                    cc.log("更新玩家积分 ChairID "+i+" --更新前积分 "+player.getScore());
                    player.setScore(player.getScore()+parseData.GameScore[i]);
                    cc.log("更新玩家积分 ChairID "+i+" --更新后积分 "+player.getScore());
                }
                else{
                    // 金币更新金币
                    cc.log("更新玩家积分 ChairID "+i+" --更新前积分 "+player.getMoney());
                    player.setMoney(player.getMoney()+parseData.GameScore[i]);
                    cc.log("更新玩家积分 ChairID "+i+" --更新后积分 "+player.getMoney());
                }
			}

		}
		
		// 胡牌动画后游戏结束界面
		dlgCardsInf.onGameEnd(result);
		
		// 更新历史记录
		ZpmjUIMgr.getInstance().updateGameInfo();
	},
	
	// 配置底注 (无用到)
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
		var dlgUserInf=UIMgr.getInstance().getDlg(ID_DlgZpmjUserInf);
		if(!dlgUserInf) return;
		dlgUserInf.SetCellInf(parseData.lCellScore,game.getMeBankNums());
		if(parseData.wConfigUser == game.getMeChairId())
		{
			game.setMakesureUser(parseData.wConfigUser);

			// 发送命令
			var dataBuilder = new DataBuilder();
			dataBuilder.init(0);
			g_gameSocket.sendData(MDM_GF_GAME,CMD_ZPMJ.SUB_C_MAKESURE,dataBuilder.getData());
		}	
	},

	// 用户坐下（无用到）
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

		var dlgUserInf=UIMgr.getInstance().getDlg(ID_DlgZpmjUserInf);
		if(!dlgUserInf) return;
		dlgUserInf.updataScore();
		ZpmjUIMgr.getInstance().update();

	},

	// 用户退出（无用到）
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
		
		ZpmjUIMgr.getInstance().update();
	},


    // ////////////////////////////////////////////客户端 发送消息/////////////////////////////// //

	// 出牌消息
	sendOutCard:function(data){
        cc.log("发送出牌消息");
        g_gameSocket.sendData("C2G_ZPMJ_OutCard", {
            CardData :data.cbCardData
        });
	},

	// 操作命令
	sendOperateCard:function(data){
        cc.log("发送操作命令");
        g_gameSocket.sendData("C2G_ZPMJ_OperateCard",{
            OperateCode : data.cbOperateCode,
            OperateCard : data.cbOperateCard,
        });
	},

    // 听牌操作命令
    sendTingOperateCard:function(){
        cc.log("发送听牌操作命令");
        g_gameSocket.sendData("C2G_MJZP_ListenCard",{
            ListenCard  : true,
        });
    },

	// 抓到花牌通知后台要补花
    sendReplaceCard:function(data){
		cc.log("发送操作命令-补花");
        g_gameSocket.sendData("C2G_MJZP_ReplaceCard",{
            CardData   : data.cbCardData,
        });
    },

	// 发送是否托管请求
    sendbTrustee:function(bTrustee){
        cc.log("发送是否托管命令");
        g_gameSocket.sendData("C2G_MJZP_Trustee",{
            Trustee   : bTrustee,  //true：托管 false：取消托管
        });
    },

    // 发送设置插花请求
    sendInsetFlowerCount:function(count){
        cc.log("发送设置插花请求");
        g_gameSocket.sendData("C2G_MJZP_SetChaHua",{
            SetCount    : count,
        });
    },
});

var g_ZpmjGameMsg = null;

ZpmjGameMsg.getInstance = function(){
	if(g_ZpmjGameMsg == null){
		g_ZpmjGameMsg = new ZpmjGameMsg();
	}
	return g_ZpmjGameMsg;
}

GameMsgMgr.getInstance().addGameMsgInstance(ZpmjGameMsg.getInstance());
