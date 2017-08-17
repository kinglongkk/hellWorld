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
	    cc.log("---------通信消息管理器创建：WSMsgMgr.create()--------------")
        this.logondSocket = new socket()
        this.logondSocket._ptype = PTypeToLogon
        this.gameSocke = new socket()
        this.gameSocke._ptype = PTypeToGame
        this.chatSocke =new socket()
        this.chatSocke._ptype = PTypeToChat
	},


	reConnectGameServer: function(dt){
	    if(this._bForceCloseGameSocket) return;
        var runScene = cc.director.getRunningScene();
        if(runScene && runScene.isGameScene ) {
            if(!runScene.isGameScene())
            {
                return
            }
        }
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
		cc.log("reConnectGameServer");
		this.gameSocke.status = SOCKET_STATUS._SS_INVALID;
        if(!this.gameReConnectCallBack){
            var self = this;
            this.gameReConnectCallBack = function(){
                cc.log("-------------重连登录游戏服务器后发送的请求---------");
                GameLogonMsg.getInstance().sendLogon(); // 登陆了游戏服务器
                GameFrameMsg.getInstance().sendGameOption();
                self.gameReConnectCallBack = null;
            };
        }
		this.connectGameServer(ip, port);
	},

	connectLogonServer:function(ip, port){
		cc.log("------------------------连接登录服务器 loginWSSocket ..... ", ip, port)
		if (this.logondSocket.status == SOCKET_STATUS._SS_INVALID ){
			var sock = this.logondSocket;
			sock._onOpen =  function () {
                cc.log("--------------调用了  LoginWSSocket._onOpen()-----------")
                LogonMsgHandler.getInstance().onConnectResult(1);
            };
			sock._onClose = function () {
                cc.log("----------调用了  LoginWSSocket._onClose() ----------------")
                LogonMsgHandler.getInstance().onOffLine();
            };

			sock.connect(ip + ":" + port)
		}
	},
	connectGameServer:function(ip, port){
		var self = this
        cc.log("------------------------试图连接Game服务器 GameWSSocket： ..... ", ip, port)
		if (this.gameSocke.status == SOCKET_STATUS._SS_INVALID ){
			var sock = this.gameSocke;
			sock._onOpen = function () {
                cc.log("------------------------调用了  GameWSSocket._onOpen() ")
                GameMsgHandler.getInstance().onConnectResult(1);
                if(self.gameReConnectCallBack){
                    self.gameReConnectCallBack();
                }
                else
                {
                    this._bForceCloseGameSocket = false
                }
            };
			sock._onClose = function () {
                cc.log("----------调用了  GameWSSocket._onClose()")
                GameMsgHandler.getInstance().onOffLine();
                var runScene = cc.director.getRunningScene();
                if(runScene && runScene.isGameScene && runScene.isGameScene()){
                    self.reConnectGameServer();
                    return;
                }
            };

			sock.connect(ip + ":" + port)
		}
	},
	connectMsgServer:function(ip, port){
        cc.log("------------------------连接消息服务器 MsgWSSocket ..... ", ip, port)
		if (this.chatSocke.status == SOCKET_STATUS._SS_INVALID ){
			var sock = this.chatSocke;
			sock._onOpen = function () {
                cc.log("------------------------调用了 MsgWSSocket._onOpen()")
                CmdHandler.getInstance().onConnectResult(1);
            };
			sock._onClose = function () {
                cc.log("------------------------调用了 MsgWSSocket _onClose()")
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
	    cc.log("---------------关闭游戏服务器socket--------------")
		this.gameSocke.close();
	},

    closeGameSocketForce:function (bForce) {
        cc.log("---------------强制关闭游戏服务器socket--------------")
        this._bForceCloseGameSocket = bForce
        this.closeGameSocket();
    },

    //关闭消息服务器socket
	closeMsgSocket: function(){
        cc.log("---------------关闭消息服务器socket--------------")
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
        sock.binaryType = 'blob';
        var self = this
        self.instance = sock;
        self.status = SOCKET_STATUS._SS_CONNECTING
        sock.onopen = function() {
            cc.log("----------socket类 建立了WSSocket 连接成功 地址为：" , addr )
            self.status = SOCKET_STATUS._SS_CONNECTED
            self._onOpen(1)
        }

        sock.onmessage = function(msg) {
            if (msg.type == "ping") {

            }
            cc.log(msg.data)
        	var data = ab2Str(msg.data)
 
            var str = CryptoUtil.decryptByDES(data, "mqjx@mqc")
        	//cc.log("    S2C::::::", str)
            if (self.status == SOCKET_STATUS._SS_CONNECTED) {
            	var res = JSON.parse(str)
                for(var key in res){
            	    cc.log("---------------收到服务器协议号：" + key + "-----------------")
                    fn = self._handlers[key]
                    if (fn) {
                        cc.log("---------------收到服务器数据：" + str + "-----------------")
                        fn(res[key])
                    }else {
                    	cc.error("not foud handler function msg:",key, str)
                    }
                }
            }
        }

        sock.onerror = function(msg) {}
        sock.onclose = function(msg) {
            cc.log("----------WebSocket类 WSSocket关闭" )
            self.status = SOCKET_STATUS._SS_INVALID
            self._onClose()
        }
    },

    sendData : function(funcName, data) {
        cc.log("    C2S :::::: ", funcName,  JSON.stringify(data))
        cc.log("--------------客户端发送请求 ：", funcName,  JSON.stringify(data))
        var sendMsg = {}
        sendMsg[funcName] = data
        if (this.status == SOCKET_STATUS._SS_CONNECTED) {
            var str = CryptoUtil.encryptByDES(JSON.stringify(sendMsg), "mqjx@mqc");

            // var strTest = "tiantiantiyu天天体育tiantiantiyu";
            // cc.log("加密前---"+strTest);
            // strTest = CryptoUtil.encryptByDES(strTest, "mqjx@mqc");//"CfWGpwX9+oXkAGTTBxN503GQ/g5urJ6oCfWGpwX9+oV1EiMowjxqNQ==";//CryptoUtil.encryptByDES(strTest, "mqjx@mqc");
            // cc.log("加密后---"+strTest);
            // strTest = CryptoUtil.decryptByDES(strTest, "mqjx@mqc")
            // //cc.log(CryptoUtil.decryptByDES(str, "mqjx@mqc"));
            // cc.log("解密后---"+strTest);


            var err = this.instance.send(str);
            if (err) {
                cc.log("send msg error :", err)
            }
        }else {
        	cc.log("send msg ", funcName, "socket is close")
		}
    },

    close : function () {
        cc.log("客户端调用了 socket.close() this._ptype =",this._ptype )
        cc.log("close socket  === ", this._ptype)
        if  (this.status != SOCKET_STATUS._SS_INVALID){
            this.status = SOCKET_STATUS._SS_INVALID
            this.instance.close()
            this.instance = null;
        }else {
            cc.log(" double close socket  === !!!!!!!!!!!")
        }
    },
    getStatus:function () {
        return this.status
    },


});


///////////////////////
function stackTrace() {
    var err = new Error();
    cc.error( "stask : ",err.stack);
}

function ab2Str(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
       cc.log("this string seems to contain (still encoded) multibytes");
    }
    return str;
}



