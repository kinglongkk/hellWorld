var g_logonMsgHandler = null;
var LogonMsgHandler = cc.Class.extend({

	ctor: function(){
		this.callBacks = [];

		this.reConnectTimes = 0;
	},

	close: function(){
		cc.log("------------------------ logon socket 断开连接------------------------")
		g_logonSocket.close();
	},

	connect: function(cb, bAdd){
		//已经链接
		if(g_logonSocket.status != SOCKET_STATUS._SS_INVALID){
			if(cb){
				cb();
			}
		}else{
			MsgMgr.getInstance().connectLogonServer(_CONFIG_.LOGON_IP, _CONFIG_.LOGON_PORT);
            this.callBacks.push(this.reLoginAcc.bind(this))
			if (bAdd)
			{
                this.callBacks.push(cb);
			}
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

        var cmd_describes = {
            100 : "手机登录 100",
            101 : "列表命令 101",
            3 : "用户服务命令 3",
            200 : "签到命令 200",
            201 : "查询房间结果 201",
            5: "邮件命令 5",
            6 : "商城命令 6",
        }

        var describe = cmd_describes[mainCmd]
        if (!describe)
        {
            describe = "未说明"
        }
        cc.log("-------接收logon服务器（主命令）命令号： mainCmd = " +mainCmd + " :" + describe + " -------------")
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

	// 登陆帐号后的所有指令发送用这个API
	send:function (protocolId, data, bPush) {
		var curProtocolId = protocolId
		var curData = data
		var bAdd = bPush && true
        this.connect(function () {
            if (g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED) {
                g_logonSocket.sendData(curProtocolId, curData);
            }
        }, !bAdd);
    },

    // 帐号登陆登录服务器
    reLoginAcc:function () {
        var account = g_objHero.getAccount()
        var md5Pass = g_objHero.getMd5Pass();
        var machineId = LocalStorageMgr.getInstance().getUuidItem();
        this.send("C2L_Login", {
            ModuleID : 0,
            PlazaVersion : VERSION_MOBILE,
            DeviceType: DEVICE_TYPE,
            LogonPass:md5Pass,
            Accounts:account,
            MachineID : machineId,
            MobilePhone:LEN_MOBILE_PHONE + "",
		}, false);

    },
});

LogonMsgHandler.getInstance = function(){
	if(g_logonMsgHandler == null){
		g_logonMsgHandler = new LogonMsgHandler();
	}
	return g_logonMsgHandler;
}