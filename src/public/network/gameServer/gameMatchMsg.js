
var g_gameMatchMsg = null;
var GameMatchMsg = cc.Class.extend({

	ctor: function(){},

	//游戏框架命令
	onMsgMainGameFrame: function(subCmd, data){
		switch (subCmd) {
		//报名费用 400
		case SUB_GR_MATCH_FEE:
			this.onSubMatchFee(data);
			break;
			//等待人数401
		case SUB_GR_MATCH_NUM:
			this.onSubMatchNum(data);
			break;
			//比赛状态406
		case SUB_GR_MATCH_STATUS:
			this.onMatchStatus(data);
			break;
			//比赛描述408
		case SUB_GR_MATCH_DESC:
			this.onMatchDesc(data);
			break;
		default:
			break;
		}
	},
	
	//报名费用 400
	onSubMatchFee: function(data){
		cc.log("### [GameMatchMsg] onSubMatchFee()");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["dwMatchFee", "DWORD"]//比赛费用
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));
	},
	//等待人数401
	onSubMatchNum: function(data){
		cc.log("### [GameMatchMsg] onSubMatchNum()");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["dwWaitting", "DWORD"],//等待人数
		                                  ["dwTotal", "DWORD"]//开赛人数
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));
		
		var match = ClientData.getInstance().getMatch();
		if(match){
			match.setMatchWaitNum(parseData.dwWaitting);
			match.setMatchTotal(parseData.dwTotal);
		}
	},
	//比赛状态406
	onMatchStatus: function(data){
		cc.log("### [GameMatchMsg] onMatchStatus()");

		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["cbMatchStatus", "BYTE"]//比赛状态
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));
		
		var match = ClientData.getInstance().getMatch();
		match.setMatchStatus(parseData.cbMatchStatus);
	},
	//比赛描述408
	onMatchDesc: function(data){
		cc.log("### [GameMatchMsg] onMatchDesc()");
		
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  //用户属性
		                                  ["szTitle", "TCHARS[]", 4, 16],//信息标题
		                                  ["szDescribe", "TCHARS[]", 4, 64],//描述内容
		                                  ["crTitleColor", "DWORD"],//标题颜色
		                                  ["crDescribeColor", "DWORD"],//描述颜色
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));
		
		var match = ClientData.getInstance().getMatch();
		match.setMatchDesc(parseData);
	},

	////////////////////////////////// C->S /////////////////////////////////////////////////////

	//退出比赛
	sendLeaveMatch: function(){
		var dataBuilder = new DataBuilder();
		dataBuilder.init(0);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_gameSocket.sendData(MDM_GR_MATCH, SUB_GR_LEAVE_MATCH, dataBuilder.getData());
		}
	},
});

GameMatchMsg.getInstance = function(){
	if(g_gameMatchMsg == null){
		g_gameMatchMsg = new GameMatchMsg();
	}
	return g_gameMatchMsg;
}