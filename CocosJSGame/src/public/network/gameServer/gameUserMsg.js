var g_gameUserMsg = null;
var GameUserMsg = cc.Class.extend({

	ctor: function(){},

	// 用户命令 3
	onMsgMainUser: function(subCmd, data){
        var cmd_describes = {
            1100 : "用户进入 1100",
            1101 : "用户分数 1101",
            1102 : "用户状态 1102",
            1103 : "请求失败 1103",
            2101 : "聊天信息 2101",
            2102 : "表情消息 2102",
            2103 : "私聊消息 2103",
            2104 : "私聊表情 2104",
            210 : "创建房间命令 210",
        }

        var describe = cmd_describes[subCmd]
        if (!describe)
        {
            describe = "未说明"
        }
        cc.log("-------接收游戏服务器（用户命令）命令号： mainCmd = " +subCmd + " :" + describe + " -------------")
		switch (subCmd) {
			// ///////////////////////////用户状态////////////////////////////////
			// 用户进入 100
			case SUB_GR_USER_ENTER:
				this.onSubUserEnter(data);
				break;								
			// 用户分数 101
			case SUB_GR_USER_SCORE:
				this.onSubUserScore(data);
				break;								
			// 用户状态 102
			case SUB_GR_USER_STATUS:
				this.onSubUserStatus(data);
				break;							
			// 请求失败 103
			case SUB_GR_REQUEST_FAILURE:
				this.onSubRequestFailure(data);
				break;
			// //////////////////////////////聊天命令////////////////////////////////
			// 聊天信息 201
			case SUB_GR_USER_CHAT:
				this.onSubUserChat(data);
				break;
			// 表情消息 202
			case SUB_GR_USER_EXPRESSION:
				this.onSubUserExpression(data);
				break;								
			// 私聊消息 203
			case SUB_GR_WISPER_CHAT:
				this.onSubWisperChat(data);
				break;
			// 私聊表情 204
			case SUB_GR_WISPER_EXPRESSION:
				this.onSubWisperExpression(data);
				break;
			// 会话消息 205
			case SUB_GR_COLLOQUY_CHAT:
				this.onSubColloquyChat(data);
				break;
			// 会话表情 206
			case SUB_GR_COLLOQUY_ERPRESSION:
				this.onSubColloquyExpression(data);
				break;
			// //////////////////////////////道具命令////////////////////////////////
			// 购买道具 300
			case SUB_GR_PROPERTY_BUY:
				this.onSubPropertyBuy(data);
				break;
			// 道具成功 301
			case SUB_GR_PROPERTY_SUCCESS:
				this.onSubPropertySuccess(data);
				break;
			// 道具失败 302
			case SUB_GR_PROPERTY_FAILURE:
				this.onSubPropertyFailure(data);
				break;
			// 道具消息 303
			case SUB_GR_PROPERTY_MESSAGE:
				this.onSubPropertyMessage(data);
				break;
			// 道具效应 304
			case SUB_GR_PROPERTY_EFFECT:
				this.onSubPropertyEffect(data);
				break;
			// 用户喇叭 305
			case SUB_GR_PROPERTY_TRUMPET:
				this.onSubPropertyTrumpet(data);
				break;
			default:
				break;
		}
	},

	setIsHeroEnter:function(IsHeroEnter){
		this.isHeroEnter =IsHeroEnter;
	},
	getIsHeroEnter:function()
	{
		return this.isHeroEnter;
	},
	// 用户进入 100
	onSubUserEnter: function(data){
		cc.log("### 游戏服务器，（用户命令 /用户状态）用户进入");
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		
		var room = ClientData.getInstance().getRoom();
		if(!room){
			return;
		}

		cc.log("onSubUserEnter == ", JSON.stringify(data))

		// 旁观暂时不处理
		if(data.UserStatus == US_LOOKON){
			cc.log("at onSubUserEnter data.UserStatus == US_LOOKON ")
			return;
		}
		
		// 自己进入消息
		this.isHeroEnter = false;        //后期修改
		if(data.UserID == g_objHero.getUserId()){
			this.isHeroEnter = true;
			GameUserMsg.getInstance().setIsHeroEnter(true);
			cc.log("wanjiashifoujinru2"+this.isHeroEnter)
		}

//		if (!this.isHeroEnter) {
//            // 发送请求位置
//			gg.WxSdkMgr.getInstance().getUserPosInfoTimer(NickName.UserID);
//		}

		var player = null;
		// 自己进入
		if(this.isHeroEnter){
			player = g_objHero;
		}else{
			player = new Player();
			player.setHeaderUrl(data.HeaderUrl);
		}
		player.setNickName(data.NickName);
		player.setGameId(data.KindID);
		player.setUserId(data.UserID);
		player.setFaceId(data.FaceID);
		player.setGender(data.Gender);
		player.setMemberOrder(data.MemberOrder);
		player.setWinCount(data.WinCount);
		player.setPlayerInfo(data);

        if(data.TableID!=INVALID_TABLE){
            player.setTableId(data.TableID);
        }
		
		player.setChairID(data.ChairID);
		player.setStatus(data.UserStatus);
		
		var plaza = ClientData.getInstance().getPlaza();
		var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
		if(curGameType==GAME_GENRE_PERSONAL){ // 断线重连的时候，这边搞错了，因为大厅默认设置了 = GAME_GENRE_PERSONAL
			//房卡
            cc.log("player设置Score"+data.Score);
			player.setScore(data.Score);

            player.setMoney(data.Score); // 临时措施；具体还是得去改动大厅的类型
		}
		else{
			//金币场
			cc.log("onSubUserEnter player设置money"+data.Score+"data.UserID:"+data.UserID);
			player.setMoney(data.Score);
		}
		// 玩家进入房间
		cc.log("push player to room ", player.getUserId())
		room.addPlayer(player);
		
		// 自己进入
		if(this.isHeroEnter){
			cc.log("table.addPlayer(player)------this.isHeroEnter");
			table.addPlayer(player);
			table.removeOtherPlayer();
			
			if(g_objHero.getStatus() >= US_SIT && g_objHero.getTableId() != INVALID_TABLE && !g_objHero.isEnter/*test*/){
				GameUserMsg.getInstance().sendRequestUserInfo(g_objHero.getTableId());
				
				//test
				g_objHero.isEnter = true;
			}
		}else{
			// 同桌（自己已经坐下）
			if( g_objHero.getStatus() >= US_SIT && g_objHero.getTableId() != INVALID_TABLE && g_objHero.getChairID() != INVALID_CHAIR ){
				if(data.TableID == g_objHero.getTableId()){
					// 玩家进入自己所在桌子
					cc.log("table.addPlayer(player)------玩家进入自己所在桌子");
					table.addPlayer(player);
				}else {
					cc.log("data.TableID != g_objHero.getTableId() ", data.TableID, g_objHero.getTableId())
                }
			}else{
				var tableCount = room.getTableCount();
				cc.log(" tableCount === ", tableCount)
				// 如果就一张桌子
				if(tableCount == 1){
					cc.log("table.addPlayer(player)------如果就一张桌子");
					table.addPlayer(player);
				}
			}
		}
		
		// this.sendRequestUserInfo(parseData.wTableID);
		
		// //////////////////////////////////////////////////////////////////////////////////////////////////
		// 处理UI
		
		var runScene = cc.director.getRunningScene();
		
		// 自己进入
		if(this.isHeroEnter){
			// 启动游戏
			if(runScene && runScene.isPlazaScene && runScene.isPlazaScene()){
				// GameKindMgr.getInstance().runGameScene();
			}
			
			// 更新玩家信息
			if(runScene && runScene.isGameScene && runScene.isGameScene()){
				GameKindMgr.getInstance().getGameUIMgr().onUpdateAllPlayerInfo();
			}
		}else{
			// 同桌
			if( g_objHero.getStatus() >= US_SIT && g_objHero.getTableId() != INVALID_TABLE && g_objHero.getChairID() != INVALID_CHAIR ){
				if(data.TableID == g_objHero.getTableId()){
					// 更新玩家信息
					if(runScene && runScene.isGameScene && runScene.isGameScene()){
						GameKindMgr.getInstance().getGameUIMgr().onUpdateAllPlayerInfo();
					}
				}
			}
		}
		
		cc.log("palyerCounts = "+ table.getPlayers().length);
        //g_outcome.player.push(data.UserID);
	},
	
	// 用户分数 101
	onSubUserScore: function(data){
		cc.log("### 游戏服务器，（用户命令 /用户状态）用户分数 101");
		
		var dataParser = new DataParser();
		dataParser.init(data);
		var parseData = dataParser.parse([
		                                  ["dwUserID", "DWORD"],// 用户标识
		                                  // 积分信息
		                                  ["UserScore", "STRUCT", [
		                                                           // 积分信息
		                                                           ["lScore", "INT64_NUMBER"],// 用户分数
		                                                           // 输赢信息
		                                                           ["dwWinCount", "DWORD"],// 胜利盘数
		                                                           ["dwLostCount", "DWORD"],// 失败盘数
		                                                           ["dwDrawCount", "DWORD"],// 和局盘数
		                                                           ["dwFleeCount", "DWORD"],// 逃跑盘数
		                                                           // 全局信息
		                                                           ["dwExperience", "DWORD"],// 椅子位置
		                                                           ]],
		                                  ]);

		// cc.log("##### 用户分数 parseData = " + JSON.stringify(parseData));
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		
		var player = table.getPlayerByUserId(parseData.dwUserID);
		var plaza = ClientData.getInstance().getPlaza();
		var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
		if(player){
			if(curGameType==GAME_GENRE_PERSONAL){
				//房卡
				player.setScore(parseData.UserScore.lScore);
			}
			else{
				//金币场
				player.setMoney(parseData.UserScore.lScore);
			}
		}
		
		// //////////////////////////////////////////////////////////////////////////////////////////////////
		// 处理UI
		
		// 切换场景时不处理UI
		var bReplaceScene = ClientData.getInstance().getReplaceScene();
		if(bReplaceScene){
			return;
		}
		
		// 更新玩家信息
		var runScene = cc.director.getRunningScene();
		if(runScene && runScene.isGameScene && runScene.isGameScene()){
			GameKindMgr.getInstance().getGameUIMgr().onUpdateAllPlayerInfo();
		}
	},
									
	// 用户状态 102
	onSubUserStatus: function(data){
		cc.log("### 游戏服务器，（用户命令 /用户状态）用户状态 102");
		var room = ClientData.getInstance().getRoom();
		if(!room){
			return;
		}
		
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		cc.log("parseData = " + JSON.stringify(data));
		
		// //////////////////////////////////////////////////////////////////////////////////////////////////
		// 处理数据
		var msgUserId = data.UserID;
		var msgTableId = data.UserStatus.TableID;
		var msgChairId = data.UserStatus.ChairID;
		var msgUserStatus = data.UserStatus.UserStatus;
		
		var lastTableId = g_objHero.getTableId();
		var lastChairId = g_objHero.getChairID();
		cc.log("user id ===== ", msgUserId,  g_objHero.getUserId())
		// 自己状态消息
		var isHeroStatus = false;
		if(msgUserId == g_objHero.getUserId()){
			isHeroStatus = true;
		}

		// 旁观暂时不处理
		if(msgUserStatus == US_LOOKON){
			cc.log("user status == ", msgUserStatus)
			return;
		}
		
		var bSameTable = false;
		
		// 更新信息
		var roomPlayer = room.getPlayerByUserId(msgUserId);
		if(roomPlayer){
			// 判断同桌
			if(!isHeroStatus){
				if( g_objHero.getStatus() >= US_SIT && g_objHero.getTableId() != INVALID_TABLE && g_objHero.getChairID() != INVALID_CHAIR){
					if( roomPlayer.getTableId() == g_objHero.getTableId() ){
						bSameTable = true;
					}
				}
			}
			
			roomPlayer.setStatus(msgUserStatus);
			if(msgTableId != INVALID_TABLE){
				roomPlayer.setTableId(msgTableId);
			}

			if(msgChairId != INVALID_CHAIR){
				roomPlayer.setChairID(msgChairId);
			}
		}
		
		// 更新信息
		var tablePlayer = table.getPlayerByUserId(msgUserId);
		if(tablePlayer){
			tablePlayer.setStatus(msgUserStatus);
			if(msgTableId != INVALID_TABLE){
				cc.log("setTableId ==  ")
				tablePlayer.setTableId(msgTableId);
			}

			if(msgChairId != INVALID_CHAIR){
                cc.log("setChairID ==  ")
				tablePlayer.setChairID(msgChairId);
			}
		}
		
		// 请求玩家信息
		if(tablePlayer == null){
			if(msgTableId != INVALID_TABLE && msgChairId != INVALID_CHAIR){
				this.sendRequestChairUserInfo(msgTableId, msgChairId);
				return;
			}
		}
		
		// 离开房间
		if(msgUserStatus == US_NULL){
			room.removePlayerByUserId(msgUserId);
			table.removePlayerByUserId(msgUserId);
		}
		
		// 离开桌子
		if(msgUserStatus == US_FREE || msgTableId == INVALID_TABLE || msgChairId == INVALID_CHAIR){
			if(isHeroStatus){
				table.removeOtherPlayer();
			}else{
				// 同桌
				if(bSameTable){
					table.removePlayerByUserId(msgUserId);
				}
			}
		}
		
		// 自己坐下
		if(isHeroStatus){
			if(g_objHero.getStatus() == US_SIT && g_objHero.getTableId() != INVALID_TABLE){
				var players = room.getPlayersByTableId(g_objHero.getTableId());
				for(var i=0; i<players.length; i++){
					// table.addPlayer(players[i]);
				}
			}
			
			if(msgTableId != INVALID_TABLE && (msgTableId != lastTableId || msgChairId != lastChairId)){
				GameUserMsg.getInstance().sendRequestUserInfo(g_objHero.getTableId());
			}
		}
		
		// //////////////////////////////////////////////////////////////////////////////////////////////////
		// 处理UI
        cc.log("000000000000000000 ",isHeroStatus)
		var runScene = cc.director.getRunningScene();
		
		
		// 自己状态消息
		cc.log("111111111111111111111111111 ",isHeroStatus)
		if(isHeroStatus){
			// // 发送游戏规则
			// if(msgTableId != INVALID_TABLE && (msgTableId != lastTableId || msgChairId != lastChairId)){
			// 	GameFrameMsg.getInstance().sendGameOption();
			// }
			
			// 换桌流程：（坐下状态 -> 换桌 -> 起立状态 -> 坐下状态）
			// 进入游戏（换桌坐下）
			if(g_objHero.getStatus() == US_SIT){
				if(runScene.isGameScene && runScene.isGameScene()){
					var bChangeTable = GameKindMgr.getInstance().getGameUIMgr().isChangeTable();
					if(bChangeTable){
						GameKindMgr.getInstance().getGameUIMgr().setChangeTable(false);
						GameKindMgr.getInstance().getGameUIMgr().onChangeTableSucc();
					}else{
						// 游戏结束回到坐下状态
					}
				}
			}
			
			// 离开游戏（换桌离开）
			if(g_objHero.getStatus() == US_FREE && runScene.isGameScene && runScene.isGameScene()){
				var bChangeTable = GameKindMgr.getInstance().getGameUIMgr().isChangeTable();
				if(bChangeTable){
					// 换桌时离开，正在换桌
				}else{
					// GameKindMgr.getInstance().backPlazaScene();
				}
			}
			
			// 更新玩家信息
			if(runScene && runScene.isGameScene && runScene.isGameScene()){
				GameKindMgr.getInstance().getGameUIMgr().onUpdateAllPlayerInfo();
				cc.log("更新玩家信息11");
			}
		}else{
			if(runScene && runScene.isGameScene && runScene.isGameScene()){
				GameKindMgr.getInstance().getGameUIMgr().onUpdateAllPlayerInfo();
			}
		}
	},
    // 坐下结果  返会成功失败， 状态在更新状态协议下发
    onSubSitDownRst: function(data){
        cc.log("### 坐下结果  返会成功失败， 状态在更新状态协议下发");
        cc.log("parseData = " + JSON.stringify(data));
        if(data.Code==0){
        	//请求游戏规则
		}
		else{
            // 提示界面
            DlgTip.openSysTip(data.DescribeString + ", error : "+data.Code, function(target){
                target.closeTip();

                // 关闭游戏服务器
                g_gameSocket.close();
            });
		}
    },
	// 请求失败 103
	 onSubRequestFailure: function(data){
		cc.log("### 游戏服务器，（用户命令 /用户状态）请求失败 103");
		cc.log("parseData = " + JSON.stringify(data));
         showWaiting(false);
		// //////////////////////////////////////////////////////////////////////////////////////////////////
		// 处理UI
		
		// 切换场景时不处理UI
		var bReplaceScene = ClientData.getInstance().getReplaceScene();
		if(bReplaceScene){
			return;
		}
		
		// 提示界面
		var strTip = LoadErrorCfg.getInstance().getStrErrTip(data.ErrorCode)
		DlgTip.openSysTip(strTip, function(target){
			target.closeTip();
		});
		
		// // 请求失败
		// PlazaUIMgr.getInstance().onRequestFailure();
	},
	
	// //////////////////////////////聊天命令////////////////////////////////
	// 聊天信息 201
	onSubUserChat: function(data){
		cc.log("### 游戏服务器，（用户命令 /聊天命令）聊天信息 201");
	},
	
	// 表情消息 202
	onSubUserExpression: function(data){
		cc.log("### 游戏服务器，（用户命令 /聊天命令）表情消息 202");
	},
									
	// 私聊消息 203
	onSubWisperChat: function(data){
		cc.log("### 游戏服务器，（用户命令 /聊天命令）私聊消息 203");
	},
	
	// 私聊表情 204
	onSubWisperExpression: function(data){
		cc.log("### 游戏服务器，（用户命令 /聊天命令）私聊表情 204");
	},
	
	// 会话消息 205
	onSubColloquyChat: function(data){
		cc.log("### 游戏服务器，（用户命令 /聊天命令）会话消息 205");
	},
	
	// 会话表情 206
	onSubColloquyExpression: function(data){
		cc.log("### 游戏服务器，（用户命令 /聊天命令）会话表情 206");
	},
	
	// //////////////////////////////道具命令////////////////////////////////
	// 购买道具 300
	onSubPropertyBuy: function(data){
		cc.log("### 游戏服务器，（用户命令 /道具命令）购买道具 300");
	},
	
	// 道具成功 301
	onSubPropertySuccess: function(data){
		cc.log("### 游戏服务器，（用户命令 /道具命令）道具成功 301");
	},
	
	// 道具失败 302
	onSubPropertyFailure: function(data){
		cc.log("### 游戏服务器，（用户命令 /道具命令）道具失败 302");
	},
	
	// 道具消息 303
	onSubPropertyMessage: function(data){
		cc.log("### 游戏服务器，（用户命令 /道具命令）道具消息 303");
	},
	
	// 道具效应 304
	onSubPropertyEffect: function(data){
		cc.log("### 游戏服务器，（用户命令 /道具命令）道具效应 304");
	},
	
	// 用户喇叭 305
	onSubPropertyTrumpet: function(data){
		cc.log("### 游戏服务器，（用户命令 /道具命令）用户喇叭 305");
	},

	// ///////////////////////////////////////////////////////////////////////////////////////////
	
	// 请求用户信息
	sendRequestUserInfo: function(tableID){
		g_gameSocket.sendData("C2G_REQUserInfo",{
            UserID:INVALID_CHAIR,
            TablePos:tableID,
		});
	},
	
	// 请求椅子用户
	sendRequestChairUserInfo: function(tableID, chairID) {
		cc.log("### send request chairId user info.");
		cc.log("tableID = " + tableID + "chairID = " + chairID);
		g_gameSocket.sendData("C2G_REQUserChairInfo", {
			TableID: tableID,// 桌子号码
			ChairID: chairID,// 椅子号码
		})
	},
	
	// 坐下
	sendUserSitDown: function(data)
	{
		g_gameSocket.sendData("C2G_UserSitdown", data);
	},
	
	// 请求更换位置（快速坐下）
	sendUserChairReq: function()
	{
		g_gameSocket.sendData("C2G_GR_UserChairReq", {});
	},
	
	// 起立请求
	sendStandUp: function(bForce){
		var tableID = g_objHero.getTableId();
		var chairID = g_objHero.getChairID();
		var forceLeave = 0;
		if(bForce){
			forceLeave = 1;
		}
		cc.log("起立请求");
		// g_gameSocket.sendData("C2G_UserStandup",{
         //    TableID:tableID,
         //    ChairID:chairID,
         //    ForceLeave:forceLeave,
		// });
        g_gameSocket.sendData("C2G_LeaveRoom",{
            TableID:tableID,
            ChairID:chairID,
            ForceLeave:forceLeave,
        });
	},
});

GameUserMsg.getInstance = function(){
	if(g_gameUserMsg == null){
		g_gameUserMsg = new GameUserMsg();
	}
	return g_gameUserMsg;
}
