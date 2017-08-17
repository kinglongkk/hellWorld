/*
 * 游戏主界面 管理
 * Author: 	xjn 
 * Date:	2017.4.8
 * 
 * 功能：
 * */
var HzmjUIMgr = GameUIMgr.extend({
	reset: function () {
		cc.log("HzmjUIMgr------reset--");
	},

	startGame: function () {
		cc.log("HzmjUIMgr------startGame--");

		this.reset();
		//设置游戏人数
		this.setPlayerCount(CMD_HZMJ.GAME_PLAYER);

		var sizeDir = cc.director.getWinSize();

		//创建和打开牌面
		UIMgr.getInstance().openDlg(ID_DlgHzmjCardsInfo);
		
		//创建和打开主界面
		UIMgr.getInstance().openDlg(ID_DlgHzmjMain);
		
		var DlgHzmjMain = UIMgr.getInstance().getDlg(ID_DlgHzmjMain);
		if(DlgHzmjMain){
			//设置局数信息
			DlgHzmjMain.setRoundInfo();
			//设置剩余牌数
			DlgHzmjMain.setCardssLeft();
		}
		
		//断线重连
		var table = ClientData.getInstance().getTable();
		if(table.getGameStatus() == CMD_HZMJ.GS_MJ_PLAY)
			this.onBreak();
		
		//更新玩家信息
		this.onUpdateAllPlayerInfo();
	},

	////////////////////////////////////实现父类中包含的函数/////////////////////////////////////////////
	//更新所有玩家
	onUpdateAllPlayerInfo: function(){	
		if(!this._bInit){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		cc.log("update~~~~~~~");
		cc.log("显示!!!!!!!!!!!!!!!!!");

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		//获取 游戏主界面
		var DlgHzmjMain = UIMgr.getInstance().getDlg(ID_DlgHzmjMain);
		if(!DlgHzmjMain) 
			return;

		//设置玩家信息
		var isPlayersFull = true;
		for(chairID=0; chairID<CMD_HZMJ.GAME_PLAYER; ++chairID){
			if(!DlgHzmjMain.setUserInfo(chairID)){
				isPlayersFull = false;
			}
		}

		if(isPlayersFull){
			DlgHzmjMain.Panel_waitOperation.setVisible(false);
			DlgHzmjMain.Button_start.setPositionX(110);
		}
		else{
			DlgHzmjMain.Panel_waitOperation.setVisible(true);
			DlgHzmjMain.Button_invite.setVisible(true);
			
			if(game.getTableOwnerUserID()==g_objHero.getUserId()){
				//DlgHzmjMain.Button_delete.setVisible(true);
				DlgHzmjMain.Button_invite.setPositionX(190);
			}
			//else{
			//	//DlgHzmjMain.Button_delete.setVisible(false);
			//	DlgHzmjMain.Button_invite.setPositionX(400);
			//}
		}

		// 如果游戏中 隐藏掉，放在游戏结束界面处理
		if(game.getOnGameEndUI()) {
			DlgHzmjMain.Panel_waitOperation.setVisible(false);
			DlgHzmjMain.Button_start.setVisible(false);
		}
	},

	// 用户托管标志更新
	onTrustee:function () {
		if(!this._bInit){
			return;
		}
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		if(!dlgCardsInf) return;
		dlgCardsInf.updateTrustee();
	},
	///////////////////////////////////////////////////////////////

	onGameEnd: function(){
		if(!this._bInit){
			return;
		}

		this._endPhase = true;


	},

	againGame: function(){
		if(!this._bInit){
			return;
		}

		var bForceExitGame = this.checkForceExit();
		if(bForceExitGame){
			return;
		}

		this._endPhase = false;
		this.onUpdateAllPlayerInfo();

	},

	getPlayersNick: function(){
		if(!this._bInit){
			return;
		}

		return this.playersNick;
	},

	onGameScene: function(){
		if(!this._bInit){
			return;
		}

	},

	//换桌成功
	onChangeTableSucc: function(){
	},

	///////////////////////////////////////////////////////////////

	//设置底注
	onCallScore: function() {
	},

	//操作结果
	onOperateResult: function(){
		if(!this._bInit){
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		if(!dlgCardsInf) return;
		dlgCardsInf.operateResult();
	},
	//补花
	replaceCard: function(){
		if(!this._bInit){
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		if(!dlgCardsInf) return;
		dlgCardsInf.replaceCard();
	},
	//发牌
	onSendCard: function(){
		if(!this._bInit){
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		cc.log("----hzmjUIMgr.onSendCard----");
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		if(!dlgCardsInf) return;
		dlgCardsInf.sendCard();
		
		var DlgHzmjMain = UIMgr.getInstance().getDlg(ID_DlgHzmjMain);
		if(!DlgHzmjMain) return;
		//设置剩余牌数
		DlgHzmjMain.setCardssLeft();
		
		SoundMgr.getInstance().playEffect("hzmj_outCard", 0, false);
	},
	//操作提示
	onOperatorTip:function(){
		if(!this._bInit){
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var cbActionMask = game.getAcionMasks();

		//打开提示面板
		cc.log("--UIMgr打开操作提示面板--");
		var arrOperator = [];
		//碰牌类型
		if(cbActionMask & CMD_HZMJ.WIK_PENG)
		{
			arrOperator.push(CMD_HZMJ.WIK_PENG);
		}
		//杠牌类型
		if(cbActionMask & CMD_HZMJ.WIK_GANG)
		{
			arrOperator.push(CMD_HZMJ.WIK_GANG);
		}
		//胡类型
		if(cbActionMask & CMD_HZMJ.WIK_CHI_HU)
		{
			arrOperator.push(CMD_HZMJ.WIK_CHI_HU);
		}
		if(cbActionMask & CMD_HZMJ.WIK_FANG_PAO)
		{
			arrOperator.push(CMD_HZMJ.WIK_FANG_PAO);
		}

		//显示操作面板
		if(arrOperator.length!=0){
			var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
			if(dlgCardsInf) {
				dlgCardsInf.showOperator(true, arrOperator);

				dlgCardsInf.setGameClock(game.getMeChairId(),game.getTimeOutCard());
				dlgCardsInf.outCardEnabled = false;

			}
		}
	},
	//出牌
	onOutCard: function(){
		if(!this._bInit){
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		cc.log("----hzmjUIMgr.onOutCard----");
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		if(!dlgCardsInf) return;
		dlgCardsInf.outCard();
	},
	//开始发牌
	onGameStart: function(){
		if(!this._bInit){
			cc.log("!this._bInit***********");
			return;
		}
		var game = ClientData.getInstance().getGame();
		if(!game){
			cc.log("!game***********");
			return;
		}

		this.onUpdateAllPlayerInfo();

		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		if(!dlgCardsInf) return;
		//清理
		dlgCardsInf.doClear();
		
		//显示手牌
		dlgCardsInf.showCard();

		var DlgHzmjMain = UIMgr.getInstance().getDlg(ID_DlgHzmjMain);
		if(!DlgHzmjMain) return;
		//设置局数信息
		DlgHzmjMain.setRoundInfo();
		//game.setLeftCardCount(60);
		//设置剩余牌数
		DlgHzmjMain.setCardssLeft();

		DlgHzmjMain.Panel_waitOperation.setVisible(false);
		dlgCardsInf.Panel_roundInfo.setVisible(true);
		if(game.getAcionMasks()!=0){
			cc.log("发牌打开操作提示面板==");
			HzmjUIMgr.getInstance().onOperatorTip();
		}
		
		SoundMgr.getInstance().playEffect("hzmj_gameStart", 0, false);
	},

	//断线重连
	onBreak:function(){
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		if(dlgCardsInf){
			dlgCardsInf.onBreak();
			SoundMgr.getInstance().playEffect("hzmj_gameStart", 0, false);
		}
	},
	onGameScene: function(){
		if(!this._bInit){
			return;
		}

		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}

		var i;
		var gameStatus = table.getGameStatus();

	},
	
	/** 
	 * download url lite 
	 * 
	 * @author: legend(legendsky@hotmail.com) 
	 * @link: http://www.ugia.cn/?p=122 
	 * @version: 1.0 
	 * 
	 * @param string   url 
	 * @param string   callback  回调函数 
	 * @param string  data      post数据 
	 * 
	 * @return void 
	 */ 
	downloadUrl:function (url, callback, data){ 
		// init 
		url += url.indexOf("?") > 0 ? "&" : "?"; 
		url += "random_download_url=" + Math.random(); 

		if (typeof data == 'undefined') 
		{ 
			var data = null; 
		} 

		method = data ? 'POST' : 'GET'; 

		// create XMLHttpRequest object 
		if (window.XMLHttpRequest) 
		{ 
			var objXMLHttpRequest = new XMLHttpRequest(); 
		} 
		else 
		{ 
			var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP']; 
			for(var n = 0; n < MSXML.length; n ++) 
			{ 
				try 
				{ 
					var objXMLHttpRequest = new ActiveXObject(MSXML[n]); 
					break; 
				} 
				catch(e) 
				{ 
				} 
			} 
		} 

		// send request 
		with(objXMLHttpRequest) 
		{ 
			//setTimeouts(30*1000,30*1000,30*1000,30*60*1000); 
			try 
			{ 
				open(method, url, true); 

				if (method == 'POST') 
				{ 
					setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'); 
				} 

				send(data); 
			} 
			catch(e) 
			{ 
				alert(e); 
			} 

			// on ready 
			onreadystatechange = function() 
			{ 
				if (objXMLHttpRequest.readyState == 4) 
				{ 
					callback(objXMLHttpRequest.response, objXMLHttpRequest.status); 
					delete(objXMLHttpRequest); 
				} 
			} 
		} 
	},
	
	//加载网络图片并保存
	loadUrlImage: function(userID, url, cb){
		if(!url || url.length==0){
			url = "http://a-ssl.duitang.com/uploads/item/201607/05/20160705130934_MLJzU.jpeg"; //测试url 默认图片
		}
		cc.log("****url***"+url);
		var xhr = new XMLHttpRequest();    
		xhr.open("get", url, true);
		xhr.responseType = "arraybuffer";
		
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
				var httpStatus = xhr.statusText;
				var arrayBuffer = xhr.response;
				
				if (arrayBuffer) {
					var byteArray = new Uint8Array(arrayBuffer);
					
					var savePath = jsb.fileUtils.getWritablePath()+"headImage_"+userID+".jpg";
					if(zutils.saveToFile(savePath,byteArray)){
						//保存成功
						cc.log("保存成功");
						cb(savePath)
					}
				}
			}
		};
		xhr.send();
	},
	
	//空闲进入的时候清理游戏记录
	//断线重入的时候获取记录 并保存到game model 
	//游戏结束的时候 更新记录
	updateGameInfo: function(){
		var objGameInfo = {};
		
		//获取房间号
		objGameInfo.rooID = g_objHero.getRoomID();
		
		//获取局数限制
		var game = ClientData.getInstance().getGame();
		objGameInfo.countLimit = game.getDrawCountLimit();
		//获取当前局数
		objGameInfo.curCount = game.getPlayCount();
		
		//历史积分
		objGameInfo.scoreList = [];
		for(var chairID=0;chairID<CMD_HZMJ.GAME_PLAYER;chairID++)
		{
			objGameInfo.scoreList[chairID] = objGameInfo.scoreList[chairID] || [];
			
			var settleScoreList = game.getSettleScore(chairID);
			for(var index=0; index<settleScoreList.length; ++index){
				var score = settleScoreList[index];
				objGameInfo.scoreList[chairID][index] = score;
			}
		}
		
		//转成字符串
		var strGameInfo = JSON.stringify(objGameInfo);
		cc.log("**setGameInfo**"+strGameInfo);
		
		//保存
		LocalStorageMgr.getInstance().setHzmjGameInfo(strGameInfo);
	},
	//获取本地游戏记录--进入游戏的时候获取记录 并保存到game model 
	getGameInfo: function(){
		var strGameInfo = LocalStorageMgr.getInstance().getHzmjGameInfo();
		cc.log("**getGameInfo**"+strGameInfo);
		if(strGameInfo=="")
			return;
		
		var objGameInfo = JSON.parse(strGameInfo);
		
		var curRoomID = g_objHero.getRoomID();
		if(objGameInfo.rooID!=curRoomID){
			this.removeGameInfo();
			return;
		}
		
		//局数限制
		var game = ClientData.getInstance().getGame();
		game.setDrawCountLimit(objGameInfo.countLimit);
		//当前局数
		game.setPlayCount(objGameInfo.curCount);
		if(objGameInfo.curCount!=objGameInfo.countLimit){
			game.setPlayCount(objGameInfo.curCount);
		}
		
		//历史积分
		for(var chairID=0;chairID<CMD_HZMJ.GAME_PLAYER;chairID++)
		{
			var scoreList = objGameInfo.scoreList[chairID];
			for(var index=0; index<scoreList.length; ++index){
				var score = scoreList[index];
				game.addSettleScore(chairID,score);
			}
		}
	},
	//清理本地游戏记录
	removeGameInfo: function(){
		LocalStorageMgr.getInstance().setHzmjGameInfo("");
	},

	//设置定时器
	schedule: function(callBack, interval, isRepeat, target){
		//var repeat = isRepeat?cc.REPEAT_FOREVER:0;
		
		cc.director.getScheduler().scheduleCallbackForTarget(target, callBack, interval, isRepeat, 0, false);
		
		//cc.director.getScheduler().schedule(callBack, target, interval, repeat, 0, false, key);
	},
	unschedule: function(callBack, target){
		//cc.director.getScheduler().unschedule(key, target);
		cc.director.getScheduler().unscheduleCallbackForTarget(target, callBack);
	}
});

var g_HzmjUIMgr = null;

HzmjUIMgr.getInstance = function() {
	if (!g_HzmjUIMgr) {
		g_HzmjUIMgr = new HzmjUIMgr();
	}
	return g_HzmjUIMgr;
};