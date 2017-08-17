/*
 * 红中麻将 主界面
 * Author: 	xjn 
 * Date:	2017.4.8
 * 
 * 功能：
 * 
 * */

cc.log("--------ID_DlgHzmjMain = "  + ID_DlgHzmjMain);
DLG_CREATOR[ID_DlgHzmjMain] = function() {
	return new DlgHzmjMain();
};

var DlgHzmjMain = DlgBase.extend({
	
	ctor: function(){	
	
	},
	onCreate: function() {
		this.init();
		this.reset();
	},
	onClose: function() {
		cc.log("---ID_DlgHzmjMain--- close");
	},
	reset: function() {
	},
	init: function() {		
		// 背景音乐
		SoundMgr.getInstance().playMusic("hzmj_bgMusic",0,true);//循环播放大厅音乐
		var MusicVolume = LocalStorageMgr.getInstance().getMusicVolumeItem();
		console.log("MusicVolume="+ MusicVolume);
		var value = MusicVolume / 100;

		if(MusicVolume <100){	
			SoundMgr.getInstance().setMusicVolume(value/2);
		}
		else SoundMgr.getInstance().setMusicVolume(value);
		
		var json = ccs.load(res.hzmjDlgMain_json);
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
//		this.Button_return = this.setBtnCallBack(this.Panel_root,"Button_return",this.onClickBtnEvent);
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
		this.Button_invite = this.setBtnCallBack(this.Panel_waitOperation,"Button_invite",this.onClickBtnEvent);
		
		// 开始面板 Panel_ready
		this.Panel_ready = this.Panel_root.getChildByName("Panel_ready");
		this.Button_start = this.setBtnCallBack(this.Panel_ready,"Button_start",this.onClickBtnEvent);
		
		// 初始化房间信息
		this.Panel_roomInfo = this.Panel_root.getChildByName("Panel_roomInfo");
		this.Text_roomNum = this.Panel_roomInfo.getChildByName("Text_roomNum");
		this.Text_roomNum.string = g_objHero.getRoomID();
		this.Panel_roomInfoEx = this.Panel_roomInfo.getChildByName("Panel_roomInfoEx");
        //房间扩展信息的协议 G2C_PersonalTableTip
		// 房间信息扩展
		var roomSpecialInfo = game.getGameRoomOhterInfo();
		if(roomSpecialInfo!=undefined)
		{
			// 开关 res.info_Close  资源是开
			this.openCb = function (sender, type) {
				if (ccui.Widget.TOUCH_ENDED == type){
					this.btnOpen +=1;
					this.Panel_roomInfoEx.setVisible(this.btnOpen%2==0?false:true);
					this.Panel_content.setVisible(this.btnOpen%2==0?false:true);
					this.Btn_RoomInfoEx.loadTextureNormal(this.btnOpen%2==0 ?   res.info_Close: res.info_Open , ccui.Widget.LOCAL_TEXTURE);
					this.btnOpen = this.btnOpen%2;
				}
			};

			this.btnOpen = 1;
			this.Btn_RoomInfoEx = this.setBtnCallBack(this.Panel_roomInfo,"Btn_RoomInfoEx",this.openCb);
			this.Panel_content = this.Panel_roomInfo.getChildByName("Panel_content");

			var ListBgSize = this.Panel_roomInfoEx.getContentSize();
			var testH =  20;
			var info = [];

			if(roomSpecialInfo.zhaMa!=undefined){
				info.push(roomSpecialInfo.zhaMa ? "扎码":"不扎码");
			}

			for(var i = 0;i<info.length;i++) {

				var func = function (index,tempthis) {
					cc.log("index:"+index);
					var widget = new ccui.TextField();
					widget.setAnchorPoint(0,1);
					widget.setFontSize(20);
					widget.string = info[i];
					widget.setColor(cc.color(102, 255, 255));
					widget.setPosition(cc.p(10,0 -((testH+10)*index)));
					widget.setTouchEnabled(false);
					tempthis.Panel_content.addChild(widget);

				}(i,this);
			}
			ListBgSize = this.Panel_roomInfoEx.getContentSize();
			this.Panel_roomInfoEx.setContentSize(ListBgSize.width,(testH+10)*info.length +testH);
		}
		else
		{
			cc.log("roomSpecialInfo是空的");
		}

		this.Image_PayType = this.Panel_roomInfo.getChildByName("Image_PayType");
		var payType = game.getGameRoomPayType();
		var bAA = (payType == 2 ? true: false);
		this.Image_PayType.loadTexture(bAA==true ? res.payType_AA : res.payType_Zhuang, ccui.Widget.LOCAL_TEXTURE);


		// 取消托管
		var cancelTrustreeFun = function (sender, type) {
			switch(type) {
				case ccui.Widget.TOUCH_ENDED: {
					// 发送取消托管
					ZpmjGameMsg.getInstance().sendbTrustee(false);// 取消托管
					cc.log("hello this.Panel_root on click 发送取消托管=========》》》》》》");
					break;
				}
			}
		};
		this.Panel_OnTopTouch = this.Panel_root.getChildByName("Panel_OnTopTouch");
		this.Btn_CancelTrustree = this.Panel_OnTopTouch.getChildByName("Btn_CancelTrustree");
		this.Btn_CancelTrustree.addTouchEventListener(cancelTrustreeFun, this);
		this.Panel_OnTopTouch.addTouchEventListener(cancelTrustreeFun, this);

		// 玩家信息
		this.Panel_playerInfo = this.Panel_root.getChildByName("Panel_playerInfo");
		
		//添加文字聊天监听
		var calcu = function(thisObj){
			return function(even){
				thisObj.setWordMsg(even._userData);
			}
		}
		g_objHero.addListenerWordMsg(calcu(this));

		var dlgChatScene = UIMgr.getInstance().openDlg(ID_DlgChatScene);
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
		
		if(cc.sys.isNative){
			var delay = cc.DelayTime(3);
			var run=cc.CallFunc(function(){
				Panel_msg.setVisible(false);
			},this);
			action.push(delay);
			action.push(run);
			
			Panel_msg.runAction(cc.Sequence(action));
		}
		else{
			var delay = new cc.DelayTime(3);
			var run=new cc.CallFunc(function(){
				Panel_msg.setVisible(false);
			},this);
			action.push(delay);
			action.push(run);

			Panel_msg.runAction(new cc.Sequence(action));
		}
		
		Panel_msg.setVisible(true);
	},
	
	//设置当前局数
	setRoundInfo: function(){
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		var curRounds = game.getPlayCount();
		var totalRounds = game.getDrawCountLimit();
		
		//当前局数信息
		var dlgHzmjCardsInfo = UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		var Text_roundsInfo = dlgHzmjCardsInfo.Panel_roundInfo.getChildByName("Text_roundsInfo");
		Text_roundsInfo.string = curRounds+"/"+totalRounds;
		
		//游戏底分
		var AtlasLabel_baseScore = dlgHzmjCardsInfo.Panel_roundInfo.getChildByName("AtlasLabel_baseScore");
		AtlasLabel_baseScore.string = ""+game.getCellScore();
		AtlasLabel_baseScore.setContentSize(cc.size(39*AtlasLabel_baseScore.string.length, 60));
		
		//房间号
		this.Text_roomNum.string = g_objHero.getRoomID();
	},
	
	//设置剩余张数
	setCardssLeft: function(){
		var game = ClientData.getInstance().getGame();
		if(!game){
			return;
		}
		
		cc.log("设置剩余张数 ++++++ "+game.getLeftCardCount());
		var dlgHzmjCardsInfo = UIMgr.getInstance().getDlg(ID_DlgHzmjCardsInfo);
		var AtlasLabel_cardssLeft = dlgHzmjCardsInfo.Panel_roundInfo.getChildByName("AtlasLabel_cardssLeft");
		AtlasLabel_cardssLeft.string = game.getLeftCardCount();
		AtlasLabel_cardssLeft.setContentSize(cc.size(39*AtlasLabel_cardssLeft.string.length, 60));
	},
	
	//设置玩家位置信息
	updateUserPosInfo: function(){
		cc.log("设置玩家位置信息");
        return;
		var table = ClientData.getInstance().getTable();
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
		
		for(var i = 0; i < CMD_HZMJ.GAME_PLAYER; i++){

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
		}
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
			var scoreOrMoney = player.getScore();//
			var plaza = ClientData.getInstance().getPlaza();
			var curGameType = plaza.getCurGameType();

			// 头像
			var Image_head = Image_nomal.getChildByName("Image_head");

			var Text_gold = Image_head.getChildByName("Text_gold");
			//设置金币监听回调
			//var callBack = function(objPlayer, text){
			//	return function(even){
			//		if(text){
			//			text.string = objPlayer.getScore();
			//		}
			//
			//	}
			//};
			//player.addListenerChangeScore(callBack(player, Text_gold));

			if(curGameType==GAME_GENRE_PERSONAL){
				//player.addListenerChangeScore(callBack(player, this)); // 房卡版
				cc.log("分数score"+player.getScore());
				scoreOrMoney = player.getScore();
			}
			else {
				//player.addListenerChangeMoney(callBack(player, this)); // 积分版
				cc.log("分数money"+player.getMoney());
				scoreOrMoney = player.getMoney();
			}

			var flower = 0;//
			var headImage = "";//
			var nickName = player.getNickName();//

			
			var status = player.getStatus();
			var position = 0;//
			
			cc.log(" player nickName "+nickName);
			
			//Image_nomal.getChildByName("Text_flowerNum").string = ""+flower
			if(nickName.length>6) {
				nickName = nickName.substr(0, 5) + "...";
			}
			Image_head.getChildByName("Text_nickName").string = nickName;
			Image_head.getChildByName("Text_gold").string = ""+scoreOrMoney;
			
			if(status==US_OFFLINE){
				Image_head.getChildByName("Text_nickName").string = "断线";
			}
			

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
				this.Button_start.setVisible(status<US_READY);
				Image_nomal.getChildByName("Text_position").string = "";
			}
			else{
				Image_nomal.getChildByName("Text_position").string ="";
			}
			//准备状态
			state.setVisible(status==US_READY);
			
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
					Image_roomHoster.setPositionX(posX+50);
					Image_roomHoster.setPositionY(posY);
					Image_roomHoster.setVisible(true);
				}
			}
			else{
				//左边
				if(isRoomHoster){
					Image_roomHoster.setPositionX(posX-50);
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
			SoundMgr.getInstance().playEffect("hzmj_button", 0, false);
			
			var strBtnName = sender.getName();
			cc.log('onClickBtnEvent ' + strBtnName);
			switch (strBtnName) {
//			case "Button_return":
//				var game = ClientData.getInstance().getGame();
//				var table = ClientData.getInstance().getTable();
//				var status = g_objHero.getStatus();
//				var players = table.getPlayers();
//				//游戏中
//				if(status == US_PLAYING || status == US_OFFLINE || game.getPlayCount()>0){
//					cc.log("游戏中---sendCancelRoom");
//					DlgTip.openGameTip("解散房间","游戏已经开始，\r\n 现在解散房间，房卡无法返还！", function(){
//						OpenRoomMsg.getInstance().sendCancelRoom();
//					});
//				}
//				//未开始牌局
//				else{
//					//起立
//					GameUserMsg.getInstance().sendStandUp(true);
//					//退出到大厅
//					GameKindMgr.getInstance().backPlazaScene();
//				}
//				break;
			case "Button_start":
				// 开始
				// netWork: 发送开始准备
				cc.log("netWork: 发送开始准备");
				if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
                    cc.log("netWork: 发送开始准备----");
					GameFrameMsg.getInstance().sendReady();
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
				UIMgr.getInstance().openDlg(ID_DlgGameSet);
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
