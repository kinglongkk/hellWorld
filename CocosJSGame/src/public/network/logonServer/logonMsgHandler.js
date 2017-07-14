var g_logonMsgHandler = null;
var LogonMsgHandler = cc.Class.extend({
	
	ctor: function(){
		this.callBacks = [];

		this.reConnectTimes = 0;
	},
	
	close: function(){
		g_logonSocket.close();
	},
	
	connect: function(cb){
		cc.log("at login connect ====== ")
		//已经链接
		if(g_logonSocket.status != SOCKET_STATUS._SS_INVALID){
			if(cb){
				cb();
			}
		}else{
			MsgMgr.getInstance().connectLogonServer(_CONFIG_.LOGON_IP, _CONFIG_.LOGON_PORT);
			this.callBacks.push(cb);
		}
	},
	
	//掉线
	onOffLine: function(){
		this.callBacks = [];
	},

	onConnectResult: function(bResult){
		//链接成功
		if(bResult){
			for(var i=0; i<this.callBacks.length; i++){
				var cb = this.callBacks[i];
				if(cb){
					cb();
				}
			}
			this.callBacks = [];
			this.reConnectTimes = 0;
		}else{
			if(this.reConnectTimes > 10){
				DlgTip.openTip(DLG_TIP_CFG.CONNECT_SERVER_FAILURE, function(target){
					target.closeTip();
					LoginSceneUIMgr.getInstance().onConnectFailure();
				});
			}else{
				MsgMgr.getInstance().connectLogonServer(_CONFIG_.LOGON_IP, _CONFIG_.LOGON_PORT);
				this.reConnectTimes++;
			}
		}
	},
	
	onMessage: function(msg){
		//cc.log("### LogonMsgHandler onMessage() : msg = " + JSON.stringify(msg));
		var mainCmd = msg.mainCmd;
		var subCmd = msg.subCmd;
		var data = msg.data;
		
		switch (mainCmd) {
			//----------------------------------PC------------------------------
			//登录	
			case MDM_GP_LOGON:
				LoginRegisterMsg.getInstance().onMsgMainPCLogon(subCmd, data);
				break;
			//列表命令	
			case MDM_GP_SERVER_LIST:
				ServerListMsg.getInstance().onMsgMainPCServerList(subCmd, data);
				break;
			//-----------------------------手机-----------------------------------
			//手机登录	
			case MDM_MB_LOGON:
				LoginRegisterMsg.getInstance().onMsgMainMBLogon(subCmd, data);
				break;
			//列表命令	
			case MDM_MB_SERVER_LIST:
				ServerListMsg.getInstance().onMsgMainMBServerList(subCmd, data);
				break;
			
			//用户服务命令
			case MDM_GP_USER_SERVICE:
				console.log("服务器返回数据长度："+mainCmd.byteLength);
				UserServerMsg.getInstance().onMsgMainGPUserServer(subCmd, data);
				break;
			//签到命令
			case MDM_GP_MB_SIGN_IN:
				SignInMsg.getInstance().onMsgMainPCMBSignIn(subCmd, data);
				break;
			//查询房间结果（房卡版）
			case MDM_MB_PERSONAL_SERVICE:
				EnterRoomMsg.getInstance().onMsgMainPCMBEnterRoom(subCmd, data);
				break;
            // 邮件
            case MDM_CS_MANAGER_SERVICE:
                PlazaMailMsg.getInstance().onMsgGetMailListRet(subCmd, data);
                break;

			// 商城
			case MDM_GP_PROPERTY:
				PlazaMallMsg.getInstance().onMsgMallRet(subCmd, data);
				break;
			default:
				break;
		}
	},
});

LogonMsgHandler.getInstance = function(){
	if(g_logonMsgHandler == null){
		g_logonMsgHandler = new LogonMsgHandler();
	}
	return g_logonMsgHandler;
}