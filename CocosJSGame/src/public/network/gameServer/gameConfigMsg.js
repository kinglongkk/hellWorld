
var g_gameConfigMsg = null;
var GameConfigMsg = cc.Class.extend({

	ctor: function(){},
	
	//配置命令 2
	onMsgMainConfig: function(subCmd, data){
		switch (subCmd) {
		//列表配置 100
		case SUB_GR_CONFIG_COLUMN:
			this.onSubConfigColumn(data);
			break;
			//房间配置 101
		case SUB_GR_CONFIG_SERVER:
			this.onSubConfigServer(data);
			break;
			//道具配置 102
		case SUB_GR_CONFIG_PROPERTY:
			this.onSubConfigProperty(data);
			break;
			//配置完成 103
		case SUB_GR_CONFIG_FINISH:
			this.onSubConfigFinish(data);
			break;
			//玩家权限 104
		case SUB_GR_CONFIG_USER_RIGHT:
			this.onSubConfigUserRight(data);
			break;
		default:
			break;
		}
	},

	//列表配置 100
	onSubConfigColumn: function(data){
		cc.log("### 游戏服务器，列表配置 100");
		//服务端未发此消息
	},

	//房间配置 101
	onSubConfigServer: function(data){

		cc.log("parseData = " + JSON.stringify(data));
		var room = ClientData.getInstance().getRoom();
		if(room){
			room.initAllTable(data.TableCount, data.ChairCount);
			room.setServerType(data.ServerType);
		}
		
		PlazaUIMgr.getInstance().onConfigServer();
	},

	//道具配置 102
	onSubConfigProperty: function(data){
		cc.log("### 游戏服务器，（配置命令 ）道具配置 102");
		//服务端未发此消息
	},
	
	//配置完成 103
	onSubConfigFinish: function(data){
		cc.log("### 游戏服务器，（配置命令 ）配置完成 103");
		//配置完成
		//GameFrameMsg.getInstance().sendGameOption();
		
		PlazaUIMgr.getInstance().onConfigFinish();
	},
	
	//玩家权限 104
	onSubConfigUserRight: function(data){
		cc.log("### 游戏服务器，（配置命令 ）玩家权限 104");
		//服务端未发此消息
	},
});

GameConfigMsg.getInstance = function(){
	if(g_gameConfigMsg == null){
		g_gameConfigMsg = new GameConfigMsg();
	}
	return g_gameConfigMsg;
};