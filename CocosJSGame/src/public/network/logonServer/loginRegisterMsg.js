
var g_loginRegisterMsg = null;
var LoginRegisterMsg = cc.Class.extend({
	ctor: function(){
	},
	
	onMsgMainPCLogon: function(subCmd, data){
		switch (subCmd) {
			//验证成功
			case SUB_GP_CHECK_SUCCESSS:
				this.onSubCheckSuccess(data);
				break;
			//验证失败
			case SUB_GP_CHECK_FAILURE:
				this.onSubCheckFailure(data);
				break;
			default:
				break;
		}
	},

	//登录
	onMsgMainMBLogon: function(subCmd, data){
		switch (subCmd) {
			//登录成功
			case SUB_MB_LOGON_SUCCESS:
				this.onSubLogonSuccess(data);
				break;
			//登录失败
			case SUB_MB_LOGON_FAILURE:
				this.onSubLogonFailure(data);
				break;
			default:
				break;
		}
	},

	//登录成功
	onSubLogonSuccess: function(data){
		var parseData = data
		cc.log("onSubLogonSuccess daparseData[ = " + JSON.stringify(parseData)+"]");
		g_objHero.setSpreaderID(parseData.szSpreader);
		g_objHero.setFaceId(parseData.wFaceID);
		g_objHero.setGender(parseData.cbGender);
		g_objHero.setUserId(parseData.dwUserID);
		g_objHero.setGameId(parseData.dwGameID);
		g_objHero.setNickName(parseData.szNickName);
		g_objHero.setMoney(parseData.lUserScore);
		g_objHero.setMbDiamond(parseData.dwMedal);
		g_objHero.setInsureMoney(parseData.lUserInsure);
		g_objHero.setExperience(parseData.dwExperience);
		g_objHero.setUnderWrite(parseData.szUnderWrite);
		g_objHero.setWinCount(parseData.dwWinCount);
		g_objHero.setLostCount(parseData.dwLostCount);
		g_objHero.setDrawCount(parseData.dwDrawCount);
		g_objHero.setFleeCount(parseData.dwFleeCount);
		g_objHero.setRegisterDate(parseData.RegisterDate);
		g_objHero.setMbTicket(parseData.dwMbTicket);
		g_objHero.setMbPayTotal(parseData.dwMbPayTotal);
		g_objHero.setMbVipLevel(parseData.dwMbVipLevel);
		g_objHero.setPayMbVipUpgrade(parseData.dwPayMbVipUpgrade);
		g_objHero.setRoomCard(parseData.lRoomCard);
		g_objHero.setHallNodeID(parseData.HallNodeID)
		//设置锁定信息
		g_objHero.setLockInfo({
			lRoomCard: parseData.lRoomCard,
			dwLockServerID: parseData.dwLockServerID,
			dwKindID: parseData.dwKindID,
			ServerIP : parseData.ServerIP,
		});
		
		LoginSceneUIMgr.getInstance().onLogonResult(true);
	},

	//登录失败
	onSubLogonFailure: function(data){
		var parseData = data
		cc.log("onSubLogonFailure parseData = " + JSON.stringify(parseData));
		DlgTip.openSysTip(parseData.DescribeString);
		
		LogonMsgHandler.getInstance().close();

		LoginSceneUIMgr.getInstance().onLogonResult(false);
	},
	
	//验证成功
	onSubCheckSuccess: function(data){
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["szDescribeString", "TCHARS", 128],//描述消息
		                                  ]);

		cc.log("验证成功parseData = " + JSON.stringify(parseData));
		DlgTip.openSysTip(parseData.szDescribeString);
	},
	
	//验证失败
	onSubCheckFailure: function(data){
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["lResultCode", "DWORD"],//错误代码
		                                  ["szDescribeString", "TCHARS", 128],//描述消息
		                                  ]);

		cc.log("验证失败parseData = " + JSON.stringify(parseData));
		DlgTip.openSysTip(parseData.szDescribeString);
	},
	
	///////////////////////////////////////////////////////////////////////////////S
	//检测账号
	sendCheckAccounts: function(data){
		//帐号登录
		var dataBuilder = new DataBuilder();
		dataBuilder.init(64);
		dataBuilder.build([
		                   ["szAccounts", "TCHARS", data.szAccounts, 32],//登录帐号
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_LOGON, SUB_GP_CHECK_ACCOUNTS, dataBuilder.getData());
		}
	},
	
	//登录
	sendLogon: function(account, md5Pass){
		var machineId = LocalStorageMgr.getInstance().getUuidItem();
		//test
		// this.sendMBRegister("xm1", "123456")
        // this.sendMBRegister("xm2", "123456")
        // this.sendMBRegister("xm3", "123456")
        // this.sendMBRegister("xm4", "123456")
        // this.sendMBRegister("xm5", "123456")
		g_logonSocket.sendData("C2L_Login", {
			ModuleID : 0,
			PlazaVersion : VERSION_MOBILE,
			DeviceType: DEVICE_TYPE,
			LogonPass:md5Pass,
			Accounts:account,
			MachineID : machineId,
			MobilePhone:LEN_MOBILE_PHONE + "",
		});
	},
	
	//注册
	sendMBRegister: function(account, password){
		var md5Pass = CryptoUtil.md5(password);
		var machineId = LocalStorageMgr.getInstance().getUuidItem();

		//记录注册账号和密码
		g_objHero.setAccount(account);
		g_objHero.setMd5Pass(md5Pass);

		g_logonSocket.sendData("C2L_Regist", {
			ModuleID : 0,
			PlazaVersion : VERSION_MOBILE,//广场版本
			DeviceType  : DEVICE_TYPE,//设备类型
			//密码变量
			LogonPass  : md5Pass, //登录密码
			szInsurePass  : md5Pass, //银行密码

			//注册信息
			FaceID  : 1, //头像标识
			Gender  : 1, //用户性别
			Accounts  : account, //登录帐号
			NickName  : account,//用户昵称

			//连接信息
			MachineID  : machineId, //机器标识
			MobilePhone  : "1222222222", //电话号码  //默认不获取本机号码
		});
	},
	
	//发送日志
	sendLog: function(logCode){
		return;

		LogonMsgHandler.getInstance().connect(function(){
			var userId = g_objHero.getUserId();
			
			cc.log("userId-"+userId+"-logCode-"+logCode);

			var dataBuilder = new DataBuilder();
			dataBuilder.init(5);
			dataBuilder.build([
			                   ["userId", "INT", userId],//用户昵称
			                   ["logCode", "BYTE", logCode],//
			                   ]);
			if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_MB_LOGON, SUB_MB_LOG , dataBuilder.getData());
			}
		});
		
		
	},
	
	sendMbPcRegister: function(data){
		var dataBuilder = new DataBuilder();
		dataBuilder.init(1147);
		dataBuilder.build([
		                   ["cbDeviceType", "BYTE", data.cbDeviceType],//设备类型
		                   //系统信息
		                   ["dwPlazaVersion", "DWORD", data.dwPlazaVersion],//广场版本
		                   ["szMachineID", "TCHARS", data.szMachineID, 33],//机器标识
		                   //注册信息
		                   ["szAccounts", "TCHARS", data.szAccounts, 32],//登录帐号
		                   ["cbGender", "BYTE", data.cbGender],//用户性别
		                   ["szLogonPass", "TCHARS", data.szLogonPass, 33],//登录密码
		                   ["szCompellation", "TCHARS", data.szCompellation, 16],//真实名字
		                   ["szPassPortID", "TCHARS", data.szPassPortID, 19],//证件号码
		                   ["szMobilePhone", "TCHARS", data.szMobilePhone, 12],//移动电话
		                   ["szQQ", "TCHARS", data.szQQ, 16],//qq
		                   ["szUnderWrite", "TCHARS", data.szUnderWrite, 32],//个性签名
		                   //
		                   ["szCountry", "TCHARS", data.szCountry, 20],//国家
		                   ["szProvince", "TCHARS", data.szProvince, 20],//省
		                   ["szCity", "TCHARS", data.szCity, 20],//市
		                   ["szPostCode", "TCHARS", data.szPostCode, 10],//邮编
		                   ["szAddress", "TCHARS", data.szAddress, 128],//地址
		                   ["szDegree", "TCHARS", data.szDegree, 14],//学历
		                   ["szEmail", "TCHARS", data.szEmail, 33],//邮箱
		                   ["szPHP", "TCHARS", data.szPHP, 33],//个人主页
		                   ["szSeatPhone", "TCHARS", data.szSeatPhone, 33],//固定电话
		                   ["szMSN", "TCHARS", data.szMSN, 33],//MSN
		                   //密码变量
		                   ["szInsurePass", "TCHARS", data.szInsurePass, 33],//银行密码
		                   //
		                   ["cbValidateFlags", "BYTE", data.cbValidateFlags],//校验标识
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_MB_LOGON, SUB_GP_MB_REGISTER_ACCOUNTS, dataBuilder.getData());
		}
	},
});

LoginRegisterMsg.getInstance = function(){
	if(g_loginRegisterMsg == null){
		g_loginRegisterMsg = new LoginRegisterMsg();
	}
	return g_loginRegisterMsg;
}