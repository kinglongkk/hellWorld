//ZSocket API
// sendData  发送消息
// connect  连接socket
// close  关闭socket

var g_msgMgr = null;
var MsgMgr = cc.Class.extend({
	_socket_logon:null,
	_socket_game:null,
	_socket_msg:null,

	ctor:function(){
		//登录服务器socket==========
		var self = this;
		this._socket_logon = new ZSocket();
		this._socket_logon.status = SOCKET_STATUS._SS_INVALID;
		
		this._socket_logon.onConnect = function(params){
			cc.log(JSON.stringify(params));
			//params.result == 1 表示连接成功
			
			var bResult = false;
			if(params.result == 1){
				bResult = true;
			}

			LogonMsgHandler.getInstance().onConnectResult(bResult);
		};

		this._socket_logon.onMessage = function(params){
			//cc.log(JSON.stringify(params));
			//cc.log(params.data.byteLength);
			//TODO: 解析不同的消息====
			//TODO: 建立多个不同的XXXMsgHandler.js 分类处理
			
			LogonMsgHandler.getInstance().onMessage(params);

		};

		this._socket_logon.onStatusChanged = function(params){
			cc.mozStackSizing
			cc.log(JSON.stringify(params));
			//判断连接状态根据这个status为准
			
			//断开连接
			if(self._socket_logon.status != SOCKET_STATUS._SS_INVALID && params.status == SOCKET_STATUS._SS_INVALID){
				LogonMsgHandler.getInstance().onOffLine();
			}
			
			self._socket_logon.status = params.status;
		};
		
		//游戏服务器socket================
		this._socket_game = new ZSocket();
		this._socket_game.status = SOCKET_STATUS._SS_INVALID;
		
		
		this._socket_game.onConnect = function(params){
			cc.log(JSON.stringify(params));
			var bResult = false;
			if(params.result == 1){
				bResult = true;
			}
			
			GameMsgHandler.getInstance().onConnectResult(bResult);
			
			if(self.gameReConnectCallBack && params.result == 1){
				self.gameReConnectCallBack();
				//重连成功
				cc.log("-----重连成功--------");
			}
		};

		this._socket_game.onMessage = function(params){
			//cc.log(JSON.stringify(params));
			//cc.log(params.data.byteLength);
			
			GameMsgHandler.getInstance().onMessage(params);
		};

		this._socket_game.onStatusChanged = function(params){
			cc.log(JSON.stringify(params));
			
			//断开连接
			if(self._socket_game.status != SOCKET_STATUS._SS_INVALID && params.status == SOCKET_STATUS._SS_INVALID){
				//掉线
				cc.log("******掉线**********");

				GameMsgHandler.getInstance().onOffLine();
				//根据游戏需要通过游戏KindID进行设置
				var plaza = ClientData.getInstance().getPlaza();
				if (plaza.getCurKindID() === CMD_NIUNIU_TB.KIND_ID && g_objHero.getBackPlazaSign()) {
					//返回大厅
                    GameKindMgr.getInstance().backPlazaScene();
                    self._socket_game.status = params.status;
					return;
				}
				
				var runScene = cc.director.getRunningScene();
				if(!self.gameReConnectCallBack && runScene && runScene.isGameScene && runScene.isGameScene()){
                    //开启等待动画
					self.reConnectGameServer();
					//cc.log("******scheduleCallbackForTarget(self, self.reConnectGameServer()**********");
					//self.hInteval = setInterval(self.reConnectGameServer, 0.1);
					//cc.director.getScheduler().scheduleCallbackForTarget(self, self.reConnectGameServer, 0.1, true, 0, false);
					return;
				}
			}
			cc.log("******7777******params.status****"+params.status);
			self._socket_game.status = params.status;

			if (cc.sys.isNative) {
				if (cc.sys.os == cc.sys.OS_IOS) {
					return;
				}
			}
			if(self.gameReConnectCallBack && params.status == SOCKET_STATUS._SS_INVALID){
				cc.log("******7777******reConnectGameServer**1111");
				self.reConnectGameServer();
				cc.log("******7777******reConnectGameServer**2222");
			}
		};

		// 消息服务器socket===============
		this._socket_msg = new ZSocket();

		this._socket_msg.status = SOCKET_STATUS._SS_INVALID;

		this._socket_msg.onConnect = function(params){
			cc.log(JSON.stringify(params));
			//params.result == 1 表示连接成功

			var bResult = false;
			if(params.result == 1){
				bResult = true;
			}

			CmdHandler.getInstance().onConnectResult(bResult);
		};

		this._socket_msg.onMessage = function(params){
			//cc.log(JSON.stringify(params));
			//cc.log(params.data.byteLength);
			//TODO: 解析不同的消息====
			//TODO: 建立多个不同的XXXMsgHandler.js 分类处理

			CmdHandler.getInstance().onMessage(params);

		};

		this._socket_msg.onStatusChanged = function(params){
			cc.log(JSON.stringify(params));
			//判断连接状态根据这个status为准

			//断开连接
			if(self._socket_msg.status != SOCKET_STATUS._SS_INVALID && params.status == SOCKET_STATUS._SS_INVALID){
				CmdHandler.getInstance().onOffLine();
			}

			self._socket_msg.status = params.status;
		};
		
	},
	reConnectGameServer: function(dt){
		cc.log("--断开连接--onOffLine---");

		var plaza = ClientData.getInstance().getPlaza();
		plaza.setRoomOpType(ROOM_OPERATION_ADD);

		var kindId = plaza.getCurKindID();
		var listServer = plaza.getListServerByKindID(kindId);
		var roomServerInfo = listServer[0];

		var room = ClientData.getInstance().getRoom();
		if(room){
			room.setCurServer(roomServerInfo);
		}

		var ip = roomServerInfo.szServerAddr;
		var port = roomServerInfo.wServerPort;
		
		this._socket_game.close();
		cc.log("reConnectGameServer");
		this._socket_game.status = SOCKET_STATUS._SS_INVALID;
		this.connectGameServer(ip, port);
		
		if(!this.gameReConnectCallBack){
			cc.log("gameReConnectCallBack");
			var self = this;
			this.gameReConnectCallBack = function(){
				cc.log("unscheduleCallbackForTarget");
				clearInterval(self.hInteval);
				//cc.Director.getInstance().getScheduler().unscheduleCallbackForTarget(self, self.reConnectGameServer);
				GameLogonMsg.getInstance().sendLogon();
				self.gameReConnectCallBack = null;
				self.hInteval = null;
			};
		}
	},
	connectLogonServer:function(ip, port){
		if(this._socket_logon.status == SOCKET_STATUS._SS_INVALID){
			this._socket_logon.connect(ip, port);
		}
	},
	connectGameServer:function(ip, port){
		cc.log("connect---++status+"+this._socket_game.status);
		if(this._socket_game.status == SOCKET_STATUS._SS_INVALID){
			this._socket_game.connect(ip, port);
			cc.log("connect---+++");
		}
	},
	connectMsgServer:function(ip, port){
		if(this._socket_msg.status == SOCKET_STATUS._SS_INVALID){
			this._socket_msg.connect(ip, port);
		}
	},

	getLogonSocket:function(){
		return this._socket_logon;
	},
	getGameSocket:function(){
		return this._socket_game;
	},
	getMsgSocket:function(){
		return this._socket_msg;
	},
	//==============
	//工具函数
	stringToBuffer:function (strData) {
		if (!strData)
			return null;
		
		if(cc.sys.os == cc.sys.OS_WINDOWS){
			strData = MyUtil.utf8to16(strData);
		}

		var arrData = new Uint16Array(strData.length);
		for (var i = 0; i < strData.length; i++) {
			arrData[i] = strData.charCodeAt(i);
		}
		return arrData;
	},
	//关闭游戏kocket
	closeGameSocket: function(){
		//关闭游戏服务器
		if(this._socket_game.status != SOCKET_STATUS._SS_INVALID){
			this._socket_game.close();
		}
	},

	//关闭消息socket
	closeMsgSocket: function(){
		//关闭消息服务器
		if(this._socket_msg.status != SOCKET_STATUS._SS_INVALID){
			this._socket_msg.close();
		}
	},

	// ios关闭socket
	iosCloseSocket: function (nSocket) {
		if (nSocket & 0x01) {
			// 关闭游戏socket
			this.closeGameSocket();
		} else if (nSocket & 0x02) {
			// 关闭消息socket
			this.closeMsgSocket();
		} else if (nSocket & 0x04) {
			// 关闭登录socket
            if(this._socket_logon.status != SOCKET_STATUS._SS_INVALID){
                this._socket_logon.close();
            }
		}
    },

	// iOS网络状态改变
	iosNetWorkStatusChange: function (nSocket, nStatus) {

        if (nStatus == SOCKET_STATUS._SS_INVALID || nStatus == SOCKET_STATUS._SS_UNKNOWN) {
            // 未连接和未使用
			this.iosCloseSocket(nSocket);
			return;
        } else if (nStatus == SOCKET_STATUS._SS_CONNECTED) {
            // 已连接

        } else if (nStatus == SOCKET_STATUS._SS_CONNECTING) {
            // 连接中
        }

        cc.log("非掉线");
        var param = {"status" : nStatus};

        if (nSocket & 0x01) {
            // 游戏socket
            this._socket_game.status == nStatus;
            this.reConnectGameServer();
        } else if (nSocket & 0x02) {
            // 消息socket
            this._socket_msg.status == nStatus;
            if (this._socket_msg.onStatusChanged) {
                this._socket_msg.onStatusChanged(param);
            }
        } else if (nSocket & 0x04) {
            // 登录socket
            this._socket_logon.status == nStatus;
            if (this._socket_logon.onStatusChanged) {
                this._socket_logon.onStatusChanged(param);
            }
        }
    },
});

MsgMgr.getInstance = function(){
	if(g_msgMgr == null){
		//if (_CONFIG_.WS){
           g_msgMgr = new WSMsgMgr();
	//	}else {
          //  g_msgMgr = new MsgMgr();
		//}
	}
	return g_msgMgr;
}

var g_logonSocket = MsgMgr.getInstance().getLogonSocket();
var g_gameSocket = MsgMgr.getInstance().getGameSocket();
var g_msgSocket = MsgMgr.getInstance().getMsgSocket();

/*
var testb = 9999999999;
var dataBuilderb = new DataBuilder();
dataBuilderb.init(8);
dataBuilderb.writeInt64Number(testb);
var datab = dataBuilderb.getData()

var dataParserb = new DataParser();
dataParserb.init(datab);

var valueb = dataParserb.readInt64Buffer();
cc.log("======================== valueb = " + valueb);
var str = "";
for(var i=0; i<8; i++){
	str += valueb[i].toString(16);
}
cc.log("======================== valueb = " + str);
/////////////////////////////////////////////////////////
var testa = 9999999999;
var dataBuildera = new DataBuilder();
dataBuildera.init(8);
dataBuildera.writeInt64Number(testa);
var dataa = dataBuildera.getData()

var dataParsera = new DataParser();
dataParsera.init(dataa);

var valuea = dataParsera.readInt64Number();
cc.log("======================== valuea = " + valuea);
*/
