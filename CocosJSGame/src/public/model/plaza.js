
var Plaza = cc.Class.extend({
    ctor: function () {
    	this.reset();
    },

    reset: function(){
    	//保险柜
    	this.bLogonInsure = false;
    	this.insureMd5Pass = "";
    	
    	this.serverInfo = {};

    	
//    	this.curKindID = 0;
//    	this.curGameType = GAME_GENRE_PERSONAL;//设置游戏类型
    	this.curCreateRoomData = null;
    	this.roomOperationType = ROOM_OPERATION_ADD;
    },
    
    setRoomOpType: function(roomOperationType){
    	this.roomOperationType = roomOperationType;
    },
    getRoomOpType: function(){
    	return this.roomOperationType;
    },

    //房间列表
    setServerInfo: function(info){
    	this.serverInfo = info;
    },

    getServerInfo: function(){
    	return this.serverInfo;
    },
    
    setServerOnlineByServerId: function(serverId, onLineCount){
    	var key;
    	for(key in this.serverInfo){
    		var listServer = this.getListServerByKindID(key);
    		if(listServer){
    			for(var i=0; i<listServer.length; i++){
    				var server = listServer[i];
    				if(serverId == server.wServerID){
    					server.dwOnLineCount = onLineCount;
    					break;
    				}
    			}
    		}
    	}
    },
    
    getListServerByKindID: function(kindID){
    	cc.log("getListServerByKindID = " + JSON.stringify(this.serverInfo));
    	return this.serverInfo[kindID];
    },
    
    getServerCountByKindID: function(kindID){
    	var count = 0;
    	
    	var server = this.getListServerByKindID(kindID);
    	
    	if(server){
    		count = server.length;
    	}
    	
    	return count;
    },
    
    getServerQuickGame: function(playerScore){
    	var serverInfo = null;
    	
    	var serverList = this.getListServerByKindID(this.curKindID);
    	
    	var maxScore = 0;
    	
    	for(var i=0; i<serverList.length; i++){
    		var minEnterScore = serverList[i].lMinEnterScore;
    		console.log(minEnterScore)
    		if(playerScore >= minEnterScore && minEnterScore > maxScore){
    			serverInfo = serverList[i];
    		}
    	}
    	
    	return serverInfo;
    },
    
    getGameCount: function(){
    	var count = 0;
    	var key;
    	for(key in this.serverInfo){
    		count++;
    	}
    	
    	return count;
    },
    setCreateRoomData: function(data){
    	this.curCreateRoomData = data;
    },
    getCreateRoomData: function(){
    	return this.curCreateRoomData;
    },
    setCurGameType: function(gameType){
    	cc.log("setCurGameType----"+gameType);
    	this.curGameType = gameType;
    },
    getCurGameType: function(){
    	return this.curGameType;
    },
    
    setCurKindID: function(kindID){
    	cc.log("-----------设置默认的游戏ID = " + kindID)
    	this.curKindID = kindID;

//    	var game = GameKindMgr.getInstance().getGame();
//    	ClientData.getInstance().setGame(game);
    },
    getCurKindID: function(){
    	return this.curKindID;
    },
    
    setLogonInsure: function(bLogonInsure){
    	this.bLogonInsure = bLogonInsure;
    },
    getLogonInsure: function(){
    	return this.bLogonInsure;
    },
    
    setInsureMd5Pass: function(insureMd5Pass){
    	this.insureMd5Pass = insureMd5Pass;
    },
    getInsureMd5Pass: function(){
    	return this.insureMd5Pass;
    },
});
