
var SssGameModel = cc.Class.extend({
	ctor: function (opts) {
		this.cellScore = 0;
		this.playMode = 0;
		this.gameCount = 0;
		//this.cbPlayerCount = 0;   //玩家人数
		this.gameoverFlag = false;
		this.gameComping = false;
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
		this.bFirstTimes = false;//首次叫庄
		this.callBanker = INVALID_CHAIR;
		this.banker = INVALID_CHAIR;
		this.turnMaxScore = 0;

		//this.cellScore = 0; 			//底分
		this.ctrlFlag = INVALID_BYTE;   //叫分标志
		this.androidMinCellScore;		//机器人可设置的最小底注
		this.androidMaxCellScore;		//机器人可设置的最大底注
		this.maxScoreTimes = 0;			//最大倍数
		this.PayType = 0;				//支付类型
		this.gameFlag = false;
		this.PublicCards = [];			//三张公共牌
		this.Laizi = [];				//癞子牌
		this.playerDatas = [];
		//初始化, index为chairId
		for(i=0; i<CMD_SSS.GAME_PLAYER; i++){
			this.playerDatas[i] = {
					nick: "",
					bPlay: false, //是否断线重播发牌动画不重发
					bOverCard:false,//组牌完成状态
					addScore: 0,
					nSpecial:false,
					nSpecialScore:0,
                	card: [],//手牌
					cardone: [],//手牌
					cardtwo: [],//
					cardthree: [],//
					cardResult: [],
					openCard: false,
					score: 0,
					tax: 0,
					lastTurnScore: 0,
					allTurnScore: 0,
					lTurnScore: 0,
					lCollectScore: 0,
					nPlayer:null,
			};
		}

		this.dealer = -1;//当前庄家
		this.dealerCandidate = -1;//庄家候选人
		this.curPlayerChairId = -1;

		this.timeSpend = 0;
	},

    // 游戏房间的特殊信息
    setGameRoomOhterInfo:function (rootOtherInfo) {
		cc.log("游戏房间的特殊信息"+JSON.stringify(rootOtherInfo,null,2));
        this.rootOtherInfo = rootOtherInfo;
    },
    getGameRoomOhterInfo:function () {
        return this.rootOtherInfo;
    },
	// 游戏模式 0x0001:金币场 0x0010:房卡场
	setPlayMode: function (nMode) {
		this.playMode = nMode;
	},
    //游戏支付类型（AA - 房主）
    setGameRoomPayType:function (PayType) {
        this.PayType = PayType;
    },
    getGameRoomPayType:function () {
		return this.PayType;
    },
	getPlayMode: function () {
		return this.playMode;
	},
    // //当前玩家数
    // setPlayerCount:function(cbPlayerCount){
    //     this._playerCount = cbPlayerCount;
    // },
    // getPlayerCount:function(){
    //     return this._playerCount;
    // },
	//客户端时时已玩局数
	setCurentCount: function (count) {
		this.curentCount = count;
	},
	getCurentCount: function () {
		return this.curentCount;
	},
    setPlayCount: function (count) {
    	this.curentCount = count;
	},
	getPlayCount: function () {
   	 	return this.curentCount;
	},
	//底分
	setCellScore: function(score) {
		this.cellScore = score;
	},

	getCellScore: function() {
		return this.cellScore;
	},

	//叫分标志
	setCtrlFlag: function(flag) {
		this.ctrlFlag = flag;
	},

	getCtrlFlag: function() {
		return this.ctrlFlag;
	},

	//机器人可设置的最小底注
	setAndroidMinCellScore: function(score) {
		this.androidMinCellScore = score;
	},

	//机器人可设置的最小底注
	getAndroidMinCellScore: function(score) {
		return this.androidMinCellScore;
	},

	//机器人可设置的最大底注
	setAndroidMaxCellScore: function(score) {
		this.androidMaxCellScore = score;
	},

	setMaxScoreTimes: function(maxScoreTimes) {
		this.maxScoreTimes = maxScoreTimes;
	},

	getMaxScoreTimes: function() {
		return this.maxScoreTimes;
	},

	getAndroidMaxCellScore: function(score) {
		return this.androidMaxCellScore;
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
		this.callBanker = chairId;
	},
	getCallBankerChairId: function(){
		return this.callBanker;
	},

	//庄家
	setBankerChairId: function(chairId){
		this.banker = chairId;
	},
	getBankerChairId: function(){
		return this.banker;
	},

	//当轮最大下注
	setTurnMaxScore: function(turnMaxScore){
		this.turnMaxScore = turnMaxScore;
	},
	getTurnMaxScore: function(){
		return this.turnMaxScore;
	},

	//玩家昵称
	setNick: function(chairId, nick){
		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData){
			playerData.nick = nick;
		}
	},
	getNick: function(chairId){
		var nick = 0;

		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData){
			nick = playerData.nick;
		}

		return nick;
	},

	//玩家加注
	setAddScore: function(chairId, addScore){
		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData){
			playerData.addScore = addScore;
		}
	},
	getAddScore: function(chairId){
		var addScore = 0;

		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData){
			addScore = playerData.addScore;
		}

		return addScore;
	},

	getCardsByChairId: function(chairId){
		var playerData = this.getPlayerDataByChairId(chairId);
		if(!playerData){
			return null;
		}
		return playerData.cards;
	},

	//手牌
	setAllPlayerCards: function(cardsValue){
		for(var i=0; i<cardsValue.length; i++){
			this.setHandCardValues(i, cardsValue[i]);
		}
	},

	//设定玩家牌型
	setPlayersCards:function(playersCards){

		for(var j=0;j<CMD_DDZ.MAX_COUNT;j++)
			this.playerCards[0][j] = playersCards[j];
		cc.log("设定玩家牌型this.playerCards = " + JSON.stringify(this.playerCards));
		//--------------//
	},

	//设定玩家牌型
	setPlayersCards:function(playersCards){

		for(var j=0;j<CMD_DZQS.MAX_COUNT;j++)
			this.playerCards[0][j] = playersCards[j];
		cc.log("设定玩家牌型this.playerCards = " + JSON.stringify(this.playerCards));
		//--------------//
	},

	setHandCardValues: function(chairId, cardsValue){
		var playerData = this.getPlayerDataByChairId(chairId);
		if(!playerData){
			return;
		}

		playerData.cardsValue = cardsValue;
	},
	getHandCardValues: function(chairId){
		var cardsValue = null;

		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData){
			cardsValue = playerData.cardsValue;
		}

		return cardsValue;
	},

	//开牌
	openCard: function(chairId, cbCardData){
		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData){
			playerData.openCard = true;

			if (cbCardData[0] != 0) {
				this._noType = false;
				var cardsValue = this.ddzmodel.GetOxCard(playerData.cardsValue);
				if(cardsValue){
					this.setHandCardValues(chairId, cardsValue);
				}
			} else {
				cc.log("@@@@@ cbCardData[0]=0");
				this._noType = true;
			};

		}
	},

	isNoType: function() {
		return this._noType;
	},

	isOpenCard: function(chairId){
		var openCard = false;

		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData){
			openCard = playerData.openCard;
		}

		return openCard;
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

	//服务费
	setTax: function(chairId, tax){
		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData){
			playerData.tax = tax;
		}
	},
	getTax: function(chairId){
		var tax = 0;

		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData){
			tax = playerData.tax;
		}

		return tax;
	},

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

	//游戏结束
	gameEnd: function(endInfo){
		for(i=0; i<CMD_DDZ.GAME_PLAYER; i++){
			var score = endInfo.lGameScore[i];
			this.setScore(i, score);

			var tax = endInfo.lGameTax[i];
			this.setTax(i, tax);
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
    // //P - C
    // getChairIdByPlayerPos: function(playerPos){
    //     var chairID = (g_objHero.getChairID() + playerPos) % this.cbPlayerCount;
    //     return chairID;
    // },
	setPlayByChairId: function(chairId, bPlay){
		var playerData = this.getPlayerDataByChairId(chairId);
		if(playerData != null){
			playerData.bPlay = bPlay;
		}
	},
	isPlayByChairId: function(chairId){
		var isPlay = false;
		var playerData = this.getPlayerDataByChairId(chairId);
        cc.log("playerData"+playerData+"chairId"+chairId);
		if(playerData){
			isPlay = playerData.bOverCard;
		}

		return isPlay;
	},

	///////////////////////////////////////////////
	getCardTypeByChairId: function(chairId){
		var cardsData = this.getHandCardValues(chairId);
		if(cardsData && cardsData.length == 5){
			return this.ddzmodel.GetCardType(cardsData);
		}

		return DdzModel.CardType.OX_VALUE0;
	},

	getOxCardByChairId: function(chairId){
		var cardsValue = null;
		var cardsData = this.getHandCardValues(chairId);


		if(cardsData && cardsData.length == 5){
			cardsValue = this.ddzmodel.GetOxCard(cardsData);
		}

		return cardsValue;
	},
	//设置局数限制
	setDrawCountLimit:function(dwDrawCountLimit){
		this.gameCount = dwDrawCountLimit;
	},
	getDrawCountLimit:function(){
		return this.gameCount;
	},
	setTableOwnerUserID:function(tableOwnerUserID){
		this.tableOwnerUserID = tableOwnerUserID;
	},

	getTableOwnerUserID:function(){
		return this.tableOwnerUserID;
	},

	getCardTypeInfo: function(chairId){
		var info = {
				value0: 0,
				value1: 0,
				value2: 0,
				valueNum: 0
		};

		var valueNum = this.getCardTypeByChairId(chairId);
		if(valueNum > 10){
			valueNum = 10;
		}
		info.valueNum = valueNum;

		var value = 0;
		var cardsValue = this.getOxCardByChairId(chairId);

		if (info.valueNum != DdzModel.CardType.OX_VALUE0) {
			value = 10;
		} else {
			value = this.ddzmodel.GetCardLogicValue(cardsValue[0]);
			value += this.ddzmodel.GetCardLogicValue(cardsValue[1]);
			value += this.ddzmodel.GetCardLogicValue(cardsValue[2]);
			value = value % 10;
			if(value == 0){
				value = 10;
			}
		};

		info.value0 = value;	//前三
		if (cardsValue[3] == 0x4E || cardsValue[3] == 0x4F) {
			info.value2 = this.ddzmodel.GetCardLogicValue(cardsValue[4]);
			info.value1 = 10 - info.value2;
			if (info.value1 == 0) {
				info.value1 = 10;
			};
		} else if (cardsValue[4] == 0x4E || cardsValue[4] == 0x4F) {
			info.value1 = this.ddzmodel.GetCardLogicValue(cardsValue[3]);
			info.value2 = 10 - info.value1;
			if (info.value2 == 0) {
				info.value2 = 10;
			};
		} else {
			info.value1 = this.ddzmodel.GetCardLogicValue(cardsValue[3]);
			info.value2 = this.ddzmodel.GetCardLogicValue(cardsValue[4]);
		};


		return info;
	},
});

//var nSssGameModel = new SssGameModel();