var Room = cc.Class.extend({
    ctor: function () {
    	this.reset();
    },
    
    reset: function(){
    	this.curServer = null;
    	this.serverType = 0;
    	
    	this.tableCount = 0;
    	this.chairCount = 0;
    	this.listTable = [];
    	this.players = [];
    },
    
    setCurServer: function(server){
    	this.curServer = server;
    },
    getCurServer: function(){
    	return this.curServer;
    },
    
    initAllTable: function(tableCount, chairCount){
    	this.players = [];
    	
    	var table = ClientData.getInstance().getTable();
    	if(table){
    		table.reset();
    	}
    	
    	this.tableCount = tableCount;
    	this.chairCount = chairCount;
    	var i;
    	
    	//i: tableId
    	for(i=0; i<tableCount; i++){
    		this.listTable[i] = {
    				owner: INVALID_USERID,	//拥有者userId
    				tablePass: "",	//桌子密码
    		};
    	}
    },
    
    setServerType: function(type) {
    	this.serverType = type;
	},
	getServerType: function(){
		return this.serverType;
	},
    
    getTableCount: function(){
    	return this.tableCount;
    },
    
    getChairCount: function(){
    	return this.chairCount;
    },
    
    addPlayer: function(player){
    	if(!player){
    		return;
    	}
    	    	
    	var players = this.players;
    	var bFind = false;
    	
    	for(var i=0; i<players.length; i++){
    		if( players[i].getUserId() == player.getUserId() ){
    			bFind = true;
    			players[i] = player;
    		}
    	}

    	if(!bFind){
    		cc.log("push platyer ============== ",this.players, "1111", JSON.stringify(players))
    		players.push(player);
            cc.log("at addPlayer ", JSON.stringify(this.players))
    	}
    },

    
    getPlayersByTableId: function(tableId){
    	var players = [];
    	for(var i=0; i<this.players.length; i++){
    		if( this.players[i].getTableId() == tableId ){
    			players.push(this.players[i]);
    		}
    	}

    	return players;
    },

    
    removePlayerByChairID: function(chairId){
    	for(var i=0; i<this.players.length; i++){
    		if( this.players[i].getChairID() == chairID ){
    			this.players.splice(i,1);
    			return true;
    		}
    	}

    	return false;
    },
    
    /////////////////////////////////////房间玩家//////////////////////////////////////////////
    
    clearPlayers: function(){
    	trace()
    	this.players = [];
    	
    	//更新桌子玩家信息
    	var table = ClientData.getInstance().getTable();
    	if(table){
    		table.clearPlayers();
    	}
    },
    
    getPlayers: function(){
    	return this.players;
    },
    

    removePlayerByUserId: function(userId){
    	for(var idx in this.players){
    		if( this.players[idx].getUserId() == userId ){
    			this.players.splice(idx,1);
    			break;
    		}
    	}
    },
    
    getPlayerByUserId: function(userId){
    	cc.log("at getPlayerByUserId ========== ", this, JSON.stringify(this.players))
    	var player = null;
    	for(var idx in this.players){
    		cc.log("aaaaaaaaaaaaaaaa ", this.players[idx].getUserId(), userId)
    		if( this.players[idx].getUserId() == userId ){
    			player = this.players[idx];
    		}
    	}

    	return player;
    },
});