
var g_signInMsg = null;
var SignInMsg = cc.Class.extend({

	ctor: function(){},

	//签到
	onMsgMainPCMBSignIn: function(subCmd, data){
		switch (subCmd) {
		//签到信息
		case SUB_GP_MB_SIGN_IN_INFO:
			console.log("20170330签到信息");
			var myDate = new Date();
			console.log("签到信息返回的时间是 "+ myDate.toLocaleTimeString() + "毫秒：" + myDate.getMilliseconds());
			this.onSubSignInInfo(data);
			break;
			//签到结果
		case SUB_GP_MB_SIGN_IN_RESULT:
			console.log("20170330签到结果 ");
			this.onSubSignInResult(data);
			break;
		default:
			break;
		}
	},

	//签到信息
	onSubSignInInfo: function(data){
		cc.log('#######签到信息');
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["dwSignInCount", "DWORD"],//签到天数
		                                  //服务器时间
		                                  ["ServerTime", "STRUCT", [
		                                                            ["wYear", "WORD"],
		                                                            ["wMonth", "WORD"],
		                                                            ["wDayOfWeek", "WORD"],
		                                                            ["wDay", "WORD"],
		                                                            ["wHour", "WORD"],
		                                                            ["wMinute", "WORD"],
		                                                            ["wSecond", "WORD"],
		                                                            ["wMilliseconds", "WORD"]
		                                                            ]],
		                                                            ["dwSignInDays", "DWORD[]",31],
		                                                            ["dwSignInList", "DWORD[]",31]
		                                  ]);

		console.log("20170330获取到的签到信息: " + JSON.stringify(parseData));


		var ServerDate = parseData.ServerTime;	
		var SignDaystatus = parseData.dwSignInDays;
		var SignDaysgift = parseData.dwSignInList;
		var nServerDay = ServerDate.wDay;
		
		var dlgShare = UIMgr.getInstance().getDlg(ID_DlgSignIn);
		if(dlgShare == null){
			dlgShare = UIMgr.getInstance().openDlg(ID_DlgSignIn);
		}
		dlgShare.dwSignInDays = SignDaystatus;
		dlgShare.dwSignInGiftList = SignDaysgift;
		dlgShare.ServerTime = nServerDay;
		dlgShare.setNumberDaysStauts();

		//关闭连接
		LogonMsgHandler.getInstance().close();
	},

	//签到结果
	onSubSignInResult: function(data){
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["dwUserID", "DWORD"],//用户 I D
		                                  ["lUserScore", "SCORE"],//用户金币
		                                  //服务器时间
		                                  ["ServerTime", "STRUCT", [
		                                                            ["wYear", "WORD"],
		                                                            ["wMonth", "WORD"],
		                                                            ["wDayOfWeek", "WORD"],
		                                                            ["wDay", "WORD"],
		                                                            ["wHour", "WORD"],
		                                                            ["wMinute", "WORD"],
		                                                            ["wSecond", "WORD"],
		                                                            ["wMilliseconds", "WORD"]
		                                                            ]],
		                                                            ["lResultCode", "DWORD"],//操作代码，0成功
		                                                            ["szDescribeString", "TCHARS", 128],//描述消息
		                                                            ]);

		console.log("Server return parseData = " + JSON.stringify(parseData));



		//成功签到
		if(parseData.lResultCode == DB_SUCCESS){
			console.log("20170330签到成功====================....");

			var ServerDate = parseData.ServerTime;
			var nServerDay = ServerDate.wDay;
			console.log("服务器时间是"+nServerDay+"号，已经签到成功");
			//  改变今天签到状态
			var dlgShare = UIMgr.getInstance().getDlg(ID_DlgSignIn);
			dlgShare.setSomeDayStauts(nServerDay);
			dlgShare.setTextSuccessStatus(true);
			dlgShare.setTitleForSignOk();
			
			var money = parseData.lUserScore;
			g_objHero.setMoney(money);

			//只显示签到成功弹窗
            DlgTip.openSysTip(parseData.szDescribeString, function(target){

                target.closeTip();
            });
		}
		


		//关闭连接
		LogonMsgHandler.getInstance().close();

	},

	///////////////////////////////////////////////////////////////////////////////S
	//查询签到信息任务
	sendQuerySignInInfo: function(data){
		var dataBuilder = new DataBuilder();
		dataBuilder.init(5);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", data.dwUserID],//用户 I D
		                   ["cbDeviceType", "BYTE", data.cbDeviceType],//设备类型
		                   ]);

		cc.log("getSignInInfo data = " + JSON.stringify(data));
		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			cc.log("getSignInInfo data 1= " + JSON.stringify(data));
			g_logonSocket.sendData(MDM_GP_MB_SIGN_IN, SUB_GP_MB_QUERY_SIGN_IN_INFO, dataBuilder.getData());
		}
	},

	//签到
	sendSignIn: function(data){
		var dataBuilder = new DataBuilder();
		dataBuilder.init(71);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", data.dwUserID],//用户 I D
		                   ["cbDeviceType", "BYTE", data.cbDeviceType],//设备类型
		                   ["szMachineID", "TCHARS", data.szMachineID, 33],//机器序列
		                   ]);
		cc.log("SOCKET_STATUS._SS_CONNECTED = " + g_logonSocket.status);
		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_MB_SIGN_IN, SUB_GP_MB_SIGN_IN, dataBuilder.getData());
		}
	},
});

SignInMsg.getInstance = function(){
	if(g_signInMsg == null){
		g_signInMsg = new SignInMsg();
	}
	return g_signInMsg;
}