
var g_gameFrameMsg = null;
var GameFrameMsg = cc.Class.extend({

	ctor: function(){},

	//游戏框架命令
	onMsgMainGameFrame: function(subCmd, data){
		switch (subCmd) {
			//用户聊天 10
			case SUB_GF_USER_CHAT:
				this.onSubGFUserChat(data);
				break;
			//用户表情 11
			case SUB_GF_USER_EXPRESSION:
				this.onSubGFUserExpression(data);
				break;
			//游戏状态 100
			case SUB_GF_GAME_STATUS:
				this.onSubGFGameStatus(data);
				break;
			//游戏场景 101
			case SUB_GF_GAME_SCENE:
				this.onSubGFGameScene(data);
				break;
			//系统消息 200
			case SUB_GF_SYSTEM_MESSAGE:	
				this.onSubGFSystemMessage(data);
				break;
			////////////////////////////////////////////比賽//
				//比赛信息 403
			case SUB_GR_MATCH_INFO:	
				this.onSubMatchInfo(data);
				break;
				//等待提示404
			case SUB_GR_MATCH_WAIT_TIP:	
				this.onSubMatchWaitTip(data);
				break;
				//比赛结果 405
			case SUB_GR_MATCH_RESULT:	
				this.onSubMatchResult(data);
				break;
			case  SUB_GF_USER_VOICE:
				this.onSubGfUserVoice(data);
				break;
			//比賽////////////////////////////////////////////
			default:
				break;
		}
	},
	
	////////////////////////////////////////////比賽//
	//比赛信息 403
	onSubMatchInfo: function(data){
		cc.log("### [GameFrameMsg] onSubMatchInfo");
		
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  //用户属性
		                                  ["szTitle", "TCHARS[]", 4, 64],//信息标题
		                                  ["wGameCount", "WORD"],//游戏局数
		                                  ]);

		cc.log("parseData = " + JSON.stringify(parseData));
		
		var match = ClientData.getInstance().getMatch();
		if(match){
			match.setMatchInfo(parseData);
		}
	},
	
	//等待提示404
	onSubMatchWaitTip: function(data){
		cc.log("### [GameFrameMsg] onSubMatchWaitTip");
		
		var len = data.byteLength;
		
		if(len != 0){
			var dataParser = new DataParser();
			dataParser.init(data);
			var parseData = dataParser.parse([
			                                  //用户属性
			                                  ["lScore", "INT64_NUMBER"],//当前积分
			                                  ["wRank", "WORD"],//当前名次
			                                  ["wCurTableRank", "WORD"],//本桌名次
			                                  ["wUserCount", "WORD"],//当前人数
			                                  ["wPlayingTable", "WORD"],//游戏桌数
			                                  ["szMatchName", "TCHARS", 32],//比赛名称
			                                  ]);

			cc.log("parseData = " + JSON.stringify(parseData));
			
			var dlgMatchWait = UIMgr.getInstance().openDlg(ID_DlgMatchWait);
			if(dlgMatchWait){
				dlgMatchWait.setWaitInfo(parseData);
			}
		}		
	},
	
	//比赛结果 405
	onSubMatchResult: function(data){
		cc.log("### [GameFrameMsg] onSubMatchResult");
		
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  //用户属性
		                                  ["szDescribe", "TCHARS", 256],//得奖描述
		                                  ["dwGold", "DWORD"],//金币奖励
		                                  ["dwMedal", "DWORD"],//奖牌奖励
		                                  ["dwExperience", "DWORD"],//经验奖励
		                                  ]);
		
		cc.log("parseData = " + JSON.stringify(parseData));
		
		var gameUIMgr = GameKindMgr.getInstance().getGameUIMgr();
		if(gameUIMgr && gameUIMgr.onShowMatchResult){
			gameUIMgr.onShowMatchResult(parseData);
		}
	},
	//比賽////////////////////////////////////////////

	//用户聊天 10
	onSubGFUserChat: function(data){
		cc.log("### 游戏服务器， （游戏框架命令 ）用户聊天 10");

        var parseData = {}
        parseData.dwChatColor = data.ChatColor
        parseData.dwSendUserID = data.SendUserID
        parseData.dwTargetUserID = data.TargetUserID
        parseData.dwClientID = data.ClientID
        parseData.ChatIndex = data.ChatIndex
        parseData.szChatString = data.ChatString

        g_objHero.emitWordMsg(parseData);
        cc.log("++++++++++++1");
        //播放语音
        
        var table = ClientData.getInstance().getTable();
        var player = table.getPlayerByUserId(parseData.dwSendUserID);
        var plaza = ClientData.getInstance().getPlaza();
        cc.log("++++++++++++2");
        var soundFile = LoadWordChatCfg.getInstance().getSoundFile(parseData.ChatIndex, player.getGender(), plaza.getCurKindID());
        cc.log("++++++++++++3");
        SoundMgr.getInstance().playEffect(soundFile, 0, false);
        cc.log("++++++++++++4soundFile"+soundFile);
	},
	
	//用户表情 11
	onSubGFUserExpression: function(data){
		cc.log("### 游戏服务器， （游戏框架命令 ）用户表情 11");
	},

	//游戏状态 100
	onSubGFGameStatus: function(data){
		cc.log("### 游戏服务器， （游戏框架命令 ）游戏状态 100");
		cc.log("parseData = " + JSON.stringify(data));
		
		var table = ClientData.getInstance().getTable();
		if(table){
			table.setGameStatus(data.GameStatus);
			
			var bAllow = false;
			if(data.AllowLookon == 1){
				bAllow = true;
			}
			table.setAllowLookon(bAllow);
		}
		
		var gameMsgMgr = GameMsgMgr.getInstance();
		if(gameMsgMgr){
			gameMsgMgr.onGameStatus();
		}
		
		//请求桌子玩家信息
		//GameUserMsg.getInstance().sendRequestUserInfo(g_objHero.getTableId());		
	},

	//游戏场景 101
	onSubGFGameScene: function(data){
		cc.log("游戏场景 101--### [gameFrameMsg], game scene!");
		
		var gameMsgMgr = GameMsgMgr.getInstance();
		if(gameMsgMgr){
			gameMsgMgr.onGameSceneMsg(data, false);
		}
		
		PlazaUIMgr.getInstance().onEnterGameScene();
		
		//test
		g_objHero.isEnter = false;
	},

    //游戏场景 101
    onSubGFGameScenePlay: function(data){
        cc.log("游戏场景 101--### [gameFrameMsg], game scene!");

        var gameMsgMgr = GameMsgMgr.getInstance();
        if(gameMsgMgr){
            gameMsgMgr.onGameSceneMsg(data, true);
        }

        PlazaUIMgr.getInstance().onEnterGameScene();

        //test
        g_objHero.isEnter = false;
    },

	//系统消息 200
	onSubGFSystemMessage: function(data){
		cc.log("### 游戏服务器， （游戏框架命令 ）系统消息 200");
		var callBack = function(target){
			target.closeTip();
		};

		//关闭房间
		if (data.Type & SMT_CLOSE_GAME){
			ClientData.getInstance().setForceExitGame(true, data.Context);
			
			//不在结算阶段直接显示
			var bEndPhase = GameKindMgr.getInstance().getGameUIMgr().isEndPhase();
			cc.log("@@@@@@----------------------bEndPhase = " + bEndPhase);
			if(!bEndPhase){
				cc.log("--------------------@@@");
				GameKindMgr.getInstance().getGameUIMgr().checkForceExit();
			}
			
			return;
		}
		
		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
		//切换场景时不处理UI
		var bReplaceScene = ClientData.getInstance().getReplaceScene();
		if(bReplaceScene){
			return;
		}
		
		//弹出消息
		if ( (data.Type & SMT_EJECT) || (data.Type & SMT_TABLE_ROLL) ){
			//弹出提示信息
			DlgTip.openSysTip(data.Context, callBack);
		}
	},

	//语音回调
   
                                   
	onSubGfUserVoice: function(data){

	console.log("### 收到后台语音回调");
    
	var dataParser1 = new DataParser();
		dataParser1.init(data);
		var parseData1 = dataParser1.parse([
			["dwSendUserID", "DWORD"],	//发送用户
			["dwTargetUserID", "DWORD"],//目标用户
			["dwVoiceLength", "DWORD"],	//语音长度
		]);
		cc.log("dwVoiceLength1:"+parseData1.dwVoiceLength); // 为了先获取动态大小得事先解析出大小，然后再来解析byte

        var dataParser = new DataParser();
		dataParser.init(data);
	var parseData = dataParser.parse([
		["dwSendUserID", "DWORD"],	//发送用户
		["dwTargetUserID", "DWORD"],//目标用户
		["dwVoiceLength", "DWORD"],	//语音长度
		["byVoiceData", "BYTE[]",parseData1.dwVoiceLength],//语音数据
		]);
		cc.log("parseData = " + JSON.stringify(parseData));

		// 读取buf
		var szBuffer = parseData.byVoiceData;
		var nlen = parseData1.dwVoiceLength;

		// js数组转ArrayBuffer
		var	dataBuffer 	= new ArrayBuffer(nlen);
		var dataView 	= new DataView(dataBuffer);
		var offset 		= 0;

		for(var i=0; i<nlen; i++){
			dataView.setUint8(offset, szBuffer[i], isLittleEndian);
			offset += 1;
		}

		// 写入文件
        var uuid = UUID.generate().toString();
		var recvAmrPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") +uuid+ "recv.amr");

		if (zutils.WriteDataToFile(dataBuffer,nlen,recvAmrPath)) {
            if(jsb.fileUtils.isFileExist(recvAmrPath)) {
                if(cc.sys.isNative){
                    if(cc.sys.os == cc.sys.OS_IOS) {
                        jsb.reflection.callStaticMethod("HFAudio","startPlay:",recvAmrPath);
                    }
                    else if(cc.sys.os == cc.sys.OS_ANDROID) {
                        cc.audioEngine.playEffect(recvAmrPath,false);
                    }
                }
            }
            else {
                DlgTip.openSysTip("### 录音转换后的文件不存在", function(target){
                    target.closeTip();
                });
            }
		}
		else {
            DlgTip.openSysTip("### 录音数据写入失败", function(target){
                target.closeTip();
            });
        }

		////////////////////////////////////////////////////////////////////////////////////////////////////
		//处理UI
	},

	////////////////////////////////// C->S /////////////////////////////////////////////////////
	
	//发送游戏规则（重连、进入房间、坐下）
	sendGameOption: function(){

		cc.log("发送游戏规则  = " + MDM_GF_FRAME + ", SUB_GF_GAME_OPTION = " + SUB_GF_GAME_OPTION);
		g_gameSocket.sendData("C2G_GameOption",{
            AllowLookon : 0,
            /*FrameVersion :INVALID_DWORD,
            ClientVersion : INVALID_DWORD,*/
			FrameVersion : parseInt(110),
            ClientVersion : parseInt(110)
		});
	},
	
	//发送状态
	sendUserStatus: function(cbStatus) {		
		var userID = g_objHero.getUserId();
		var tableID = g_objHero.getTableId();
		var chairID = g_objHero.getChairID();
		g_gameSocket.sendData("C2G_UserReady",{
			TableID : tableID,
			ChairID : chairID,
		})
	},
	
	//发送准备
	sendReady: function(){
		this.sendUserStatus(US_READY);
	},

    nntbSendReady: function (status) {
        this.sendNNTBUserStatus(status);
    },

    //发送状态
    sendNNTBUserStatus: function(cbStatus) {
        var userID = g_objHero.getUserId();
        var tableID = g_objHero.getTableId();
        var chairID = g_objHero.getChairID();
        var sendStr = "C2G_UserReady";
        if (cbStatus === US_SIT) sendStr = "C2G_UserCancel";
        g_gameSocket.sendData(sendStr, {
            TableID : tableID,
            ChairID : chairID
        })
    },

	// 发送语音 sxh
	sendVoiceReq: function(tempAmrPath){
        console.log("------------发送语音请求");
		var VoiceData = jsb.fileUtils.getDataFromFile(tempAmrPath);
		var szBuf = [];
		var dataView = new DataView(VoiceData.buffer);
		var offset = 0;
		for(var i=0; i<VoiceData.length; i++){
			szBuf[i] = dataView.getUint8(offset, isLittleEndian);
			offset += 1;
		}

		var dwTargetUserID = g_objHero.getUserId();
		var dataBuilder = new DataBuilder();
		dataBuilder.init(4+4+VoiceData.length);
		dataBuilder.build([
			["dwTargetUserID", "DWORD", dwTargetUserID],
			["dwVoiceLength", "DWORD", VoiceData.length],
			["byVoiceData", "BYTE[]", szBuf, VoiceData.length],
		]);

		if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
			g_gameSocket.sendData(MDM_GF_FRAME, SUB_GF_USER_VOICE, dataBuilder.getData());
		}
	},

	// 发送文字消息
	sendWordsMsg: function (msg, index) {
		cc.log(msg+"---------请求发送文字消息-----------index-"+index);
		cc.log(msg+msg.length);
        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
            g_gameSocket.sendData("C2G_GameChart_ToAll", {
                ChatColor : 0, //字体颜色
                SendUserID : g_objHero.getUserId(),//发送者id
                ChatString : msg, //消息内容
                ChatIndex: index, //第几条消息
			});
        }
    },
});

GameFrameMsg.getInstance = function(){
	if(g_gameFrameMsg == null){
		g_gameFrameMsg = new GameFrameMsg();
	}
	return g_gameFrameMsg;
}
