var NiuniuFPGameMsg = GameMsg.extend({

    ctor: function () {},

    //判断是否当前运行游戏
    isCurRunGame: function () {
        var kindId = 0;
        var plaza = ClientData.getInstance().getPlaza();
        if (plaza) {
            kindId = plaza.getCurKindID();

            if (kindId === CMD_NIUNIU_TB.KIND_ID) {
                return true;
            }
        }

        return false;
    },

    onGameStatus: function () {
        if (!this.isCurRunGame()) {
            return;
        }

        //set game
        var game = new NiuniuFPGame();
        ClientData.getInstance().setGame(game);
    },

    //通比牛牛游戏命令
    /*    onGameMsg: function (subCmd, data) {
        if (!this.isCurRunGame()) {
            return;
        }

        switch (subCmd) {

            //游戏开始
            case CMD_NIUNIU_TB.SUB_S_GAME_START:
                this.onGameMsgGameStart(data);
                break;
            //加注结果
            case CMD_NIUNIU_TB.SUB_S_ADD_SCORE:
                this.onGameMsgAddScore(data);
                break;
            //用户强退
            case CMD_NIUNIU_TB.SUB_S_PLAYER_EXIT:
                this.onGameMsgPlayerExit(data);
                break;
            //发牌消息
            case CMD_NIUNIU_TB.SUB_S_SEND_CARD:
                this.onGameMsgSendCard(data);
                break;
            //游戏结束
            case CMD_NIUNIU_TB.SUB_S_GAME_END:
                this.onGameMsgGameEnd(data);
                break;
            //用户摊牌
            case CMD_NIUNIU_TB.SUB_S_OPEN_CARD:
                this.onGameMsgOpenCard(data);
                break;
            //用户叫庄
            case CMD_NIUNIU_TB.SUB_S_CALL_BANKER:
                this.onGameMsgCallBanker(data);
                break;
            case CMD_NIUNIU_TB.SUB_S_BUQIANG:
                break;
            //设置底注
            case CMD_NIUNIU_TB.SUB_S_SET_BASESCORE:
                this.onGameMsgSetBaseCore(data);
                break;
            //发牌控制
            case CMD_NIUNIU_TB.SUB_S_ALL_CARD:
                this.onGameMsgAllCard(data);
                break;
            //系统控制
            case CMD_NIUNIU_TB.SUB_S_AMDIN_COMMAND:
            //发送库存值
            case CMD_NIUNIU_TB.SUB_S_SEND_STORAGE_START:
            //查询衰减值
            case CMD_NIUNIU_TB.SUB_S_SEND_STORAGE_DEDUCT:
            //发送账号
            case CMD_NIUNIU_TB.SUB_S_SEND_ACCOUNT:
            //查询账号
            case CMD_NIUNIU_TB.SUB_S_ADMIN_CHEAK:
                break;
            default:
                break;
        }
    },*/

    //游戏场景消息
    onGameSceneMsg: function (parseData, isPlay) {
        if (!this.isCurRunGame()) {
            return;
        }

        //设置游戏场景
        GameKindMgr.getInstance().setNewGameSceneFun(function () {
            var gameScene = new NiuniuFPScene();
            return gameScene;
        });

        var table = ClientData.getInstance().getTable();
        if (!table) return;

        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var gameStatus = table.getGameStatus();
        var i = 0;

        switch (gameStatus) {
            case CMD_NIUNIU_TB.GS_TK_FREE:

                cc.log("#### 游戏场景消息， （通比牛牛游戏命令 ）等待开始");
                cc.log("parseData = " + JSON.stringify(parseData, null, 2));

                //暂定游戏人数为4
                for (i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
                    game.setPlayByChairId(i, true);
                }

                //设置低分
                game.setCellScore(parseData.CellScore);

/*                var dataParser = new DataParser();	//CMD_S_StatusFree
                dataParser.init(data);
                var parseData = dataParser.parse([
                    ["lCellScore", "LONGLONG"],	// 基础积分
                    ["lTurnScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],	// 积分信息
                    ["lCollectScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],	// 积分信息
                    ["szGameRoomName", "TCHARS", CMD_NIUNIU_TB.SERVER_LEN],	// 房间名称
                    ["cbCtrlFlag", "BYTE"],		// 操作标志
                    ["wMaxScoreTimes", "WORD"],	// 最大倍数
                    ["lAndroidMaxCellScore", "LONG"],	//机器人可设置的最大底注
                    ["lAndroidMinCellScore", "LONG"],	//机器人可设置的最小底注
                    ["cbTimeOutCard", "BYTE"],		// 出牌时间
                    ["cbTimeOperateCard", "BYTE"],	// 操作时间
                    ["cbTimeStartGame", "BYTE"],	// 开始时间
                    ["cbPlayerCount", "BYTE"],	// 玩家人数
                    ["cbMaCount", "BYTE"],			// 底分
                    ["wPlayMode", "WORD"],			// 游戏模式0x0001 //金币类型  0x0010 //房卡类型
                    ["wPlayCount", "BYTE"],			// 游戏局数
                    ["playCount", "BYTE"],                                        //断线后已玩局数
                    ["eachRoundScore", "INT[][]", CMD_NIUNIU_TB.GAME_PLAYER, 16]	    //断线之后的战绩数据
                ]);*/

                var waitIndex = 0;

                if (parseData.EachRoundScore[0]) {
                    for (; waitIndex < parseData.EachRoundScore[0].length; waitIndex++) {
                        if (parseData.EachRoundScore[0][waitIndex] === 0) {
                            break;
                        }
                    }
                }

                //历史积分数据
                for (i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
                    game.setTurnScore(i, parseData.lTurnScore);
                    game.setCollectScore(i, parseData.lCollectScore);

                    player = table.getPlayerByChairID(i);
                    g_outcome.setPlayerByChairId(i, player);
                    if (parseData.EachRoundScore[i]) {
                        parseData.EachRoundScore[i].length = waitIndex;
                        g_outcome.setPointByChairId(i, parseData.EachRoundScore[i]);
                    }

                }

                game.setPlayMode(parseData.wPlayMode);
                game.setCtrlFlag(parseData.cbCtrlFlag);
                game.setAndroidMinCellScore(parseData.lAndroidMinCellScore);
                game.setAndroidMaxCellScore(parseData.lAndroidMaxCellScore);
                game.setMaxScoreTimes(parseData.wMaxScoreTimes);
                game.setGameCount(parseData.wPlayCount);
                game.setCurentCount(parseData.playCount);

                break;
            case CMD_NIUNIU_TB.GS_TK_CALL:

                cc.log("#### 游戏场景消息，（通比牛牛游戏命令 ） 叫庄状态");
                cc.log("parseData = " + JSON.stringify(parseData, null, 2));

/*                var dataParser = new DataParser();	//CMD_S_StatusCall
                dataParser.init(data);
                var parseData = dataParser.parse([
                    ["wCallBanker", "WORD"],									//叫庄用户
                    ["cbDynamicJoin", "BYTE"],									//动态加入
                    ["cbPlayStatus", "BYTE[]", CMD_NIUNIU_TB.GAME_PLAYER],	//用户状态
                    ["lTurnScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],	//积分信息
                    ["lCollectScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],	//积分信息
                    ["szGameRoomName", "TCHAR[]", CMD_NIUNIU_TB.SERVER_LEN]	//房间名称
                ]);*/


                for (i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
                    game.setPlayByChairId(i, true);
                    game.setCallBankerChairId(parseData.wCallBanker);

                    //用户名字
                    var player = table.getPlayerByChairID(i);
                    if (player) {
                        var nick = player.getNickName();
                        game.setNick(i, nick);
                    }

                    //历史积分
                    game.setTurnScore(i, parseData.lTurnScore);
                    game.setCollectScore(i, parseData.lCollectScore);
                }
                break;
            case CMD_NIUNIU_TB.GS_TK_SCORE:

                cc.log("#### 游戏场景消息， （通比牛牛游戏命令 ）下注状态");
                cc.log("parseData = " + JSON.stringify(parseData));

/*                var dataParser = new DataParser();
                dataParser.init(data);
                var parseData = dataParser.parse([
                    ["cbPlayStatus", "BYTE[]", CMD_NIUNIU_TB.GAME_PLAYER],			//用户状态
                    ["cbDynamicJoin", "BYTE"],											//动态加入
                    ["lTurnMaxScore", "LONGLONG"],										//最大下注
                    ["lTableScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],			//下注数目
                    ["wBankerUser", "WORD"],
                    ["szGameRoomName", "TCHAR[]"],										//庄家用户
                    ["lTurnScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],			//积分信息
                    ["lCollectScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER]			//积分信息
                ]);*/


                for (i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
                    game.setPlayByChairId(i, parseData.cbPlayStatus[i]);
                    game.setTurnMaxScore(parseData.lTurnMaxScore);
                    game.setAddScore(i, parseData.lTableScore[i]);
                    game.setBankerChairId(parseData.wBankerUser);

                    //用户名字
                    var player = table.getPlayerByChairID(i);
                    if (player) {
                        var nick = player.getNickName();
                        game.setNick(i, nick);
                    }

                    //历史积分
                    game.setTurnScore(i, parseData.lTurnScore);
                    game.setCollectScore(i, parseData.lCollectScore);
                }
                break;
            case CMD_NIUNIU_TB.GS_TK_PLAYING:

                cc.log("#### 游戏场景消息， （通比牛牛游戏命令 ）游戏进行");

/*                var dataParser = new DataParser();
                dataParser.init(data);
                var parseData = dataParser.parse([
                    ["lCellScore", "LONGLONG"],									//基础积分
                    ["cbPlayStatus", "BYTE[]", CMD_NIUNIU_TB.GAME_PLAYER],		//用户状态
                    ["cbDynamicJoin", "BYTE"],										//动态加入
                    ["lTurnMaxScore", "LONGLONG"],									//最大下注
                    ["lTableScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],		//下注数目（玩家下注值）
                    ["wBankerUser", "WORD"],										//庄家用户
                    //扑克信息
                    ["cbHandCardData", "BYTE[][]", CMD_NIUNIU_TB.GAME_PLAYER, CMD_NIUNIU_TB.MAXCOUNT],//桌面扑克
                    ["bOxCard", "BYTE[]", CMD_NIUNIU_TB.GAME_PLAYER],		//牛牛数据
                    //历史积分
                    ["lTurnScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],		//积分信息
                    ["lCollectScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],		//积分信息
                    ["szGameRoomName", "TCHARS", CMD_NIUNIU_TB.SERVER_LEN],		//房间名称
                    ["cbCtrFlag", "BYTE"],										//操作标志
                    ["wMaxScoreTimes", "WORD"],										//最大倍数
                    ["lAndroidMaxCellScore", "LONG"],										//机器人可设置的最大底注
                    ["lAndroidMinCellScore", "LONG"],										//机器人可设置的最小底注
                    ["isOpenCard", "BYTE[]", CMD_NIUNIU_TB.GAME_PLAYER],     //断线后是否翻牌
                    ["playCount", "BYTE"],                                        //断线后已玩局数
                    ["eachRoundScore", "INT[][]", CMD_NIUNIU_TB.GAME_PLAYER, 16]	//断线之后的战绩数据
                ]);*/

                cc.log("parseData = " + JSON.stringify(parseData, null, 2));
                game.setCellScore(parseData.lCellScore);
                game.setTurnMaxScore(parseData.lTurnMaxScore);
                game.setBankerChairId(parseData.wBankerUser);
                game.setAllPlayerCards(parseData.cbHandCardData);
                game.setCtrlFlag(parseData.cbCtrFlag);
                game.setAndroidMinCellScore(parseData.lAndroidMinCellScore);
                game.setAndroidMaxCellScore(parseData.lAndroidMaxCellScore);
                game.setMaxScoreTimes(parseData.wMaxScoreTimes);
                game.setCurentCount(parseData.playCount);

                var conductIndex = 0;
                for (; conductIndex < parseData.EachRoundScore[0].length; conductIndex++) {
                    if (parseData.EachRoundScore[0][conductIndex] === 0) {
                        break;
                    }
                }

                for (i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
                    var chairId = NiuniuFPUIMgr.getInstance().getPlayerPosByChairId(i);
                    game.setPlayByChairId(chairId, parseData.cbPlayStatus[chairId]);
                    game.setAddScore(chairId, parseData.lTableScore[chairId]);
                    game.setTurnScore(chairId, parseData.lTurnScore[chairId]);
                    game.setCollectScore(chairId, parseData.lCollectScore[chairId]);

                    if (parseData.bOxCard[i] != 0xFF) {
                        game.openCard(chairId, parseData.cbHandCardData[chairId]);
                    }

                    game.changeOpenCard(chairId, parseData.isOpenCard[chairId]);


                    //用户名字
                    var player = table.getPlayerByChairID(chairId);
                    if (player) {
                        var nick = player.getNickName();
                        game.setNick(chairId, nick);
                        g_outcome.setPlayerByChairId(chairId, player);
                        parseData.EachRoundScore[chairId].length = conductIndex;
                        g_outcome.setPointByChairId(chairId, parseData.EachRoundScore[chairId]);
                    }
                }
                break;
            default:
                cc.log("游戏场景消息中的游戏状态");
                break;
        }

        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().onGameScene();
    },

    //游戏开始 100
    onGameMsgGameStart: function (data) {

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）游戏开始");
        cc.log("parseData = " + JSON.stringify(data, null, 2));

/*        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["lCellScore", "LONG"],		//单元下注
            ["lDrawMaxScore", "LONGLONG"],	//最大下注
            ["lTurnMaxScore", "LONGLONG"],	//最大下注
            ["wBankerUser", "WORD"]  		//庄家用户
        ]);*/

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (game) {
            game.setBankerChairId(data.wBankerUser);
            game.setTurnMaxScore(data.lTurnMaxScore);

        }

        var table = ClientData.getInstance().getTable();
        if (table) {
            table.setGameStatus(CMD_NIUNIU_TB.GS_TK_SCORE);
            table.startGame();
        }

        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        // NiuniuFPUIMgr.getInstance().onSetBanker();
        NiuniuFPUIMgr.getInstance().onGameStart();
    },

    //发送两张公共牌
    onGameMsgSendPublicCard: function (data) {
        if (data) cc.log("发送两张公共牌" + JSON.stringify(data));

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）发两张牌消息");
        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (game) game.setPublicCards(data.PublicCardData);

        ///////////////////////////////////后UI处理//////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().sendPublicCard();
    },

    //发四张牌
    onGameMsgSendCard: function (data) {
        if (data) cc.log("发四张牌" + JSON.stringify(data));

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）发四张牌消息");

/*        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["cbCardData", "BYTE[][]", CMD_NIUNIU_TB.GAME_PLAYER, CMD_NIUNIU_TB.MAXCOUNT]	//用户扑克
        ]);*/

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (game) game.setAllPlayerCards(data.CardData);

        var table = ClientData.getInstance().getTable();
        if (table) table.setGameStatus(CMD_NIUNIU_TB.GS_TK_PLAYING);

        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().onSendCard(4);
    },

    //用户抢庄
    callScore: function () {
/*        if (data) cc.log("用户抢庄" + JSON.stringify(data));

        cc.log("### 游戏客户端， （通比牛牛游戏命令 ）用户抢庄");
        g_gameSocket.sendData("C2G_TBNN_CallScore", {
            CallScore : data
        });*/
    },

    //广播抢庄用户
    onGameMsgCallScore: function (data) {
        if (data) cc.log("广播抢庄用户" + JSON.stringify(data));

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）广播抢庄用户");

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (!CMD_NIUNIU_TB.isLocal) {
            if (game) game.setRobBankerScore(data.ChairID, data.CallScore);
        } else {

        }
        ///////////////////////////////////后UI处理//////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().onCallScore(data.ChairID);
    },

    //广播庄家用户
    onGameMsgResultCallScore: function (data) {
        if (data) cc.log("广播成为庄家用户" + JSON.stringify(data));

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）广播成为庄家用户");

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        if (!CMD_NIUNIU_TB.isLocal) {
            var game = ClientData.getInstance().getGame();
            if (game) game.setBankerChairId(data.Banker);
        }
        ///////////////////////////////////后UI处理//////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().bankerWordAnimation();
    },

    //不是庄家的用户加注
    addScore: function (data) {
/*        if (data) cc.log("不是庄家的用户加注" + JSON.stringify(data));

        cc.log("### 游戏客户端， （通比牛牛游戏命令 ）不是庄家的用户加注");
        g_gameSocket.sendData("C2G_TBNN_AddScore", {
            Score :data
        });*/
    },

    //广播用户加注倍数
    onGameMsgAddScore: function (data) {
        if (data) cc.log("广播用户加注倍数" + JSON.stringify(data));

        cc.log("### 游戏服务端， （通比牛牛游戏命令 ）广播用户加注倍数");

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        if (!CMD_NIUNIU_TB.isLocal) {
            var game = ClientData.getInstance().getGame();
            if (game) game.setAddChipScore(data.ChairID, data.AddScoreCount);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().onAddChip(data.ChairID);
    },

    //发最后一张牌
    onGameMsgSendLastCard: function (data) {
        if (data) cc.log("发最后一张牌" + JSON.stringify(data));

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）发最后一张牌消息");

        ///////////////////////////////////先数据处理 //////////////////////////////////////////
        if (!CMD_NIUNIU_TB.isLocal) {
            var game = ClientData.getInstance().getGame();
            if (game) game.setAllPlayerCards(data.LastCard);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().onSendCard(1);
    },

    //用户亮牌
    sendOpenCard: function (data) {
        if (data) cc.log("用户亮牌" + JSON.stringify(data));

        cc.log("### 游戏客户端， （通比牛牛游戏命令 ）用户亮牌");
        g_gameSocket.sendData("C2G_TBNN_OpenCard", {
            CardType: data.type,
            CardData: data.cards
        });
    },

    //广播亮牌用户
    onGameMsgOpenCard: function (data) {
        if (data) cc.log("广播用户亮牌" + JSON.stringify(data));

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）广播用户亮牌");

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        if (!CMD_NIUNIU_TB.isLocal) {
            var game = ClientData.getInstance().getGame();
            if (game) game.openCard(data.chairId, data.CardType, data.CardData);
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().onShowOpenCard(data.chairId);
    },

    //游戏结束 104
    onGameMsgGameEnd: function (data) {
        if (data) cc.log("游戏结束" + JSON.stringify(data));

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）游戏结束");

/*        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["lGameTax", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],	 //游戏税收
            ["lGameScore", "LONGLONG[]", CMD_NIUNIU_TB.GAME_PLAYER],  //游戏得分
            ["cbCardData", "BYTE[]", CMD_NIUNIU_TB.GAME_PLAYER],  //用户扑克
            ["AllbCardValue", "BYTE[]", CMD_NIUNIU_TB.GAME_PLAYER],
            ["MMcbCardData", "BYTE[][]", CMD_NIUNIU_TB.GAME_PLAYER, CMD_NIUNIU_TB.MAXCOUNT]  //用户扑克
        ]);*/

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        if (!CMD_NIUNIU_TB.isLocal) {
            var game = ClientData.getInstance().getGame();
            if (game) game.gameEnd(data);

            var table = ClientData.getInstance().getTable();
            if (table) {
                table.setGameStatus(CMD_NIUNIU_TB.GS_TK_FREE);

                // 更新金币跟积分
                var plaza = ClientData.getInstance().getPlaza();
                var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
                for (var i = 0; i < data.lGameScore.length; i++) {
                    if (data.lGameScore[i] === 0) continue;
                    var player = table.getPlayerByChairID(i);
                    if (player) {
                        if (curGameType === GAME_GENRE_PERSONAL) {
                            //房卡
                            player.setScore(player.getScore() + data.lGameScore[i]);
                        }
                    }
                }
            }
        }
        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().onGameEnd();
    },

    //用户强退 102
    onGameMsgPlayerExit: function (data) {

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）用户强退 102");

/*        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wPlayerID", "WORD"]	//退出用户
        ]);*/

        cc.log("parseData = " + JSON.stringify(data));
    },

    //广播用户摊牌 105
    /*onGameMsgOpenCard: function (data) {

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）用户摊牌 105");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["wPlayerID", "WORD"],	//摊牌用户
            ["bOpen", "BYTE"],  	//摊牌标志，
            ["cbCardData", "BYTE[][]", CMD_NIUNIU_TB.GAME_PLAYER, CMD_NIUNIU_TB.MAXCOUNT]  //牌数据
        ]);

        cc.log("parseData = " + JSON.stringify(parseData));

        ///////////////////////////////////先数据处理//////////////////////////////////////////
        var game = ClientData.getInstance().getGame();
        if (game) {
            game.openCard(parseData.wPlayerID, parseData.cbCardData[parseData.wPlayerID]);
        }

        ///////////////////////////////////后UI处理 //////////////////////////////////////////
        NiuniuFPUIMgr.getInstance().onOpenCard(parseData.wPlayerID);
    },*/

    //发牌控制 107 not used
    /*onGameMsgAllCard: function () {

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）发牌控制 107");

        //只发给机器人
    },*/

    //设置底注
    /*onGameMsgSetBaseCore: function (data) {

        cc.log("### 游戏服务器， （通比牛牛游戏命令 ）设置底注 ");

        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["lBaseScore", "LONG"]
        ]);

        cc.log("parseData = " + JSON.stringify(parseData, null, 2));

        var game = ClientData.getInstance().getGame();
        game.setCellScore(parseData.lBaseScore);
    },*/

    /////////////////////////////////C - > S///////////////////////////////////////

    /**
     * 设置用户底注
     * @param cbCallScore 底注
     */
    /*sendCallCellScore: function (cbCallScore) {
        cc.log("@@@@发送设置底注" + cbCallScore);
        var dataBuilder = new DataBuilder();
        dataBuilder.init(4);
        dataBuilder.build([
            ["cbCallScore", "LONG", cbCallScore]
        ]);

        if (g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            g_gameSocket.sendData(MDM_GF_GAME, CMD_NIUNIU_TB.SUB_C_CALL_CELLSCORE, dataBuilder.getData());
        }
    },*/

    //用户叫庄
    /*sendCallBanker: function (bBanker) {
        var bCall = 0;
        if (bBanker) {
            bCall = 1;
        }

        // var bStuff1 = 1;
        // var bStuff2 = Math.floor(Math.random() * 100);

        var dataBuilder = new DataBuilder();
        dataBuilder.init(1);
        dataBuilder.build([
            ["bBanker", "BYTE", bCall]		//做庄标志
        ]);

        if (g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            g_gameSocket.sendData(MDM_GF_GAME, CMD_NIUNIU_TB.SUB_C_CALL_BANKER, dataBuilder.getData());
        }
    },*/

    //用户加注
    /*sendAddScore: function (addMoney) {
        var dataBuilder = new DataBuilder();
        dataBuilder.init(8);
        dataBuilder.build([
            ["lScore", "INT64_NUMBER", addMoney]//加注数目
        ]);

        if (g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            g_gameSocket.sendData(MDM_GF_GAME, CMD_NIUNIU_TB.SUB_C_ADD_SCORE, dataBuilder.getData());
        }
    },*/

    //用户摊牌
    /*    sendOpenCard: function (bOX, cardData) {
        var cbOX = bOX ? 1 : 0;
        cc.log("@@@@@@@@@@@@ sendOpenCard" + bOX + " " + cbOX + " " + cardData);
        var dataBuilder = new DataBuilder();
        dataBuilder.init(6);
        dataBuilder.build([
            ["bOX", "BYTE", cbOX],//牛牛标志
            ["cbCardData", "BYTE[]", cardData, CMD_NIUNIU_TB.MAXCOUNT]
        ]);

        if (g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED) {
            g_gameSocket.sendData(MDM_GF_GAME, CMD_NIUNIU_TB.SUB_C_OPEN_CARD, dataBuilder.getData());
        }
    },*/

    //加注结果 101
    /*onGameMsgAddScore: function (data) {

     cc.log("### 游戏服务器， （通比牛牛游戏命令 ）加注结果 101");

     var dataParser = new DataParser();
     dataParser.init(data);
     var parseData = dataParser.parse([
     ["wAddScoreUser", "WORD"],//加注用户
     ["lAddScoreCount", "LONGLONG"]  //加注数目
     ]);

     // cc.log("parseData = " + JSON.stringify(parseData, null, 2));

     ///////////////////////////////////先数据处理//////////////////////////////////////////
     var game = ClientData.getInstance().getGame();
     if (game) {
     game.setAddScore(parseData.wAddScoreUser, parseData.lAddScoreCount);
     }

     ///////////////////////////////////后UI处理 //////////////////////////////////////////
     NiuniuFPUIMgr.getInstance().onAddScore(parseData.wAddScoreUser, parseData.lAddScoreCount);
     },*/

    //广播用户叫庄  106
    /*onGameMsgCallBanker: function (data) {

     cc.log("### 游戏服务器， （通比牛牛游戏命令 ）用户叫庄 ");

     var dataParser = new DataParser();
     dataParser.init(data);
     var parseData = dataParser.parse([
     ["bQiang_Start", "BOOL"],	//开始抢 false
     ["wCallBanker", "WORD"],	//叫庄用户
     ["bFirstTimes", "BOOL"]  	//首次叫庄
     ]);

     cc.log("parseData = " + JSON.stringify(parseData, null, 2));

     ///////////////////////////////////先数据处理//////////////////////////////////////////
     var table = ClientData.getInstance().getTable();
     if (table) {
     //刚开始游戏
     if (parseData.bFirstTimes) {
     // table.startGame();
     }

     var game = ClientData.getInstance().getGame();
     if (game) {
     game.setFirstTimesCallBanker(parseData.bFirstTimes);
     game.setCallBankerChairId(parseData.wCallBanker);
     }

     table.setGameStatus(CMD_NIUNIU_TB.GS_TK_CALL);

     if (parseData.bQiang_Start) {

     } else {
     // 		m_wBankerUser=pCallBanker->wCallBanker;
     // //庄家标志
     // WORD wID=m_wViewChairID[m_wBankerUser];
     // m_GameClientView.SetBankerUser(wID);

     // //m_GameClientView.m_bShowSmallBank=true;//1.29
     if (g_objHero.getChairID() == parseData.wCallBanker) {
     this.sendCallBanker(true);
     }
     }
     }

     ///////////////////////////////////后UI处理 //////////////////////////////////////////
     NiuniuFPUIMgr.getInstance().onCallBanker();
     },*/

});


var g_niuniuFPGameMsg = null;

NiuniuFPGameMsg.getInstance = function () {
    if (g_niuniuFPGameMsg == null) {
        g_niuniuFPGameMsg = new NiuniuFPGameMsg();
    }
    return g_niuniuFPGameMsg;
};

GameMsgMgr.getInstance().addGameMsgInstance(NiuniuFPGameMsg.getInstance());
