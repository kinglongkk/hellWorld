/*
 sxh 消息处理类，用来处理
 发送
 接收
 * */
var DdzGameMsg = GameMsg.extend({

    ctor: function(){
        cc.log("---------- NiuniuFPGameMsg. 消息中转器被建创--------------------")
        //this.setName("DdzGameMsg 消息中转器")
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
        cc.log("-----------------------斗地主 onGameStatus 消息----------------------------");
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

    // 游戏场景消息， （斗地主游戏命令）等待开始
    onGameSceneMsgFree: function (data) {
    	cc.log("#### 游戏场景消息， （斗地主游戏命令）等待开始");
        cc.log("空闲状态")
    	//设置游戏场景 注意：只有这边设置了，发送房间后完成后，才能用这个场景运行 sxh
    	GameKindMgr.getInstance().setNewGameSceneFun(function(){
    		var gameScene = new DdzGameScene();
    		return gameScene;
    	});
        PlazaUIMgr.getInstance().onEnterGameScene();
    	var game = ClientData.getInstance().getGame();
    	if(!game){
    		return;
    	}

    	var parseData = data

    	cc.log("parseData = " + JSON.stringify(parseData, null, 2));

    	game.setCellScore(parseData.CellScore);
    	game.setTimeOutCard(parseData.TimeOutCard);
    	game.setTimeCallScore(parseData.TimeCallScore);
    	game.setTimeStartGame(parseData.TimeStartGame);
    	game.setTimeHeadOutCard(parseData.TimeHeadOutCard);

    	game.setPlayMode(parseData.GameType);
    	game.setGameCount(parseData.PlayCount);

        var table = ClientData.getInstance().getTable();
        if(table){
            //空闲
            table.setGameStatus(CMD_DDZ.GS_TK_FREE);
        }
    	///////////////////////////////////后UI处理 //////////////////////////////////////////
    	DdzUIMgr.getInstance().onGameScene();

        var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
        if(dlgLoader){
            dlgLoader.setProgress(100);
        }
    },

    onGameMsgStatusPlay:function(data){
        var parseData = data;

        cc.log("#### 游戏场景消息， （斗地主游戏命令 ）游戏进行");
        cc.log("游戏状态")
        cc.log("parseData = " + JSON.stringify(parseData, null, 2));
        GameKindMgr.getInstance().setNewGameSceneFun(function(){
            var gameScene = new DdzGameScene();
            return gameScene;
        });
        PlazaUIMgr.getInstance().onEnterGameScene();
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }

        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }
        game.setLiziCard(parseData.LaiziCard);
        game.setTimeOutCard(parseData.TimeOutCard);
        game.setTimeCallScore(parseData.TimeCallScore);
        game.setTimeStartGame(parseData.TimeStartGame);
        game.setTimeHeadOutCard(parseData.TimeHeadOutCard);
        game.setCellScore(parseData.CellScore);
        game.setBombCount(parseData.EachBombCount[0]+parseData.EachBombCount[1]+parseData.EachBombCount[2]);
        game.setRocketCount(parseData.bMissile);
        game.setBankerChairId(parseData.BankerUser);
        game.setCurrentUser(parseData.CurrentUser);
        game.setBankerScore(parseData.BankerScore);
        game.setLastSendCardUser(parseData.TurnWiner);
        game.setTurnCardCount(parseData.HandCardCount);
        game.setTurnCardData(parseData.TurnWiner, parseData.TurnCardData.CardData );
        game.setCardDatatype(parseData.TurnWiner, parseData.TurnCardData.CardType );
        game.setBankerCard(parseData.BankerCard);

        game.setAllPlayerCards(parseData.ShowCardData);
        game.setonTopen(parseData.ShowCardSign);
        //历史积分数据
        for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++){
            game.setHandCardCount(i, parseData.HandCardCount[i]);

            //用户名字
            var player = table.getPlayerByChairID(i);
            if(player){
                var nick = player.getNickName();
                game.setNick(i, nick);
            }
        }

        //游戏
        if(table) {
            table.setGameStatus(CMD_DDZ.GS_TK_PLAYING);
        }

        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onGameScene(parseData.TrusteeSign);
        var dlgLoader = UIMgr.getInstance().getDlg(ID_DlgLoader);
        if(dlgLoader){
            dlgLoader.setProgress(100);
        }
    },

    //游戏开始
    onGameMsgGameStartddz:function(data){
        cc.log("### 发送扑克");
        var dataParser = data;
        cc.log("parseData = " + JSON.stringify(dataParser, null, 2));

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if(game){
            game.setLiziCard(dataParser.LiziCard);
            game.setCurrentUser(dataParser.CallScoreUser);
            game.setHandCardValues(g_objHero.getChairID(), dataParser.CardData[g_objHero.getChairID()]); // 设置自己的牌

            for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {

                game.setHandCardCount(i, CMD_DDZ.NORMAL_COUNT);
            }
            // 游戏开始，已玩局数自增
            game.setPlayCount(game.getPlayCount() + 1);

        }

        //DdzUIMgr.getInstance().onTopen(dataParser.ShowCard);
        var table = ClientData.getInstance().getTable();
        if(table){
            //游戏开始
            table.setGameStatus(CMD_DDZ.GS_TK_PLAYING);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onSendCard();
    },


    // 用户叫分结果 101
    onGameMsgCallScore: function(data){
        cc.log("### 游戏服务器，叫分结果");
        var dataParser = data;
        cc.log("parseData = " + JSON.stringify(dataParser, null, 2));
        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (!game){
           return;
        }

        for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++){
            if(dataParser.ScoreInfo[i] <= 3){
                game.setBankerScore(dataParser.ScoreInfo[i]);
                //game.setLastCallScore(dataParser.ScoreInfo[i]);
                game.setCallBankerChairId(i);
                if(dataParser.ScoreInfo[i] == 3){
                    game.setLastCallScore(3);
                }
            }
            if(dataParser.ScoreInfo[i] == 65535){
                game.setCurrentUser(i);
                game.setLastCallScore(dataParser.ScoreInfo[(i+3-1)%3]);
            }

        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onSetBanker();
    },
    // 庄家信息
    onGameMsgBankerInfo: function(data){
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        var parseData = data;
        cc.log("parseData = " + JSON.stringify(parseData, null, 2));
        game.setCurrentUser(parseData.CurrentUser);
        game.setCallBankerChairId(parseData.BankerUser);
        game.setBankerScore(parseData.BankerScore);
        game.setBankerCard(parseData.BankerCard);
        game.setHandCardCount(parseData.BankerUser, game.getHandCardCount(parseData.BankerUser) + 3);
        // 庄家是否是自己
        if (parseData.BankerUser == g_objHero.getChairID()) {
            var cardsValues = game.getHandCardValues(parseData.BankerUser);
            Array.prototype.push.apply(cardsValues, parseData.BankerCard);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onBankerInfo();
    },

    // 用户出牌消息
    onGameMsgSendCardddz: function(data){
        cc.log("### 游戏服务器， （斗地主游戏命令 ）用户发牌消息");
        var parseData = data;
        cc.log("parseData = " + JSON.stringify(parseData));
        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if(!game){
            return
        }

        game.setTurnCardCount(parseData.cbCardCount);
        game.setCurrentUser(parseData.CurrentUser);
        game.setLastSendCardUser(parseData.OutCardUser);
        game.setTurnCardData(parseData.OutCardUser, parseData.CardData.CardData);
        game.setCardDatatype(parseData.OutCardUser, parseData.CardData.CardType );
        // 出牌玩家手上的牌数量要减掉
        var nCount = game.getHandCardCount(parseData.OutCardUser) - parseData.CardData.CardData.length;
        game.setHandCardCount(parseData.OutCardUser, nCount);
        // 出牌玩家牌去掉
        game.removeCardFromPlayerCardsByValue(parseData.OutCardUser, parseData.CardData.CardData);

        var table = ClientData.getInstance().getTable();
        if(table){
            //出牌
            table.setGameStatus(CMD_DDZ.GS_TK_PLAYING);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onOpenCard();
    },

    // 用户放弃出牌 104
    onGameMsgPassCard: function (data) {
        cc.log("### 游戏服务器， （斗地主游戏命令 ）用户放弃出牌 104");
        var parseData = data;
        cc.log("parseData = " + JSON.stringify(parseData));
        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (!game){
           return;
        }
        game.setCurrentUser(parseData.CurrentUser);
        game.setLastPassCardUser(parseData.PassCardUser);
        game.setTurnCardData(parseData.PassCardUser, []);
        cc.log("不出后自己当前的手牌"+game.getHandCardValues(g_objHero.getChairID()));
        var table = ClientData.getInstance().getTable();
        if(table){
            //用户放弃出牌
            table.setGameStatus(CMD_DDZ.GS_TK_PLAYING);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onPassCard();
    },
    // 游戏结束 105
    onGameMsgGameEndddz: function(data){
        cc.log("--------------游戏结束----------------------------");
        parseData = data;
        cc.log("parseData = " + JSON.stringify(parseData, null, 2));
        // 战绩页赋值玩家ID
        g_outcome.resetWithPlayerCount(CMD_DDZ.GAME_PLAYER);
        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if(!game){
            return
        }
        game.setCellScore(parseData.CellScore);
        var cardsArr = [];
        var nCount = 0;
        if(parseData.GameScore == null){
            parseData.GameScore=[0,0,0];
        }
        for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {

            g_outcome.setPointByChairId(i, parseData.GameScore[i]);
            game.setTurnScore(i, parseData.GameScore[i]);

            // 剩余牌赋值，结束页需要显示
            cardsArr = [];

            if( parseData.HandCardData != null && parseData.HandCardData.length != 0   ){
                for (var j = 0; j < parseData.HandCardData[i].length; j++) {
                    cardsArr[j] = parseData.HandCardData[i][j];
                    nCount++;
                }
            }

            cc.log("展示牌数组" + cardsArr);
            game.setHandCardValues(i, []);
            game.setHandCardCount(i, 0);
            game.setTurnCardData(i, cardsArr);
        }
        game.setSpringCount(parseData.SpringSign);
        game.setAntiSpring(parseData.SpringSign);
        game.setRocketCount(parseData.KingCount == null ? 0 : parseData.KingCount.length);
        if(parseData.EachBombCount != null){
            game.setBombCount(parseData.EachBombCount[0]+parseData.EachBombCount[1]+parseData.EachBombCount[2]);
        }
        game.setBankerScore(parseData.BankerScore);
        //game.setKingCount(parseData.KingCount);

        var table = ClientData.getInstance().getTable();
        if (table) {
            // 游戏结束
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
                        player.setScore(player.getScore() + parseData.GameScore[i]);
                    } else {
                        player.setMoney(player.getScore() + parseData.GameScore[i]);
                    }
                }
            }
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onGameEnd(parseData.RecordInfo,parseData.Reason);
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

    // 托管
    onGameMsgTrustee: function(data){
        cc.log("### 游戏服务器， （斗地主游戏命令 ）托管消息 108");
        var parseData = data;
        cc.log("parseData = " + JSON.stringify(parseData));
        DdzUIMgr.getInstance().onTrustee(parseData);
    },

    //明牌
    onGameMsgopende:function(data){
        cc.log("### 游戏服务器，用户明牌");
        var parseData = data;
        cc.log("parseData = " + JSON.stringify(parseData));
        DdzUIMgr.getInstance().onTopen(parseData);
    },

    //叫分状态
    onGameMsgStatusCall:function(data){
        cc.log("-------------叫分状态-------------");
        GameKindMgr.getInstance().setNewGameSceneFun(function(){
            var gameScene = new DdzGameScene();
            return gameScene;
        });
        PlazaUIMgr.getInstance().onEnterGameScene();

        var parseData = data;
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        var table = ClientData.getInstance().getTable();
        if(!table){
        	return;
        }
        game.setLiziCard(parseData.LaiziCard);
        cc.log("parseData = " + JSON.stringify(parseData, null, 2));

        game.setTimeOutCard(parseData.TimeOutCard);
        game.setTimeCallScore(parseData.TimeCallScore);
        game.setTimeStartGame(parseData.TimeStartGame);
        game.setTimeHeadOutCard(parseData.TimeHeadOutCard);//首出时间
        game.setCellScore(parseData.CellScore);// 单元积分
        game.setRocketCount(parseData.bMissile);
        game.setCurrentUser(parseData.CurrentUser);// 当前玩家
        game.setBankerScore(parseData.BankerScore);// 庄家叫分
        game.setPlayMode(parseData.GameType);
        //game.setHandCardValues(g_objHero.getChairID(), parseData.CardData[g_objHero.getChairID()]);
        game.setAllPlayerCards(parseData.ShowCardData);
        game.setonTopen(parseData.ShowCardSign);

        for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++){
            game.setHandCardCount(i, parseData.HandCardCount[i]);
            game.setScoreInfo(i, parseData.ScoreInfo[i]);

            //用户名字
            var player = table.getPlayerByChairID(i);
            if(player){
                var nick = player.getNickName();
                game.setNick(i, nick);
            }
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        DdzUIMgr.getInstance().onGameScene();
    },
    /////////////////////////////////C - > S///////////////////////////////////////

    // 用户叫分
    sendCallScore: function (Score) {
        cc.log("#### 用户叫分" + Score);
        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
            g_gameSocket.sendData("C2G_DDZ_CallScore", {CallScore:Score });
        }
    },
    // 用户出牌
    sendOutCard:function(data){
        // 发送消息
        var dataBuilder = data;
        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            cc.log("用户发送出牌，牌paipai=" + data);
            var game = ClientData.getInstance().getGame();
            cc.log("出牌前的数据"+game.getHandCardValues(g_objHero.getChairID()));
            g_gameSocket.sendData("C2G_DDZ_OutCard",{CardData:data,CardType:1 });
        }
    },

    // 用户放弃
    sendPassCard: function () {
        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            var game = ClientData.getInstance().getGame();
            cc.log("用户发送放弃出牌"+game.getHandCardValues(g_objHero.getChairID()));
            g_gameSocket.sendData("C2G_DDZ_OutCard",{CardType:0 });
        }
    },

    // 用户托管
    sendTrustee: function (data) {
        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            cc.log("用户发送托管标识，标识=" + data);
            g_gameSocket.sendData("C2G_DDZ_TRUSTEE", {Trustee :data });
        }
    },

    //用户明牌
    sendDeals:function(){
        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            g_gameSocket.sendData("C2G_DDZ_SHOWCARD", null);
        }
    }
});


var g_DdzGameMsg = null

DdzGameMsg.getInstance = function(){
    if(g_DdzGameMsg == null){
        g_DdzGameMsg = new DdzGameMsg();
        //GameMsgMgr.getInstance().addGameMsgInstance(g_DdzGameMsg)
    }
    return g_DdzGameMsg;
}
GameMsgMgr.getInstance().addGameMsgInstance(DdzGameMsg.getInstance());
