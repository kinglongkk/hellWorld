var Table = cc.Class.extend({
    _chairCount: 5,

    ctor: function () {
        this.reset();
    },

    init: function(){
        this.tableID = tableInfo.tableID;
        this.baseScore = tableInfo.baseScore;
        this.minScore = tableInfo.minScore;
        this.maxScore = tableInfo.maxScore;
        
        //this.status = CONST.TableStatus.TABLE_STATUS_FREE;
    },

    reset: function(){
    	//游戏状态
    	this.gameStatus = GAME_STATUS_FREE;
    	//旁观
    	this.bAllowLookon = false;
    	
    	this.tableID = INVALID_TABLE;
    	this.baseScore = 1;
    	this.minScore = 0;
    	this.maxScore = 0;

    	this.players = [];
    },
    
    //游戏状态
    setGameStatus: function(gameStatus){
        cc.log("-----------设置桌子状态为：" + gameStatus + "--------------------------------")
    	this.gameStatus = gameStatus;
    },
    getGameStatus: function(){
    	return this.gameStatus;
    },

    //旁观
    setAllowLookon: function(bAllowLookon){
    	this.bAllowLookon = bAllowLookon;
    },
    getAllowLookon: function(){
    	return this.bAllowLookon;
    },
    
    startGame: function(){
    	var playersInfo = this.getGamePlayersInfo();
    	
    	var game = ClientData.getInstance().getGame();
    	if(game){
    		game.startGame(playersInfo);
    	}
    },

    getTableID: function(){
        return this.tableID;
    },

    setTableStatus: function(status){
        //this.status = status;
    },

    getTableStatus: function(){
        //return this.status;
    },

    getChairCount: function(){
        return this._chairCount;
    },

    clearPlayers: function(){
        this.players = [];
        cc.log("clearPlayers---");
    },

    getPlayers: function(){
        return this.players;
    },
    
    getPlayersBySortScore: function(){    	
    	//排序扑克
    	var players = this.players.slice(0);
    	players.sort(function(a,b){
    		var sub = b.getMoney() - a.getMoney();

    		return sub;
    	});
    	
    	return players;
    },

    getGamePlayersInfo: function(){
    	var playersInfo = [];

        for(var i=0; i<this.players.length; i++){
            var player = this.players[i];
            var status = player.getStatus();
            if(status == US_PLAYING || status == US_OFFLINE){
            	var chairId = player.getChairID();
            	var nick = player.getNickName();
            	var info = {
            			chairId: chairId,
            			nick: nick
            	};
            	playersInfo.push(info);
            }
        }

        return playersInfo;
    },

    getPlayerCount: function(){
        var gamePlayers = this.getGamePlayers();
        return gamePlayers.length;
    },

    addPlayer: function(player){
        //cc.log("addPlayer = " + JSON.stringify(player._playerInfo));
        var bFind = false;
        for(var idx in this.players){
            //cc.log("this.players[idx] = " + JSON.stringify(this.players[idx]._playerInfo));
        	if( this.players[idx].getUserId() == player.getUserId() ){
                bFind = true;
                this.players[idx] = player;
            }
        }
       // cc.log("addPlayer palyerCounts1111 = "+ this.getPlayers().length);
        if(!bFind){
            this.players.push(player);
            cc.log("----------------桌子加入了个玩家----：" + player.getUserId());
        }
        //cc.log("addPlayer palyerCounts222 = "+ this.getPlayers().length);
    },
    
    removePlayerByUserId: function(userId){
    	for(var idx in this.players){
    		if( this.players[idx].getUserId() == userId ){
    			this.players.splice(idx,1);
    			return true;
    		}
    	}

    	return false;
    },

    removePlayerByChairID: function(chairID){
        for(var idx in this.players){
            if( this.players[idx].getChairID() == chairID ){
                this.players.splice(idx,1);
                return true;
            }
        }

        return false;
    },

    removePlayerByPlayerID: function(playerID){
        for(var idx in this.players){
            if( this.players[idx].getPlayerID() == playerID ){
                this.players.splice(idx,1);
                //cc.log("removePlayerByPlayerID length=" + this.players.length);
                return true;
            }
        }

        return false;
    },

    removeOtherPlayer: function(){
        this.players = [];
        this.players.push(g_objHero);
    },
    
    getPlayerByUserId: function(userId){
    	var player = null;
    	for(var idx in this.players){
    		if( this.players[idx].getUserId() == userId ){
    			player = this.players[idx];
    		}
    	}

    	return player;
    },

    getPlayerByChairID: function(chairID){
        var player = null;
        for(var idx in this.players){
            if( this.players[idx].getChairID() == chairID ){
                player = this.players[idx];
            }
        }

        return player;
    },
    
    getPlayerByNick: function(nick){
    	var player = null;
    	for(var idx in this.players){
    		if( this.players[idx].getNickName() == nick ){
    			player = this.players[idx];
    		}
    	}

    	return player;
    },

    getPlayerByPlayerID: function(playerID){
        var player = null;
        for(var idx in this.players){
            if( this.players[idx].getPlayerID() == playerID ){
                player = this.players[idx];
            }
        }

        return player;
    },

    getChairIdByPlayerId: function(playerID){
        var player = this.getPlayerByPlayerID(playerID);
        if(player){
            return player.getChairID();
        }

        return null;
    },

    setPlayerStatus: function(playerId, status){
        var player = this.getPlayerByPlayerID(playerId);
        if(player){
            player.setStatus(status);
        }
    },

    getPlayerStatusByChairID: function(chairID){
        var playerStatus = null;

        var player = this.getPlayerByChairID(chairID);
        if(player){
            playerStatus = player.getStatus();
        }

        return playerStatus;
    },

    setPlayerMoney: function(playerId, money){
        var player = this.getPlayerByPlayerID(playerId);
        if(player){
            player.setMoney(money);
        }
    },

    getPlayerMoneyByChairID: function(chairID){
        var money = 0;
        var player = this.getPlayerByChairID(chairID);
        if(player){
            money = player.getMoney();
        }
        return money;
    },
});

