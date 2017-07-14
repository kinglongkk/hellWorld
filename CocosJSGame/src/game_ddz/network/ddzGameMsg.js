/*
 sxh 消息处理类，用来处理
 发送
 接收
 * */
var DdzGameMsg = GameMsg.extend({

    ctor: function(){
        cc.log("DdzGameMsg 被创建");
    },

    //判断是否当前运行游戏
    isCurRunGame: function(){

        var kindId = 0;
        var plaza = ClientData.getInstance().getPlaza();
        if(plaza){
            kindId = plaza.getCurKindID();

            if(kindId == CMD_DDZ.KIND_ID){
                return true;
            }
            else {
            	cc.log(" 错误 kind=%d",kindId);
            }
        }
        cc.log("isCurRunGame kindId=%d ",kindId);


        return false;
    },

    onGameStatus: function(){
        cc.log("斗地主 onGameStatus 消息");
        if(!this.isCurRunGame()){
            return;
        }
        //set game
        var game = new DdzGameModel();
        ClientData.getInstance().setGame(game);
    },

    //斗地主游戏命令
    onGameMsg: function(subCmd, data){

        cc.log("斗地主 onGameMsg 消息" + subCmd);

        if(!this.isCurRunGame()){
            return;
        }

        switch (subCmd) {
/* 响应
 SUB_S_GAME_START:      100,	    // 游戏开始 发送扑克
 SUB_S_CALL_SCORE:	    101,	    // 用户叫分
 SUB_S_BANKER_INFO:	    102,	    // 庄家信息
 SUB_S_OUT_CARD:	    103,	    // 用户出牌
 SUB_S_PASS_CARD:	    104,	    // 放弃出牌
 SUB_S_GAME_CONCLUDE:   105,	    // 游戏结束
 SUB_S_SET_BASESCORE:   106,	    // 设置基数
 SUB_S_CHEAT_CARD	    107		    // 作弊扑克
 SUB_S_TRUSTEE		    108		    // 托管
* */
            //游戏开始，马上获取自己的牌
            case CMD_DDZ.SUB_S_GAME_START:
                this.onGameMsgGameStart(data);
                break;

            // 用户叫分
            case CMD_DDZ.SUB_S_CALL_SCORE:
                this.onGameMsgCallScore(data);
                break;

            // 庄家信息
            case CMD_DDZ.SUB_S_BANKER_INFO:
                this.onGameMsgBankerInfo(data);
                break;

            // 用户出牌
            case CMD_DDZ.SUB_S_OUT_CARD:
                this.onGameMsgSendCard(data);
                break;

            // 放弃出牌
            case CMD_DDZ.SUB_S_PASS_CARD:
                this.onGameMsgPassCard(data);
                break;

            // 游戏结束
            case CMD_DDZ.SUB_S_GAME_CONCLUDE:
                this.onGameMsgGameEnd(data);
                break;

            // 设置基数
            case CMD_DDZ.SUB_S_SET_BASESCORE:
                this.onGameMsgSetBaseScore(data);
                break;
            case CMD_DDZ.SUB_S_CHEAT_CARD:
                this.onGameMsgCheatCard(data);
                break;
            case CMD_DDZ.SUB_S_TRUSTEE:
                this.onGameMsgTrustee(data);
                break;

            default:
                cc.log("命令 %d 未处理!",subCmd);
                break;
        }
    },

    //游戏场景消息 进入房间后，会发送，
    onGameSceneMsg: function(data){
        cc.log("斗地主 onGameSceneMsg 消息");
        if(!this.isCurRunGame()){
            return;
        }

        //设置游戏场景 注意：只有这边设置了，发送房间后完成后，才能用这个场景运行 sxh
        GameKindMgr.getInstance().setNewGameSceneFun(function(){
            var gameScene = new DdzGameScene();
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
            case CMD_DDZ.GS_TK_FREE:{

                cc.log("#### 游戏场景消息， （斗地主游戏命令）等待开始");

                var dataParser = new DataParser();	//CMD_S_StatusFree
                dataParser.init(data);
                var parseData = dataParser.parse([
                    ["lCellScore",	"LONG"],	    // 基础积分
                    ["cbTimeOutCard", "BYTE"],		// 出牌时间
                    ["cbTimeCallScore", "BYTE"],    // 叫分时间
                    ["cbTimeStartGame", "BYTE"],	// 开始时间
                    ["cbTimeHeadOutCard", "BYTE"],  // 首出时间
                    ["lTurnScore", "SCORE[]", CMD_DDZ.GAME_PLAYER],       // 积分信息
                    ["lCollectScore", "SCORE[]", CMD_DDZ.GAME_PLAYER],    // 积分信息
                    ["wPlayMode", "WORD"],          // 游戏模式
                    ["cbPlayCount", "BYTE"]         // 游戏局数
                ]);


                cc.log("parseData = " + JSON.stringify(parseData, null, 2));

                game.setCellScore(parseData.lCellScore);
                game.setTimeOutCard(parseData.cbTimeOutCard);
                game.setTimeCallScore(parseData.cbTimeCallScore);
                game.setTimeStartGame(parseData.cbTimeStartGame);
                game.setTimeHeadOutCard(parseData.cbTimeHeadOutCard);
                //历史积分数据
                for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++){
                    game.setTurnScore(i, parseData.lTurnScore[i]);
                    game.setCollectScore(i, parseData.lCollectScore[i]);
                }

                game.setPlayMode(parseData.wPlayMode);
                game.setGameCount(parseData.cbPlayCount);

            }
                break;
            case CMD_DDZ.GS_TK_CALL:{

                cc.log("#### 游戏场景消息，（斗地主游戏命令） 叫庄状态");

                var dataParser = new DataParser();	//CMD_S_StatusCall
                dataParser.init(data);
                var parseData = dataParser.parse([
                    ["cbTimeOutCard",   "BYTE"],    // 出牌时间
                    ["cbTimeCallScore",   "BYTE"],  // 叫分时间
                    ["cbTimeStartGame",   "BYTE"],  // 开始时间
                    ["cbTimeHeadOutCard",   "BYTE"],    // 首出时间
                    ["lCellScore", 	"LONG"],        // 单元积分
                    ["wCurrentUser", 	"WORD"],    // 当前玩家
                    ["cbBankerScore",   "BYTE"],    // 庄家叫分
                    ["cbScoreInfo", 	"BYTE[]",   CMD_DDZ.GAME_PLAYER],   // 叫分信息
                    ["cbHandCardData",  "BYTE[]",   CMD_DDZ.NORMAL_COUNT],  // 手上扑克
                    ["lTurnScore",  "SCORE[]",  CMD_DDZ.GAME_PLAYER],   // 积分信息
                    ["lCollectScore",   "SCORE[]",  CMD_DDZ.GAME_PLAYER],   // 积分信息
                ]);

                cc.log("parseData = " + JSON.stringify(parseData, null, 2));

                game.setTimeOutCard(parseData.cbTimeOutCard);
                game.setTimeCallScore(parseData.cbTimeCallScore);
                game.setTimeStartGame(parseData.cbTimeStartGame);
                game.setTimeHeadOutCard(parseData.cbTimeHeadOutCard);
                game.setCellScore(parseData.lCellScore);
                game.setBankerScore(parseData.cbBankerScore);
                game.setHandCardValues(g_objHero.getChairID(), parseData.cbHandCardData);
                game.setCurrentUser(parseData.wCurrentUser);

                for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++){
                    //用户名字
                    var player = table.getPlayerByChairID(i);
                    if(player){
                        var nick = player.getNickName();
                        game.setNick(i, nick);
                    }

                    game.setHandCardCount(i, CMD_DDZ.NORMAL_COUNT);
                    game.setScoreInfo(i, parseData.cbScoreInfo[i]);
                    //历史积分
                    game.setTurnScore(i, parseData.lTurnScore[i]);
                    game.setCollectScore(i, parseData.lCollectScore[i]);
                }
            }

                break;
            case CMD_DDZ.GS_TK_PLAYING:{

                cc.log("#### 游戏场景消息， （斗地主游戏命令 ）游戏进行");

                var dataParser = new DataParser();
                dataParser.init(data);
                var parseData = dataParser.parse([
                        ["cbTimeOutCard",   "BYTE"],    // 出牌时间
                        ["cbTimeCallScore",   "BYTE"],  // 叫分时间
                        ["cbTimeStartGame",   "BYTE"],  // 开始时间
                        ["cbTimeHeadOutCard",   "BYTE"],    // 首出时间
                        ["lCellScore",			"LONG"],    // 基础积分
          			    ["cbBombCount",     "BYTE"],    // 炸弹次数
                        ["bMissile",        "INT"],    // 火箭标识
                        ["wBankerUser",     "WORD"],    // 庄家用户
                        ["wCurrentUser",    "WORD"],    // 当前玩家
                        ["cbBankerScore",   "BYTE"],    // 庄家叫分
                        ["wTurnWiner",      "WORD"],    // 出牌玩家
                        ["cbTurnCardCount", "BYTE"],    // 出牌数目
                        ["cbTurnCardData",  "BYTE[]",   CMD_DDZ.MAX_COUNT],  // 出牌数据
                        ["cbBankerCard",    "BYTE[]",   3], // 游戏底牌
                        ["cbHandCardData",  "BYTE[]",   CMD_DDZ.MAX_COUNT],  // 手上扑克
                        ["cbHandCardCount", "BYTE[]",   CMD_DDZ.GAME_PLAYER],   // 扑克数目
                        ["lTurnScore",      "SCORE[]",  CMD_DDZ.GAME_PLAYER],   // 积分信息
                        ["lCollectScore",   "SCORE[]",  CMD_DDZ.GAME_PLAYER]    // 积分信息
                ]);

                cc.log("parseData = " + JSON.stringify(parseData, null, 2));
                cc.log("大小"+data.byteLength);
                game.setTimeOutCard(parseData.cbTimeOutCard);
                game.setTimeCallScore(parseData.cbTimeCallScore);
                game.setTimeStartGame(parseData.cbTimeStartGame);
                game.setTimeHeadOutCard(parseData.cbTimeHeadOutCard);
                game.setCellScore(parseData.lCellScore);
                game.setBombCount(parseData.cbBombCount);
                game.setRocketCount(parseData.bMissile);
                game.setBankerChairId(parseData.wBankerUser);
                game.setCurrentUser(parseData.wCurrentUser);
                game.setBankerScore(parseData.cbBankerScore);
                game.setLastSendCardUser(parseData.wTurnWiner);
                game.setTurnCardCount(parseData.cbTurnCardCount);
                game.setTurnCardData(parseData.wTurnWiner, parseData.cbTurnCardData);
                game.setBankerCard(parseData.cbBankerCard);
                game.setHandCardValues(g_objHero.getChairID(), parseData.cbHandCardData);

                for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++){
                    game.setHandCardCount(i, parseData.cbHandCardCount[i]);
                    game.setTurnScore(i, parseData.lTurnScore[i]);
                    game.setCollectScore(i, parseData.lCollectScore[i]);

                    //用户名字
                    var player = table.getPlayerByChairID(i);
                    if(player){
                        var nick = player.getNickName();
                        game.setNick(i, nick);
                    }
                }
            }
                break;
            default:
                break;
        }

        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onGameScene();
    },

    //游戏开始 100
    onGameMsgGameStart: function(data){

        cc.log("### 游戏服务器， （斗地主游戏命令 ）游戏开始 100");
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wStartUser", 		"WORD"],		//开始玩家
            ["wCurrentUser",    	"WORD"],	    //当前玩家
            ["cbValidCardData", 	"BYTE"],	    //明牌扑克
            ["cbValidCardIndex", 	"BYTE"],  		//明牌位置
            ["cbCardData", "BYTE[]",17],         //扑克列表
        ]);

        // 参考牛牛 发牌消息

        cc.log("parseData = " + JSON.stringify(parseData, null, 2));

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if(game){
            game.setCurrentUser(parseData.wCurrentUser);
            game.setHandCardValues(g_objHero.getChairID(), parseData.cbCardData); // 设置自己的牌
            game.sortCardsValueWithChairId(g_objHero.getChairID());
            for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
                game.setHandCardCount(i, CMD_DDZ.NORMAL_COUNT);
            }
            // 游戏开始，已玩局数自增
            game.setPlayCount(game.getPlayCount() + 1);
        }

        var table = ClientData.getInstance().getTable();
        if(table){
            table.setGameStatus(CMD_DDZ.GS_TK_PLAYING);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onSendCard();
    },

    // 用户叫分结果 101
    onGameMsgCallScore: function(data){

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）叫分结果 101");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wCurrentUser", 	    "WORD"],    // 当前玩家
            ["wCallScoreUser", 	    "WORD"],    // 叫分玩家
            ["cbCurrentScore", 	    "BYTE"],    // 当前叫分
            ["cbUserCallScore",     "BYTE"],    // 上次叫分
        ]);

        cc.log("parseData = " + JSON.stringify(parseData, null, 2));

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (game){
            game.setCurrentUser(parseData.wCurrentUser);
            game.setCallBankerChairId(parseData.wCallScoreUser);
            game.setBankerScore(parseData.cbCurrentScore);
            game.setLastCallScore(parseData.cbUserCallScore);
        }

        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onSetBanker();
    },

    // 庄家信息 102
    onGameMsgBankerInfo: function(data){

        cc.log("### 游戏服务器， （斗地主游戏命令 ）庄家信息 102");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wBankerUser",     "WORD"],	// 庄家玩家
            ["wCurrentUser",    "WORD"],	// 当前玩家
            ["cbBankerScore",   "BYTE"],    // 庄家叫分
            ["cbBankerCard",    "BYTE[]",   3], // 底牌
        ]);

        var game = ClientData.getInstance().getGame();
        if (game){
            game.setCurrentUser(parseData.wCurrentUser);
            game.setCallBankerChairId(parseData.wBankerUser);
            game.setBankerScore(parseData.cbBankerScore);
            game.setBankerCard(parseData.cbBankerCard);
            game.setHandCardCount(parseData.wBankerUser, game.getHandCardCount(parseData.wBankerUser) + 3);

            // 庄家是否是自己
            if (parseData.wBankerUser == g_objHero.getChairID()) {
                var cardsValues = game.getHandCardValues(parseData.wBankerUser);
                Array.prototype.push.apply(cardsValues, parseData.cbBankerCard);
                // 排序
                game.sortCardsValueWithChairId(parseData.wBankerUser);
            }
        }

        cc.log("parseData = " + JSON.stringify(parseData));

        DdzUIMgr.getInstance().onBankerInfo();
    },

    // 用户出牌消息 103
    onGameMsgSendCard: function(data){

        cc.log("### 游戏服务器， （斗地主游戏命令 ）用户发牌消息 103");

        cc.log("长度="+data.byteLength);
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["cbCardCount",     "BYTE"],	// 出牌数目
            ["wCurrentUser",    "WORD"],	// 当前玩家
            ["wOutCardUser",    "WORD"],    // 出牌玩家
            ["cbCardData",  "BYTE[]",   data.byteLength - 5], // 用户扑克
        ]);

        cc.log("parseData = " + JSON.stringify(parseData));

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (game){
            game.setTurnCardCount(parseData.cbCardCount);
            game.setCurrentUser(parseData.wCurrentUser);
            game.setLastSendCardUser(parseData.wOutCardUser);
            game.setTurnCardData(parseData.wOutCardUser, parseData.cbCardData);
            // 出牌玩家手上的牌数量要减掉
            var nCount = game.getHandCardCount(parseData.wOutCardUser) - parseData.cbCardCount;
            game.setHandCardCount(parseData.wOutCardUser, nCount);
            // 出牌玩家牌去掉
            game.removeCardFromPlayerCardsByValue(parseData.wOutCardUser, parseData.cbCardData);
        }

        var table = ClientData.getInstance().getTable();
        if(table){
            table.setGameStatus(CMD_DDZ.GS_TK_PLAYING);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onOpenCard();
    },

    // 用户放弃出牌 104
    onGameMsgPassCard: function (data) {
        cc.log("### 游戏服务器， （斗地主游戏命令 ）用户放弃出牌 104");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["cbTurnOver",      "BYTE"],	// 一轮结束
            ["wCurrentUser",    "WORD"],	// 当前玩家
            ["wPassCardUser",   "WORD"],    // 放弃玩家
        ]);

        cc.log("parseData = " + JSON.stringify(parseData));

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (game){
            game.setCurrentUser(parseData.wCurrentUser);
            game.setLastPassCardUser(parseData.wPassCardUser);

            game.setTurnCardData(parseData.wPassCardUser, []);
        }

        var table = ClientData.getInstance().getTable();
        if(table){
            table.setGameStatus(CMD_DDZ.GS_TK_PLAYING);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onPassCard();
    },

    // 游戏结束 105
    onGameMsgGameEnd: function(data){

        cc.log("### 游戏服务器， （斗地主游戏命令 ）游戏结束 105");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["lCellScore", 		"LONG"],	// 单元积分
            ["lGameScore", 		"SCORE[]", 	CMD_DDZ.GAME_PLAYER],   // 游戏积分
            ["bChunTian", 		"BYTE"],    // 春天标志
            ["bFanChunTian", 	"BYTE"],    // 反春天标志
            ["cbBombCount", 	"BYTE"],    // 炸弹个数
            ["cbEachBombCount", "BYTE[]",   CMD_DDZ.GAME_PLAYER],   // 炸弹个数
            ["bMissile", 	    "BYTE"],    // 火箭标志
            ["cbBankerScore", 	"BYTE"],    // 叫分数目
            ["cbCardCount",     "BYTE[]",   CMD_DDZ.GAME_PLAYER],   // 扑克数目
            ["cbHandCardData",  "BYTE[]",   54],    // 剩余牌
        ]);

        cc.log("parseData = " + JSON.stringify(parseData, null, 2));

        // 战绩页赋值玩家ID
        g_outcome.resetWithPlayerCount(CMD_DDZ.GAME_PLAYER);

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if(game){
            game.setCellScore(parseData.lCellScore);

            var cardsArr = [];
            var nCount = 0;
            for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
                g_outcome.setPointByChairId(i, parseData.lGameScore[i]);
                game.setTurnScore(i, parseData.lGameScore[i]);

                // 剩余牌赋值，结束页需要显示
                cardsArr = [];
                for (var j = 0; j < parseData.cbCardCount[i]; j++) {
                    cardsArr[j] = parseData.cbHandCardData[nCount];
                    nCount++;
                }
                game.setHandCardValues(i, []);
                game.setHandCardCount(i, 0);
                game.setTurnCardData(i, cardsArr);
            }
            game.setSpringCount(parseData.bChunTian);
            game.setAntiSpring(parseData.bFanChunTian);
            game.setRocketCount(parseData.bMissile);
            game.setBombCount(parseData.cbBombCount);
            game.setBankerScore(parseData.cbBankerScore);
        }

        var table = ClientData.getInstance().getTable();
        if (table) {
            table.setGameStatus(CMD_DDZ.GS_TK_FREE);

            // 更新玩家积分
            var plaza = ClientData.getInstance().getPlaza();    // 用来判断房卡还是金币
            for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
                var player = table.getPlayerByChairID(i);
                if (player) {
                    cc.log("更新玩家积分"+i);
                    //设置游戏类型 1：房卡 其他：金币
                    if(plaza.getCurGameType() == GAME_GENRE_PERSONAL){
                        //房卡
                        player.setScore(player.getScore() + parseData.lGameScore[i]);
                    } else {
                        player.setMoney(player.getMoney() + parseData.lGameScore[i]);
                    }
                }
            }
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onGameEnd();
    },

    // 设置基数 106
    onGameMsgSetBaseScore: function(data){

        cc.log("### 游戏服务器， （斗地主游戏命令 ）设置基数 106");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["lCellScore", 	"LONG"],	//摊牌用户
        ]);

        cc.log("parseData = " + JSON.stringify(parseData));

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if(game){
            game.setCellScore(parseData.lCellScore);
        }

        ///////////////////////////////////后UI处理 //////////////////////////////////////////
    },

    // 作弊扑克  107
    onGameMsgCheatCard: function(data){

        cc.log("### 游戏服务器， （斗地主游戏命令 ）作弊扑克 107");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wCardUser",   "WORD[]",   CMD_DDZ.GAME_PLAYER],	// 作弊玩家
            ["cbUserCount", "BYTE"],	// 作弊数量
            ["cbCardData", 	"BYTE[][]", CMD_DDZ.GAME_PLAYER, CMD_DDZ.MAX_COUNT],    // 扑克列表
            ["cbCardCount",	"BYTE[]",   CMD_DDZ.GAME_PLAYER],   // 扑克数量
        ]);

        cc.log("parseData = " + JSON.stringify(parseData, null, 2));

        DdzUIMgr.getInstance().onCheatCard(dataParser);
    },

    // 托管 108
    onGameMsgTrustee: function(data){

        cc.log("### 游戏服务器， （斗地主游戏命令 ）托管消息 108");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wTrusteeUser", 	"WORD"],	//托管玩家
            ["bTrustee", 		"BYTE"],  	//托管标志
        ]);

        cc.log("parseData = " + JSON.stringify(parseData));

        DdzUIMgr.getInstance().onTrustee(dataParser);
    },

    /////////////////////////////////C - > S///////////////////////////////////////
    // 用户叫分
    sendCallScore: function (nCallScore) {
        var dataBuilder = new DataBuilder();
        dataBuilder.init(1);
        dataBuilder.build([
            ["cbCallScore", "BYTE", nCallScore] // 叫分数目
        ]);

        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
            cc.log("用户发送叫分，叫分数="+nCallScore);
            g_gameSocket.sendData(MDM_GF_GAME, CMD_DDZ.SUB_C_CALL_SCORE, dataBuilder.getData());
        }
    },

    // 用户出牌
    sendOutCard:function(data){
        // 发送消息
        var dataBuilder = new DataBuilder();
        dataBuilder.init(data.length + 1);

        dataBuilder.build([
            ["cbCardCount", "BYTE", data.length],       // 出牌数量
            ["cbCardData;", "BYTE[]", data, data.length],   // 牌
        ]);

        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            cc.log("用户发送出牌，牌=" + data);
            g_gameSocket.sendData(MDM_GF_GAME, CMD_DDZ.SUB_C_OUT_CARD, dataBuilder.getData());
        }
    },

    // 用户放弃
    sendPassCard: function () {
        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            cc.log("用户发送放弃出牌");
            g_gameSocket.sendData(MDM_GF_GAME, CMD_DDZ.SUB_C_PASS_CARD, null);
        }
    },

    // 用户托管
    sendTrustee: function (bTrustee) {
        var dataBuilder = new DataBuilder();
        dataBuilder.init(1);
        dataBuilder.build([
            ["bTrustee", "BYTE", bTrustee] // 1：托管 0：取消托管
        ]);

        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            cc.log("用户发送托管标识，标识=" + bTrustee);
            g_gameSocket.sendData(MDM_GF_GAME, CMD_DDZ.SUB_C_TRUSTEE, dataBuilder.getData());
        }
    },
});


var g_DdzGameMsg = null

DdzGameMsg.getInstance = function(){
    if(g_DdzGameMsg == null){
        g_DdzGameMsg = new DdzGameMsg();
    }
    return g_DdzGameMsg;
}

GameMsgMgr.getInstance().addGameMsgInstance(DdzGameMsg.getInstance());
