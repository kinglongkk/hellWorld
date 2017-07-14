
var ZpmjUIMgr = GameUIMgr.extend({
	reset: function () {
		cc.log("ZpmjUIMgr------reset--");
	},

	startGame: function () {
		cc.log("ZpmjUIMgr------startGame--");

		this.reset();
		//设置游戏人数
		this.setPlayerCount(CMD_ZPMJ.GAME_PLAYER);

		var sizeDir = cc.director.getWinSize();

		//创建和打开牌面
        var dlg = UIMgr.getInstance().openDlg(ID_DlgZpmjCardsInfo);
		
		//创建和打开主界面
		UIMgr.getInstance().openDlg(ID_DlgZpmjMain);

		if(dlg){
			//设置局数信息
            dlg.setRoundInfo();
			//设置剩余牌数
            dlg.setCardssLeft();
		}
		
		//断线重连
		var table = ClientData.getInstance().getTable();
		if(table.getGameStatus() == CMD_ZPMJ.GS_MJ_PLAY)
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
		var DlgZpmjMain = UIMgr.getInstance().getDlg(ID_DlgZpmjMain);
		if(!DlgZpmjMain) 
			return;

		//设置玩家信息
		var isPlayersFull = true;
		for(chairID=0; chairID<CMD_ZPMJ.GAME_PLAYER; ++chairID){
			if(!DlgZpmjMain.setUserInfo(chairID)){
				isPlayersFull = false;
			}
		}

		if(isPlayersFull){
			DlgZpmjMain.Panel_waitOperation.setVisible(false);
		}
		else{
			DlgZpmjMain.Panel_waitOperation.setVisible(true);
			DlgZpmjMain.Button_invite.setVisible(true);
			
			if(game.getTableOwnerUserID()==g_objHero.getUserId()){
				DlgZpmjMain.Button_delete.setVisible(true);
				DlgZpmjMain.Button_invite.setPositionX(190.75);
			}
			else{
				DlgZpmjMain.Button_delete.setVisible(false);
				DlgZpmjMain.Button_invite.setPositionX(400);
			}
		}
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

    //显示插花界面
    onShowInserFlowerUI:function (bShow) {
        var dlg = UIMgr.getInstance().getDlg(ID_DlgZpmjMain);
        if (!dlg) return;
        dlg.Panel_addFlowers.setVisible(bShow);
    },

	//操作结果
	onOperateResult: function(){
		if(!this._bInit){
			return;
		}

		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
		if(!dlgCardsInf) return;
		dlgCardsInf.operateResult();
	},

    //广播听牌操作结果
    onListenOperateResult: function(){
        if(!this._bInit){
            return;
        }

        var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
        if(!dlgCardsInf) return;
        dlgCardsInf.onListenOperateResult();
    },

    //出牌能听的出牌数组操作
    onTingHuCard: function(){
        if(!this._bInit){
            return;
        }
        var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
        if(!dlgCardsInf) return;
        var arrOperator = [];
        arrOperator.push(CMD_ZPMJ.WIK_LISTEN);
        dlgCardsInf.showOperator(true, arrOperator);
    },

    // 用户托管标志更新
    onTrustee:function () {
        if(!this._bInit){
            return;
        }
        var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
        if(!dlgCardsInf) return;
        dlgCardsInf.updateTrustee();
    },

	//更新玩家的插花个数
    updateInsertFlowerNum:function (chairID,bHide) {
        var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
        if(!dlgCardsInf) return;
        // 更新花数
        dlgCardsInf.updateInsertFlowerNum(chairID,bHide);
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
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
		if(!dlgCardsInf) return;

		dlgCardsInf.replaceCard();

		//设置剩余牌数
        dlgCardsInf.setCardssLeft();
	},

    // 只更新庄家花个数
    updateFloweNum:function (replaceUser) {
        var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
        if(!dlgCardsInf) return;
        // 更新花数
        dlgCardsInf.updateFlowerNum(replaceUser);
    },

    // 7花可查
    replaceCard_7Flower: function(){
        if(!this._bInit)
            return;
        var game = ClientData.getInstance().getGame();
        if(!game)
            return;
        var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
        if(!dlgCardsInf) return;
        dlgCardsInf.replaceCard_7Flower();
    },

    // 翻金
    updateGoldMedal:function(){
        var game = ClientData.getInstance().getGame();
        if(!game){
            return;
        }
        var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
        if(!dlgCardsInf) return;
        dlgCardsInf.updateGoldMedal();
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
		cc.log("----zpmjUIMgr.onSendCard----");
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
		if(!dlgCardsInf) return;
		dlgCardsInf.sendCard();

		//设置剩余牌数
        dlgCardsInf.setCardssLeft();
		
		SoundMgr.getInstance().playEffect("zpmj_outCard", 0, false);
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
		cc.log("--打开操作提示面板--");
		var arrOperator = [];

		//吃
        if(cbActionMask & CMD_ZPMJ.WIK_LEFT || cbActionMask & CMD_ZPMJ.WIK_CENTER || cbActionMask & CMD_ZPMJ.WIK_RIGHT) {
            arrOperator.push(CMD_ZPMJ.WIK_LEFT);// 代表吃 用来显示吃按钮
        }
		//碰牌类型
		if(cbActionMask & CMD_ZPMJ.WIK_PENG) {
			arrOperator.push(CMD_ZPMJ.WIK_PENG);
		}
		//杠牌类型
		if(cbActionMask & CMD_ZPMJ.WIK_GANG) {
			arrOperator.push(CMD_ZPMJ.WIK_GANG);
		}
		//胡类型
		if(cbActionMask & CMD_ZPMJ.WIK_CHI_HU) {
			arrOperator.push(CMD_ZPMJ.WIK_CHI_HU);
		}
		if(cbActionMask & CMD_ZPMJ.WIK_FANG_PAO) {
			arrOperator.push(CMD_ZPMJ.WIK_FANG_PAO);
		}

		//显示操作面板
		if(arrOperator.length!=0){
			var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
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
		cc.log("----zpmjUIMgr.onOutCard----");
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
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

		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
		if(!dlgCardsInf) return;
		//清理
		dlgCardsInf.doClear();
		
		//显示手牌
		dlgCardsInf.showCard();
        //设置剩余牌数
        dlgCardsInf.setCardssLeft();
        //设置局数信息
        dlgCardsInf.setRoundInfo();

		var DlgZpmjMain = UIMgr.getInstance().getDlg(ID_DlgZpmjMain);
		if(!DlgZpmjMain) return;

		game.setLeftCardCount(CMD_ZPMJ.FULL_COUNT-13*4);
		DlgZpmjMain.Panel_waitOperation.setVisible(false);
		
		SoundMgr.getInstance().playEffect("zpmj_gameStart", 0, false);
	},
	//断线重连
	onBreak:function(){
		var dlgCardsInf=UIMgr.getInstance().getDlg(ID_DlgZpmjCardsInfo);
		if(dlgCardsInf){
			dlgCardsInf.onBreak();
			SoundMgr.getInstance().playEffect("zpmj_gameStart", 0, false);
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
		for(var chairID=0;chairID<CMD_ZPMJ.GAME_PLAYER;chairID++)
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
		LocalStorageMgr.getInstance().setZpmjGameInfo(strGameInfo);
	},
	//获取本地游戏记录--进入游戏的时候获取记录 并保存到game model 
	getGameInfo: function(){
		var strGameInfo = LocalStorageMgr.getInstance().getZpmjGameInfo();
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
		for(var chairID=0;chairID<CMD_ZPMJ.GAME_PLAYER;chairID++)
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
		LocalStorageMgr.getInstance().setZpmjGameInfo("");
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

var g_ZpmjUIMgr = null;

ZpmjUIMgr.getInstance = function() {
	if (!g_ZpmjUIMgr) {
		g_ZpmjUIMgr = new ZpmjUIMgr();
	}
	return g_ZpmjUIMgr;
};