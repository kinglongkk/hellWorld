
var g_gameLogonMsg = null;
var GameLogonMsg = cc.Class.extend({

	ctor: function(){},

	//登录命令
	onMsgMainLogon: function(subCmd, data){
		switch (subCmd) {
		//登录成功
		case SUB_GR_LOGON_SUCCESS:
			this.onSubLogonSuccess(data);
			break;
			//登录失败
		case SUB_GR_LOGON_FAILURE:
			this.onSubLogonFailure(data);
			break;
			//登录完成
		case SUB_GR_LOGON_FINISH:
			this.onSubLogonFinish(data);
			break;
			//升级提示
		case SUB_GR_UPDATE_NOTIFY:
			this.onSubUpdateNotify(data);
			break;
		default:
			break;
		}
	},

	//登录成功
	onSubLogonSuccess: function(data){
		cc.log("### 游戏服务器， （登录命令 ）登录成功");
		//服务端未发此消息
	},

	//登录失败
	onSubLogonFailure: function(data){
		cc.log("### 游戏服务器， （登录命令 ）登录失败");
		cc.log("parseData = " + JSON.stringify(data));
		
		//提示界面
		if(data && data.ResultCode && (9 == data.ResultCode || 5 == data.ResultCode))
		{
            var bRet =  GameFrameMsg.getInstance().onUserGameMsg({key: "G2C_LogonFailure", value: data})
			if (!bRet) {
                var strTip = "房间已不存在，确定返回大厅！"
                DlgTip.openSysTip(strTip, function(target){
                    target.closeTip();
                    GameKindMgr.getInstance().backPlazaScene();
                });
			}
		}
		else {
            DlgTip.openSysTip(data.DescribeString);
            //关闭游戏服务器
            // if (g_gameSocket.status != SOCKET_STATUS._SS_INVALID) {
            //     g_gameSocket.close();
            // }
			MsgMgr.getInstance().closeGameSocket()
        }
		
		PlazaUIMgr.getInstance().onLogonGameFailure();
	},

	//登录完成
	onSubLogonFinish: function(data){
		cc.log("----------------------游戏服务器，  （登录命令 ）登录完成----------------------");
		
		var status = g_objHero.getStatus();
		var serverType = null;
		var room = ClientData.getInstance().getRoom();
		if(room){
			serverType = room.getServerType();
		}
		
		var plaza = ClientData.getInstance().getPlaza();
		var roomOpType = plaza.getRoomOpType();
		
		//空闲状态
		if(status == US_FREE || status == US_NULL)
		{
			if( (serverType & GAME_GENRE_MATCH) == 0 &&
					(serverType & GAME_GENRE_PERSONAL) == 0){
				cc.log("空闲状态------sendUserChairReq--");
				GameUserMsg.getInstance().sendUserChairReq();
			}
		}
		else{
			do{
				var plaza = ClientData.getInstance().getPlaza();
				var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
				var roomOpType = plaza.getRoomOpType();
				if(curGameType==GAME_GENRE_PERSONAL && roomOpType==ROOM_OPERATION_CREATE){
					break;
				}
				
				// //重入
				// var tableID = g_objHero.getTableId();
				// if(tableID != INVALID_TABLE){
				// 	cc.log("重入------sendGameOption--");
				// 	GameFrameMsg.getInstance().sendGameOption();
				// }
			}while(false);
		}
		
		PlazaUIMgr.getInstance().onLogonFinish();
	},
	
	onSubUpdateNotify: function(data) {
		cc.log("### [GameServer], update notify!");		
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  //升级标志
		                                  ["cbMustUpdatePlaza", "BYTE"],//强行升级
		                                  ["cbMustUpdateClient", "BYTE"],//强行升级
		                                  ["cbAdviceUpdateClient", "BYTE"],//建议升级
		                                  //当前版本
		                                  ["dwCurrentPlazaVersion", "DWORD"],//当前版本
		                                  ["dwCurrentFrameVersion", "DWORD"],//当前版本
		                                  ["dwCurrentClientVersion", "DWORD"],//当前版本
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));
	},
	
	/////////////////////////////////////////////
	//登录游戏服务器
	sendLogon: function(){
		var account = g_objHero.getAccount();
		var userId = g_objHero.getUserId();
		var md5Pass = g_objHero.getMd5Pass();
		var behaviorFlags =(BEHAVIOR_LOGON_NORMAL|VIEW_MODE_PART);//BEHAVIOR_LOGON_NORMAL  BEHAVIOR_LOGON_IMMEDIATELY
		var kindID;
		var machineId = LocalStorageMgr.getInstance().getUuidItem();

		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			kindID = plaza.getCurKindID();
		}
		
		var gameVersion = 0;//GameKindMgr.getInstance().getGameVersion();
		
		cc.log("登录游戏服务器  kindID = " + kindID);
		cc.log("登录游戏服务器  version = " + gameVersion);
        var listServer = plaza.getListServerByKindID(kindID);
        var roomServerInfo = listServer[0];
        cc.log("aa ",  g_objHero.getHallNodeID())
		g_gameSocket.sendData("C2G_GR_LogonMobile",{
			HallNodeID:g_objHero.getHallNodeID(),
            GameID:	kindID,						//游戏标识
            KindID : kindID,					//
            ServerID : roomServerInfo.wServerID, //服务标识
            ProcessVersion:	gameVersion,			//进程版本

            //桌子区域
            DeviceType:	 DEVICE_TYPE,             //设备类型
            BehaviorFlags:behaviorFlags,          //行为标识
            PageTableCount:1,           //分页桌数

            //登录信息
            UserID: userId,		//用户 I D
            Password: md5Pass,	//登录密码
            MachineID: machineId,//机器标识
            
		});

	},	
});

GameLogonMsg.getInstance = function(){
	if(g_gameLogonMsg == null){
		g_gameLogonMsg = new GameLogonMsg();
	}
	return g_gameLogonMsg;
}