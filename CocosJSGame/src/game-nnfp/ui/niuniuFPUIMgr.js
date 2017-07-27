var s_sharedNiuniuFPUIMgr = null;

var NiuniuFPUIMgr = GameUIMgr.extend({
    resetData: function () {
        this._bDealGameScene = false;
        this._endPhase = false;

        this.btn = {
            state: 0
        }

    },

    startGame: function () {
        cc.log("运行次数");
        this.resetData();
        //设置游戏人数
        this.setPlayerCount(CMD_NIUNIU_TB.GAME_PLAYER);

        var sizeDir = cc.director.getWinSize();

        //发牌
        var sendCardLayer = SendCardMgr.getInstance().getSendCardLayer();
        this._uiLayer.addChild(sendCardLayer, 10);
        var startPt = cc.p(sizeDir.width / 2, sizeDir.height / 2);
        var parameter = {
            sendTime: 0.1,  //一张牌时间
            interval: 0.2, //设置发牌间隔（秒）
            startPt: startPt,
            startR: 0,
            startS: 0.3, //初始大小
            endR: 0 //旋转圈，360为1圈
        };
        SendCardMgr.getInstance().setParameter(parameter);

        var playerDlg = UIMgr.getInstance().openDlg(ID_NnFpDlgPlayer);
        playerDlg.updateResultIcon(false);

        this.sprite = new cc.Sprite("#huaiFengCardListPlist/img_card_back.png");
        this.sprite.setVisible(false);
        this._uiLayer.addChild(this.sprite);

        var imgStr = "gameNnFpPlist/nnui0042.png";
        this.bankerWorld = new ccui.ImageView(imgStr, ccui.Widget.PLIST_TEXTURE);
        this.bankerWorld.setVisible(false);
        this._uiLayer.addChild(this.bankerWorld);

        var btnStr = "gameNnFpPlist/nnui0009.png";
        var btn = new ccui.Button(btnStr, "", "", ccui.Widget.PLIST_TEXTURE);
        btn.setPosition(cc.p(1200, 50));
        btn.setScale(0.7);
        btn.addTouchEventListener(this.onButtonTouchEvent, this);
        this._uiLayer.addChild(btn, 10);

/*        UIMgr.getInstance().openDlg(ID_DlgChatScene);
        UIMgr.getInstance().openDlg(ID_NnFpDlgSystem);*/

        this.onUpdateAllPlayerInfo();

        if (!this._bDealGameScene) {
            // this.onGameScene();
        }

        // // SoundMgr.getInstance().playMusic("nnftb_bg", 0, true);

    },

    onButtonTouchEvent: function (send, type) {
        var game = ClientData.getInstance().getGame();
        // var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        var data = {
            PublicCardData: game.niuniu.GetArr(2),
            CardData: [game.niuniu.GetArr(5), game.niuniu.GetArr(5),
                        game.niuniu.GetArr(5), game.niuniu.GetArr(5),
                        game.niuniu.GetArr(5), game.niuniu.GetArr(5)],
            chairId: 0,
            CallScore: 2,
            Banker: 0,
            AddScoreCount: 3,
            LastCard: [7, 8, 9, 12, 13],
            CardType: 18,
            lGameScore: 10
        };
        if (ccui.Widget.TOUCH_ENDED === type) {
            switch (this.btn.state) {
                case 0:
                    this.againGame();
                    this.openTimer("sendPublicCards");
                    break;
                case 1:
                    NiuniuFPGameMsg.getInstance().onGameMsgSendPublicCard(data);
                    break;
                case 2:
                    NiuniuFPGameMsg.getInstance().onGameMsgSendCard(data);
                    break;
                case 3:
                    NiuniuFPGameMsg.getInstance().onGameMsgCallScore(data);
                    break;
                case 4:
                    NiuniuFPGameMsg.getInstance().onGameMsgResultCallScore(data);
                    break;
                case 5:
                    NiuniuFPGameMsg.getInstance().onGameMsgAddScore(data);
                    break;
                case 6:
                    NiuniuFPGameMsg.getInstance().onGameMsgSendLastCard(data);
                    break;
                case 7:
                    NiuniuFPGameMsg.getInstance().onGameMsgOpenCard(data);
                    break;
                case 8:
                    NiuniuFPGameMsg.getInstance().onGameMsgGameEnd(data);
                    break;
                default:
                    break;
            }
            this.btn.state = (this.btn.state + 1) % 9;
        }
    },

    ////////////////////////////////////实现父类中包含的函数/////////////////////////////////////////////

    //更新所有玩家
    onUpdateAllPlayerInfo: function () {
        if (!this._bInit) {
            // return;
        }

        if (this._endPhase) {
            //return;
        }

        var table = ClientData.getInstance().getTable();
        if (!table) return;

        var game = ClientData.getInstance().getGame();
        if (!game) return;

        for (var pos = 0; pos < CMD_NIUNIU_TB.GAME_PLAYER; pos++) {
            var chairId = this.getChairIdByPlayerPos(pos);
            var bPlay = game.isPlayByChairId(chairId);
            // cc.log("onUpdateAllPlayerInfo" + pos);
            if (this._endPhase && bPlay) {
                continue;
            }

            var player = table.getPlayerByChairID(chairId);

            var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
            if (dlgPlayer) {
                dlgPlayer.updatePlayerInfo(pos, player);
            }
        }

        //准备界面
        if (g_objHero.getStatus() >= US_READY) {
            this.closeTimer("ready");
            UIMgr.getInstance().closeDlg(ID_NnTbDlgCallScore);
            UIMgr.getInstance().closeDlg(ID_NnFpDlgReady);
        }

        if (g_objHero.getStatus() >= US_SIT) {
            var dlgSystem = UIMgr.getInstance().getDlg(ID_NnFpDlgSystem);
            if (dlgSystem) {
                dlgSystem.updateDlg();
            }
        }
    },

    //换桌成功
    onChangeTableSucc: function () {
        if (!this._bInit) {
            return;
        }

        UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);

        var dlgSystem = UIMgr.getInstance().getDlg(ID_NnFpDlgSystem);
        if (dlgSystem) {
            dlgSystem.updateDlg();
        }

        var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (dlgPlayer) {
            dlgPlayer.resetDlg();
        }
    },

    openTimer: function (strId, subTime) {
        if (!this._bInit) {
            return;
        }

        var time = 15;
        var callBack = function () {
        };

        var table = ClientData.getInstance().getTable();
        if (!table) return;

        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var gameStatus = table.getGameStatus();

        switch (strId) {
            case "ready":
                time = 15;
                if (subTime) {
                    time -= subTime;
                }
                callBack = function () {
                    GameUserMsg.getInstance().sendStandUp(true);
                    GameKindMgr.getInstance().backPlazaScene();
                };
                break;
            case "sendPublicCards":
                cc.log("准备发牌");
                time = 300;
                callBack = function () {
                    cc.log("开始发牌");

                };
                break;
            case "robBanker":   //抢庄
                time = 10;
                callBack = function () {
                    //抢庄时间到默认不抢
                    cc.log("抢庄时间到！");
/*                    if (g_gameSocket.status === SOCKET_STATUS._SS_CONNECTED) {
                        // NiuniuFPGameMsg.getInstance().callScore(0);
                        UIMgr.getInstance().closeDlg(ID_DlgNnFpRobBanker);
                    }*/
                };
                break;
            case "addChip":     //加注
                time = 12;
                callBack = function () {
                    //加注时间到默认不加

                    if (g_gameSocket.status === SOCKET_STATUS._SS_CONNECTED) {
                        // NiuniuFPGameMsg.getInstance().addScore(0);
                        UIMgr.getInstance().closeDlg(ID_DlgNnFpAddChip);
                    }
                };
                break;
            case "open":
                if (gameStatus === CMD_NIUNIU_TB.GS_TK_PLAYING) {
                    time = 10;
                    callBack = function () {
                        var game = ClientData.getInstance().getGame();
                        var cardData = game.getResultCardsAndTypeByChairId(g_objHero.getChairID());

                        if (g_gameSocket.status === SOCKET_STATUS._SS_CONNECTED) {
                            /*NiuniuFPGameMsg.getInstance().sendOpenCard(data);
                             UIMgr.getInstance().closeDlg(ID_NnFpDlgOpen);*/
                        }
                    };
                }
                break;
            case "callScore": //叫分
                time = 10;

                callBack = function () {
                    GameUserMsg.getInstance().sendStandUp(true);
                    GameKindMgr.getInstance().backPlazaScene();
                };

                break;
            case "callBanker":
                break;
            case "bet":
                break;
            default:
                break;
        }

        UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);
        UIMgr.getInstance().openDlg(ID_NnFpDlgClock);

        var dlgClock = UIMgr.getInstance().getDlg(ID_NnFpDlgClock);
        if (dlgClock) {
            dlgClock.openTimer(time, callBack);
            dlgClock.setTimerName(strId);
        }
    },

    closeTimer: function (strId) {
        var dlgClock = UIMgr.getInstance().getDlg(ID_NnFpDlgClock);
        if (!dlgClock) {
            return;
        }

        var timerName = dlgClock.getTimerName();
        if (strId === timerName) {
            UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);
        }
    },

    //接收到游戏开始消息
    onGameStart: function () {
        if (!this._bInit) return;

        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
        if (bPlayHero) {
            UIMgr.getInstance().closeDlg(ID_NnFpDlgReady);
            UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);
        }

        // 更新局数
        cc.director.getRunningScene().layer.updateNode();
    },

    //发两张牌
    sendPublicCard: function () {
        this.bankerWorld.setVisible(false);
        var cards = [];
        var game = ClientData.getInstance().getGame();
        // game.setPublicCards([0x25, 0x15]);
        if (game) cards = game.getPublicCards();
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (!dlg) return;
/*        var card = CardGroup.create(0, false);
        card.name = "publicCards";
        card.setAnchorPoint(cc.p(0.5, 0.5));
        var size = cc.winSize;
        card.x = size.width / 2.23;
        card.y = size.height / 2;
        card.setCardSpace(cc.p(360, 0));
        this._uiLayer.addChild(card);
        card.addCardList(cards, true);*/
        cards = game.getPublicCards();
        dlg.showPublicCards(cards);
    },

    //发四张牌
    onSendCard: function (cardIndex) {
        // if (!this._bInit) return;

        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
        if (bPlayHero) {
            UIMgr.getInstance().closeDlg(ID_NnFpDlgReady);
            UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);
        }


        game.setPlayByChairId(g_objHero.getChairID(), true);

        for (var i = 0; i < cardIndex; i++) {
            for (var pos = 0; pos < CMD_NIUNIU_TB.GAME_PLAYER; pos++) {
                var chairId = this.getChairIdByPlayerPos(pos);

                // cc.log("发牌---2");
/*                var bPlay = game.isPlayByChairId(chairId);
                cc.log("@@@@@ chairId=" + chairId + " bPlay=" + bPlay);
                if (!bPlay) continue;*/

                // cc.log("发牌---3");
                var cardsValue = game.getHandCardValues(pos);
                // cc.log("@@@@@ 发牌" + cardsValue);
                var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                var ptEnd = dlgPlayer.getCardPosByIndex(pos, i);
                var scale = 1;
                if (pos !== 0) scale = 64 / 100;

                // cc.log("ptEnd x = " + ptEnd.x + " y = " + ptEnd.y);
                var cardValue = 0;
                if (cardIndex === 4) cardValue = cardsValue[i];
                if (cardIndex === 1) cardValue = cardsValue[4];
                var _self = this;

                SendCardMgr.getInstance().sendCard(
                    ptEnd,  //发牌结束位置
                    scale,	//发牌scale
                    cardValue,  //牌值
                    false, //牌正反面
                    //发牌到结束位置回调
                    function (playerPos, cardIdx, cardIndex) {
                        return function () {
                            var cardsValue = game.getHandCardValues(playerPos);
                            var cardValue = 0;
                            if (cardIndex === 4) cardValue = cardsValue[cardIdx];
                            if (cardIndex === 1) cardValue = cardsValue[4];

                            var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                            if (dlgPlayer) {
                                dlgPlayer.addCard(playerPos, cardValue, false, _self.heroSendEnd.bind(_self));
                            }
                        };
                    }(pos, i, cardIndex)
                );
            }
        }
    },

    //叫庄
    onCallBanker: function () { //显示叫庄按钮
        if (!this._bInit) {
            return;
        }

        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
        if (bPlayHero) UIMgr.getInstance().closeDlg(ID_NnFpDlgReady);

        var bFirst = game.isFirstTimesCallBanker();
        var callBanker = game.getCallBankerChairId();

        var pos = this.getPlayerPosByChairId(callBanker);
        var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (dlgPlayer) {
            dlgPlayer.setBanker(pos);
        }

        cc.log("onCallBanker  ------ 5" + g_objHero.getChairID());

        this.openTimer("callBanker");

        //自己抢庄
        if (callBanker === g_objHero.getChairID()) {
            if (bFirst) {
                // SoundMgr.getInstance().playEffect("nndz_push_bank", 0, false);
            }

            // UIMgr.getInstance().openDlg(ID_NnDzDlgCallBanker);
        }
    },

    //显示抢庄玩家
    onCallScore: function (chairId) {
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (chairId) {
            if (!this._bInit) return;
            var game = ClientData.getInstance().getGame();
            if (!game) return;

            //获取抢庄玩家的位置
            var scoreMultiple = game.getRobBankerScore(chairId);
            var pos = this.getPlayerPosByChairId(chairId);
            if (dlg) dlg.showCallScore(pos, scoreMultiple);
        } else {
            UIMgr.getInstance().closeDlg(ID_DlgNnFpRobBanker);
            for (var i = 0; i < 6; i++) {
                dlg.showCallScore(i, Math.floor(Math.random()*5));
            }
        }
    },

/*    //显示庄家
    onRobBanker: function (chairId) {
        if (!this._bInit) return;
        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var pos = this.getPlayerPosByChairId(chairId);
        var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (dlgPlayer) dlgPlayer.showBankerSignByChairId(pos);
    },*/

    //随机选择庄家黄色边框
    blinkHeadPortrait: function () {
        var arr = this.getBankerPosArr([0,1,2,3,4,5]);
        var faceArr = [];
        var actions = [];
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (!dlg) return;
        for (var i = 0; i < arr.length; i++) {
            faceArr[i] = dlg.getBankerWordPos(arr[i], true);
            var moveTo = cc.moveTo(0, faceArr[i]);
            var delayTime = cc.delayTime(0.1);
            var blink = cc.blink(0.1, 2);
            actions.push(moveTo, delayTime, blink);
        }
        var blinkStr = "gameNnFpPlist/nnui0003c.png";
        var img = new ccui.ImageView(blinkStr, ccui.Widget.PLIST_TEXTURE);

        img.setPosition(faceArr[0]);
        this._uiLayer.addChild(img);
        var _t = this;
        var callFunc = cc.callFunc(function () {
            // img.runAction(cc.sequence(cc.moveBy(1, cc.p(50, 50))));
            cc.log("这里要在停止的时候执行");
            _t.testBankerWordAnimation(Math.floor(Math.random()*6));
        }, _t);
        // actions.push(callFunc);

        var seq = cc.sequence(actions);
        img.runAction(cc.sequence(seq.repeat(3), callFunc));
    },

    getBankerPosArr: function (chairIdArr) {
        var posArr = [];
        chairIdArr.reverse();
        for (var i = 0; i < chairIdArr.length; i++) {
            posArr[i] = chairIdArr[i];
        }
        return posArr;
    },

    //得到广播庄家用户显示庄字动画
    bankerWordAnimation: function () {
        UIMgr.getInstance().openDlg(ID_DlgNnFpAddChip);
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (!dlg) return;
        if (!CMD_NIUNIU_TB.isLocal) {
            if (!this._bInit) return;
            var game = ClientData.getInstance().getGame();
            if (!game) return;
            UIMgr.getInstance().closeDlg(ID_DlgNnFpRobBanker);
            JSON.stringify(game.getPlayerData(), null, 2);
            for (var i = 0; i < 4; i++) {
                var scoreMultiple = game.getRobBankerScore(i);
                if (scoreMultiple === -1) scoreMultiple = 0;
                var callScorePos = this.getPlayerPosByChairId(i);
                dlg.showCallScoreMultiple(callScorePos, scoreMultiple);
            }

            //获得庄家用户位置
            var bankerId = game.getBankerChairId();
            var pos = this.getPlayerPosByChairId(bankerId);
            cc.log("庄家的位置 = " + pos);
            var faceSize = dlgPlayer.getBankerWordPos(pos);
            var sizeDir = cc.director.getWinSize();
            var imgStr = "gameNnFpPlist/nnui0042.png";
            var node = new ccui.ImageView(imgStr, ccui.Widget.PLIST_TEXTURE);
            this._uiLayer.addChild(node);
            node.setPosition(cc.p(sizeDir.width / 2, sizeDir.height / 2));

            var spawn1 = cc.spawn(
                cc.scaleTo(0, 0.2)
                // cc.blink(0.5, 5)
            );

            var spawn2 = cc.spawn(
                cc.scaleTo(0.2, 0.4)
            );

            var spawn3 = cc.spawn(
                cc.scaleTo(0.2, 0.5)
            );

            var delay = cc.delayTime(0.3);

            /*        var moveBy1 = cc.moveBy(0.5, cc.p(0, sizeDir.height / 2));
             var moveBy2 = cc.moveBy(0.5, cc.p(sizeDir.width / 2, 0));
             var moveBy3 = cc.moveBy(0.5, cc.p(0, sizeDir.height));
             var moveBy4 = cc.moveBy(0.5, cc.p(-sizeDir.width, 0));
             var moveBy5 = cc.moveBy(0.5, cc.p(0, sizeDir.height));
             var moveBy6 = cc.moveBy(0.5, cc.p(sizeDir.width / 2, 0));*/

            var moveTo1 = cc.moveTo(0.5, faceSize);

            var callFun = cc.CallFunc(function () {
                //显示等待或者加注按钮
                dlg.showBtnOrAddChip();
            }, this);
            // var seq = cc.sequence(spawn1, spawn2, spawn3, delay, moveBy1, moveBy2, moveBy3, moveBy4, moveBy5, moveBy6);
            var seq = cc.sequence(spawn1, spawn2, spawn3, delay, moveTo1);
            var rep = cc.repeatForever(seq);

            node.runAction(seq);

        } else {
            this.testBankerWordAnimation(Math.floor(Math.random()*4));
            for (var i = 0; i < 6; i++) {
                dlg.showCallScoreMultiple(i, Math.floor(Math.random()*4));
            }
        }

    },

    //得到广播庄家用户显示庄字动画
    testBankerWordAnimation: function (pos) {
        //获得庄家用户位置
        cc.log("庄家的位置 = " + pos);
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (!dlg) return;
        var faceSize = dlg.getBankerWordPos(pos);
        var sizeDir = cc.director.getWinSize();
        this.bankerWorld.setVisible(true);
        this.bankerWorld.setPosition(cc.p(sizeDir.width / 2, sizeDir.height / 2));

        var spawn1 = cc.spawn(
            cc.scaleTo(0, 3.0)
            // cc.blink(0.5, 5)
        );

        var spawn2 = cc.spawn(
            cc.scaleTo(0.3, 0.4)
        );

        var spawn3 = cc.spawn(
            cc.scaleTo(0.3, 0.5)
        );

        var delay = cc.delayTime(0.3);

        /*        var moveBy1 = cc.moveBy(0.5, cc.p(0, sizeDir.height / 2));
         var moveBy2 = cc.moveBy(0.5, cc.p(sizeDir.width / 2, 0));
         var moveBy3 = cc.moveBy(0.5, cc.p(0, sizeDir.height));
         var moveBy4 = cc.moveBy(0.5, cc.p(-sizeDir.width, 0));
         var moveBy5 = cc.moveBy(0.5, cc.p(0, sizeDir.height));
         var moveBy6 = cc.moveBy(0.5, cc.p(sizeDir.width / 2, 0));*/

        var moveTo1 = cc.moveTo(0.3, faceSize);

        var callFun = cc.CallFunc(function () {
            //显示等待或者加注按钮
            if (dlg) dlg.showBtnOrAddChip();
        }, this);
        // var seq = cc.sequence(spawn1, spawn2, spawn3, delay, moveBy1, moveBy2, moveBy3, moveBy4, moveBy5, moveBy6);
        var seq = cc.sequence(spawn1, spawn2, spawn3, delay, moveTo1);
        var rep = cc.repeatForever(seq);

        this.bankerWorld.runAction(seq);
    },

    //玩家加注
    onAddScore: function (chairId, addScore) {
        if (!this._bInit) return;

        var table = ClientData.getInstance().getTable();

        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
        if (bPlayHero) {
            if (chairId === g_objHero.getChairID()) {
                UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);
            }
        }

        cc.log("### chair [" + chairId + "] 加注 " + addScore);
        var pos = this.getPlayerPosByChairId(chairId);

        var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (dlgPlayer) {
            var player = table.getPlayerByChairID(chairId);
            if (player) {
                var money = player.getMoney();
                var plaza = ClientData.getInstance().getPlaza();
                var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
                if (curGameType === GAME_GENRE_PERSONAL) {
                    //房卡
                    money = player.getScore();
                }
                var leaveMoney = money - addScore;
                dlgPlayer.betValue(pos, addScore, leaveMoney);
            }
        }
    },

    //显示加注玩家
    onAddChip: function (chairId) {
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (chairId) {
            if (!this._bInit) return;
            var game = ClientData.getInstance().getGame();
            if (!game) return;

            //获取加注玩家倍数和位置
            var chipMultiple = game.getAddChipScore(chairId);
            var pos = this.getPlayerPosByChairId(chairId);
            if (dlg) dlg.showAddChipMultiple(pos, chipMultiple);
        } else {
            UIMgr.getInstance().closeDlg(ID_DlgNnFpAddChip);
            for (var i = 0; i < 6; i++) {
                dlg.showAddChipMultiple(i, Math.floor(Math.random()*3));
            }
        }
    },

    //最后一张牌发完之后
    heroSendEnd: function () {
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (!dlg) return;

        this.sprite.opacity = 255;
        this.sprite.setPosition(dlg.getLastCardPos());
        this.sprite.setVisible(true);

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,    // TODO【事件吞噬】，阻止事件传递给下一层(层根据事件优先级而定，而非对象(节点)的zIndex值)
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var size = target.getContentSize();
                var rect = cc.rect(0, 0, size.width, size.height);
                if (!(cc.rectContainsPoint(rect, locationInNode))) return false;
                return true;
            },
            onTouchMoved: function (touch, event) {
                cc.log("onTouchMoved");
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;

                if (target.x > 1000 || target.x < 780 || target.y < 15 || target.y > 340) {
                    target.runAction(cc.sequence(cc.fadeTo(0.6, 0)));
                }

            },
            onTouchEnded: function (touch, event) {
                cc.log("onTouchMoved");
                var target = event.getCurrentTarget();
                // target.opacity = 255;
            },
            onTouchCancelled : function(touch, event){
                cc.log("onTouchCancelled");
            }
        });

        cc.eventManager.addListener(listener, this.sprite);



/*        if (!this._bInit) return;

        // UIMgr.getInstance().openDlg(ID_NnFpDlgGetType);
        // UIMgr.getInstance().openDlg(ID_NnFpDlgOpen);
        // this.openTimer("open");

        var table = ClientData.getInstance().getTable();
        if (!table) return;

        var game = ClientData.getInstance().getGame();
        if (!game) return;*/

        /*var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (dlgPlayer) {
            var heroChairId = g_objHero.getChairID();
            var tipCardValue = game.getOxCardByChairId(heroChairId);
            if (tipCardValue) {
                // dlgPlayer.tipCard(0, tipCardValue);
            }
        }

        // cc.log("@@@@@发牌结束"+game.getCellScore());
        for (var i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
            var chairId = this.getChairIdByPlayerPos(i);
            var bPlay = game.isPlayByChairId(chairId);
            if (bPlay) {
                var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                if (dlgPlayer) {
                    var player = table.getPlayerByChairID(chairId);
                    if (!player)
                        continue;

                    var addScore = game.getCellScore();

                    var money = player.getMoney();
                    var plaza = ClientData.getInstance().getPlaza();
                    var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
                    if (curGameType === GAME_GENRE_PERSONAL) {
                        //房卡
                        money = player.getScore();
                    }

                    var leaveMoney = money - addScore;
                    if (leaveMoney < 0) {
                        leaveMoney = 0;
                    }
                    dlgPlayer.betValue(i, addScore, leaveMoney);
                }
            }
        }*/
    },

    //显示玩家牌值
    onShowOpenCard: function (chairId) {
        this.sprite.setVisible(false);
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (!dlg) return;
        var game = ClientData.getInstance().getGame();
        if (!game) return;
        if (chairId) {
            if (!this._bInit) return;

            //获取亮牌玩家牌和位置
            var cardsValue = game.getResultCardsValue(chairId);
            var surplusCards = game.getSurplusCards(chairId);
            var pos = this.getPlayerPosByChairId(chairId);
            dlg.showCardsValue(pos, cardsValue, surplusCards);
            this.onShowOpenCardType(chairId);
        } else {
            for (var i =0; i < 6; i++) {
                if (i === 0) dlg.showCardsValue(i, game.niuniu.GetArr(5), game.niuniu.GetArr(2));
                dlg.showCardsValue(i, game.niuniu.GetArr(5));
                dlg.showCardsType(i, Math.floor(Math.random()*18) + 1);
            }
        }
    },

    //显示玩家牌型
    onShowOpenCardType: function (chairId) {
        if (!this._bInit) return;
        var game = ClientData.getInstance().getGame();
        if (!game) return;
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (!dlg) return;

        //获取亮牌玩家牌和位置
        var cardsType = game.getCardsTypeByChairId(chairId);
        var pos = this.getPlayerPosByChairId(chairId);
        dlg.showCardsType(pos, cardsType);
    },

    onGameEnd: function () {
        if (!CMD_NIUNIU_TB.isLocal) {
            if (!this._bInit) return;

            this._endPhase = true;

            var game = ClientData.getInstance().getGame();
            if (!game) return;

            // 赋值玩家ID
            var table = ClientData.getInstance().getTable();
            if (table) {
                for (var pos = 0; pos < CMD_NIUNIU_TB.GAME_PLAYER; pos++) {
                    var chairId = this.getChairIdByPlayerPos(pos);
                    var player = table.getPlayerByChairID(chairId);
                    if (player) {
                        g_outcome.setPlayerByChairId(chairId, player);
                    }
                }
            }

            cc.log("自己的id" + g_objHero.getUserId());
            var scoreArr = [];
            for (var i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
                var bPlay = game.isPlayByChairId(i);
                if (bPlay) {
                    //得分
                    var score = game.getScore(i);
                    var pos = this.getPlayerPosByChairId(i);

                    scoreArr[i] = score;
                    g_outcome.setPointByChairId(i, score);
                    var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                    if (dlgPlayer) {
                        dlgPlayer.showScoreValue(pos, score);
                    }
                }
            }

            var plaza = ClientData.getInstance().getPlaza();
            var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币

            if (curGameType === GAME_GENRE_PERSONAL) {
                // 房卡模式，不弹结束页
                cc.log("弹准备");
                g_objHero.setStatus(US_SIT);
                var dlg = UIMgr.getInstance().openDlg(ID_NnFpDlgReady);
                dlg.setReadBtbPosition();
                var table = ClientData.getInstance().getTable();
                if (table && table.getPlayers().length > 3) dlg.setInviteFriend(false);
                else dlg.setInviteFriend(true);
            } else {
                var delay = cc.DelayTime.create(3);
                var callFunc = cc.CallFunc.create(function () {
                    // SoundMgr.getInstance().playEffect("game_end", 0, false);
                    //UIMgr.getInstance().openDlg(ID_NnTbDlgResult);

                    var heroChairId = g_objHero.getChairID();
                    var bHeroPlay = game.isPlayByChairId(heroChairId);
                    if (bHeroPlay) {
                        UIMgr.getInstance().openDlg(ID_NnTbDlgResult);
                    } else {
                        this.againGame();
                    }
                }, this);

                var seq = cc.sequence(delay, callFunc);
                this._uiLayer.runAction(seq);
            }

            this.onUpdateAllPlayerInfo();
            UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer).updateResultIcon(true);
        } else {
            var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
            for (var i = 0; i < 6; i++) {
                dlg.showScoreValue(i, Math.floor(Math.random()*100) -50);
            }
        }
    },

    //显示战绩中心
    sendOpenResult: function () {
        UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);
        // UIMgr.getInstance().closeDlg(ID_NnFpDlgGetType);
        UIMgr.getInstance().closeDlg(ID_NnFpDlgOpen);
        UIMgr.getInstance().closeDlg(ID_NnTbDlgReady);
        var delay = cc.delayTime(2);
        var callFunc = cc.callFunc(function () {
            // // SoundMgr.getInstance().playEffect("game_end", 0, false);
            //清理桌子资源
            var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
            if (dlgPlayer) dlgPlayer.resetDlg();
            UIMgr.getInstance().openDlg(ID_DlgResult);
            // UIMgr.getInstance().openDlg(ID_DlgNnFpResult);
        }, this);
        var seq = cc.sequence(delay, callFunc);
        this._uiLayer.runAction(seq);
    },

    againGame: function () {
        if (!this._bInit) return;

        var bForceExitGame = this.checkForceExit();
        if (bForceExitGame) return;

        this._endPhase = false;
        this.onUpdateAllPlayerInfo();

        var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (dlgPlayer) dlgPlayer.resetDlg();

        this.bankerWorld.setVisible(false);

        /*        UIMgr.getInstance().closeDlg(ID_NnFpDlgOpen);
        UIMgr.getInstance().closeDlg(ID_NnTbDlgResult);

        var game = ClientData.getInstance().getGame();
        if (game && game.getPlayMode() === 0x10) {
            return;
        }

        cc.log("准备状态")
        cc.log(g_objHero.getStatus());
        if (g_objHero.getStatus() < US_READY) {
            var dlgCallScore = UIMgr.getInstance().getDlg(ID_NnTbDlgCallScore);
            if (!dlgCallScore) {
                var dlg = UIMgr.getInstance().openDlg(ID_NnFpDlgReady);
                var table = ClientData.getInstance().getTable();
                if (table && table.getPlayers().length > 3) dlg.setInviteFriend(false);
                else dlg.setInviteFriend(true);
                this.openTimer("ready", 5);
            }
        }*/
    },

    onGameScene: function () {

        if (!this._bInit) {
            // return;
        }

        var table = ClientData.getInstance().getTable();
        if (!table) return;

        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var plaza = ClientData.getInstance().getPlaza();
        if (plaza) game.setPlayMode(plaza.getCurGameType());

        var gameStatus = table.getGameStatus();
        cc.log("onGameScenepp" + gameStatus);
        switch (gameStatus) {
            case CMD_NIUNIU_TB.GS_TK_FREE:
                cc.log("@@@@ 叫分 CMD_NIUNIU_TB.GS_TK_FREE");
                // 断线后更新局数
                var scene = cc.director.getRunningScene();
                if (scene && scene.layer) {
                    scene.layer.resetNumberOfGames();
                }
                //设置准备按钮
                UIMgr.getInstance().openDlg(ID_NnFpDlgReady);
                // this.onCallScore();

                //清理桌子
                var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                if (dlgPlayer) dlgPlayer.resetDlg();
                UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);
                // UIMgr.getInstance().closeDlg(ID_NnFpDlgGetType);
                UIMgr.getInstance().closeDlg(ID_NnFpDlgOpen);
                break;
            case CMD_NIUNIU_TB.GS_TK_CALL:
                break;
            case CMD_NIUNIU_TB.GS_TK_SCORE:
                break;
            case CMD_NIUNIU_TB.GS_TK_PLAYING:
                cc.log("@@@@ CMD_NIUNIU_TB.GS_TK_PLAYING");
                if (game.getPlayMode() === 0x10) {

                    var scene = cc.director.getRunningScene();
                    if (scene && scene.layer) {
                        scene.layer.resetNumberOfGames();
                    }

                    var game = ClientData.getInstance().getGame();
                    if (game) {
                        var table = ClientData.getInstance().getTable();

                        var dlgPlayer = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);

                        if (dlgPlayer) {
                            for (var i = 0; i < table.getPlayers().length; i++) {
                                var chairId = this.getChairIdByPlayerPos(i);
                                var bOpen = game.isOpenCard(chairId);
                                var cardsValue = game.getHandCardValues(chairId);
                                var pos = this.getPlayerPosByChairId(chairId);
                                dlgPlayer.resetPlayerDlg(pos);
                                if (g_objHero.getChairID() === chairId && !bOpen) {
                                    var _self = this;
                                    for (var cardIndex = 0; cardIndex < 5; cardIndex++) {
                                        var oneCardValue = cardsValue[cardIndex];
                                        dlgPlayer.addCard(pos, oneCardValue, false, _self.heroSendEnd.bind(_self));
                                    }
                                }
                                if (bOpen) {
                                    var cardType = game.getCardTypeByChairId(chairId);
                                    dlgPlayer.openCard(pos, cardsValue);
                                    dlgPlayer.setNiuType(pos, cardType);
                                } else {
                                    if (pos !== 0) {
                                        for (var cardIndex = 0; cardIndex < 5; cardIndex++) {
                                            var oneCardValue = cardsValue[cardIndex];
                                            dlgPlayer.addCard(pos, oneCardValue, false, null);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }

        this._bDealGameScene = true;
        this.onUpdateAllPlayerInfo();
    }

    /*onSetBanker: function () {
     if (!this._bInit) {
     return;
     }

     var game = ClientData.getInstance().getGame();
     if (!game) {
     return;
     }

     var bPlayHero = game.isPlayByChairId(g_objHero.getChairID());
     if (bPlayHero) {
     UIMgr.getInstance().closeDlg(ID_NnFpDlgReady);
     UIMgr.getInstance().closeDlg(ID_NnFpDlgClock);
     }

     // 更新局数
     cc.director.getRunningScene().layer.updateNode();
     },*/

    //设置底注
    /*onCallScore: function () {
     if (!this._bInit) {
     return;
     }

     var game = ClientData.getInstance().getGame();
     if (!game) {
     return;
     }

     var nMode = game.getPlayMode();
     if (nMode === 0x0001) {
     cc.log("金币场模式");
     UIMgr.getInstance().openDlg(ID_NnTbDlgCallScore);
     UIMgr.getInstance().closeDlg(ID_NnFpDlgReady);
     } else {
     cc.log("房卡模式");
     if (g_objHero.getStatus() !== 3) {
     var dlg = UIMgr.getInstance().openDlg(ID_NnFpDlgReady);
     var table = ClientData.getInstance().getTable();
     if (table && table.getPlayers().length > 3) dlg.setInviteFriend(false);
     else dlg.setInviteFriend(true);
     }
     }

     },*/
});

NiuniuFPUIMgr.getInstance = function () {
    if (!s_sharedNiuniuFPUIMgr) {
        s_sharedNiuniuFPUIMgr = new NiuniuFPUIMgr();
    }
    return s_sharedNiuniuFPUIMgr;
};
