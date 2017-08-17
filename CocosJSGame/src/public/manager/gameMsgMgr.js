var s_sharedGameMsgMgr = null;

var GameMsgMgr = cc.Class.extend({

	ctor: function () {
		this._gameMsgInstances = [];
		cc.log("-----------------------------------------------------")
        cc.log("-----------GameMsgMgr.create() 通信消息管理器创建------------------")
        cc.log("-----------------------------------------------------")
	},

	reset: function(){
		this._gameMsgInstances = [];
	},
	
	addGameMsgInstance: function(gameMsgInstance){
		var name = gameMsgInstance.name ;
		cc.log("-----------GameMsgMgr 消息管理器添加了对像：", name)
		this._gameMsgInstances.push(gameMsgInstance);
	},
	
	onGameStatus: function(){
		cc.log("--------动态调用了GameMsgMgr：onGameStatus（）----------------------")
		for(var i=0; i<this._gameMsgInstances.length; i++){
			var gameMsgInstance = this._gameMsgInstances[i];

			if(gameMsgInstance.isCurRunGame()){
				gameMsgInstance.onGameStatus();
			}
		}
	},
	
	onGameMsg: function(subCmd, data){
		//cc.log("### onGameMsg === data.len =" + data.byteLength);
        cc.log("--------动态调用了GameMsgMgr：onGameMsg（）----------------------")
		for(var i=0; i<this._gameMsgInstances.length; i++){
			var gameMsgInstance = this._gameMsgInstances[i];
			
			if(gameMsgInstance.isCurRunGame()){
				gameMsgInstance.onGameMsg(subCmd, data);
			}
		}
	},
	
	onGameSceneMsg: function(data, isPay){
        cc.log("--------动态调用了GameMsgMgr：onGameSceneMsg（）----------------------")
		for(var i=0; i<this._gameMsgInstances.length; i++){
			var gameMsgInstance = this._gameMsgInstances[i];

			if(gameMsgInstance.isCurRunGame()){
				gameMsgInstance.onGameSceneMsg(data, isPay);
			}
		}
	},

    onUserGameMsg:function (data) {
		var bRet = false
        for(var i=0; i<this._gameMsgInstances.length; i++){
            var gameMsgInstance = this._gameMsgInstances[i];
            if(gameMsgInstance.isCurRunGame() && gameMsgInstance.onUserGameMsg){
                var b = gameMsgInstance.onUserGameMsg(data);
                bRet = bRet || b
            }
        }
        return bRet
    }
});

GameMsgMgr.getInstance = function () {
	if (!s_sharedGameMsgMgr) {
		s_sharedGameMsgMgr = new GameMsgMgr();
	}
	return s_sharedGameMsgMgr;
};

