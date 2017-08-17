
var DdzGameModel = cc.Class.extend({
    ctor: function (opts) {
        this.cellScore = 0;


        this.reset();
    },

    startGame: function(playersInfo){
        var i;
        this.reset();
        //设置有玩的玩家
        for(i=0; i<playersInfo.length; i++){
            var info = playersInfo[i];
            cc.log("true info.chairId = " + info.chairId);
            this.setPlayByChairId(info.chairId, true);
            this.setNick(info.chairId, info.nick);
        }
    },

    reset: function(){
        this.isGameEnd  = false;    // 游戏是否结束
        this.lCellScore = 0;        // 基础积分
        this.cbTimeOutCard = 0;     // 出牌时间
        this.cbTimeCallScore = 0;   // 叫分时间
        this.cbTimeStartGame = 0;   // 开始时间
        this.cbTimeHeadOutCard = 0; // 首出时间
        this.gameCount = 0;         // 游戏局数
        this.dwPlayCount = 0;       // 已玩局数
        this.bFirstTimes = 0;       // 首次叫庄
        this.playMode = 0;          // 游戏模式
        this.tableOwnerUserID = 0;  // 桌主userID
        this.playerDatas = [];      //
        //初始化, index为chairId
        for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++){
            this.playerDatas[i] = {
                nick: "",
                bPlay: false,
                addScore: 0,
                cardsValue: [],//手牌
                score: 0,
                lastTurnScore: 0,
                allTurnScore: 0,
                lTurnScore: 0,      // 积分信息
                lCollectScore: 0,   // 积分信息
                cbScoreInfo: 0,     // 叫分信息
                cbHandCardCount: 0, // 扑克数目
                cbTurnCardData: [],   // 出牌数据
                CardDatatype:0,       //出牌类型
                ShowCardSign:[]         //明牌标签
            };
        }
        this.againGame();
    },

    againGame: function () {
        this.wLastSendCardUser = 0; // 上一个操作的玩家
        this.wLastPassCardUser = 0; // 上一个pass的玩家
        this.cbBankerScore = 0;     // 庄家叫分
        this.cbBombCount = 0;       // 炸弹次数
        this.wBankerUser = CMD_DDZ.INVALID;       // 庄家用户
        this.wTurnWiner = 0;        // 胜利玩家
        this.cbTurnCardCount = 0;   // 出牌数目
        this.cbBankerCard = [];     // 游戏底牌
        this.CurrentUser = 0;      // 当前正在出牌/叫分等操作的玩家
        this.bSpringCount = 0;      // 春天
        this.antiSpring = 0;        // 反春天
        this.bRocketCount = 0;      // 炸弹
        this.LiziCard = 0;          //癞子
        this.op = 0;
        this.wLastCallScore = CMD_DDZ.INVALID;    // 上次叫分

        for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
            this.setHandCardValues(i, []);
            this.setHandCardCount(i, 0);
            this.setTurnCardData(i, []);
            this.setCardDatatype(i, 0);
        }
    },

    // 设置游戏是否结束
    setGameEnd: function (bEnd) {
        this.isGameEnd = bEnd;
    },

    getGameEnd: function () {
        return this.isGameEnd;
    },

    //客户端时时已玩局数
    setCurentCount: function (count) {
        this.dwPlayCount = count;
    },

    getCurentCount: function () {
        return this.dwPlayCount;
    },

    //底分
    setCellScore: function(score) {
        this.lCellScore = score;
    },

    getCellScore: function() {
        return this.lCellScore;
    },

    // 出牌时间
    setTimeOutCard: function (nTime) {
        this.cbTimeOutCard = nTime;
    },

    getTimeOutCard: function () {
        return this.cbTimeOutCard;
    },

    // 叫分时间
    setTimeCallScore: function (nTime) {
        this.cbTimeCallScore = nTime;
    },

    getTimeCallScore: function () {
        return this.cbTimeCallScore;
    },

    // 开始时间
    setTimeStartGame: function (nTime) {
        this.cbTimeStartGame = nTime;
    },

    getTimeStartGame: function () {
        return this.cbTimeStartGame;
    },

    // 首出时间
    setTimeHeadOutCard: function (nTime) {
        this.cbTimeHeadOutCard = nTime;
    },

    getTimeHeadOutCard: function () {
        return this.cbTimeHeadOutCard;
    },

    // 局数
    setGameCount: function (nCount) {
        this.gameCount = nCount;
    },

    getGameCount: function () {
        return this.gameCount;
    },

    //设置局数限制
    setDrawCountLimit:function(dwDrawCountLimit){
        this.gameCount = dwDrawCountLimit;
    },
    getDrawCountLimit:function(){
        return this.gameCount;
    },

    // 游戏模式 0x0001:金币场 0x0010:房卡场
    setPlayMode: function (nMode) {
        this.playMode = nMode;
    },

    getPlayMode: function () {
        return this.playMode;
    },

    // 上一个出牌的玩家
    setLastSendCardUser: function (chairID) {
        this.wLastSendCardUser = chairID;
    },

    getLastSendCardUser: function () {
        return this.wLastSendCardUser;
    },

    // 上一个过的玩家
    setLastPassCardUser: function (chairID) {
        this.wLastPassCardUser = chairID;
    },

    getLastPassCardUser: function () {
        return this.wLastPassCardUser;
    },

    //已玩局数
    setPlayCount:function(dwPlayCount){
        cc.log("已玩局数++++++++++++++++++++++");
        this.dwPlayCount = dwPlayCount;
    },
    getPlayCount:function(){
        return this.dwPlayCount;
    },

    //首次叫庄
    setFirstTimesCallBanker: function(bFirst){
        this.bFirstTimes = bFirst;
    },
    isFirstTimesCallBanker: function(){
        return this.bFirstTimes;
    },

    //叫庄chairID
    setCallBankerChairId: function(chairId){
        this.wBankerUser = chairId;
    },
    getCallBankerChairId: function(){
        return this.wBankerUser;
    },

    //庄家
    setBankerChairId: function(chairId){
        this.wBankerUser = chairId;
    },
    getBankerChairId: function(){
        return this.wBankerUser;
    },
    // 庄家叫分
    setBankerScore: function (nScore) {
		this.cbBankerScore = nScore; 
    },

    getBankerScore: function () {
        // 0 < 2
        //if(this.op <= this.cbBankerScore){
        //    this.op = this.cbBankerScore
        //}
        if(this.op <= this.cbBankerScore ){
            this.op = this.cbBankerScore
        }
        cc.log(this.op + "问问多少分")
        return this.op;
    },

    // 炸弹次数
    setBombCount: function (nCount) {
        this.cbBombCount = nCount;
    },

    getBombCount: function () {
        return this.cbBombCount;
    },

    // 胜利玩家
    setTurnWiner: function (nUserID) {
        this.wTurnWiner = nUserID;
    },

    getTurnWiner: function () {
        return this.wTurnWiner;
    },

    // 出牌数目
    setTurnCardCount: function (nCount) {
        this.cbTurnCardCount = nCount;
    },

    getTurnCardCount: function () {
        return this.cbTurnCardCount;
    },

    // 游戏底牌
    setBankerCard: function (bankerCard) {
        this.cbBankerCard = bankerCard;
    },

    getBankerCard: function () {
        return this.cbBankerCard;
    },

    // 当前出牌的玩家
    setCurrentUser: function (userId) {
        this.CurrentUser = userId;
    },

    getCurrentUser: function () {
        return this.CurrentUser;
    },

    //玩家昵称
    setNick: function(chairId, nick){
        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            playerData.nick = nick;
        }
    },
    getNick: function(chairId){
        var nick = "";

        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            nick = playerData.nick;
        }

        return nick;
    },

    getCardsByChairId: function(chairId){
        var playerData = this.getPlayerDataByChairId(chairId);
        if(!playerData){
            return null;
        }
        return playerData.cardsValue;
    },
    //癞子
    setLiziCard:function(lazi){
        this.LiziCard = lazi;
    },
    getLiziCard:function(){
        return this.LiziCard;
    },
    //明牌
    setonTopen:function(type){
        cc.log(type+"明牌的");
        this.ShowCardSign = type;
    },
    getonTopen:function(){
        var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
        if (dlg) {
            dlg.ddzMingcar();
        }
    },
    //手牌
    setAllPlayerCards: function(cardsValue){
        cc.log("设置所有人的当前手牌"+cardsValue);
        for(var i=0; i<cardsValue.length; i++){
            this.setHandCardValues(i, cardsValue[i]);
        }
    },

    setHandCardValues: function(chairId, cardsValue){
        var playerData = this.getPlayerDataByChairId(chairId);
        if(!playerData){
            return;
        }

        cc.log(chairId+"设置当前手牌"+cardsValue);
        playerData.cardsValue = cardsValue;
    },

    getHandCardValues: function(chairId){
        var cardsValue = null;

        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            cardsValue = playerData.cardsValue;
        }

        cc.log(chairId+"获取当前手牌"+cardsValue);
        return cardsValue;
    },

    // 出牌
    setTurnCardData: function (chairId, cardsValue) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if(!playerData){
            return;
        }
        playerData.cbTurnCardData = cardsValue;
    },

    getTurnCardData: function (chairId) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if(!playerData){
            return;
        }
        return playerData.cbTurnCardData;
    },
    //出牌类型
    setCardDatatype: function (chairId, cardsValue) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if(!playerData){
            return;
        }
        playerData.CardDatatype = cardsValue;
    },

    getCardDatatype: function (chairId) {
        var playerData = this.getPlayerDataByChairId(chairId);
        if(!playerData){
            return;
        }
        return playerData.CardDatatype;
    },

    //玩家得分
    setScore: function(chairId, score){
        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            playerData.score = score;
        }
    },
    getScore: function(chairId){
        var score = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            score = playerData.score;
        }

        return score;
    },
    //setRecordInfo
    //总得分
    setTurnScore: function(chairId, lTurnScore){
        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            playerData.lTurnScore = lTurnScore;
        }
    },

    getTurnScore: function(chairId){
        var lTurnScore = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            lTurnScore = playerData.lTurnScore;
        }

        return lTurnScore;
    },

    //总得分
    setCollectScore: function(chairId, lCollectScore){
        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            playerData.lCollectScore = lCollectScore;
        }
    },
    getCollectScore: function(chairId){
        var lCollectScore = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            lCollectScore = playerData.lCollectScore;
        }

        return lCollectScore;
    },

    // 叫分信息
    setScoreInfo: function (chairId, cbScoreInfo) {
        var  playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.cbScoreInfo = cbScoreInfo;
        }
    },

    getScoreInfo: function (chairId) {
        var cbScoreInfo = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            cbScoreInfo = playerData.cbScoreInfo;
        }

        return cbScoreInfo;
    },

    // 扑克数目
    setHandCardCount: function (chairId, cbHandCardCount) {
        var  playerData = this.getPlayerDataByChairId(chairId);
        if (playerData) {
            playerData.cbHandCardCount = cbHandCardCount;
        }
    },

    getHandCardCount: function (chairId) {
        var cbHandCardCount = 0;

        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            cbHandCardCount = playerData.cbHandCardCount;
        }

        return cbHandCardCount;
    },

    //游戏结束
    gameEnd: function(endInfo){
        for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++){
            var score = endInfo.lGameScore[i];
            this.setScore(i, score);
        }
    },

    //玩家游戏数据
    getPlayerData: function(){
        return this.playerDatas;
    },

    getPlayerDataByChairId: function(chairId){
        if(!this.playerDatas){
            return null;
        }

        return this.playerDatas[chairId];
    },

    setPlayByChairId: function(chairId, bPlay){
        var playerData = this.getPlayerDataByChairId(chairId);
        if(playerData){
            playerData.bPlay = bPlay;
        }
    },

    isPlayByChairId: function(chairId){
        var isPlay = false;
        var playerData = this.getPlayerDataByChairId(chairId);

        if(playerData){
            isPlay = playerData.bPlay;
        }

        return isPlay;
    },

    // 桌主UserID
    setTableOwnerUserID:function(tableOwnerUserID){
        this.tableOwnerUserID = tableOwnerUserID;
    },

    getTableOwnerUserID:function(){
        return this.tableOwnerUserID;
    },

    // 春天个数
    setSpringCount: function (nCount) {
        this.bSpringCount = nCount;
    },

    getSpringCount: function () {
        return this.bSpringCount;
    },

    // 反春天个数
    setAntiSpring: function (nCount) {
        this.antiSpring = nCount;
    },

    getAntiSpring: function () {
        return this.antiSpring;
    },

    // 火箭
    setRocketCount: function (nCount) {
        cc.log(nCount + "火箭倍数")
        this.bRocketCount = nCount;
    },

    getRocketCount: function () {
        return this.bRocketCount;
    },

    // 牌排序
    sortCardsValueWithChairId: function (chairId) {
        var cardsValue = this.getHandCardValues(chairId);
        if (!cardsValue) return;
        cc.log("外层排序前"+cardsValue);
        DdzModel.prototype.Laizi = this.LiziCard;
        DdzModel.prototype.sortCardWithLaizi(cardsValue);
        cc.log("外层排序后"+this.getHandCardValues(chairId));

    },
    
    // 去除某个玩家的牌中指定的数据
    removeCardFromPlayerCardsByValue: function (chairId, vals) {
        var cardsValue = this.getHandCardValues(chairId);
        cc.log("去掉某个玩家的牌之前的数据"+cardsValue);
        if(cardsValue == null) return;
        for (var i = 0; i < vals.length; i++) {
            DdzModel.prototype.removeByValue(cardsValue, vals[i]);
        }
        cc.log("去掉某个玩家的牌之后的数据"+cardsValue);
    },

    // 上次叫分
    setLastCallScore: function (nScore) {
        this.wLastCallScore = nScore;
        if(this.op <= this.wLastCallScore ){
            this.op = this.wLastCallScore
        }
    },

    getLastCallScore: function () {
        return this.wLastCallScore;
    },

    // 游戏房间的特殊信息
    setGameRoomOhterInfo:function (rootOtherInfo) {
        this.rootOtherInfo = rootOtherInfo;
    },
    getGameRoomOhterInfo:function () {
        return this.rootOtherInfo;
    },
    // 房间支付信息
    setGameRoomPayType:function (payType) {
        this.payType = payType;
    },
    getGameRoomPayType:function () {
        return this.payType;
    },
});

