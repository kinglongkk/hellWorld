
var g_gameTaskMsg = null;
var GameTaskMsg = cc.Class.extend({

	ctor: function(){},

	//用户命令
	onMsgMainGameTask: function(subCmd, data){
		switch (subCmd) {
			//任务信息
		case SUB_GR_S_TASK_INFO:
			this.onSubTaskInfo(data);
			break;		
			//任务信息结束
		case SUB_GR_S_TASK_INFO_END:
			this.onSubTaskInfoEnd(data);
			break;		
			//完成任务
		case SUB_GR_S_TASK_COMPLETE:
			this.onSubTaskComplete(data);
			break;		
			//领取奖励成功
		case SUB_GR_S_TASK_REWARDS_SUCCESS:
			this.onSubTaskRewardsSuccess(data);
			break;		
			//领取奖励失败
		case SUB_GR_S_TASK_REWARDS_FAILURE:
			this.onSubTaskRewardsFailure(data);
			break;	
		default:
			break;
		}
	},
	
	//任务信息
	onSubTaskInfo: function(data){
		cc.log("### [GameTaskMsg] onSubTaskInfo!");
		
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["taskID", "DWORD"],//任务ID
		                                  ["userID", "DWORD"],//用户ID
		                                  ["typeID", "DWORD"],//任务类型
		                                  ["gameKindID", "DWORD"],//游戏类型
		                                  ["taskState", "DWORD"],//任务状态
		                                  ["startTime", "SYSTEMTIME"],//任务开始时间
		                                  ["data1", "DWORD"],//任务数据1
		                                  ["data2", "DWORD"],//任务数据2
		                                  ["data3", "LONGLONG"],//任务数据3
		                                  ]);

		cc.log("##### parseData = " + JSON.stringify(parseData));
		
		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理数据
		var task = ClientData.getInstance().getTask();
		if(task){
			task.addTaskInfo(parseData);
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
	},
	//任务信息结束
	onSubTaskInfoEnd: function(data){
		cc.log("### [GameTaskMsg] onSubTaskInfoEnd!");

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理数据
		var task = ClientData.getInstance().getTask();
		if(task){
			//task.saveTaskInfos();
			task.resetStartTime();
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
		var gameUIMgr = GameKindMgr.getInstance().getGameUIMgr();
		if(gameUIMgr){
			gameUIMgr.openDlgGameTask();
		}
		
	},
	//完成任务
	onSubTaskComplete: function(data){
		cc.log("### [GameTaskMsg] onSubTaskComplete!");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["userID", "DWORD"],//用户ID
		                                  ["typeID", "DWORD"],//任务类型
		                                  ["gameKindID", "DWORD"],//游戏类型
		                                  ]);

		cc.log("##### parseData = " + JSON.stringify(parseData));

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理数据
		var task = ClientData.getInstance().getTask();
		if(task){
			task.taskComplete(parseData.typeID, parseData.gameKindID);
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
		var gameUIMgr = GameKindMgr.getInstance().getGameUIMgr();
		if(gameUIMgr){
			gameUIMgr.onTaskComplete();
		}
	},
	//领取奖励成功
	onSubTaskRewardsSuccess: function(data){
		cc.log("### [GameTaskMsg] onSubTaskRewardsSuccess!");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["dwAddScore", "DWORD"],//增加欢乐豆
		                                  ["dwAddMbTicket", "DWORD"],//增加兑换券
		                                  ["szDescribeString", "TCHARS", 128],//描述消息
		                                  ]);

		cc.log("##### parseData = " + JSON.stringify(parseData));

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理数据
		var money = g_objHero.getMoney() + parseData.dwAddScore;
		g_objHero.setMoney(money);
		
		var ticket = g_objHero.getMbTicket() + parseData.dwAddMbTicket;
		g_objHero.setMbTicket(ticket);

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
		DlgTip.openSysTip(parseData.szDescribeString);
	},
	//领取奖励失败
	onSubTaskRewardsFailure: function(data){
		cc.log("### [GameTaskMsg] onSubTaskRewardsFailure!");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["lResultCode", "LONG"],//错误代码
		                                  ["szDescribeString", "TCHARS", 128],//描述消息
		                                  ]);

		cc.log("##### parseData = " + JSON.stringify(parseData));

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理数据

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
		DlgTip.openSysTip(parseData.szDescribeString);
	},

	////////////////////////////// C->S ///////////////////////////////////////////////////////////////	
	//请求任务信息
	sendTaskInfoRequest: function(){
		var dataBuilder = new DataBuilder();
		dataBuilder.init(0);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_gameSocket.sendData(MDM_GR_TASK, SUB_GR_C_TASK_INFO_REQUEST, dataBuilder.getData());
		}
	},

	//领取任务奖励
	sendGetTaskRewards: function(typeID, gameKindID){
		var userID = g_objHero.getUserId();
		var machineId = LocalStorageMgr.getInstance().getUuidItem();
		
		var dataBuilder = new DataBuilder();
		dataBuilder.init(78);
		dataBuilder.build([
		                   ["userID", "DWORD", userID],//用户ID
		                   ["typeID", "DWORD", typeID],//任务类型
		                   ["gameKindID", "DWORD", gameKindID],//游戏类型
		                   ["szMachineID", "TCHARS", machineId, 33],//机器标识
		                   ]);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_gameSocket.sendData(MDM_GR_TASK, SUB_GR_C_TASK_GET_REWARDS, dataBuilder.getData());
		}
	},
});

GameTaskMsg.getInstance = function(){
	if(g_gameTaskMsg == null){
		g_gameTaskMsg = new GameTaskMsg();
	}
	return g_gameTaskMsg;
}