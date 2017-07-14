//ZSocket API
//sendData  发送消息
//connect  连接socket
//close  关闭socket

var SOCKET_STATUS = {
		_SS_INVALID : 0,//未连接
		_SS_CONNECTING : 1,//连接中
		_SS_CONNECTED : 2,//已连接
		_SS_UNKNOWN : 3,//未使用
};

HEAD_SIZE = 8
WORLD_SIZE = 2
TCPINFO_SIZE = 4

var PTypeToLogon  = 1,
PTypeToGame = 2,
PTypeToGate = 3,
PTypeToChat = 4



var WSMsgMgr = cc.Class.extend({
	logondSocket:null,
	gameSocke:null,
	chatSocke:null,

	ctor:function(){
        this.logondSocket = new socket()
        this.logondSocket._ptype = PTypeToLogon
        this.gameSocke = new socket()
        this.gameSocke._ptype = PTypeToGame
        this.chatSocke =new socket()
        this.chatSocke._ptype = PTypeToChat
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

		this.gameSocke.close();
		cc.log("reConnectGameServer");
		this.gameSocke.status = SOCKET_STATUS._SS_INVALID;
		this.connectGameServer(ip, port);

		if(!this.gameReConnectCallBack){
			var self = this;
			this.gameReConnectCallBack = function(){
				cc.log("unscheduleCallbackForTarget");
				//cc.Director.getInstance().getScheduler().unscheduleCallbackForTarget(self, self.reConnectGameServer);
				GameLogonMsg.getInstance().sendLogon();
				self.gameReConnectCallBack = null;
			};
		}
	},

	connectLogonServer:function(ip, port){
		cc.log("at connectLogonServer ..... ", ip, port)
		if (this.logondSocket.status == SOCKET_STATUS._SS_INVALID ){
			var sock = this.logondSocket;
			sock._onOpen =  function () {
                LogonMsgHandler.getInstance().onConnectResult(1);
            };
			sock._onClose = function () {
                LogonMsgHandler.getInstance().onOffLine();
            };

			sock.connect(ip + ":" + port)
		}
	},
	connectGameServer:function(ip, port){
		var self = this
        cc.log("at connectGameServer ..... ", ip, port)
		if (this.gameSocke.status == SOCKET_STATUS._SS_INVALID ){
			var sock = this.gameSocke;
			sock._onOpen = function () {
                GameMsgHandler.getInstance().onConnectResult(1);
                if(self.gameReConnectCallBack){
                    self.gameReConnectCallBack();
                }
            };
			sock._onClose = function () {
                GameMsgHandler.getInstance().onOffLine();
                var runScene = cc.director.getRunningScene();
                if(!self.gameReConnectCallBack && runScene && runScene.isGameScene && runScene.isGameScene()){
                    self.reConnectGameServer();
                    //cc.director.getScheduler().scheduleCallbackForTarget(self, self.reConnectGameServer(), 3000.0, true, 0, false);
                    return;
                }
            };

			sock.connect(ip + ":" + port)
		}
	},
	connectMsgServer:function(ip, port){
        cc.log("at connectMsgServer ..... ", ip, port)
		if (this.chatSocke.status == SOCKET_STATUS._SS_INVALID ){
			var sock = this.chatSocke;
			sock._onOpen = function () {
                CmdHandler.getInstance().onConnectResult(1);
            };
			sock._onClose = function () {
                CmdHandler.getInstance().onOffLine();
            };
			sock.connect(ip + ":" + port)
		}
	},

	getLogonSocket:function(){
		return this.logondSocket;
	},
	getGameSocket:function(){
		return this.gameSocke;
	},
	getMsgSocket:function(){
		return this.chatSocke;
	},

	//=============
    //关闭游戏服务器socket
	closeGameSocket: function(){
		this.gameSocke.close();
	},

    //关闭消息服务器socket
	closeMsgSocket: function(){
		this.chatSocke.close();
	},
});

var socket = cc.Class.extend({
    ctor:function(){
        this.status= SOCKET_STATUS._SS_INVALID
		this.instance= null
		this._ptype=null
		this._onOpen=null
		this._onClose=null
		this._handlers = {}
	},

	addHandler : function (event, fn) {
        if (!fn) {
            cc.assert("func is nil ===== ". event)
        }
        this._handlers[event] =fn
    },

    connect : function(addr) {
        addr = "ws://" + addr
        if  (this.status ==  SOCKET_STATUS._SS_CONNECTING){
            cc.assert(false, " at connnect  socket is vaild")
            return
        }
        cc.log(" connect to server ====== " , addr )
        var sock = new WebSocket(addr);
        var self = this
        self.instance = sock;
        sock.binaryType = "Blob"
        self.status = SOCKET_STATUS._SS_CONNECTING
        sock.onopen = function() {
            self.status = SOCKET_STATUS._SS_CONNECTED
            self._onOpen(1)
        }

        sock.onmessage = function(msg) {
        	var str = ab2Str(msg.data)
        	cc.log("read  server msg : ", str)
            if (self.status == SOCKET_STATUS._SS_CONNECTED) {
            	var res = JSON.parse(str)
                for(var key in res){
                    fn = self._handlers[key]
                    if (fn) {
                        fn(res[key])
                    }else {
                    	cc.error("not foud handler function msg:",key, str)
                    }
                }
            }
        }

        sock.onerror = function(msg) {}
        sock.onclose = function(msg) {
            self.status = SOCKET_STATUS._SS_INVALID
            self._onClose()
        }
    },

    sendData : function(funcName, data) {
        cc.log("send data to server === ", funcName,  JSON.stringify(data))
        var sendMsg = {}
        sendMsg[funcName] = data
        if (this.status == SOCKET_STATUS._SS_CONNECTED) {
            var err = this.instance.send(JSON.stringify(sendMsg));
            if (err) {
                cc.log("send msg error :", err)
            }
        }else {
        	cc.log("send msg ", funcName, "socket is close")
		}
    },

    close : function () {
        cc.log("close socket  === ", this._ptype)
        if  (this.status != SOCKET_STATUS._SS_INVALID){
            this.status = SOCKET_STATUS._SS_INVALID
            this.instance.close()
            this.instance = null;
        }else {
            cc.log(" double close socket  === !!!!!!!!!!!")
        }
    },


});


///////////////////////
function trace () {
    var i = 0;
    var fun = arguments.callee;
    do {
        fun = fun.arguments.callee.caller;
        console.log(++i + ': ' + fun);
    } while (fun)
}

function ab2Str(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
       cc.log("this string seems to contain (still encoded) multibytes");
    }
    return str;
}



