var s_sharedGameUIMgr = null;

var GameUIMgr = SceneUIMgr.extend({
	
	ctor: function () {
		SceneUIMgr.prototype.ctor.call(this);
		
		this._bChangeTable = false;
		this._playerCount = 4; //默认玩家数为4
		this._bDealGameScene = false;
		this._endPhase = false;
	},
	
	reset: function(){
		SceneUIMgr.prototype.reset.call(this);
		
		this._bChangeTable = false;
		this._playerCount = 4; //默认玩家数为4
		this._bDealGameScene = false;
	},
	
	setPlayerCount: function(count){
		this._playerCount = count;
	},

    getPlayerCount: function(){
        return this._playerCount;
    },

	isEndPhase: function(){
		return this._endPhase;
	},
	// C - P
	getPlayerPosByChairId: function(chairID){
        if (chairID == INVALID_CHAIR) return chairID;
		var playerPos = (chairID + this._playerCount - g_objHero.getChairID()) % this._playerCount;
		return playerPos;
	},
	//P - C
	getChairIdByPlayerPos: function(playerPos){
		var chairID = (g_objHero.getChairID() + playerPos) % this._playerCount;
		return chairID;
	},

	//判断是否正在换桌	
	isChangeTable: function(){
		return this._bChangeTable;
	},
	
	//设置是否正在换桌
	setChangeTable: function(bChange){
		this._bChangeTable = bChange;
	},
	
	//开始换桌
	changeTable: function(){
		GameUserMsg.getInstance().sendUserChairReq();
		this.setChangeTable(true);
	},
	
	//保险柜
	onGameUserInsureInfo: function(){
		var insure = ClientData.getInstance().getInsure();
		if(insure){
			var score = insure.getScoreInsure();
			var insureScore = insure.getScoreGame();
			
			var dlgGameInsure = UIMgr.getInstance().getDlg(ID_DlgGameInsure);
			if(dlgGameInsure){
				dlgGameInsure.setScore(score, insureScore);
			}
		}
	},
	
	checkForceExit: function(){
		var bForce = ClientData.getInstance().isForceExitGame();
		var str = ClientData.getInstance().getForceStr();
		ClientData.getInstance().clearForce();
		
		if(bForce){
			DlgTip.openSysTip(str, function(target){
				target.closeTip();
				g_outcome.reset();
				GameKindMgr.getInstance().backPlazaScene();
			});
		}

		return bForce;
	},
	
	//请求任务信息
	requestTaskInfos: function(){
		GameTaskMsg.getInstance().sendTaskInfoRequest();
	},
	
	//任务
	openDlgGameTask: function(){
		UIMgr.getInstance().openDlg(ID_DlgGameTask);
	},
	
	//任务完成
	onTaskComplete: function(){
		var dlgTask = UIMgr.getInstance().getDlg(ID_DlgGameTask);
		if(dlgTask){
			dlgTask.updateDlg();
		}
	},
	
	//////////////////////未实现部分，子类中实现////////////////////////////
	
	//更新所有玩家
	onUpdateAllPlayerInfo: function(){},
	
	//换桌成功
	onChangeTableSucc: function(){},
});

