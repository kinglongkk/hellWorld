var s_sharedGameKindMgr = null;

var GameKindMgr = cc.Class.extend({
	ctor: function(){
		this.gameUIMgr = null;
		this.newGameSceneFun = null;
	},
	
	setNewGameSceneFun: function(fun){
		cc.log("----------------------设置游戏场景函数-------------------------")
		this.newGameSceneFun = fun;
	},
	getNewGameSceneFun: function(){
		return this.newGameSceneFun;
	},
	
	runGameScene: function(){
		cc.log("#### run game scene.");
		LoginRegisterMsg.getInstance().sendLog(248);
		var gameScene = this.newGameSceneFun();
		
		if(gameScene){
			var runScene = cc.director.getRunningScene();
			if(runScene.isPlazaScene && runScene.isPlazaScene()){
				ClientData.getInstance().setReplaceScene(true);
				_dlg_table_ = {};
                if(cc.sys.isNative) {
                    //var scene = new cc.TransitionFade(0.5, gameScene, cc.color(255,255,255,255));
                    var scene = new cc.TransitionCrossFade(0.5, gameScene);
                    cc.director.runScene(scene);
				}
				else{
                    cc.director.runScene(gameScene);
				}
				// iOS控制不锁屏
                if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod(
                        "AppController",
                        "setScreenLock:",
                        true
                    );
                }
			}
		}else{
			cc.log("### error: setNewGameSceneFun is null!");
		}
	},
	backLoginScene: function(){
        g_outcome.reset();
        this.newGameSceneFun = null;

        var runScene = cc.director.getRunningScene();
        if(runScene.isGameScene && runScene.isGameScene()){
            GameKindMgr.getInstance().getGameUIMgr().reset();
            ClientData.getInstance().setReplaceScene(true);
            _dlg_table_ = {};

            LogonMsgHandler.getInstance().close();

            if(cc.sys.isNative) {
                var scene = new cc.TransitionCrossFade(0.5, new LoginScene());
                cc.director.runScene(scene);
            }
            else{
                cc.director.runScene(new LoginScene());
            }

            // iOS恢复锁屏功能
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(
                    "AppController",
                    "setScreenLock:",
                    false
                );
            }
        }
	},
	backPlazaScene: function(){
		cc.log("#### ---------------------返回大厅场景---------------------------");

        g_outcome.reset();
		this.newGameSceneFun = null;
		
		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			
			var gameList = GameKindMgr.getInstance().getGameList(); //设置初始游戏ID 
            var defaultKindID = gameList[0].gameKindId;
            if(plaza.getCurKindID()!=defaultKindID)
                plaza.setCurKindID(defaultKindID);
			else 
				plaza.setCurKindID(CMD_ZPMJ.KIND_ID);
			
			plaza.setCurGameType(GAME_GENRE_PERSONAL); // 这边设置也有问题已经不是房卡版了....
		}
		
		var runScene = cc.director.getRunningScene();
		if(runScene.isGameScene && runScene.isGameScene()){
			GameKindMgr.getInstance().getGameUIMgr().reset();
			ClientData.getInstance().setReplaceScene(true);
			_dlg_table_ = {};
			
			if(cc.sys.isNative) {
				var scene = new cc.TransitionCrossFade(0.5, new PlazaScene());
				cc.director.runScene(scene);
			}
			else{
				cc.director.runScene(new PlazaScene());
			}

			// iOS恢复锁屏功能
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod(
                    "AppController",
                    "setScreenLock:",
                    false
                );
            }
		}
	},
	
	restartPlazaScene: function(){
		cc.log("#### restart plaza scene.");
		this.newGameSceneFun = null;
		
		ClientData.getInstance().setReplaceScene(true);
		_dlg_table_ = {};
		var scene = new cc.TransitionCrossFade(0.5, new PlazaScene());
		cc.director.runScene(scene);
	},
	
	getGameList: function(){
		var gameList = [];

		if (_GAME_LIST_CFG_){
			gameList = _GAME_LIST_CFG_["gameList"];
		}

		return gameList;
	},
	
	getGameCfg: function(kindId){
		var gameCfg = null;
		
		if(kindId != 0){
			var gameList = this.getGameList();
			
			for(var i=0; i<gameList.length; i++){
				var itemKindId = gameList[i].gameKindId;
				if(kindId == itemKindId){
					gameCfg = gameList[i];
					break;
				}
			}
		}
		
		return gameCfg;
	},
	
	getGameVersion: function(){
		var gameVersion = 0;
		
		var kindId = 0;
		var plaza = ClientData.getInstance().getPlaza();
	    if(plaza){
	        kindId = plaza.getCurKindID();
	    }
	    
	    if(kindId != 0){
	    	var gameCfg = this.getGameCfg(kindId);
	    	if(gameCfg){
	    		var cbMainVer = gameCfg.gameVersion[0];
	    		var cbSubVer = gameCfg.gameVersion[1];
	    		var cbBuildVer = gameCfg.gameVersion[2];

	    		gameVersion = PROCESS_VERSION(cbMainVer,cbSubVer,cbBuildVer);
	    	}
	    }
	    
		return gameVersion;
	},
	
	getGameName: function(){
		var gameName = "";
		
		var kindId = 0;
		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			kindId = plaza.getCurKindID();
		}
		
		if(kindId != 0){
			var gameCfg = this.getGameCfg(kindId);
			if(gameCfg){
				itemPic = gameCfg.gameName;
			}
		}

		return gameName;
	},
	
	//
	setGameUIMgr: function(gameUIMgr){
		this.gameUIMgr = gameUIMgr;
	},
	getGameUIMgr: function(){
		return this.gameUIMgr;
	},
});

GameKindMgr.getInstance = function() {
	if (!s_sharedGameKindMgr) {
		s_sharedGameKindMgr = new GameKindMgr();
	}
	return s_sharedGameKindMgr;
};
