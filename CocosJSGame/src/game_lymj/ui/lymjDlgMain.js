
cc.log("--------ID_DlgLymjMain = "  + ID_DlgLymjMain);
DLG_CREATOR[ID_DlgLymjMain] = function() {
	return new DlgLymjMain();
};

var DlgLymjMain = DlgBase.extend({
	
	ctor: function(){	
		cc.log("---ID_DlgLymjMain--- ctor");
	},
	onCreate: function() {
		cc.log("---ID_DlgLymjMain--- onCreate");
		this.init();
		this.reset();
	},
	onClose: function() {
		cc.log("---ID_DlgLymjMain--- close");
	},
	reset: function() {
	},
	init: function() {		
		// 背景音乐
		SoundMgr.getInstance().playMusic("lymj_bgMusic",0,true);//循环播放大厅音乐
		var MusicVolume = LocalStorageMgr.getInstance().getMusicVolumeItem();
		console.log("MusicVolume="+ MusicVolume);
		var value = MusicVolume / 100;

		if(MusicVolume <100){	
			SoundMgr.getInstance().setMusicVolume(value/2);
		}
		else SoundMgr.getInstance().setMusicVolume(value);
		
		var json = ccs.load(res.lymjDlgMain_json);
		this._rootWidget = json.node;

		// 自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		cc.log("创建 游戏主界面...");
		
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		
		
		this.Panel_root = this._rootWidget.getChildByName("Panel_root");
		
		// onClickBtnEvent
		// 返回按钮
		this.Button_return = this.Panel_root.getChildByName("Button_return");
		this.Button_return = this.setBtnCallBack(this.Panel_root,"Button_return",this.onClickBtnEvent);
		// 规则按钮 设置按钮
		this.Panel_setAndRule = this.Panel_root.getChildByName("Panel_setAndRule");
		this.Button_rule = this.setBtnCallBack(this.Panel_setAndRule,"Button_rule",this.onClickBtnEvent);
		this.Button_set = this.setBtnCallBack(this.Panel_setAndRule,"Button_set",this.onClickBtnEvent);
		// 语音按钮,消息按钮
		this.Panel_msg = this.Panel_root.getChildByName("Panel_msg");
		this.Button_msg = this.setBtnCallBack(this.Panel_msg,"Button_msg",this.onClickBtnEvent);
		this.Button_talk = this.setBtnCallBack(this.Panel_msg,"Button_talk",this.onClickBtnEvent);
		
		// 邀请好友 解散房间
		this.Panel_waitOperation = this.Panel_root.getChildByName("Panel_waitOperation");
		this.Button_delete = this.setBtnCallBack(this.Panel_waitOperation,"Button_delete",this.onClickBtnEvent);
		this.Button_invite = this.setBtnCallBack(this.Panel_waitOperation,"Button_invite",this.onClickBtnEvent);
		
		// 开始面板 Panel_ready
		this.Panel_ready = this.Panel_root.getChildByName("Panel_ready");
		this.Button_startGame = this.setBtnCallBack(this.Panel_ready,"Button_startGame",this.onClickBtnEvent);
		
		// 初始化房间信息
		this.Panel_roomInfo = this.Panel_root.getChildByName("Panel_roomInfo");
		this.Text_roomNum = this.Panel_roomInfo.getChildByName("Text_roomNum");
		this.Text_roomNum.string = g_objHero.getRoomID();
	
		
		// 玩家信息
		this.Panel_playerInfo = this.Panel_root.getChildByName("Panel_playerInfo");
		
		//添加文字聊天监听
		var calcu = function(thisObj){
			return function(even){
				thisObj.setWordMsg(even._userData);
			}
		}
		g_objHero.addListenerWordMsg(calcu(this));
		
		/* 暂时注释掉 语音与聊天公共界面
		var dlgChatScene = UIMgr.getInstance().openDlg(ID_DlgChatScene);
		dlgChatScene.BtnSendMsg.setPositionY(dlgChatScene.BtnSounds.getPositionY()+130);
		*/
	},
	//文字信息回调
	setWordMsg: function(data){
//		var parseData = dataParser.parse([
//		["wChatLength", "WORD"],			// 信息长度
//		["dwChatColor", "DWORD"],			// 信息颜色
//		["dwSendUserID", "DWORD"],			// 发送用户
//		["dwTargetUserID", "DWORD"],		// 目标用户
//		["wClientID", "WORD"],				// 客户端ID
//		["szChatString", "TCHARS", 128],	// 聊天信息
//		]);
		cc.log("设置 文字消息" + JSON.stringify(data));
		var wChatLength = data.wChatLength;
		var dwChatColor = data.dwChatColor;
		var dwSendUserID = data.dwSendUserID;
		var dwTargetUserID = data.dwTargetUserID;
		var wClientID = data.wClientID;
		var szChatString = data.szChatString;
		
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		var player = table.getPlayerByUserId(data.dwSendUserID);
		var meChairID = g_objHero.getChairID();
		var chairID = player.getChairID();
		
		var index = 0
		while(true){ if(((meChairID+index)%4)==chairID) break; index++; }
		var strWho = "My";
		switch(index){
		case 0:{ strWho = "My"; 	break; }//自己
		case 1:{ strWho = "Right"; 	break; }//右边
		case 2:{ strWho = "Up"; 	break; }//对面
		case 3:{ strWho = "Left"; 	break; }//左边
		default: break;
		}
		var userInfoNodeName = "Node_userInfo"+strWho;
		var userInfoNode = this.Panel_playerInfo.getChildByName(userInfoNodeName);
		var Panel_msg = userInfoNode.getChildByName("Panel_msg");
		var Text_msg = Panel_msg.getChildByName("Text_msg");
		Text_msg.string = szChatString;
		Text_msg.setColor(cc.color(128, 0, 128));
		
		var action=[];
		var delay = cc.DelayTime(3);
		var run=cc.CallFunc(function(){
			Panel_msg.setVisible(false);
		},this);
		action.push(delay);
		action.push(run);
		Panel_msg.setVisible(true);
		Panel_msg.runAction(cc.Sequence(action));
		
	},
	
	
	//设置玩家位置信息
	updateUserPosInfo: function(){
		cc.log("设置玩家位置信息");
        
		return;
        
		/*var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}
		
		var getDir = function(chairID){
			var meChairID = g_objHero.getChairID();
			var index = 0;
			while(true){ if(((meChairID+index)%4)==chairID) break; index++; }
			var strWho = "My";
			switch(index){
			case 0:{ strWho = "My"; 	break; }//自己
			case 1:{ strWho = "Right"; 	break; }//右边
			case 2:{ strWho = "Up"; 	break; }//对面
			case 3:{ strWho = "Left"; 	break; }//左边
			default: break;
			}
			
			return strWho;
		}
		
		for(var i = 0; i < CMD_LYMJ.GAME_PLAYER; i++){

			var player = table.getPlayerByChairID(i);

			if(player && player.getUserId() != g_objHero.getUserId()){
				var nearUserInfo = player.getNearUserInfo();
				var myUserInfo = g_objHero.getNearUserInfo();
				cc.log("更新玩家位置信息2"+nearUserInfo+myUserInfo);
				if (nearUserInfo && myUserInfo) {
					// 根据经纬度计算距离
					var locationTable = {};
					locationTable["myLatitude"] = myUserInfo.getLatitude();
					locationTable["myLongitude"] = myUserInfo.getLongitude();
					locationTable["otherLatitude"] = nearUserInfo.getLatitude();
					locationTable["otherLongitude"] = nearUserInfo.getLongitude();
					var strSendData = JSON.stringify(locationTable);
					cc.log("根据经纬度计算距离入参:"+strSendData);
					var loc = 0;
					if(cc.sys.isNative){
						if(cc.sys.os == cc.sys.OS_ANDROID){
							loc = jsb.reflection.callStaticMethod(
									"org/cocos2dx/javascript/AppActivity",
									"metersBetweenLocation",
									"(Ljava/lang/String;)V",
									strSendData
							);
						}

						if(cc.sys.os == cc.sys.OS_IOS){
							loc = jsb.reflection.callStaticMethod(
									"AppController",
									"metersBetweenLocation:",
									strSendData
							);
						}
					}
					cc.log("距离="+loc);
					var nDistance = parseInt(loc);
					
					var userInfoNodeName = "Node_userInfo"+getDir(i);
					var userInfoNode = this.Panel_playerInfo.getChildByName(userInfoNodeName);
					var Image_nomal = userInfoNode.getChildByName("Image_nomal");
					var posStr = Image_nomal.getChildByName("Text_position");
					if (nDistance < 1000) {
						posStr.string = nDistance + "米8";
					} else {
						posStr.string = parseInt(nDistance / 1000) + "千米9";
					}

				}
			}
		}*/
	},
	
	//
	setUserInfo: function(chairID){
		cc.log("setUserInfo--chairID "+chairID);
		var game = ClientData.getInstance().getGame();
		var table = ClientData.getInstance().getTable();
		if(!game || !table){
			return false;
		}
		
		var meChairID=game.getMeChairId();
		
		var index = 0
		while(true){ if(((meChairID+index)%4)==chairID) break; index++; }
		var strWho = "My";
		switch(index){
		case 0:{ strWho = "My"; 	break; }//自己
		case 1:{ strWho = "Right"; 	break; }//右边
		case 2:{ strWho = "Up"; 	break; }//对面
		case 3:{ strWho = "Left"; 	break; }//左边
		default: break;
		}
		var userInfoNodeName = "Node_userInfo"+strWho;
		var readyStateNodeName = "Image_state"+strWho;
		
		
		var userInfoNode = this.Panel_playerInfo.getChildByName(userInfoNodeName);
		var Image_nomal = userInfoNode.getChildByName("Image_nomal");
		var Image_nil = userInfoNode.getChildByName("Image_nil");
		var state = this.Panel_ready.getChildByName(readyStateNodeName);
		var btnStart = this.Panel_ready.getChildByName("Button_startGame");
		cc.log("palyerCounts = "+ table.getPlayers().length);
		var player = table.getPlayerByChairID(chairID);
		if(!player){
			cc.log(" !player +++++++++++++++++++++++++++");
			// 没有玩家
			Image_nomal.setVisible(false);
			Image_nil.setVisible(true);
			state.setVisible(false);
			
			//
			var Image_roomHoster = this.Panel_playerInfo.getChildByName("Image_roomHost");
			var Image_banker = this.Panel_playerInfo.getChildByName("Image_banker");
			Image_banker.setVisible(false);
			Image_roomHoster.setVisible(false);
			
			return false;
		}
		else{

			//设置金币监听回调
			var Text_gold = Image_nomal.getChildByName("v");
			var callBack = function(objPlayer, text){
				return function(even){
					if(text){
						text.string = objPlayer.getScore();
					}
					
				}
			};
			player.addListenerChangeScore(callBack(player, Text_gold));
			
			var flower = 0;//
			var headImage = "";//
			var nickName = player.getNickName();//
			
			var scoreOrMoney = player.getScore();//
			
			var status = player.getStatus();
			var position = 0;//
			
			cc.log(" player nickName "+nickName);
			
			 
			Image_nomal.getChildByName("Text_nickName").string = nickName;
			Image_nomal.getChildByName("Text_gold").string = ""+scoreOrMoney;
			
			if(status==US_OFFLINE){
				Image_nomal.getChildByName("Text_nickName").string = "断线";
			}
			
			// 头像
			var Image_head = Image_nomal.getChildByName("Image_head");
			Image_nomal.getChildByName("Text_position").setVisible(false);
			Image_nomal.getChildByName("Image_positionIcon").setVisible(false);
			
			player.loadUrlImage(function(savePath){
				Image_head.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
				Image_head.setContentSize(cc.size(76,76));
			});
			Image_head.setTouchEnabled(true);
			Image_head.addTouchEventListener(this.onClickBtnEvent,this);
			Image_head.setTag(10050+player.getUserId());
			
			
			//准备按钮
			if(chairID==meChairID){
				cc.log(meChairID+"meChairID-----+++++++++++++++++-------");
				
				btnStart.setVisible(status<US_READY);
				Image_nomal.getChildByName("Text_position").string = "";
			}
			else{
				Image_nomal.getChildByName("Text_position").string ="";
			}
            if(status==US_READY)
            {
                cc.log("准备状态-----+++++++++++++++++-------");
            }
			//准备状态
			state.setVisible(status==US_READY);
			if(status==US_READY)
			{
				cc.log("准备状态-----------------");
			}
			
			//是否有玩家
			Image_nomal.setVisible(true);
			Image_nil.setVisible(false);
			
			//房主 庄家
			var isBanker = (game.getBanker()==chairID);
			var game = ClientData.getInstance().getGame();
			var isRoomHoster = (game.getTableOwnerUserID()==player.getUserId());
			
			var Image_roomHoster = this.Panel_playerInfo.getChildByName("Image_roomHost");
			var Image_banker = this.Panel_playerInfo.getChildByName("Image_banker");
			
			var posX = userInfoNode.getPositionX();
			var posY = userInfoNode.getPositionY();
			if(posX>700){
				//右边
				if(isRoomHoster){
					Image_roomHoster.setPositionX(posX+60);
					Image_roomHoster.setPositionY(posY);
					Image_roomHoster.setVisible(true);
				}
			}
			else{
				//左边
				if(isRoomHoster){
					Image_roomHoster.setPositionX(posX-60);
					Image_roomHoster.setPositionY(posY);
					Image_roomHoster.setVisible(true);
				}
			}
			if(isBanker){
				Image_banker.setPositionX(posX+35);
				Image_banker.setPositionY(posY+45);
				Image_banker.setVisible(true);
			}
		}
		
		this.updateUserPosInfo();
		return true;
	},
	
	
	setBtnCallBack: function(btnParent, btnName, listener){
		if(btnParent==null){
			return null;
		}

		var btn = btnParent.getChildByName(btnName);
		if(btn==null){
			return null;
		}
		btn.setPressedActionEnabled(true);
		btn.addTouchEventListener(listener, this);

		return btn;
	},
	
	onClickBtnEvent: function(sender, type){
		if (ccui.Widget.TOUCH_BEGAN == type) {
			var strBtnName = sender.getName();
			switch (strBtnName) {
				default:
					break;
			}
		}
		else if (ccui.Widget.TOUCH_ENDED == type) {
			SoundMgr.getInstance().playEffect("lymj_button", 0, false);
			
			var strBtnName = sender.getName();
			cc.log('onClickBtnEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_return":
				var game = ClientData.getInstance().getGame();
				var table = ClientData.getInstance().getTable();
				var status = g_objHero.getStatus();
				var players = table.getPlayers();
				//游戏中
				if(status == US_PLAYING || status == US_OFFLINE || game.getPlayCount()>0){
					cc.log("游戏中---sendCancelRoom");
					DlgTip.openGameTip("解散房间","游戏已经开始，\r\n 现在解散房间，房卡无法返还！", function(){
						OpenRoomMsg.getInstance().sendCancelRoom();
					});
				}
				//未开始牌局
				else{
					//起立
					GameUserMsg.getInstance().sendStandUp(true);
					//退出到大厅
					GameKindMgr.getInstance().backPlazaScene();
				}
				break;
			case "Button_startGame":
				// 开始
				// netWork: 发送开始准备
				cc.log("netWork: 发送开始准备");
				if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
                    cc.log("netWork: 发送开始准备----");
					GameFrameMsg.getInstance().sendReady();
                    cc.log("netWork: 发送开始准备~~~~`");
				}
				else{
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

					//
					MsgMgr.getInstance().reConnectGameServer(ip, port, function(){
						cc.log("----重连成功---");
						GameLogonMsg.getInstance().sendLogon();
						
						//GameFrameMsg.getInstance().sendReady();
					});
				}
				//连接服务器
				
				break;
			case "Button_invite":
				// 邀请
				var target = WXShare.SHARE_TARGET_FRIEND;
				var url = _CONFIG_.URL_PART1_INVITE+g_objHero.getUserId()+"-"+"room-"+g_objHero.getRoomID()+_CONFIG_.URL_PART2;
				var title = "一起搓几局，麻雀家乡见！";
				var description = "老牌友在等你（房号："+g_objHero.getRoomID()+"），点击立即加入，一起搓个天昏地暗！";
				WXShare.getInstance().shareURL(target, url, title, description,function(){
					cc.log("----邀请成功---");
					WXShare.getInstance().showSysTip("---邀请成功---");
				});
				break;
			case "Button_delete":
				//强行解散房间
				DlgTip.openGameTip("解散房间","是否强行解散房间！", function(){
					OpenRoomMsg.getInstance().sendDissumeTalbe();
					GameKindMgr.getInstance().backPlazaScene();
				});
				break;
			case "Button_rule":
				// 规则
				var plaza = ClientData.getInstance().getPlaza();
				var dlgRule =UIMgr.getInstance().openDlg(ID_DlgGameRule);
				dlgRule.gamekind = plaza.getCurKindID();
				dlgRule.gamestatus  =  true;
				dlgRule.onWhichplatform();
				
				break;
			case "Button_set":
				// 设置
				//UIMgr.getInstance().openDlg(ID_DlgPlazaSet);

				// test
				var dlg = UIMgr.getInstance().openDlg(ID_DlgLymjCardsInfo);
				var result = {};
                var game = ClientData.getInstance().getGame();
                game.setPlayCount(game.getDrawCountLimit());
                dlg.onGameEnd(result);


				break;
			case "Image_head":
				//点击头像
				var userID = sender.getTag()-10050;
				PlazaUIMgr.getInstance().ongetPlayerInfo(userID);
				break;
			default:
				break;
			}
		}
	},
	
	
});  
