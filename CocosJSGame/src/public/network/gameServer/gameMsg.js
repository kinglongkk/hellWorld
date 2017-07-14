
var g_GameMsg = null;
var GameMsg = cc.Class.extend({

	ctor: function(){},
	
	//判断是否当前运行游戏
	isCurRunGame: function(){
		return false;
	},

	//游戏命令
	onGameMsg: function(subCmd, data){},

	//游戏场景消息
	onGameSceneMsg: function(data){},
});