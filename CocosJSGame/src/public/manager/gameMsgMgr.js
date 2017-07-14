var s_sharedGameMsgMgr = null;

var GameMsgMgr = cc.Class.extend({

	ctor: function () {
		this._gameMsgInstances = [];
	},

	reset: function(){
		this._gameMsgInstances = [];
	},
	
	addGameMsgInstance: function(gameMsgInstance){
		this._gameMsgInstances.push(gameMsgInstance);
	},
	
	onGameStatus: function(){
		for(var i=0; i<this._gameMsgInstances.length; i++){
			var gameMsgInstance = this._gameMsgInstances[i];

			if(gameMsgInstance.isCurRunGame()){
				gameMsgInstance.onGameStatus();
			}
		}
	},
	
	onGameMsg: function(subCmd, data){
		//cc.log("### onGameMsg === data.len =" + data.byteLength);
		for(var i=0; i<this._gameMsgInstances.length; i++){
			var gameMsgInstance = this._gameMsgInstances[i];
			
			if(gameMsgInstance.isCurRunGame()){
				gameMsgInstance.onGameMsg(subCmd, data);
			}
		}
	},
	
	onGameSceneMsg: function(data, isPay){
		for(var i=0; i<this._gameMsgInstances.length; i++){
			var gameMsgInstance = this._gameMsgInstances[i];

			if(gameMsgInstance.isCurRunGame()){
				gameMsgInstance.onGameSceneMsg(data, isPay);
			}
		}
	},
});

GameMsgMgr.getInstance = function () {
	if (!s_sharedGameMsgMgr) {
		s_sharedGameMsgMgr = new GameMsgMgr();
	}
	return s_sharedGameMsgMgr;
};

