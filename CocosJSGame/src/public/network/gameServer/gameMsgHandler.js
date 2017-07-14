
var g_gameMsgHandler = null;
var GameMsgHandler = cc.Class.extend({

	ctor: function(){},
	
	//掉线
	onOffLine: function(){
		var runScene = cc.director.getRunningScene();
		if(runScene && runScene.isGameScene && runScene.isGameScene()){
			//回到大厅场景
			cc.log("-----掉线，大厅场景 <<<<");
			//GameKindMgr.getInstance().backPlazaScene();
		}else{
			UIMgr.getInstance().closeDlg(ID_DlgLoader);
		}
	},
	
	onConnectResult: function(bResult){
		PlazaUIMgr.getInstance().onConnectGameResult(bResult);
	},

	onMessage: function(msg){
		//cc.log("### GameMsgHandler onMessage() : msg = " + JSON.stringify(msg));
		var mainCmd = msg.mainCmd;
		var subCmd = msg.subCmd;
		var data = msg.data;
		
		//取消网络等待
		showWaiting(false);
		
		switch (mainCmd) {
			//登录命令 1
			case MDM_GR_LOGON:
				GameLogonMsg.getInstance().onMsgMainLogon(subCmd, data);
				break;
			//配置命令 2
			case MDM_GR_CONFIG:
				GameConfigMsg.getInstance().onMsgMainConfig(subCmd, data);
				break;
			//用户命令 3
			case MDM_GR_USER:
				GameUserMsg.getInstance().onMsgMainUser(subCmd, data);
				break;
			//状态命令
			case MDM_GR_STATUS:
				//不处理
				break;
			//框架命令 100 （包含比赛信息）
			case MDM_GF_FRAME:
				GameFrameMsg.getInstance().onMsgMainGameFrame(subCmd, data);
				break;
			//游戏命令 200
			case MDM_GF_GAME:
				var gameMsgMgr = GameMsgMgr.getInstance();
				if(gameMsgMgr){
					gameMsgMgr.onGameMsg(subCmd, data);
				}
				break;
			case MDM_GR_INSURE:					//银行命令
				GameUserInsureMsg.getInstance().onMsgMainUserInsure(subCmd, data);
				break;
			case MDM_GR_MATCH:					//比赛命令
				GameMatchMsg.getInstance().onMsgMainGameFrame(subCmd, data);
				break;
			//case MDM_GR_MANAGE:					//管理命令
				//return;
				//break;
			case MDM_CM_SYSTEM:					//系统命令
				if(subCmd == SUB_CM_SYSTEM_MESSAGE){
					var dataParser = new DataParser();
					dataParser.init(data);
					var parseData1 = dataParser.parse([
					                                   ["wType", "WORD"],  //消息类型
					                                   ["wLength", "WORD"],//消息长度
					                                   ]);

					var parseData2 = dataParser.parse([
					                                   ["szString", "TCHARS", parseData1.wLength],  //消息内容
					                                   ]);

					if( parseData2.szString.search(/抱歉，当前桌子不够请等待。还差/) != -1 ){
						DlgTip.openSysTip(parseData2.szString);
					}
				}
				
				
				break;
			case MDM_GR_TASK:	//任务命令
				GameTaskMsg.getInstance().onMsgMainGameTask(subCmd, data);
				break;

				//创建房间结果
			case MDM_GR_PERSONAL_TABLE:
				OpenRoomMsg.getInstance().onMsgMainPCMBOpenRoom(subCmd, data);
				break;

			//case MDM_KN_COMMAND:				//内核命令
				//return;
				//break;
			default:
				break;
		}
	},
});

GameMsgHandler.getInstance = function(){
	if(g_gameMsgHandler == null){
		g_gameMsgHandler = new GameMsgHandler();
	}
	return g_gameMsgHandler;
}