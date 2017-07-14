
var g_serverListMsg = null;
var ServerListMsg = cc.Class.extend({

	ctor: function(){},
	//PC房间列表
	onMsgMainPCServerList: function(subCmd, data){
		switch (subCmd) {
		//类型在线
		case SUB_GR_KINE_ONLINE:
			this.onKindOnline(data);
			break;
			//房间在线
		case SUB_GR_SERVER_ONLINE:
			this.onServerOnline(data);
			break;
		default:
			break;
		}
	},

	//手机房间列表
	onMsgMainMBServerList: function(subCmd, data){
		//列表信息
		switch (subCmd) {
		//种类列表
		case SUB_MB_LIST_KIND:
			this.onListKind(data);
			break;
			//房间列表
		case SUB_MB_LIST_SERVER:
			this.onListServer(data);
			break;
			//列表完成
		case SUB_MB_LIST_FINISH:
			this.onListFinish(data);
			break;
		default:
			break;
		}
	},

	/////////////////////////////////////////////////////////////////////
	//PC房间列表
	
	onKindOnline: function(data){
		cc.log("类型在线数据请求  --");
	},
	
	onServerOnline: function(data){
		cc.log("房间在线数据请求  --");
		var len = data.byteLength;
		var count = (len - 2) / 6;
		
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["wServerCount", "WORD"],//房间数目
		                                  //房间在线
		                                  ["OnLineInfoServer", "STRUCT[]", [
		                                                                    ["wServerID", "WORD"],//房间标识
		                                                                    ["dwOnLineCount", "DWORD"],//在线人数
		                                                                    ], count],
		                                  ]);
		
		cc.log("parseData = " + JSON.stringify(parseData));
		
		//更新在线数
		var plaza = ClientData.getInstance().getPlaza();
		if(plaza){
			for(var i=0; i<count; i++){
				var info = parseData.OnLineInfoServer[i];
				
				//在线数为: parseData.dwOnLineCount >>> 16
				var onLineCount = info.dwOnLineCount >>> 16;
				plaza.setServerOnlineByServerId(info.wServerID, onLineCount);
				
				//cc.log("在线： info.wServerID = " + info.wServerID + "  " + onLineCount);
			}
		}
		
		//断开链接
		LogonMsgHandler.getInstance().close();
	},
	/////////////////////////////////////////////////////////////////////
	//手机房间列表
	
	//种类列表
	onListKind: function(data){
		//服务端未处理
	},

	//房间列表
	onListServer: function(data){

	cc.log("房间列表" );

		var plaza = ClientData.getInstance().getPlaza();
		if(!plaza){
			return;
		}
		

		var dataParser = data;

		cc.log("### count = ", dataParser.length);
		var parseData = plaza.getServerInfo();;
		for(i in dataParser){
			var item = dataParser[i]
			//过滤（积分，比赛）类型
			var strSearch = item.szServerName;
			if( strSearch.search(/体验/) != -1 ){
				continue;
			}
			
			if( strSearch.search(/赛/) != -1 ){
				//continue;
			}
			
			if( strSearch.search(/积分/) != -1 ){
				//continue;
			}

			//按kindID分类
			var key = item.wKindID + "";
			if( !(key in parseData) || parseData[key] == null){
				parseData[key] = [];
			}

			//已经存在修改，不存在添加
			var bFind = false;
			for(var j=0; j<parseData[key].length; j++){
				if(item.wServerID == parseData[key][j].wServerID){
					parseData[key][j] = item;
					bFind = true;
					break;
				}
			}
			
			if(!bFind){
				parseData[key].push(item);
			}
		}
		
		//排序
		for(var id in parseData){
			parseData[id].sort(function(a, b){
				return a.wSortID - b.wSortID;
			});
		}

		cc.log("parseData = " + JSON.stringify(parseData));
		plaza.setServerInfo(parseData);
		
		LoginSceneUIMgr.getInstance().onListServer();
	},

	//列表完成
	onListFinish: function(data){
		cc.log("### 登录服务器， 列表命令，列表完成");
		//断开链接
		//LogonMsgHandler.getInstance().close();
		
		LoginSceneUIMgr.getInstance().onListFinish();
	},
	
	/////////////////////////////////////////////////////////////////////
	//更新在线数据请求
	sendUpdateOnLineReq: function(data){
		var size = 2 + 2 * data.wServerCount;
		
		var dataBuilder = new DataBuilder();
		dataBuilder.init(size);
		dataBuilder.build([
		                   ["wServerCount", "WORD", data.wServerCount],//房间数目
		                   ["wOnLineServerID", "WORD[]", data.wOnLineServerID, data.wServerCount],//房间标识
		                   ]);

		if(g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED){
			cc.log("data = " + JSON.stringify(data));
			cc.log("更新在线数据请求");
			g_logonSocket.sendData(MDM_GP_SERVER_LIST, SUB_GP_GET_ONLINE, dataBuilder.getData());
		}
	},
});

ServerListMsg.getInstance = function(){
	if(g_serverListMsg == null){
		g_serverListMsg = new ServerListMsg();
	}
	return g_serverListMsg;
}