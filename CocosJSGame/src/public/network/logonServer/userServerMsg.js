var g_userServerMsg = null;
var UserServerMsg = cc.Class.extend({

	ctor: function(){
		this.operateTag = null;
		this.operateData = null;
		this.touchSender = null;

		// 查询玩家信息回调
		this.cbQueryIndividual = null;
	},

	setOperate: function(tag, data){
		this.operateTag = tag;
		this.operateData = data;
	},
	clearOperate: function(){
		this.operateTag = null;
		this.operateData = null;
	},
	getOperateTag: function(){
		return this.operateTag;
	},
	getOperateData: function(){
		return this.operateData;
	},

	// 服务命令
	onMsgMainGPUserServer: function(subCmd, data){

		cc.log("---------收到logon服务器的服务命令： "+subCmd);
		switch (subCmd) {
		// 修改头像
		case SUB_GP_USER_FACE_INFO:
			this.onSubUserFaceInfo(data);
			break;
		// 银行资料
		case SUB_GP_USER_INSURE_INFO:
			this.onSubUserInsureInfo(data);
			break;
			// //银行成功
		case SUB_GP_USER_INSURE_SUCCESS:
			this.onSubUserInsureSuccess(data);

			break;
			// 银行失败
		case SUB_GP_USER_INSURE_FAILURE:
			this.onSubUserInsureFailure(data);
			break;
			// 转账用户信息
		case SUB_GP_QUERY_USER_INFO_RESULT:
			this.onQueryUserInfoResult(data);
			break;
			// 用户转账记录
		case SUB_GP_USER_INSURE_LOG_RESULT:
			this.onSubUserInsureLogResult(data);
			break;
			// 用户转账记录查询完成 411
		case SUB_GP_USER_INSURE_LOG_RESULT_END:
			this.onSubUserInsureLogEnd(data);
			break;
			// 任务信息
		case SUB_GP_S_USER_TASK_INFO:
			this.onSubUserTaskInfo(data);
			break;
			// 任务信息结束
		case SUB_GP_S_USER_TASK_INFO_END:
			this.onSubUserTaskInfoEnd(data);
			break;
			// 定时礼包信息
		case SUB_GP_S_TIMING_GIFT_INFO:
			this.onSubTimingGiftInfo(data);
			break;
			// 定时礼包信息结束
		case SUB_GP_S_TIMING_GIFT_INFO_END:
			this.onSubTimingGiftInfoEnd(data);
			break;
			// 操作成功 900
		case SUB_GP_OPERATE_SUCCESS:
			this.onSubOperateSuccess(data);
			break;
			// 操作失败 901
		case SUB_GP_OPERATE_FAILURE:
			this.onSubOperateFailure(data);
			break;
			// 点卡充值成功
		case SUB_GP_USER_POINT_CARD:
			this.onSubUserPointCard(data);
			break;
			// 个人资料（查询玩家信息返回数据）
		case SUB_MB_S_USER_INDIVIDUAL:
			this.onSubUserIndividual(data);
			break;
			// 领取低保 sxh add
		case SUB_GP_BASEENSURE_RESULT:
			this.onSubBaseEnsureResult(data);
			break;
			// 首冲 sxh add
		case SUB_GP_FIRST_PAY:
			this.onSubFirstPay(data);
			break;
			// 分享获取金币 sxh add
		case SUB_GP_SHARE_AWARD:
			this.onSubShareAward(data);
			break;

		default:
			break;
		}

		if(this.touchSender!=null){
			this.touchSender.setTouchEnabled(true)
		}
	},

	// 修改头像
	onSubUserFaceInfo: function(data){
		cc.log("### 游戏服务器，服务命令 ，修改头像");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wFaceID", "WORD"],// 头像标识
		                                  ["dwCustomID", "DWORD"],// 自定索引
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		g_objHero.setFaceId(parseData.wFaceID);

		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
		PlazaUIMgr.getInstance().onModifyFace();

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	// 银行资料
	onSubUserInsureInfo: function(data){
		cc.log("### 游戏服务器，服务命令 ，银行资料");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wRevenueTake", "WORD"],// 取钱税收比例
		                                  ["wRevenueTransfer", "WORD"],// 转账税收比例
		                                  ["wServerID", "WORD"],// 房间标识
		                                  ["lUserScore", "INT64_NUMBER"],  // 用户金币
		                                  ["lUserInsure", "INT64_NUMBER"],  // 银行金币
		                                  ["lTransferPrerequisite", "INT64_NUMBER"],  // 转账条件
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		g_objHero.setMoney(parseData.lUserScore);
		g_objHero.setInsureMoney(parseData.lUserInsure);

		var insure = ClientData.getInstance().getInsure();
		if(insure){
			insure.setRevenueTake(parseData.wRevenueTake);
			insure.setRevenueTransfer(parseData.wRevenueTransfer);
			insure.setGiveLimit(parseData.lTransferPrerequisite);
		}

		//if(g_logonSocket.status != SOCKET_STATUS._SS_INVALID){
			//g_logonSocket.close();
		//}

		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
		PlazaUIMgr.getInstance().updateInsureInfo();
	},

	// 银行成功
	onSubUserInsureSuccess: function(data){
		cc.log("### 游戏服务器，服务命令 ，银行成功");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["dwUserID", "DWORD"],// 用户 I D
		                                  ["lUserScore", "INT64_NUMBER"],  // 原来游戏币
		                                  ["lUserInsure", "INT64_NUMBER"],// 原来银行金币
		                                  ["szDescribeString", "TCHARS", 128],// 描述消息
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		g_objHero.setMoney(parseData.lUserScore);
		g_objHero.setInsureMoney(parseData.lUserInsure);

		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
		var dlgTip = DlgTip.openSysTip(parseData.szDescribeString);
		if(dlgTip){
			dlgTip.setTitleFontSize(36);
			dlgTip.setTitleColor(cc.color(255, 0, 0));
			dlgTip.setContentColor(cc.color(255, 255, 0));
			dlgTip.setContentFontSize(30);
		}

		PlazaUIMgr.getInstance().updateInsureInfo();

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	// 银行失败
	onSubUserInsureFailure: function(data){
		cc.log("### 游戏服务器，服务命令 ，银行失败");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["lResultCode", "DWORD"],// 错误代码
		                                  ["szDescribeString", "TCHARS", 128],// 描述消息
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////

		DlgTip.openSysTip(parseData.szDescribeString);

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	// 转账用户信息
	onQueryUserInfoResult: function(data){
		cc.log("### 游戏服务器，服务命令 ，转账用户信息");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["dwTargetGameID", "DWORD"],// 目标用户
		                                  ["szNickName", "TCHARS", 32],// 目标用户
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
		PlazaUIMgr.getInstance().onTransferScore(parseData.szNickName, parseData.dwTargetGameID);

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	// 用户转账记录 410
	onSubUserInsureLogResult: function(data){
		cc.log("### 游戏服务器，服务命令 ，用户转账记录 410");
		var len = data.byteLength;
		var count = len / 172;

		var dataParser = new DataParser();
		dataParser.init(data);

		cc.log("### count = " + count);
		for(var i=0; i<count; i++){
			var parseData = dataParser.parse([
			                                  ["dwRecordID", "DWORD"],// ID
			                                  ["dwSourceGameID", "DWORD"],// 赠送用户ID
			                                  ["szSourceNickName", "TCHARS", 32],// 赠送用户昵称
			                                  ["dwTargetGameID", "DWORD"],// 获赠用户ID
			                                  ["szTargetNickName", "TCHARS", 32],// 获赠用户昵称
			                                  ["lSwapScore", "INT64_NUMBER"],  // 用户游戏币
			                                  ["lRevenue", "INT64_NUMBER"],  // 税收
			                                  // 赠送时间
			                                  ["time", "STRUCT", [
			                                                      ["wYear", "WORD"],
			                                                      ["wMonth", "WORD"],
			                                                      ["wDayOfWeek", "WORD"],
			                                                      ["wDay", "WORD"],
			                                                      ["wHour", "WORD"],
			                                                      ["wMinute", "WORD"],
			                                                      ["wSecond", "WORD"],
			                                                      ["wMilliseconds", "WORD"],
			                                                      ]],
			                                                      ]);


			var insure = ClientData.getInstance().getInsure();
			if(insure){
				insure.addTransferRecord(parseData);
			}
		}

		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
		PlazaUIMgr.getInstance().onUpdateRecord();
	},

	// 用户转账记录查询完成 411
	onSubUserInsureLogEnd: function(data){
		cc.log("### 游戏服务器，服务命令 ，用户转账记录查询完成 411");

		// /////////////////////////////////先数据处理//////////////////////////////////////////

		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////

	},

	// 任务信息
	onSubUserTaskInfo: function(data){
		cc.log("### 游戏服务器，服务命令 ，任务信息");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["taskID", "DWORD"],// 任务ID
		                                  ["userID", "DWORD"],// 用户ID
		                                  ["typeID", "DWORD"],// 任务类型
		                                  ["gameKindID", "DWORD"],// 游戏类型
		                                  ["taskState", "DWORD"],// 任务状态
		                                  ["startTime", "SYSTEMTIME"],// 任务开始时间
		                                  ["data1", "DWORD"],// 任务数据1
		                                  ["data2", "DWORD"],// 任务数据2
		                                  ["data3", "LONGLONG"],// 任务数据3
		                                  ]);

		cc.log("##### parseData = " + JSON.stringify(parseData));

		// //////////////////////////////////////////////////////////////////////////////////////////////////
		// 处理数据
		var task = ClientData.getInstance().getTask();
		if(task){
			task.addTaskInfo(parseData);
		}


		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
	},

	// 任务信息结束
	onSubUserTaskInfoEnd: function(data){
		cc.log("### 游戏服务器，服务命令 ，任务信息结束");

		// /////////////////////////////////先数据处理//////////////////////////////////////////

		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
		PlazaUIMgr.getInstance().onUserTaskInfoEnd();

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	// 定时礼包信息
	onSubTimingGiftInfo: function(data){
		cc.log("### 游戏服务器，服务命令 ，定时礼包信息");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["dwTimingId", "DWORD"],//
		                                  ["dwStartTime", "DWORD"],// 定时开始时间（当天：小时*3600+分钟*60+秒）
		                                  ["dwEndTime", "DWORD"],// 定时结束时间（当天：小时*3600+分钟*60+秒）
		                                  ["dwAddScore", "DWORD"],// 奖励金币
		                                  ["dwCurTime", "DWORD"],// 当前服务器时间（当天：小时*3600+分钟*60+秒）
		                                  ["dwState", "DWORD"],// 领取状态，0未领取
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		var timingGiftInfo = ClientData.getInstance().getTimingGiftInfo();
		timingGiftInfo.setTimingGiftInfo(parseData);
		timingGiftInfo.setServerTime(parseData.dwCurTime);
		timingGiftInfo.resetClientStartTime();

		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
	},

	// 定时礼包信息End
	onSubTimingGiftInfoEnd: function(data){
		cc.log("### 游戏服务器，服务命令 ，定时礼包信息End");

		// /////////////////////////////////先数据处理//////////////////////////////////////////

		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
		PlazaUIMgr.getInstance().onTimingGiftInfoEnd();

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	// 操作成功 900
	onSubOperateSuccess: function(data){
		cc.log("### 游戏服务器，服务命令 ，操作成功 900");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["lResultCode", "DWORD"],// 错误代码
		                                  ["szDescribeString", "TCHARS", 128],// 描述消息
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		var bOpenTip = true;

		// 操作
		var operateTag = this.getOperateTag();
		var operateData = this.getOperateData();

		switch (operateTag) {
		// 修改个性签名操作
		case SUB_GP_MODIFY_UNDER_WRITE:
			g_objHero.setUnderWrite(operateData);
			break;
		// 修改昵称
		case SUB_GP_MODIFY_NICK:
			g_objHero.setNickName(operateData);
			PlazaUIMgr.getInstance().onModifyNickSucc();
			break;
		// 修改性别
		case SUB_GP_MODIFY_GENDER:
			g_objHero.setGender(operateData);
			break;
		// 登陆保险柜成功
		case SUB_GP_USER_INSURE_LOGON:
			PlazaUIMgr.getInstance().onInsureLogonSuccess();

			bOpenTip = false;
			break;
		// 修改保险柜密码
		case SUB_GP_MODIFY_INSURE_PASS:
			var plaza = ClientData.getInstance().getPlaza();
			plaza.setInsureMd5Pass(operateData);
			break;
		// 领取任务奖励
		case SUB_GP_C_TASK_GET_REWARDS:
			PlazaUIMgr.getInstance().onGetTaskRewardsSuccess(operateData);
			break;
		// 领取定时礼包
		case SUB_GP_C_GET_TIMING_GIFT:
			var addScore = operateData;
			var money = g_objHero.getMoney();
			money += addScore;
			g_objHero.setMoney(money);
			break;
			// 修改身份（姓名、身份证）
		case SUB_GP_MODIFY_AUTH:
			PlazaUIMgr.getInstance().onModifyAuthSucc();
			break;
			// 修改密码
		case SUB_GP_MODIFY_LOGON_PASS:
			PlazaUIMgr.getInstance().onModifyLogonPassSucc();
			var md5Pass = operateData;
			g_objHero.setMd5Pass(md5Pass);
			break;
			// 手机验证（手机绑定）
		case SUB_GP_CHECK_MOBILE:
			var strMb = operateData[0];// 手机号码
			var cbBindMb = operateData[1];// 回调
			if(cbBindMb){
				cbBindMb(strMb);
			}
			break;
			// 手机验证吗成功（手机绑定）
		case SUB_GP_GETMOBILE_VALIDATE:
			// 可进行手机绑定操作
			var cbGetMbValidate = operateData;// 回调
			if(cbGetMbValidate){
				cbGetMbValidate();
			}
			break;
		default:
			break;
		}

		this.clearOperate();

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////

		if(parseData.szDescribeString != "" && bOpenTip){
			DlgTip.openSysTip(parseData.szDescribeString);
		}

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	// 操作失败 901
	onSubOperateFailure: function(data){
		cc.log("### 游戏服务器，服务命令 ，操作失败 901");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["lResultCode", "DWORD"],// 错误代码
		                                  ["szDescribeString", "TCHARS", 128],// 描述消息
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////

		this.clearOperate();

		DlgTip.openSysTip(parseData.szDescribeString);

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	// 点卡充值成功
	onSubUserPointCard: function(data){
		cc.log("### 游戏服务器，服务命令 ，点卡充值成功 418");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		    ["dwOprUserID", "DWORD"],// 操作用户ID
			["szCardID", "TCHARS", 32],// 充值卡号
			["szCardPwd", "TCHARS", 33],// 充值卡密码
			["szFillUserAccount", "TCHARS", 32],// 充值帐号
			["dwFillIp", "DWORD"],// 充值ip
			["cbResultCode", "BYTE"],// 204: 抱歉！您未绑定手机不能使用该充值卡，请先绑定手机！
			["szFillResult", "TCHARS", 128]// 充值结果
		]);

		cc.log("parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////
		// /////////////////////////////////后UI处理
		// //////////////////////////////////////////
		if(parseData.szFillResult != ""){
			if(parseData.cbResultCode == 204){
				// 抱歉！您未绑定手机不能使用该充值卡，请先绑定手机！
				DlgTip.openSysTip(parseData.szFillResult, function(target){
					// 打开绑定手机界面
					UIMgr.getInstance().openDlg(ID_DlgBind);
					target.closeTip();
				});
			}else{
				DlgTip.openSysTip(parseData.szFillResult);
			}
		}

		// 关闭连接
		LogonMsgHandler.getInstance().close();

		// 更新信息
		LogonMsgHandler.getInstance().connect(function(){
			UserServerMsg.getInstance().sendQueryInsureInfo();
		});
	},



	/**
	 * task 任务相关 sxh
	 */
	//
	onSubBaseEnsureResult: function(data){
		cc.log("### 领取低保解析");
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["bSuccessed", "BOOLEAN"],// 成功标识
		                                  ["lGameScore", "LONGLONG"],// 当前游戏币
		                                  ["szNotifyContent", "TCHARS", 128] // 提示内容
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		if(parseData.bSuccessed == true){ //成功处理
			g_objHero.setMoney(parseData.lGameScore);
		}

		// /////////////////////////////////先数据处理//////////////////////////////////////////

		// /////////////////////////////////后UI处理
		// 回调ui
		var cb = this.getOperateData();
		if(cb){
			cb(parseData.bSuccessed,parseData);
		}
		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	onSubFirstPay: function(data){
		cc.log("### first 首冲处理");
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["userID", "DWORD"],// 成功标识
		                                  ["Score", "LONGLONG"],// 当前游戏币
		                                  ["Medal", "DWORD"], // 提示内容
		                                  ["lResultCode", "LONG"], // 提示内容
		                                  ["szDescribeString", "TCHARS", 128], // 提示内容
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));

		if(parseData.lResultCode  == 0){ //成功处理
			g_objHero.setMoney(parseData.lGameScore);
		}

		// /////////////////////////////////先数据处理/////////////////////////////////////////

		// /////////////////////////////////后UI处理
		// 回调ui
		var cb = this.getOperateData();
		if(cb){
			cb(parseData);
		}

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},

	onSubShareAward: function(data){
		cc.log("### 分享获取金币回调函数");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["userID", "DWORD"],
		                                  ["Score", "LONGLONG"],// 最新金币
		                                  ["Medal", "DWORD"], // 最新钻石
		                                  ["lResultCode", "LONG"], // 操作代码，0成功
		                                  ["szDescribeString", "TCHARS", 128], // 描述消息
		                                  ]);
		if(parseData.lResultCode  == 0){ //成功处理
			g_objHero.setMoney(parseData.lGameScore);
		}
		cc.log("parseData = " + JSON.stringify(parseData));

		// /////////////////////////////////先数据处理//////////////////////////////////////////

		// /////////////////////////////////后UI处理
		// 回调
		var cb = this.getOperateData();
		if(cb){
			cb(parseData);
		}

		// 关闭连接
		LogonMsgHandler.getInstance().close();
	},


	// ///////////////////////////////////// C - > S
	// ///////////////////////////////////
	// 修改性别
	sendModifyGender: function(cbGender){
		var userId = g_objHero.getUserId();
		var pass = g_objHero.getMd5Pass();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(71);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["szPassword", "TCHARS", pass, 33],// 用户密码
		                   ["cbGender", "BYTE", cbGender],// 性别
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			UserServerMsg.getInstance().setOperate(SUB_GP_MODIFY_GENDER, cbGender);
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_MODIFY_GENDER, dataBuilder.getData());
		}
	},

	// 修改手机号码
	sendModifyMobilePhone: function(szMobilePhone){
		var userId = g_objHero.getUserId();
		var pass = g_objHero.getMd5Pass();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(94);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["szPassword", "TCHARS", pass, 33],// 用户密码
		                   ["szMobilePhone", "TCHARS", szMobilePhone, 12],// 手机号码
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_MODIFY_MOBILE_PHONE, dataBuilder.getData());
		}
	},

	// 修改身份
	sendModifyAuth: function(szCompellation, szPassPortId){
		var userId = g_objHero.getUserId();
		var pass = g_objHero.getMd5Pass();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(138);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["szPassword", "TCHARS", pass, 33],// 用户密码
		                   ["szPassPortId", "TCHARS", szCompellation, 16],// 真实名字
		                   ["szPassPortId", "TCHARS", szPassPortId, 18],// 身份证
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			UserServerMsg.getInstance().setOperate(SUB_GP_MODIFY_AUTH);
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_MODIFY_AUTH, dataBuilder.getData());
		}
	},

	// 修改密码
	sendModifyPassword: function(szDesPassword, szScrPassword){
		var userId = g_objHero.getUserId();
		var md5DesPass = CryptoUtil.md5(szDesPassword);
		var md5ScrPass = CryptoUtil.md5(szScrPassword);

		var dataBuilder = new DataBuilder();
		dataBuilder.init(136);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["szDesPassword", "TCHARS", md5DesPass, 33],// 用户密码
		                   ["szScrPassword", "TCHARS", md5ScrPass, 33],// 用户原密码
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			UserServerMsg.getInstance().setOperate(SUB_GP_MODIFY_LOGON_PASS, md5DesPass);
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_MODIFY_LOGON_PASS, dataBuilder.getData());
		}
	},

	// 修改头像
	sendModifyFaceId: function(faceId){
		var userId = g_objHero.getUserId();
		var pass = g_objHero.getMd5Pass();
		var machineId = LocalStorageMgr.getInstance().getUuidItem();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(138);
		dataBuilder.build([
		                   ["wFaceID", "WORD", faceId],// 头像标识
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["szPassword", "TCHARS", pass, 33],// 用户密码
		                   ["szMachineID", "TCHARS", machineId, 33],// 机器序列
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_SYSTEM_FACE_INFO, dataBuilder.getData());
		}
	},
	// 登录保险箱
	sendUserInsureLogon: function(szPassword){
		var userId = g_objHero.getUserId();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(70);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["szPassword", "TCHARS", szPassword, 33],// 用户密码
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			UserServerMsg.getInstance().setOperate(SUB_GP_USER_INSURE_LOGON);
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_USER_INSURE_LOGON, dataBuilder.getData());
		}
	},


	// 查询银行信息
	sendQueryInsureInfo: function(){
		cc.log("-------------查询银行信息");
		var userId = g_objHero.getUserId();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(4);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_QUERY_INSURE_INFO, dataBuilder.getData());
		}
	},

	// 查询用户
	sendQueryUserInfoReq: function(bByNick, strId){
		cc.log("bByNick = " + bByNick + "   strId = " + strId);
		var dataBuilder = new DataBuilder();
		dataBuilder.init(65);
		dataBuilder.build([
		                   ["cbByNickName", "BYTE", bByNick],// 昵称赠送
		                   ["szNickName", "TCHARS", strId, 32],// 目标用户
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_QUERY_USER_INFO_REQUEST, dataBuilder.getData());
		}
	},

	// 转账金币
	sendUserTransferScore: function(bByNick, strId, gold){
		var userId = g_objHero.getUserId();
		var plaza = ClientData.getInstance().getPlaza();
		var md5Pass = plaza.getInsureMd5Pass();
		var machineId = LocalStorageMgr.getInstance().getUuidItem();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(211);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["cbByNickName", "BYTE", bByNick],// 昵称赠送
		                   ["lTransferScore", "INT64_NUMBER", gold],// 转账金币
		                   ["wClientID", "WORD", 1],// 客户端ID
		                   ["szPassword", "TCHARS", md5Pass, 33],// 银行密码
		                   ["szNickName", "TCHARS", strId, 32],// 目标用户
		                   ["szMachineID", "TCHARS", machineId, 33],// 机器序列
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_USER_TRANSFER_SCORE, dataBuilder.getData());
		}
	},

	// 转账记录
	sendQueryTransferRecord: function(cbType, cbTime){
		var userId = g_objHero.getUserId();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(10);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["cbType", "BYTE", cbType],// 0:赠送和被赠送、1:赠送、2:被赠送
		                   ["cbTime", "BYTE", cbTime],// 0:最新100条记录、1:今天、2:7天
		                   ["dwPage", "DWORD", 0]// 分页，未用到
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			// 清空记录
			var insure = ClientData.getInstance().getInsure();
			if(insure){
				insure.clearRecords();
			}
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_USER_INSURE_LOG, dataBuilder.getData());
		}
	},

	// 存入金币
	sendUserSaveScore: function(gold){
		var userId = g_objHero.getUserId();
		var machineId = LocalStorageMgr.getInstance().getUuidItem();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(78);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["lSaveScore", "INT64_NUMBER", gold],// 存入金币
		                   ["szMachineID", "TCHARS", machineId, 33],// 机器序列
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_USER_SAVE_SCORE, dataBuilder.getData());
		}
	},

	// 取出金币
	sendUserTakeScore: function(gold){
		var userId = g_objHero.getUserId();
		var plaza = ClientData.getInstance().getPlaza();
		var md5Pass = plaza.getInsureMd5Pass();
		var machineId = LocalStorageMgr.getInstance().getUuidItem();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(144);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["lTakeScore", "INT64_NUMBER", gold],// 提取金币
		                   ["szPassword", "TCHARS", md5Pass, 33],// 银行密码
		                   ["szMachineID", "TCHARS", machineId, 33],// 机器序列
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_USER_TAKE_SCORE, dataBuilder.getData());
		}
	},

	// 修改保险柜密码
	sendModifyInsurePass: function(desPassword, scrPassword){
		var userId = g_objHero.getUserId();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(136);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["szDesPassword", "TCHARS", desPassword, LEN_PASSWORD],// 用户密码
		                   ["szScrPassword", "TCHARS", scrPassword, LEN_PASSWORD],// 用户密码
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			UserServerMsg.getInstance().setOperate(SUB_GP_MODIFY_INSURE_PASS, desPassword);
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_MODIFY_INSURE_PASS, dataBuilder.getData());
		}
	},

	// 加载任务
	sendQueryUserTask: function(){
		var userId = g_objHero.getUserId();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(4);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_C_QUERY_USER_TASK, dataBuilder.getData());
		}
	},

	// 领取任务奖励
	sendGetRewards: function(typeID, gameKindID){
		var userID = g_objHero.getUserId();
		var machineId = LocalStorageMgr.getInstance().getUuidItem();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(78);
		dataBuilder.build([
		                   ["userID", "DWORD", userID],// 用户ID
		                   ["typeID", "DWORD", typeID],// 任务类型
		                   ["gameKindID", "DWORD", gameKindID],// 游戏类型
		                   ["szMachineID", "TCHARS", machineId, 33],// 机器标识
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			var data = {
					typeID: typeID,
					gameKindID: gameKindID
			};
			UserServerMsg.getInstance().setOperate(SUB_GP_C_TASK_GET_REWARDS, data);
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_C_TASK_GET_REWARDS, dataBuilder.getData());
		}
	},


	// 请求定时礼包信息
	sendQueryTimingGiftInfo: function(){
		var userId = g_objHero.getUserId();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(4);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_C_QUERY_TIMING_GIFT_INFO, dataBuilder.getData());
		}
	},

	sendGetTimingGift: function(timingID, addScore){
		var userId = g_objHero.getUserId();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(8);
		dataBuilder.build([
		                   ["dwUserID", "DWORD", userId],// 用户 I D
		                   ["dwTimingId", "DWORD", timingID],//
		                   ]);

		cc.log('timingID = ' + timingID);
		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			UserServerMsg.getInstance().setOperate(SUB_GP_C_GET_TIMING_GIFT, addScore);
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_C_GET_TIMING_GIFT, dataBuilder.getData());
		}
	},

	// 点卡充值
	sendQueryPointCard: function(strCardId, strCardPwd){
		cc.log("-------------点卡充值");
		strCardPwd = CryptoUtil.md5(strCardPwd);
		var userId = g_objHero.getUserId();
		var strFillUserAccount = g_objHero.getAccount();
		var dwFillIp = "";
		var cbResultCode = "";
		var strFillResult = "";

		var dataBuilder = new DataBuilder();
		dataBuilder.init(459);
		dataBuilder.build([
		                   ["dwOprUserID", "DWORD", userId],// 操作用户ID
		                   ["szCardID", "TCHARS", strCardId, 32],// 充值卡号
		                   ["szCardPwd", "TCHARS", strCardPwd, 33],// 充值卡密码
		                   ["szFillUserAccount", "TCHARS", strFillUserAccount, 32],// 充值帐号
		                   ["dwFillIp", "DWORD", dwFillIp],// 充值ip
		                   ["cbResultCode", "BYTE", cbResultCode],//
		                   ["szFillResult", "TCHARS", strFillResult, 128]// 充值结果
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_USER_POINT_CARD, dataBuilder.getData());
		}
	},

    /**
     * sxh add start
     */
    // 领取低保 sxh
    sendBasicEnsureReq: function(cb){
        cc.log("1-------------领取低保");

        var userId = g_objHero.getUserId();
        var machineId = LocalStorageMgr.getInstance().getUuidItem();
        var dataBuilder = new DataBuilder();
        dataBuilder.init(70);
        dataBuilder.build([
            ["dwUserID", "DWORD", userId],// 用户 I D
            ["szMachineID[33]", "TCHARS", machineId, LEN_MACHINE_ID],// 机器标识
        ]);

        if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
            if (cb){
                UserServerMsg.getInstance().setOperate(SUB_GP_BASEENSURE_RESULT, cb);
            }
            cc.log("1-------------send SUB_GP_BASEENSURE_TAKE");
            g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_BASEENSURE_TAKE, dataBuilder.getData());
        }
    },

    // 今日首冲 sxh
    sendFirstPayReq: function(taskID,kindID,cb){
        cc.log("2-------------今日首冲");
        var userID = g_objHero.getUserId();
        var machineId = LocalStorageMgr.getInstance().getUuidItem();
        var dataBuilder = new DataBuilder();
        dataBuilder.init(4*3+33*2);
        dataBuilder.build([
            ["userID", "DWORD", userID], // 用户 I D
            ["taskID", "DWORD", taskID], // 暂时写死 0
            ["kindID", "DWORD", kindID], // 暂时写死 0
            ["szMachineID[33]", "TCHARS", machineId, LEN_MACHINE_ID],// 机器标识
        ]);

        if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){

            if(cb){
                UserServerMsg.getInstance().setOperate(SUB_GP_FIRST_PAY, cb);
            }
            g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_FIRST_PAY, dataBuilder.getData());
        }
    },

    // 微信分享获取金币 sxh
    sendWXShareOKReq: function(taskType,cb){
        cc.log("3-------------微信分享获取金币");
        var userId = g_objHero.getUserId();
        var machineId = LocalStorageMgr.getInstance().getUuidItem();
        var dataBuilder = new DataBuilder();
        dataBuilder.init(74);
        dataBuilder.build([
            ["userID", "DWORD", userId],// 用户 I D
            ["taskType", "DWORD", taskType], // 任务类型// 92邀请好友，93分享朋友圈
            ["szMachineID[33]", "TCHARS", machineId, LEN_MACHINE_ID],// 机器标识
        ]);

        if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
            if (cb){
                UserServerMsg.getInstance().setOperate(SUB_GP_SHARE_AWARD, cb);
            }
            g_logonSocket.sendData(MDM_GP_USER_SERVICE, SUB_GP_SHARE_AWARD, dataBuilder.getData());
        }
    },

    /**
     * sxh add end
     */
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 请求服务器当前时间
	sendServerTime: function () {
		LogonMsgHandler.getInstance().send("C2L_TimeSync", {});
    },
	// 获取验证码(绑定手机)
	sendGetMbValidate: function(PhoneNumber){
        cc.log("-------------获取验证码(绑定手机)");
        LogonMsgHandler.getInstance().send("C2L_ReqBindMaskCode", {"PhoneNumber":PhoneNumber});
	},
    // 获取验证码结果
    onGetMbValidateResult: function(data){
        cc.log("### 获取验证码结果");
        console.log("获取验证码结果 = " + JSON.stringify(data));
        // //请求获取验证号码返回
        // type L2C_ReqBindMaskCodeRsp struct {
        //     Code int //非0位失败
        // }
        if(data.Code==0){
            //验证码时间倒数
            var dlgUserInfo = UIMgr.getInstance().getDlg(ID_DlgUserInfo);
            if(dlgUserInfo==null){
                dlgUserInfo = UIMgr.getInstance().openDlg(ID_DlgUserInfo);
            }

            dlgUserInfo.doCountDown();
        }
        else{
            DlgTip.openSysTip("获取验证码 失败");
        }
    },
	// 修改个性签名
    sendModifyUnderWrite: function(strQianMing){
        cc.log("-------------修改个性签名");
        LogonMsgHandler.getInstance().send("C2L_ChangeSign", {
            Sign:strQianMing
        });
    },
    // 修改个性签名结果
    onModifyUnderWriteResult: function(data){
        cc.log("### 修改个性签名结果");
        console.log("修改个性签名结果 = " + JSON.stringify(data));
        // //修改个性签名结果
        // type L2C_ChangeSignRsp struct {
        //     Code int //非0w位失败
        // }
        if(data.Code==0){
            DlgTip.openSysTip("修改个性签名 成功");
        }
        else{
            DlgTip.openSysTip("修改个性签名 失败");
        }
    },

    // 修改昵称
    sendModifyNick: function(szNick){
        cc.log("-------------修改昵称");
        LogonMsgHandler.getInstance().send("C2L_ChangeUserName", {
            NewName:szNick
        });
    },
    // 修改昵称结果
    onModifyNickResult: function(data){
        cc.log("### 修改昵称结果--");
        console.log("修改昵称结果 = " + JSON.stringify(data));
        // //修改昵称结果
        // type L2C_ChangeUserNameRsp struct {
        //     Code int //非0w位失败
        // }
        if(data.Code==0){
            DlgTip.openSysTip("修改昵称 成功");
            g_objHero.setNickName(data.NewName);
        }
        else{
            DlgTip.openSysTip("修改昵称 失败");
        }
    },


	// 绑定手机
	sendBindMb: function(strPhone, strMaskCode){
		cc.log("-------------绑定手机");
        LogonMsgHandler.getInstance().send("C2L_SetPhoneNumber", {
            PhoneNumber:strPhone,
            MaskCode:Number(strMaskCode)
        });
	},
    // 绑定手机结果
    onBindMbResult: function(data){
        cc.log("### 绑定手机结果");
        console.log("绑定手机结果 = " + JSON.stringify(data));
        // //绑定手机结果
        // type L2C_SetPhoneNumberRsp struct {
        //     Code int //非0 位设置失败
        // }

        if(data.Code==0){
            DlgTip.openSysTip("绑定手机 成功", function(target){
                target.closeTip();
                var dlgUserInfo = UIMgr.getInstance().getDlg(ID_DlgUserInfo);
                if(dlgUserInfo){
                    dlgUserInfo.Panel_bindPhone.setVisible(false);
				}
			});
            var dlgUserInfo = UIMgr.getInstance().getDlg(ID_DlgUserInfo);
            if(dlgUserInfo){
                var Text_textIP = dlgUserInfo.Panel_playInfo.getChildByName('Text_textIP');
                Text_textIP.string.setVisible(true);
                Text_textIP.string = "IP:"+data.PhoneNumber;

            	if(dlgUserInfo.bindPhoneCB)
                	dlgUserInfo.bindPhoneCB();
			}
        }
        else{
            var strTip = LoadErrorCfg.getInstance().getStrErrTip(data.Code);
            DlgTip.openSysTip(strTip+data.Code);
        }
    },

    // 玩家被踢出
    onHallUserKickOut: function(data){

        cc.log("-------------L2C_KickOut游戏中玩家被踢出----------");
        var strTip = "";
		var reasonKickOut = data.Reason
    	if (data.Reason == 3) {
            strTip = "大厅游戏结束"  //游戏结束，关闭房间踢出房间
		}else if(data.Reason==1){
        	//服务器维护，请稍候再试
            strTip = "大厅服务器维护，请稍候再试";
		} else if(data.Reason==2) {
            //您的账号已在别处登录
            strTip = "您的账号已在别的大厅登录";
        }else if(data.Reason==4){
			//您的账号已在别处登录
			strTip = "非法链接大厅服";
		}else {
            strTip = "大厅服务器网络断了";
		}

        DlgTip.openSysTip(strTip, function(target){
            target.closeTip();
            //
			if( 1 ==reasonKickOut || 2 ==reasonKickOut || 4 == reasonKickOut) {
                GameKindMgr.getInstance().backLoginScene();
			}
          //  GameKindMgr.getInstance().backLoginScene();
        });
    },

    // 玩家被踢出
    onGameUserKickOut: function(data){

        cc.log("-------------G2C_KickOut 游戏中玩家被踢出----", JSON.stringify(data));
        var strTip = "";
		var bCloseGameSocket = false;
        var reasonKickOut = data.Reason
        if(data.Reason==1){
            //服务器维护，请稍候再试
            strTip = "服务器维护，请稍候再试";
            bCloseGameSocket = true;
        } else if(data.Reason==2) { // 账号已在别处登录
            //您的账号已在别处登录
            strTip = "您的账号已在别处登录";
            bCloseGameSocket = true;
        }
        else if (data.Reason == 3) {// 房间解散
            // strTip = "房间已解散"  //游戏结束，关闭房间踢出房间
            bCloseGameSocket = true;
        }
		else if(data.Reason==4){ // 非法链接游戏服
			//strTip = "非法链接游戏服";
			bCloseGameSocket = true;
        }else {
            strTip = "网络断了";
            return;
        }
        if(bCloseGameSocket)
        {
            cc.log("----------------断开了gameSocket 链接-----------")
            MsgMgr.getInstance().closeGameSocketForce(true)
        }
        if (0 < strTip.length) {
            DlgTip.openSysTip(strTip, function (target) {
                target.closeTip();
                switch (reasonKickOut) {
                    case 1:		// 服务器维护
                        GameKindMgr.getInstance().backLoginScene();
                        break;
                    case 2:		// 您的账号已在别处登录
                        GameKindMgr.getInstance().backLoginScene();
                        break;
                    // case 3:		// 房间已解散
                    // {
                    //     // GameKindMgr.getInstance().backPlazaScene();
                    //     // 关闭提示界面及隐藏再来一把的按钮
                    //     var dlgGameRecordCenter = UIMgr.getInstance().getDlg(ID_DlgGameRecordCenter);
                    //     if (dlgGameRecordCenter) {
                    //         dlgGameRecordCenter.reSetStartBtn();
                    //     }
                    //     else {
                    //         GameFrameMsg.getInstance().onUserGameMsg({key: "G2C_KickOut", value: data})
                    //     }
                    //     break;
                    // }
                    case 4:
                    default :	// 网络断了
                        break;
                }

                //
                //  GameKindMgr.getInstance().backLoginScene();
            });
        }
    },

	//设置推荐人ID
	setReferrerID:function(ReferrerID){
		this.ReferrerID = ReferrerID;
	},

	getReferrerID:function(){
		return 	this.ReferrerID;
	},

	IsSetReferrerID:function(IsSetReferrerID){
		this.IsReferrerID = IsSetReferrerID;
	},

	IsGetReferrerID:function(){
		return 	this.IsReferrerID;
	},

	// 房间解散了
    onRoomDissume:function (data) {
    	cc.log("--------------房间解散消息：" , JSON.stringify(data))
		// 如果这个同意、拒绝解散房间的界面还存在,就把它关闭
		var reason = data.Reason
		var tip = ""
        switch (reason) {
			case 0: //常规结束
                tip = "游戏结束， 房间已解散"
				break;
			case 1: //游戏解散 (限制的时间到了)
                tip = "游戏时间结束， 房间已解散"
				break;
            case 2: //玩家请求解散
				tip = "玩家请求解散房间成功， 房间已解散"
                break;
            case 3: //没开始就解散
                tip = "玩家长时间未开始游戏， 房间已解散"
                break;
			default:
            break;
    	}
        var roomMsgObj = OpenRoomMsg.getInstance()
		if (roomMsgObj) {
            roomMsgObj.onRoomDissume(data)
		}
        DlgTip.openSysTip(tip, function (target) {
            target.closeTip();
			var dlgGameRecordCenter = UIMgr.getInstance().getDlg(ID_DlgGameRecordCenter);
			if (dlgGameRecordCenter) {
				dlgGameRecordCenter.reSetStartBtn();
			}
			else {
				GameFrameMsg.getInstance().onUserGameMsg({key: "G2C_RoomDissume", value: data})
			}
			if (3 == reason)
			{
                GameKindMgr.getInstance().backPlazaScene();
			}
        });
    },

    // 设置推荐人
    sendSetElect: function(ElectUid){
        cc.log("-------------设置推荐人");
        LogonMsgHandler.getInstance().send("C2L_SetElect", {
            ElectUid:ElectUid
        });
    },
    // 设置推荐人结果
    onSetElectResult: function(data){
        cc.log("### 设置推荐人结果");
        console.log("设置推荐人结果 = " + JSON.stringify(data));
        // //设置推荐人结果
        // type L2C_SetElectResult struct {
        //     RetCode int // 0带表成功， 其他则是错误码
        // }
		if(data.RetCode==0){
			var IsGetReferrerID =UserServerMsg.getInstance().IsGetReferrerID();
			if(!IsGetReferrerID)
			{
				cc.log("设置推荐人 成功")
				UserServerMsg.getInstance().IsSetReferrerID(true);
				DlgTip.openSysTip("设置推荐人成功");
				var dlgUserInfo = UIMgr.getInstance().getDlg(ID_DlgUserInfo);
				if(dlgUserInfo && dlgUserInfo.setRecommenderCB){
					dlgUserInfo.setRecommenderCB();
				}
			}
		}
		else{
            DlgTip.openSysTip("设置推荐人失败");
			UIMgr.getInstance().closeDlg(ID_DlgUserInfo);
		}
    },

	// 查询玩家信息
	sendQueryIndividual: function(cb){
		cc.log("-------------查询玩家信息");
		this.cbQueryIndividual = cb;
        LogonMsgHandler.getInstance().send("C2L_User_Individual", {
            UserId:cb.dwUserID,
		});
	},
    // 个人资料（查询玩家信息返回数据）
    onSubUserIndividual: function(data){
        cc.log("### 个人资料（查询玩家信息返回数据） 301");
        var parseData = data;
        console.log("个人信息数据 = " + JSON.stringify(parseData));
		var MeUserID =g_objHero.getUserId();
		var UserID = parseData.UserID;
        var dlgUserInfo = UIMgr.getInstance().getDlg(ID_DlgUserInfo);
		if(MeUserID!=UserID && data.Sign == "")
		{
			cc.log("个人资料玩家签名为空")
			parseData.Sign ="这个人很懒，什么都没有留下";
		}
		dlgUserInfo.doReFresh(parseData);
        if(dlgUserInfo==null){
            dlgUserInfo = UIMgr.getInstance().openDlg(ID_DlgUserInfo);
        }
    },
    // 点赞
    sendClickZan: function(userID){
        cc.log("-------------点赞");
        LogonMsgHandler.getInstance().send("C2L_DianZhan", {UserID:userID});
    },
	//点赞结果
    onClickZanResult: function(data){
        console.log("点赞结果 = " + JSON.stringify(data));

        // //点赞结果
        // type C2L_DianZhanRsp struct {
        //     Star int //当前赞数
        // }
        DlgTip.openSysTip("您已成功点赞");
    },
	// 被别人点赞
    onBaStar: function (data) {
        console.log("被别人点赞 = " + JSON.stringify(data));
		// TODO 点赞功能已经完成,剩下表现效果,等待策划确定方案
    },
    // 续费 再来一局
    sendRestart: function(){
        cc.log("-------------续费 再来一局");
        LogonMsgHandler.getInstance().send("C2L_RenewalFees", {});
    },
    //续费 再来一局结果
    onRestartFail: function(data){
        console.log("续费失败 data = " + JSON.stringify(data));
        var strTip = LoadErrorCfg.getInstance().getStrErrTip(data.Code);
		DlgTip.openSysTip(strTip, function (target) {
			target.closeTip();
		});
		var dlgGameRecordCenter = UIMgr.getInstance().getDlg(ID_DlgGameRecordCenter);
		if(dlgGameRecordCenter) dlgGameRecordCenter.onRenew();
    },

	//发送领取奖励
	sendGetRewards: function(taskID){
        LogonMsgHandler.getInstance().send("C2L_DrawSahreAward", {
            DrawId:taskID
        });
	},

	onGetRewards: function(data){
        cc.log("领取奖励结果 = " + JSON.stringify(data));
        if(data.Code==0){
            DlgTip.openSysTip("领取奖励成功");
            var dlgGameWelfare = UIMgr.getInstance().getDlg(ID_DlgGameWelfare);
            if(dlgGameWelfare && dlgGameWelfare.getRewardCB){
                dlgGameWelfare.getRewardCB();
			}
		}
		else{
            DlgTip.openSysTip("领取奖励失败");
		}
        dlgGameWelfare.getRewardCB = null;
	},

	//获取任务信息
	sendC2L_ReqTimesInfo:function(){
        cc.log("获取任务信息----");
        LogonMsgHandler.getInstance().send("C2L_ReqTimesInfo", {});
	},
	onGetTaskInfo: function(data){
        // DayTimes  map[int]int64 //每日次数信息
        // Times     map[int]int64 //永久次数信息
        // WeekTimes map[int]int64 //周次数信息
        var dlgGameWelfare = UIMgr.getInstance().getDlg(ID_DlgGameWelfare);
        if(dlgGameWelfare){
            dlgGameWelfare.doGetTaskInfo(data);
		}
	},

	//接收公告
	onGeNotice: function(data){
        //Context string // 公告内容
        horseRaceLamp.getInstance().pushMsg(data.Context);
	},

	end: function(){}
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});


// //////////////////////////////////////////////////////////////////////////////////////////

UserServerMsg.getInstance = function(){
	if(g_userServerMsg == null){
		g_userServerMsg = new UserServerMsg();
	}
	return g_userServerMsg;
}
