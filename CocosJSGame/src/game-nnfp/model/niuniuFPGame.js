var NiuniuFPGame = cc.Class.extend({

    ctor: function () {
        this.niuniu = new NiuNiuFP();
        this.cellScore = 0;
        this.playMode = 0;
        this.gameCount = 0;
        //断线重连需要
        this.drawGameCount = 0;   //局数限制
        this.playCount = 0;  	//局数
        this.curentCount = 0;
        this.cancelRoomSign = false;
        this.reset();
    },

    startGame: function (playersInfo) {
        this.reset();
        //设置有玩的玩家
        for (var i = 0; i < playersInfo.length; i++) {
            var info = playersInfo[i];
            cc.log("true info.chairId = " + info.chairId);
            this.setPlayByChairId(info.chairId, true);
            this.setNick(info.chairId, info.nick);
        }
    },

    reset: function () {
        this.bFirstTimes = false;//首次叫庄
        this.callBanker = INVALID_CHAIR;
        this.banker = INVALID_CHAIR;
        this.turnMaxScore = 0;

        //this.cellScore = 0; 			//底分
        this.ctrlFlag = INVALID_BYTE;   //叫分标志
        this.androidMinCellScore = 0;		//机器人可设置的最小底注
        this.androidMaxCellScore = 0;		//机器人可设置的最大底注
        this.maxScoreTimes = 0;			//最大倍数
        this.tableOwnerUserID = 0;			//桌主userID

        this.publicCards =  [];//公共的两张牌
        this.playerDatas = [];
        //初始化, index为chairId
        for (var i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
            this.playerDatas[i] = {
                nick: "",
                bPlay: false,
                addScore: 0,
                cardType: 0,
                cardsValue: [],//手牌
                resultCards: [],//最终五张牌
                surplusCards: [],//多出的两张牌
                sevenCards: [],
                openCard: false,
                score: 0,
                tax: 0,
                lastTurnScore: 0,
                allTurnScore: 0,
                lTurnScore: 0,
                lCollectScore: 0,
                bankerScore: 0,
                chipScore: 0
            };
        }

        this.dealer = -1;//当前庄家
        this.dealerCandidate = -1;//庄家候选人
        this.curPlayerChairId = -1;

        this.timeSpend = 0;
    },

    // 游戏模式 0x0001:金币场 0x0010:房卡场
    setPlayMode: function (nMode) {
        this.playMode = nMode;
    },

    getPlayMode: function () {
        return this.playMode;
    },

    // 总局数
    setGameCount: function (nCount) {
        this.gameCount = nCount;
    },

    getGameCount: function () {
        return this.gameCount;
    },

    //断线重连需要的字段
    //局数限制
    setDrawCountLimit: function (nCount) {
        this.drawGameCount = nCount;
    },
    getDrawCountLimit: function () {
        return this.drawGameCount;
    },

    //桌主UserID
    setTableOwnerUserID: function (id) {
        this.tableOwnerUserId = id;
    },
    getTableOwnerUserID: function () {
        return this.tableOwnerUserId;
    },
    //断线重连后的已玩局数
    setPlayCount: function (playCount) {
        this.playCount = playCount;
    },
    getPlayCount: function () {
        return this.playCount;
    },

    //客户端时时已玩局数
    setCurentCount: function (count) {
        this.curentCount = count;
    },
    getCurentCount: function () {
        return this.curentCount;
    },

    //底分
    setCellScore: function (score) {
        this.cellScore = score;
    },

    getCellScore: function () {
        return this.cellScore;
    },

    //叫分标志  房主标志
    setCtrlFlag: function (flag) {
        this.ctrlFlag = flag;
    },

    getCtrlFlag: function () {
        return this.ctrlFlag;
    },

    //机器人可设置的最小底注
    setAndroidMinCellScore: function (score) {
        this.androidMinCellScore = score;
    },

    //机器人可设置的最小底注
    getAndroidMinCellScore: function () {
        return this.androidMinCellScore;
    },

    //机器人可设置的最大底注
    setAndroidMaxCellScore: function (score) {
        this.androidMaxCellScore = score;
    },

    setMaxScoreTimes: function (maxScoreTimes) {
        this.maxScoreTimes = maxScoreTimes;
    },

    getMaxScoreTimes: function () {
        return this.maxScoreTimes;
    },

    getAndroidMaxCellScore: function () {
        return this.androidMaxCellScore;
    },


    //首次叫庄
    setFirstTimesCallBanker: function (bFirst) {
        this.bFirstTimes = bFirst;
    },
    isFirstTimesCallBanker: function () {
        return this.bFirstTimes;
    },

    //叫庄chairID
    setCallBankerChairId: function (chairId) {
        this.callBanker = chairId;
    },
    getCallBankerChairId: function () {
        return this.callBanker;
    },

    //庄家
    setBankerChairId: function (chairId) {
        this.banker = chairId;
    },
    getBankerChairId: function () {
        return this.banker;
    },

    //当轮最大下注
    setTurnMaxScore: function (turnMaxScore) {
        this.turnMaxScore = turnMaxScore;
    },
    getTurnMaxScore: function () {
        return this.turnMaxScore;
    },

    //玩家昵称
    setNick: function (chairId, nick) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.nick = nick;
        }
    },
    getNick: function (chairId) {
        var nick = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            nick = playerData.nick;
        }

        return nick;
    },

    //玩家加注
    setAddScore: function (chairId, addScore) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.addScore = addScore;
        }
    },
    getAddScore: function (chairId) {
        var addScore = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            addScore = playerData.addScore;
        }

        return addScore;
    },

    //设置抢庄倍数
    setRobBankerScore: function (chairId, bankerScore) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) playerData.bankerScore = bankerScore;
    },
    getRobBankerScore: function (chairId) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) return playerData.bankerScore;
    },

    //设置加注倍数
    setAddChipScore: function (chairId, chipScore) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) playerData.chipScore = chipScore;
    },
    getAddChipScore: function (chairId) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) return playerData.chipScore;
    },

    //公共的两张牌
    setPublicCards: function (publicCards) {
        if (publicCards) this.publicCards = publicCards;
    },
    getPublicCards: function () {
        return this.publicCards;
    },

    //手牌
    setAllPlayerCards: function (cardsValue) {
        for (var i = 0; i < cardsValue.length; i++) {
            this.setHandCardValues(i, cardsValue[i]);
            if (cardsValue[i][4] !== 0) this.setAllPlayerSevenCards(i, cardsValue[i]);
        }
    },
    setHandCardValues: function (chairId, cardsValue) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (!playerData) return;

        playerData.cardsValue = cardsValue;
    },
    getHandCardValues: function (chairId) {
        var cardsValue = null;

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            cardsValue = playerData.cardsValue;
        }

        return cardsValue;
    },

    //设置玩家七张牌 两张公共牌 ＋ 手牌
    setAllPlayerSevenCards: function (chairId, cardsValue) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (!playerData) return;

        cardsValue.push.apply(cardsValue, this.getPublicCards());
        var sevenCards = cardsValue;
        cc.log("组合的七张牌");
        cc.log(sevenCards);
        playerData.sevenCards = sevenCards;
    },

    getSevenCardsValue: function (chairId) {
        var sevenCards = null;

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            sevenCards = playerData.sevenCards;
        }

        return sevenCards;
    },

    setCancelRoomSign: function (isCancel) {
        this.cancelRoomSign = isCancel;
    },
    getCancelRoomSign: function () {
        return this.cancelRoomSign;
    },

    setResultCardsValue: function (chairId, cardsValue) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) playerData.resultCards = cardsValue;
    },
    getResultCardsValue: function (chairId) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) return playerData.resultCards;
    },
    setSurplusCards: function (chairId) {
        var playerData = this.getPlayerDataByChairId(chairId);
        var arr1 = this.getSevenCardsValue(chairId);
        var arr2 = this.getResultCardsValue(chairId);
        var surplusCards = this.niuniu.GetPublicCards(arr1, arr2);
        cc.log("设置多出的两张牌");
        cc.log(surplusCards);
        if (playerData) playerData.surplusCards = surplusCards;
    },

    getSurplusCards: function (chairId) {
        var playerData = this.getPlayerDataByChairId(chairId);
        cc.log("获取多出的两张牌");
        cc.log(playerData.surplusCards);
        if (playerData) return playerData.surplusCards;
    },

    //开牌
    openCard: function (chairId, cardType, cardData) {
        this.setResultCardsValue(chairId, cardData);
        this.setCardsTypeByChairId(chairId, cardType);
        this.setSurplusCards(chairId, cardData);

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.openCard = true;

            if (cardType > 0) this._noType = false;
            else this._noType = true;
            // this.setHandCardValues(chairId, cardData);
        }
    },

    changeOpenCard: function (chairId, isOpen) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) playerData.openCard = isOpen;
    },

    isNoType: function () {
        return this._noType;
    },

    isOpenCard: function (chairId) {
        var openCard = false;

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            openCard = playerData.openCard;
        }

        return openCard;
    },

    //玩家得分
    setScore: function (chairId, score) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.score = score;
        }
    },
    getScore: function (chairId) {
        var score = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            score = playerData.score;
        }

        return score;
    },

    //服务费
    setTax: function (chairId, tax) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.tax = tax;
        }
    },
    getTax: function (chairId) {
        var tax = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            tax = playerData.tax;
        }

        return tax;
    },

    //总得分
    setTurnScore: function (chairId, lTurnScore) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.lTurnScore = lTurnScore;
        }
    },
    getTurnScore: function (chairId) {
        var lTurnScore = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            lTurnScore = playerData.lTurnScore;
        }

        return lTurnScore;
    },

    //总得分
    setCollectScore: function (chairId, lCollectScore) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.lCollectScore = lCollectScore;
        }
    },
    getCollectScore: function (chairId) {
        var lCollectScore = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            lCollectScore = playerData.lCollectScore;
        }

        return lCollectScore;
    },

    //游戏结束
    gameEnd: function (endInfo) {
        for (var i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
            var score = endInfo.GameScore[i];
            this.setScore(i, score);

            /*var tax = endInfo.lGameTax[i];
             this.setTax(i, tax);*/
        }
    },

    //玩家游戏数据
    getPlayerData: function () {
        return this.playerDatas;
    },

    getPlayerDataByChairId: function (chairId) {
        if (!this.playerDatas) {
            return null;
        }

        return this.playerDatas[chairId];
    },

    setPlayByChairId: function (chairId, bPlay) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.bPlay = bPlay;
        }
    },
    isPlayByChairId: function (chairId) {
        var isPlay = false;
        var playerData = this.getPlayerDataByChairId(chairId);

        if (playerData) {
            isPlay = playerData.bPlay;
        }

        return isPlay;
    },

    setCardsTypeByChairId: function (chairId, type) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) playerData.cardType = type;
    },
    getCardsTypeByChairId: function (chairId) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) return playerData.cardType;
        /* var cardsData = this.getHandCardValues(chairId);
         if (cardsData && cardsData.length === 5) {
         return this.niuniu.GetCardType(cardsData);
         }

         return NiuNiuFP.CardType.OX_VALUE0;*/
    },


    getResultCardsAndTypeByChairId: function (chairId) {
        var sevenCards = this.getSevenCardsValue(chairId);
        if (sevenCards && sevenCards.length === 7) {
            return this.niuniu.GetResultCardType(sevenCards);
        }
    },

    getOxCardByChairId: function (chairId) {
        var cardsValue = null;
        var cardsData = this.getHandCardValues(chairId);


        if (cardsData && cardsData.length === 5) {
            cardsValue = this.niuniu.GetOxCard(cardsData);
        }

        return cardsValue;
    },

    getCardTypeInfo: function (chairId) {
        var info = {
            value0: 0,
            value1: 0,
            value2: 0,
            valueNum: 0
        };

        var valueNum = this.getCardTypeByChairId(chairId);
        if (valueNum > 10) {
            valueNum = 10;
        }
        info.valueNum = valueNum;

        var value = 0;
        var cardsValue = this.getOxCardByChairId(chairId);

        if (info.valueNum != NiuNiuFP.CardType.OX_VALUE0) {
            value = 10;
        } else {
            value = this.niuniu.GetCardLogicValue(cardsValue[0]);
            value += this.niuniu.GetCardLogicValue(cardsValue[1]);
            value += this.niuniu.GetCardLogicValue(cardsValue[2]);
            value = value % 10;
            if (value == 0) {
                value = 10;
            }
        }

        info.value0 = value;	//前三
        if (cardsValue[3] == 0x4E || cardsValue[3] == 0x4F) {
            info.value2 = this.niuniu.GetCardLogicValue(cardsValue[4]);
            info.value1 = 10 - info.value2;
            if (info.value1 == 0) {
                info.value1 = 10;
            }
        } else if (cardsValue[4] == 0x4E || cardsValue[4] == 0x4F) {
            info.value1 = this.niuniu.GetCardLogicValue(cardsValue[3]);
            info.value2 = 10 - info.value1;
            if (info.value2 == 0) {
                info.value2 = 10;
            }
        } else {
            info.value1 = this.niuniu.GetCardLogicValue(cardsValue[3]);
            info.value2 = this.niuniu.GetCardLogicValue(cardsValue[4]);
        }
        return info;
    }
});