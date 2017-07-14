/*
 * 红中麻将HzmjGame
 * Author: 	xjn 
 * Date:	2017.4.8
 * 
 * 功能：
 * */

var HzmjGame = cc.Class.extend({

	players:null,
	hisData:null,
	isListening:null,              //用户听牌状态
	cbHeapCardInfo:null,           //用户堆立信息
	playerCards:null,              //存用户牌
	gameStatus:0,                  //游戏状态             
	makesureUser:INVALID_CHAIR,    // 确认用户
	currentUser:INVALID_CHAIR,     // 设定当前用户
	meChairId:INVALID_CHAIR,
	banker:INVALID_CHAIR,          // 庄家用户
	tableOwnerUserID:0,	//桌主userID

	meBankNums:0,                  // 连庄次数
	cellMode:0,                    // [底注模式,0=未定义,1=显示设定底注窗;2=显示确认底注窗;3=已设定底注]
	cellLevel:null,                //底注等级列表
	bShowChallengeLogo:true,       //是否显示挑战Logo
	bShowSiceMove:false,           //是否显示骰子动画
	//cellScore:0,                   // 当前选择的底注
	cbLeftCardCount:0,             // 剩余数目


	wHeapHead:0,                   // 堆立头部
	wHeapTail:0,                   // 堆立尾部
	bShowHeapInf:false,            //是否显示堆立信息
	lSiceCount:0,                  //骰子点数
	cbMagicIndex:0,				   //钻牌索引
	// 牌数据
	cbWeaveCounts:null,
	weaveItemArray:null,
	// 动作数据
	cbActionCard:0,                	// 动作扑克
	cbActionMask:0,                	// 动作掩码
	
	//房卡数据
	dwDrawCountLimit:0,                	// 局数限制
	dwDrawTimeLimit:0,                	// 时间限制
	cellScore:0,                   // 当前选择的底注
	cbTimeOutCard:0,//出牌时间
	cbTimeOperateCard:0,//操作时间
	cbTimeStartGame:0,//开始时间
	lTurnScore:[],//积分信息
	lCollectScore:[],//积分信息
	cbPlayerCount:0,//
	cbMaCount:0,//
	dwPlayCount:0,	//已玩局数

	ctor: function (opts) {	

		this.reset();
		// --底注相关--------//
		this.cellMode = 0;
		this.cellLevel = [];
		this.cellScore = 0;		
		this.meBankNums = 0;
		this.meChairId = INVALID_CHAIR;
		this.banker = INVALID_CHAIR;
		this.cellLV=0;
		//---------------------------------//
	},
	// 开局
	startGame: function(playersInfo){
		// ------------//
	},
	// 复位
	reset: function(){
		// -------------//
		this.WeaveItemArray=[]	//扑克数组（吃碰杠的数据）
		this.cbWeaveCount=[];	//扑克数组（吃碰杠的数量）
		this.cbSendCardData=0;	//发牌扑克数据（断线重连用）
		this.cbDiscardCard=[];	//历史出牌数据
		this.cbDiscardCount=[];	//出牌历史数量(断线重连用)
		this.cbHearStatus=[];	//听牌状态0没听 1-3听	
		this.tinID=INVALID_CHAIR;//当前听牌玩家ID
		this.bCanReplace=0;		//是否可以补花   0不能 1可以 2先补花
		this.userAction=INVALID_CHAIR;//动作
		this.challengeUser=INVALID_CHAIR;//挑战的玩家
		this.configUser=INVALID_CHAIR;//设置底注用户

		this.bCanChallenge=false;	//是否显示挑战
		this.tinCardInfo=[];		//听牌信息
		this.tinCardHu=[];			//每个听牌的提示胡的牌
		this.tinCardCount=0;		//听时可打的牌的数量
		this.tinCard=[];			//听时可打的牌
		this.bTin=false;			//是否听牌
		this.endChallengeFan=0;		//结算挑战番
		this.bTrustee=false;  		 //托管
		this.leaveUser=INVALID_CHAIR;//离开用户
		this.cardCount=[];			//扑克数目
		this.cardData=[];			//扑克数据
		this.gameScore=[];			//游戏得分
		this.challengeFan=0;		//挑战番
		this.fanCount=0;			//总番数
		this.huaCardCount=0;		//花牌个数
		this.chiHuRight=[];			//胡类型
		this.chiHuKind=[];			//吃胡类型
		this.provideCard=0;			//供应扑克
		this.actionCard=0;			//动作扑克
		this.fan=0;				//番
		this.operateCard=[];			//操作扑克
		this.operateCode=0;				//操作代码
		this.operateUser=INVALID_CHAIR;  //操作用户
		this.provideUser=INVALID_CHAIR;  //供应用户
		this.outCardData=0;				//出牌数据
		this.outCardUser=INVALID_CHAIR;  //出牌用户
		this.bTail=false;			//是否从尾巴拿牌
		this.sendCardUser=INVALID_CHAIR; //发牌用户
		this.acionMasks=0;			//动作
		this.sendCard=0;				//摸的牌
		this.rePlaceCard=0;       //补花牌
		this.replaceUser=0;			//补花用户
		this.players = [];
		this.hisData = [];
		this.currentUser = INVALID_CHAIR;
		this.tableOwnerUserID = 0;

		this.makesureUser = INVALID_CHAIR;

		this.bShowChallengeLogo = true;
		this.bShowSiceMove = false;
		this.gameStatus = CMD_HZMJ.GS_MJ_FREE;
		this.cbMagicIndex = CMD_HZMJ.MAX_INDEX;

		this.cbLeftCardCount = 0;
		this.dwPlayCount = 0;


		this.lSiceCount = 0;
		//玩家牌型初始化
		this.playerCards = new Array(CMD_HZMJ.GAME_PLAYER);
		for(var i=0;i<CMD_HZMJ.GAME_PLAYER;i++)
		{
			this.playerCards[i] = new Array(CMD_HZMJ.MAX_COUNT);
			for(var j=0;j<CMD_HZMJ.MAX_COUNT;j++)
				this.playerCards[i][j] = 0x00;
		}					
		//堆立信息
		this.bShowHeapInf = false;
		this.wHeapHead = 0;
		this.wHeapTail = 0;		
		this.cbHeapCardInfo = new Array(CMD_HZMJ.GAME_PLAYER);
		for(var i=0;i<CMD_HZMJ.GAME_PLAYER;i++)
		{
			this.cbHeapCardInfo[i] = new Array(2);
			this.cbHeapCardInfo[i][0] = INVALID_CHAIR;
			this.cbHeapCardInfo[i][1] = INVALID_CHAIR;
		}			
		//--------------------------------------//
		this.cbWeaveCounts = [];
		this.weaveItemArray = [];
		// ----------//
		this.isListening = [];
		this.isListening[0] = {chairId:0,isListening:false};
		this.isListening[1] = {chairId:1,isListening:false};
		// 动作数据
		this.cbActionCard = CMD_HZMJ.WIK_NULL;
		this.cbActionMask = CMD_HZMJ.WIK_
		
		//房卡数据
		this.dwDrawCountLimit=0;                	// 局数限制
		this.dwDrawTimeLimit=0;                	// 时间限制
		this.cbTimeOutCard=0;//出牌时间
		this.cbTimeOperateCard=0;//操作时间
		this.cbTimeStartGame=0;//开始时间
		for(var i=0;i<CMD_HZMJ.GAME_PLAYER;i++)
		{//积分信息
			this.lTurnScore[i] = 0;
			this.lCollectScore[i] = 0;
		}
		
		this.cbPlayerCount=0;//当前玩家数
		this.cbMaCount=0;//当前码数;
		
		this.settleScore = [];
		for(var i=0;i<CMD_HZMJ.GAME_PLAYER;i++)
		{//积分信息
			this.settleScore[i] = [];
		}
		//---------------------//
	},
	//
	addSettleScore:function(chairID, score){
		this.settleScore[chairID].push(score);
	},
	getSettleScore:function(chairID){
		return this.settleScore[chairID];
	},
	
	//桌主UserID
	setTableOwnerUserID:function(tableOwnerUserID){
		cc.log("已玩局数++++++++++++++++++++++");
		this.tableOwnerUserID = tableOwnerUserID;
	},
	getTableOwnerUserID:function(){
		return this.tableOwnerUserID;
	},
	setCurentCount:function(dwPlayCount){
		
	},
	//已玩局数
	setPlayCount:function(dwPlayCount){
		cc.log("已玩局数++++++++++++++++++++++");
		this.dwPlayCount = dwPlayCount;
	},
	getPlayCount:function(){
		return this.dwPlayCount;
	},
	
	//出牌时间
	setTimeOutCard:function(cbTimeOutCard){
		this.cbTimeOutCard = cbTimeOutCard;
	},
	getTimeOutCard:function(){
		return this.cbTimeOutCard;
	},
	//操作时间
	setTimeOperateCard:function(cbTimeOperateCard){
		this.cbTimeOperateCard = cbTimeOperateCard;
	},
	getTimeOperateCard:function(){
		return this.cbTimeOperateCard;
	},
	//开始时间
	setTimeStartGame:function(cbTimeStartGame){
		this.cbTimeStartGame = cbTimeStartGame;
	},
	getTimeStartGame:function(){
		return this.cbTimeStartGame;
	},
	//积分信息
	setTurnScore:function(lTurnScore){
		this.lTurnScore = lTurnScore;
	},
	getTurnScore:function(){
		return this.lTurnScore;
	},
	//积分信息
	setCollectScore:function(lCollectScore){
		this.lCollectScore = lCollectScore;
	},
	getCollectScore:function(){
		return this.lCollectScore;
	},
	//当前玩家数
	setPlayerCount:function(cbPlayerCount){
		this.cbPlayerCount = cbPlayerCount;
	},
	getPlayerCount:function(){
		return this.cbPlayerCount;
	},
	//码数
	setMaCount:function(cbMaCount){
		this.cbMaCount = cbMaCount;
	},
	getMaCount:function(){
		return this.cbMaCount;
	},
	
	//设置局数限制
	setDrawCountLimit:function(dwDrawCountLimit){
		this.dwDrawCountLimit = dwDrawCountLimit;
	},
	getDrawCountLimit:function(){
		return this.dwDrawCountLimit;
	},
	//设置时间限制
	setDrawTimeLimit:function(dwDrawTimeLimit){
		this.dwDrawTimeLimit = dwDrawTimeLimit;
	},
	getDrawTimeLimit:function(){
		return this.dwDrawTimeLimit;
	},
	//设置托管
	setTrustee:function(bool){
		this.bTrustee = bool;
	},
	getTrustee:function(){
		return this.bTrustee;
	},
	//供应扑克
	setProvideCard:function(cbProvideCard){
		this.provideCard = cbProvideCard;
	},
	getProvideCard:function(){
		return this.provideCard;
	},

	//操作
	setAcionMasks:function(acionMasks){
		this.acionMasks = acionMasks;
	},
	getAcionMasks:function(){
		return this.acionMasks;
	},

	// 设定底注等级列表
	setCellLevel:function(level){
		if(level == null || level == undefined) return;
		if(level.length<=0) return;
		this.cellLevel = level;
		this.cellMode = 1;				
	},
	getCellLevel:function(){
		return this.cellLevel;
	},
	selCellLevel:function(level){
		// cc.log("---uukkk---"+level.toString());
		if(level==null || level==undefined) return;
		if(level<=0 || level>4) return;
		if(this.cellLevel.length!=4) return;
		// --------------//
		this.cellScore = this.cellLevel[level - 1];		
		this.cellMode = 3;
		this.cellLV=level;
	},	
	//得到当前底注是第几个
	getCellLV:function(){
		return this.cellLV;
	},
	// 得到底注模式
	getCellMode:function(){
		return this.cellMode;
	},
	// 得到设定的底注
	getCellScore:function(){
		return this.cellScore;
	},
	// 设定底注
	setCellScore:function(lcellScore){
		this.cellScore = lcellScore;
	},
	//确认设定的底注
	setConfCell:function(lcellScore){
		//----------------//
		this.cellMode = 2;
		this.cellScore = lcellScore;
		//更新数据
		//this.update();
	},
	// 得到自己座位号
	getMeChairId:function(){
		cc.log("得到自己座位号"+g_objHero.getChairID());
		return g_objHero.getChairID();
	},
	// 得到当前用户数据
	/*getMeUserInf:function(){
		// cc.log("---getMeUserInf--"+this.meChairId.toString());
		if(this.meChairId==INVALID_CHAIR) return null;
		if(this.players.length<=0) return null;
		if(this.meChairId>=CMD_HZMJ.GAME_PLAYER) return null;
		if(!(this.meChairId == 0 || this.meChairId==1)) return null;
		var mePlayer=null;
		for(var i=0;i<this.players.length;i++)
		{
			var player=this.players[i];
			if(player==null || player==undefined) continue;
			if(player.getChairID()==this.meChairId)
			{
				mePlayer=player;
				break;
			}
		}
		return mePlayer;			
	},*/
	// 设定用户连庄次数
	setMeBankNums:function(bankUserChairId){
		// -------------------//
		if(this.getBanker() == bankUserChairId) this.meBankNums++;		
	},
	getMeBankNums:function(){
		return this.meBankNums;
	},
	// ----------------//
	/*setPlayers:function(players){		
		this.meChairId = INVALID_CHAIR;
		var curAcc=ClientData.getInstance().getCurAccountInfo();		
		if(players.length<=0) return;		
		for(var i=0;i<players.length;i++)
		{
			var player=players[i];
			this.players[i] = player;
			if(player == null || player == undefined) continue;
			if(player.account==curAcc.account) this.meChairId=player.getChairID();	
		}		
	},*/
	setHisData:function(chairId,lTurnScore,lCollectScore){
		if(chairId==INVALID_CHAIR) return;
		if(chairId>=CMD_HZMJ.GAME_PLAYER) return;		
		var bFind=false;
		for(var i=0;i<this.hisData.length;i++)
		{
			if(this.hisData[i]==null) continue;
			if(i==chairId)
			{
				bFind = true;
				this.hisData[i].lTurnScore = lTurnScore;
				this.hisData[i].lCollectScore = lCollectScore;
				break;
			}
		}
		if(bFind) return;
		// 添加数据
		this.hisData[chairId] = { lTurnScore:0, lCollectScore:0 };
		this.hisData[chairId].lTurnScore = lTurnScore;
		this.hisData[chairId].lCollectScore = lCollectScore;
	},
	//挑战的玩家
	setChallengeUser:function(wChairId){
		this.challengeUser=wChairId;
	},
	getChallengeUser:function(wChairId){
		return this.challengeUser;
	},

	//座位是否听牌
	setTinID:function(wChairId){
		this.tinID=wChairId;
	},
	getTinID:function(wChairId){
		return this.tinID;
	},
	//是否可以挑战
	setCanChallenge:function(bool){
		this.bCanChallenge=bool;
	},
	getCanChallenge:function(){
		return this.bCanChallenge;
	},
	// 设定庄家椅子号
	setBanker:function(bankUser){
		cc.log("bankUser:"+bankUser);
		this.banker = bankUser;
	},
	getBanker:function(){
		return this.banker;
	},
	//是否可以开始补花
	setCanReplace:function(value){

		this.bCanReplace = value;
	},
	getCanReplace:function(){
		return this.bCanReplace;
	},
	//听牌信息
	setTinCardInfo:function(CMD_S_ChiHuFan){
		this.tinCardInfo=CMD_S_ChiHuFan;
	},
	getTinCardInfo:function(){
		return this.tinCardInfo;
	},

	//听牌提示胡的牌
	setTinCardHu:function(cbCardHu){
		this.tinCardHu=cbCardHu;
	},
	getTinCardHu:function(){
		return this.tinCardHu;
	},
	//听时可打的牌数量
	setTinCardCount:function(cbCardCount){
		this.tinCardCount = cbCardCount;
	},
	getTinCardCount:function(){
		return this.tinCardCount;
	},
	//听时可打的牌
	setTinCard:function(cbCard){
		this.tinCard = cbCard;
	},
	getTinCard:function(){
		return this.tinCard;
	},
	//历史出牌数据
	setDiscardCard:function(cbDiscardCard){
		for(var i=0;i<60;i++)
		{
			if(cbDiscardCard[i] == 0)
				break;
			this.cbDiscardCard[i] = cbDiscardCard[i];
		}

	},
	getDiscardCard:function(){
		return this.cbDiscardCard;
	},
	//扑克数组（吃碰杠数据）
	setWeaveItemArray:function(WeaveItemArray){
		this.WeaveItemArray = WeaveItemArray;
	},
	getWeaveItemArray:function(){
		return this.WeaveItemArray;
	},
	//扑克数组（吃碰杠的数量）
	setWeaveCount:function(cbWeaveCount){
		this.cbWeaveCount = cbWeaveCount;
	},
	getWeaveCount:function(){
		return this.cbWeaveCount;
	},
	//出牌数量（断线重连用的）
	setDiscardCount:function(cbDiscardCount){
		this.cbDiscardCount = cbDiscardCount;
	},
	getDiscardCount:function(){
		return this.cbDiscardCount;
	},
	//出牌数据
	setOutCardData:function(outCardData){
		this.outCardData = outCardData;
	},
	getOutCardData:function(){
		return this.outCardData;
	},

	//出牌用户
	setOutCardUser:function(outCardUser){
		this.outCardUser = outCardUser;
	},
	getOutCardUser:function(){
		return this.outCardUser;
	},

	//发牌用户
	setSendCardUser:function(sendCardUser){
		this.sendCardUser = sendCardUser;
	},
	getSendCardUser:function(){
		return this.sendCardUser;
	},
	//获得的牌
	setSendCard:function(sendCard){

		this.sendCard = sendCard;
	},

	getSendCard:function(){
		return this.sendCard;
	},
	// 显示对家信息
	getOtherPlayer:function(){
		var otherPlayer=null;
		for(var i=0;i<CMD_HZMJ.GAME_PLAYER;i++)
		{
			var tmpPlayer=this.players[i];
			if(tmpPlayer == null || tmpPlayer==undefined) continue;
			if(tmpPlayer.getChairID() == this.meChairId) continue;
			// -------------//
			otherPlayer = tmpPlayer;
			break;
		}
		return otherPlayer;
	},

	// 切换椅子
	/*	switchViewChairID:function(wChairID){
		if (wChairID==INVALID_CHAIR) return INVALID_CHAIR;
		// var wChairCount = CMD_HZMJ.GAME_PLAYER;
		// var wViewChairID =
		// (wChairID+wChairCount*3/2-wChairCount)%wChairCount;
		var wViewChairID=0;
		if(wChairID == this.meChairId)
			wViewChairID = 1;
		else
			wViewChairID = 0;
		return wViewChairID;
	},*/


	//是否从尾部拿牌
	setTail:function(bool){
		this.bTail =  bool;		
	},
	getTail:function(){
		return this.bTail;
	},
	// 当前用户
	setCurrentUser:function(userId){
		this.currentUser =  userId;		
	},
	getCurrentUser:function(){
		return this.currentUser;
	},
	// 设定堆立信息
	setHeapInf:function(wHeapHead,wHeapTail){
		this.wHeapHead = wHeapHead;
		this.wHeapTail = wHeapTail;
	},
	// 设定剩余数目
	setLeftCardCount:function(cbLeftCardCount){
		this.cbLeftCardCount = cbLeftCardCount;
	},
	getLeftCardCount:function(){
		return this.cbLeftCardCount;
	},
	// 设定听牌状态
	setHearStatus:function(cbHearStatus){
		this.cbHearStatus = cbHearStatus;
	},
	getHearStatus:function(){
		return this.cbHearStatus;
	},


	//设置底注玩家
	setConfigUser:function(wConfigUser)
	{
		this.configUser=wConfigUser;
	},
	getConfigUser:function()
	{
		return this.configUser;
	},
	//玩家是否听牌
	setTin:function(bool){
		this.bTin=bool;
	},

	getTin:function(){
		return this.bTin;
	},
	//离开用户
	setLeaveUser:function(wLeaveUser){
		this.leaveUser=wLeaveUser;
	},

	getLeaveUser:function(){
		return this.leaveUser;
	},
	//设置动作扑克
	setActionCard:function(cbActionCard){
		this.actionCard=cbActionCard;
	},

	getActionCard:function(){
		return this.actionCard;
	},
	//扑克数目
	setCardCount:function(cbCardCount){
		this.cardCount=cbCardCount;
	},

	getCardCount:function(){
		return this.cardCount;
	},
	//发牌扑克（断线重连用）
	setSendCardData:function(cbSendCardData){
		this.cbSendCardData=cbSendCardData;
	},

	getSendCardData:function(){
		return this.cbSendCardData;
	},
	//扑克数据
	setCardData:function(cbCardData){
		this.cardData=cbCardData;
	},

	getCardData:function(){
		return this.cardData;
	},
	//游戏各玩家得分
	setGameScore:function(lGameScore){
		this.gameScore=lGameScore;
	},

	getGameScore:function(){
		return this.gameScore;
	},
	//番
	setFan:function(wFan){
		this.fan=wFan;
	},

	getFan:function(){
		return this.fan;
	},

	//结算挑战番
	setEndChallengeFan:function(wChallengeFan){
		this.endChallengeFan=wChallengeFan;
	},

	getEndChallengeFan:function(){
		return this.endChallengeFan;
	},
	//挑战番
	setChallengeFan:function(wChallengeFan){
		this.challengeFan=wChallengeFan;
	},

	getChallengeFan:function(){
		return this.challengeFan;
	},

	//总番数
	setFanCount:function(wFanCount){
		this.fanCount=wFanCount;
	},

	getFanCount:function(){
		return this.fanCount;
	},
	//花牌个数 
	setHuaCardCount:function(cbHuaCardCount){
		this.huaCardCount=cbHuaCardCount;
	},

	getHuaCardCount:function(){
		return this.huaCardCount;
	},
	//胡类型
	setChiHuRight:function(dwChiHuRight){
		this.chiHuRight=dwChiHuRight;
	},

	getChiHuRight:function(){
		return this.chiHuRight;
	},
	//胡类型
	setChiHuKind:function(dwChiHuKind){
		this.chiHuKind=dwChiHuKind;
	},

	getChiHuKind:function(){
		return this.chiHuKind;
	},
	//操作扑克
	setOperateCard:function(cbOperateCard){
		this.operateCard=cbOperateCard;
	},

	getOperateCard:function(){
		return this.operateCard;
	},

	//操作代码
	setOperateCode:function(cbOperateCode){
		this.operateCode=cbOperateCode;
	},

	getOperateCode:function(){
		return this.operateCode;
	},

	//供应用户
	setProvideUser:function(wProvideUser){
		this.provideUser=wProvideUser;
	},

	getProvideUser:function(){
		return this.provideUser;
	},

	//操作用户
	setOperateUser:function(wOperateUser){
		this.operateUser=wOperateUser;
	},

	getOperateUser:function(){
		return this.operateUser;
	},
	//补花用户
	setReplaceUser:function(wReplaceUser){
		this.replaceUser=wReplaceUser;
	},

	getReplaceUser:function(){
		return this.replaceUser;
	},
	// 补花
	setReplaceCard:function(cbReplaceCard){
		this.rePlaceCard = cbReplaceCard;
	},

	getReplaceCard:function(cbReplaceCard){
		return this.rePlaceCard;
	},

	// 牌数据
	setWeaveDatas:function(cbWeaveCounts,weaveItemArray){
		this.cbWeaveCounts = cbWeaveCounts;
		this.weaveItemArray = weaveItemArray;
	},
	// 设定挑战Logo是否显示
	showChallengeLogo:function(bShow){
		this.bShowChallengeLogo = bShow;
	},
	isShowChallengeLogo:function(){
		return this.bShowChallengeLogo;
	},
	//设定是否显示骰子动画
	showSiceMove:function(bShow){
		this.bShowSiceMove = bShow;
	},
	isShowSiceMove:function(){
		return this.bShowSiceMove;
	},
	// 设定动作数据
	setActionData:function(cbActionMask,cbActionCard){
		this.cbActionMask = cbActionMask;
		this.cbActionCard = cbActionCard;
	},
	//设置动作用户
	setUserAction:function(chairId){
		this.userAction = chairId;
		cc.log("设置动作用户 userAction="+chairId);
	},
	getUserAction:function(){
		return this.userAction;
	},
	// 设确认底注的用户
	setMakesureUser:function(chairId){
		this.makesureUser = chairId;
		//更新数据
		//this.update();
	},
	getMakesureUser:function(){
		return this.makesureUser;
	},
	//设定用户堆立信息
	setUserHeapCardInfo:function(userHeapCardInfo){
		if(userHeapCardInfo==null || userHeapCardInfo == undefined) return;
		if(userHeapCardInfo.length<=0) return;		
		//--------------//
		cc.log("--UserHeapCardInfo:"+userHeapCardInfo.length.toString());
		for(var i=0;i<CMD_HZMJ.GAME_PLAYER;i++)
		{
			cc.log("--UserHeapCardInfo("+i.toString()+",0):"+userHeapCardInfo[i][0].toString());
			cc.log("--UserHeapCardInfo("+i.toString()+",1):"+userHeapCardInfo[i][1].toString());
			this.cbHeapCardInfo[i][0] = userHeapCardInfo[i][0];
			this.cbHeapCardInfo[i][1] = userHeapCardInfo[i][1];
		}		
	},
	//设定是否显未堆立信息
	showHeapCard:function(bShow){
		this.bShowHeapInf = bShow;
	},
	//设定骰子点数
	setSiceCount:function(lSiceCount){
		this.lSiceCount = lSiceCount;
	},
	getSiceCount:function(){
		return this.lSiceCount;
	},
	//刷新数据
	/*	update:function(){
		var uiMgr = GameKindMgr.getInstance().getGameUIMgr();
		if(uiMgr) uiMgr.onUpdate();
	},*/
	//设定玩家牌型
	setPlayersCards:function(playersCards){

		for(var j=0;j<CMD_HZMJ.MAX_COUNT;j++)
			this.playerCards[0][j] = playersCards[j];	
		cc.log("设定玩家牌型this.playerCards = " + JSON.stringify(this.playerCards));
		//--------------//
	},
	//得到自家牌型
	getMeCards:function(){

		var meCards=new Array(CMD_HZMJ.MAX_COUNT);
		for(var j=0;j<CMD_HZMJ.MAX_COUNT;j++) 
			meCards[j] = this.playerCards[0][j];	
		cc.log("meCards = " + JSON.stringify(meCards));
		return meCards;
	},
	//得到对家牌型
	getOtherCards:function(){
		var otherCards=new Array(CMD_HZMJ.MAX_COUNT);
		var otherChairId= (this.meChairId + 1)%2;
		for(var j=0;j<CMD_HZMJ.MAX_COUNT;j++) 
			otherCards[j] = this.playerCards[otherChairId][j];	
		return otherCards;
	},
	//得到自家堆立信息
	getMeHeapHead:function(){
		if(this.meChairId == INVALID_CHAIR) return INVALID_CHAIR;
		if(this.cbHeapCardInfo==null) return INVALID_CHAIR;
		if(this.cbHeapCardInfo.length!=2) return INVALID_CHAIR;
		return this.cbHeapCardInfo[this.meChairId][0];
	},
	getMeHeapTail:function(){
		if(this.meChairId == INVALID_CHAIR) return INVALID_CHAIR;
		if(this.cbHeapCardInfo==null) return INVALID_CHAIR;
		if(this.cbHeapCardInfo.length!=2) return INVALID_CHAIR;
		return this.cbHeapCardInfo[this.meChairId][1];
	},
	//得到对家堆立信息
	getOtherHeapHead:function(){
		if(this.meChairId == INVALID_CHAIR) return INVALID_CHAIR;
		if(this.cbHeapCardInfo==null) return INVALID_CHAIR;
		if(this.cbHeapCardInfo.length!=2) return INVALID_CHAIR;
		var otherChairId= (this.meChairId + 1)%2;
		return this.cbHeapCardInfo[otherChairId][0];
	},
	getOtherHeapTail:function(){
		if(this.meChairId == INVALID_CHAIR) return INVALID_CHAIR;
		if(this.cbHeapCardInfo==null) return INVALID_CHAIR;
		if(this.cbHeapCardInfo.length!=2) return INVALID_CHAIR;
		var otherChairId= (this.meChairId + 1)%2;
		return this.cbHeapCardInfo[otherChairId][1];
	},
	//-----------------------------//
});