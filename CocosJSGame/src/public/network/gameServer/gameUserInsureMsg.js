
var g_gameUserInsureMsg = null;
var GameUserInsureMsg = cc.Class.extend({

	ctor: function(){},

	//用户命令 3
	onMsgMainUserInsure: function(subCmd, data){
		switch (subCmd) {
		/////////////////////////////用户状态////////////////////////////////
		//银行资料
		case SUB_GR_USER_INSURE_INFO:
			this.onSubUserInsureInfo(data);
			break;								
			//银行成功
		case SUB_GR_USER_INSURE_SUCCESS:
			this.onSubUserInsureSuccess(data);
			break;								
			//银行失败
		case SUB_GR_USER_INSURE_FAILURE:
			this.onSubUserInsureFailure(data);
			break;							
			//用户资料
		case SUB_GR_USER_TRANSFER_USER_INFO:
			this.onSubUserTransferUserInfo(data);
			break;
		default:
			break;
		}
	},

	//银行资料
	onSubUserInsureInfo: function(data){
		cc.log("### [GameUserInsureMsg] Insure Info!");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbActivityGame", "BYTE"],//游戏动作
		                                  ["wRevenueTake", "WORD"],//税收比例
		                                  ["wRevenueTransfer", "WORD"],//税收比例
		                                  ["wServerID", "WORD"],//房间标识
		                                  ["lUserScore", "INT64_NUMBER"],//用户金币
		                                  ["lUserInsure", "INT64_NUMBER"],//银行金币
		                                  ["lTransferPrerequisite", "INT64_NUMBER"],//转账条件
		                                  ]);

		cc.log("##### parseData = " + JSON.stringify(parseData));
		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理数据

		var insure = ClientData.getInstance().getInsure();
		if(insure){
			insure.setScoreInsure(parseData.lUserInsure);
			insure.setScoreGame(parseData.lUserScore);
		}
		
		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
		GameKindMgr.getInstance().getGameUIMgr().onGameUserInsureInfo();
	},
	
	//银行成功
	onSubUserInsureSuccess: function(data){
		cc.log("### [GameUserInsureMsg] User Insure Success!");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbActivityGame", "BYTE"],//游戏动作
		                                  ["lUserScore", "INT64_NUMBER"],//身上金币
		                                  ["lUserInsure", "INT64_NUMBER"],//银行金币
		                                  ["szDescribeString", "TCHARS", 128],//描述消息
		                                  ]);

		cc.log("##### parseData = " + JSON.stringify(parseData));
		
		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理数据
		var insure = ClientData.getInstance().getInsure();
		if(insure){
			insure.setScoreInsure(parseData.lUserInsure);
			insure.setScoreGame(parseData.lUserScore);
		}
		
		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
		var dlgTip = DlgTip.openSysTip(parseData.szDescribeString);
		if(dlgTip){
			dlgTip.setTitleFontSize(36);
			dlgTip.setTitleColor(cc.color(255, 0, 0));
			dlgTip.setContentColor(cc.color(255, 255, 0));
			dlgTip.setContentFontSize(30);
		}
		
		GameKindMgr.getInstance().getGameUIMgr().onGameUserInsureInfo();
	},
	
	//银行失败
	onSubUserInsureFailure: function(data){
		cc.log("### [GameUserInsureMsg] User Insure Failure!");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbActivityGame", "BYTE"],//游戏动作
		                                  ["lErrorCode", "DWORD"],//错误代码
		                                  ["szDescribeString", "TCHARS", 128],//描述消息
		                                  ]);

		cc.log("##### parseData = " + JSON.stringify(parseData));
				
		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理数据

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
		DlgTip.openSysTip(parseData.szDescribeString  + "error : " + parseData.ErrorCode);
	},
	
	//用户资料
	onSubUserTransferUserInfo: function(data){
		cc.log("### [GameUserInsureMsg] User Transfer User Info!");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbActivityGame", "BYTE"],//游戏动作
		                                  ["cbByNickName", "BYTE"],//目标用户
		                                  ["szNickName", "TCHARS", 32],//目标用户
		                                  ]);

		cc.log("##### parseData = " + JSON.stringify(parseData));
		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理数据

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
	},


	////////////////////////////// C->S ///////////////////////////////////////////////////////////////	
	//查询银行信息
	sendQueryInsureInfo: function(){
		var userId = g_objHero.getUserId();

		var dataBuilder = new DataBuilder();
		dataBuilder.init(1);
		dataBuilder.build([
		                   ["cbActivityGame", "BYTE", 1],//游戏动作
		                   ]);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_gameSocket.sendData(MDM_GR_INSURE, SUB_GR_QUERY_INSURE_INFO, dataBuilder.getData());
		}
	},
	
	//取出金币
	sendUserTakeScore: function(score, pass){
		var dataBuilder = new DataBuilder();
		dataBuilder.init(75);
		dataBuilder.build([
		                   ["cbActivityGame", "BYTE", 1],//游戏动作
		                   ["lTakeScore", "INT64_NUMBER", score],//取款数目
		                   ["szInsurePass", "TCHARS", pass, 33],//银行密码
		                   ]);
		
		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_gameSocket.sendData(MDM_GR_INSURE, SUB_GR_TAKE_GAME_SCORE_REQUEST, dataBuilder.getData());
		}
	},
});

GameUserInsureMsg.getInstance = function(){
	if(g_gameUserInsureMsg == null){
		g_gameUserInsureMsg = new GameUserInsureMsg();
	}
	return g_gameUserInsureMsg;
}