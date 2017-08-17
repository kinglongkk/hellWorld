DLG_CREATOR[ID_DlgSSSPlayerData] = function() {
	return new DlgSSSPlayerData();
};

var DlgSSSPlayerData = DlgBase.extend({
	ctor: function () {
		this.PanelPlayer = [];
		this.PlayerBox = [];
		this.ImgBg = [];
		this.PlayerImgFace = [];
		this.Image_Fangzhu = [];
		this.Image_thumb = [];
		this.PlayerNick = [];
		this.PlayerMoney = [];
		this.PlayerDistance = [];
		this.Image_position = [];
		this.PlayerReady = [];
		this.Panelcardbox = [];
		this.Paneloutcard = [];
		this.resultfirst_win = [];
		this.resultfirst_lost = [];
		this.resultsecond_win = [];
		this.resultsecond_lost = [];
		this.resulthird_win = [];
		this.resulthird_lost = [];

		this.resultMyfirst_win = 0;
		this.resultMyfirst_lost = 0;
		this.resultMysecond_lost = 0;
		this.resultMysecond_win = 0;
		this.resulMythird_win = 0;
		this.resulMythird_lost = 0;
		
		this.resultWater_win = [];
        this.resultWater_lost = [];
		
		this.CardOver = [];
		this.CardBg = [];
		this.PlayerDialog = [];
		this.DialogWord = [];
		this.WaterBg = [];

		this.PanelOpen = [];

		this.PanelType = [];

		this.pockerValue = []; //手牌数据
		this.publicPocker = [];//公共三张牌数据
		this.laiPocker = [];	//癞子牌数据
		this.handCards = [];  //手牌

		this.Player=[];

	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function(){
        // 加载动画资源
        this.opFrameCach = cc.spriteFrameCache;
        this.opFrameCach.addSpriteFrames(res.sssEndAniPlist_plist);
        this.opFrameCach.addSpriteFrames(res.sssdlgPlayer_plist);
		var json = ccs.load(res.sssdlgPlayer_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		for(var playerNum = 0;playerNum<CMD_SSS.GAME_PLAYER;playerNum++) {
            this.PanelPlayer[playerNum] = this._rootWidget.getChildByName("Panel_player" + playerNum);

            this.PlayerBox[playerNum] = this.PanelPlayer[playerNum].getChildByName("Player_panel");
            this.PlayerBox[playerNum].setName("PlayerBox"+playerNum);
            this.PlayerBox[playerNum].setTouchEnabled(true);

            this.Image_Fangzhu[playerNum] = this.PlayerBox[playerNum].getChildByName("Image_Fangzhu");
            this.Image_Fangzhu[playerNum].setVisible(false);
            this.PlayerImgFace[playerNum] = this.PlayerBox[playerNum].getChildByName("Image_player");
            this.PlayerImgFace[playerNum].setVisible(false);
            this.Image_thumb[playerNum] = this.PlayerBox[playerNum].getChildByName("Image_thumb");
            this.Image_thumb[playerNum].ignoreContentAdaptWithSize(true);
            this.Image_thumb[playerNum].setVisible(false);
            this.PlayerNick[playerNum] = this.PlayerBox[playerNum].getChildByName("Text_nickname");
            this.PlayerMoney[playerNum] = this.PlayerBox[playerNum].getChildByName("Text_money");
            this.PlayerDistance[playerNum] = this.PlayerBox[playerNum].getChildByName("Tplayer_distance");
            this.PlayerDistance[playerNum].setVisible(false);
            this.Image_position[playerNum] = this.PlayerBox[playerNum].getChildByName("Image_position");
            this.Image_position[playerNum].setVisible(false);
            this.Panelcardbox[playerNum] = this.PanelPlayer[playerNum].getChildByName("Panel_cardbox");
            this.Paneloutcard[playerNum] = this.PanelPlayer[playerNum].getChildByName("Panel_outcard");
            if(playerNum == 0){
                this.PlayerNick[playerNum].setString(g_objHero.getNickName());
                this.PlayerMoney[playerNum].setString(g_objHero.getMoney());
            }else{
            	this.CardBg[playerNum] = this.Paneloutcard[playerNum].getChildByName("Image_card");
            	this.CardBg[playerNum].setVisible(false);
            }

            this.CardOver[playerNum] = this.Paneloutcard[playerNum].getChildByName("Image_over");
            this.CardOver[playerNum].setVisible(false);

            this.resultfirst_win[playerNum] = this.Paneloutcard[playerNum].getChildByName("resultfirst_win");
            this.resultfirst_lost[playerNum] = this.Paneloutcard[playerNum].getChildByName("resultfirst_lost");
            this.resultfirst_win[playerNum].setVisible(false);
            this.resultfirst_lost[playerNum].setVisible(false);
            this.resultsecond_win[playerNum] = this.Paneloutcard[playerNum].getChildByName("resultsecond_win");
            this.resultsecond_lost[playerNum] = this.Paneloutcard[playerNum].getChildByName("resultsecond_lost");
            this.resultsecond_win[playerNum].setVisible(false);
            this.resultsecond_lost[playerNum].setVisible(false);
            this.resulthird_win[playerNum] = this.Paneloutcard[playerNum].getChildByName("resulthird_win");
            this.resulthird_lost[playerNum] = this.Paneloutcard[playerNum].getChildByName("resulthird_lost");
            this.resulthird_win[playerNum].setVisible(false);
            this.resulthird_lost[playerNum].setVisible(false);
            //玩家总水数
			this.WaterBg[playerNum] = this.Paneloutcard[playerNum].getChildByName("Image_Water");
            this.resultWater_win[playerNum] = this.WaterBg[playerNum].getChildByName("resulAll_win");
            this.resultWater_lost[playerNum] = this.WaterBg[playerNum].getChildByName("resulAll_lost");
            this.WaterBg[playerNum].setVisible(false);
            this.resultWater_win[playerNum].setVisible(false);
            this.resultWater_lost[playerNum].setVisible(false);

            if(playerNum == 0){
            	this.resultMyfirst_win =  this.WaterBg[playerNum].getChildByName("resultfirst_win");
            	this.resultMyfirst_lost = this.WaterBg[playerNum].getChildByName("resultfirst_lost");
            	this.resultMysecond_win  =  this.WaterBg[playerNum].getChildByName("resultsecond_win");
            	this.resultMysecond_lost = this.WaterBg[playerNum].getChildByName("resultsecond_lost");
            	this.resulMythird_win =  this.WaterBg[playerNum].getChildByName("resulthird_win");
            	this.resulMythird_lost = this.WaterBg[playerNum].getChildByName("resulthird_lost");
            	this.resultMyfirst_win.setVisible(false);
            	this.resultMyfirst_lost.setVisible(false);
            	this.resultMysecond_win.setVisible(false);
            	this.resultMysecond_lost.setVisible(false);
            	this.resulMythird_win.setVisible(false);
            	this.resulMythird_lost.setVisible(false);
            };

            this.PlayerDialog[playerNum] = this.PanelPlayer[playerNum].getChildByName("Image_DialogF");
            this.DialogWord[playerNum] = this.PlayerDialog[playerNum].getChildByName("Text_word");
            this.PlayerDialog[playerNum].setVisible(false);
            cc.log("playerNum = " + playerNum);
            this.PlayerReady[playerNum] = this.PanelPlayer[playerNum].getChildByName("Img_ready");
            this.PlayerReady[playerNum].setVisible(false);

            this.PlayerBox[playerNum].setTouchEnabled(true);
            this.PlayerBox[playerNum].setTag(playerNum);
            this.PlayerBox[playerNum].addTouchEventListener(this.onClickPlayerImg, this);

        }

        // // //test
        // //发牌测试
        // this.pockerValue = [0x4e ,0x4f,0x21,0x14,0x15,0x08,0x31,0x0A ,0x0B, 0x11,0x06,0x05,0x01];
        // this.pockerValue[13] = 0x16;
        // this.pockerValue[14] = 0x12;
        // this.pockerValue[15] = 0x13;
        // //有癞子牌(可注)
        // this.laiPocker = [0x01,0x11,0x21,0x31];
        // this.CreateMyTableCards(this.pockerValue, this.laiPocker);
        //

        //test //动画测试
        // var a = [1,2];
        // this.ShowShootAni(0, a);

        ///test 玩家比牌测试
        ////////////////////////////////////////////////////////////////////////////////////////////
        // var bCardData= [//玩家数据
        //     [
        //         // 54,41,9,
        //         // 18, 60,59,11,52,
        //         // 53, 24,40,39,1
        //         0x01 ,0x02 ,0x03, 0x04,0x05,0x06,0x07,0x08,0x09, 0x0A,0x0B,0x0C,0x0D
        //     ],
        //     [
        //         // 45,55,35,
        //         // 51,37,28,20,17,
        //         // 21,42,2,12,13
        //         0x11 ,0x12 ,0x13,0x14,0x15,0x16,0x17,0x18,0x19, 0x1A,0x1B,0x1C,0x1D
        //     ],
        //     [
        //         // 29,23,22,
        //         // 10,44,33,34,36,
        //         // 56,38,19,8,49
        //         0x21 ,0x22 ,0x23,0x24,0x25,0x26,0x27,0x28,0x29, 0x2A,0x2B,0x2C,0x2D
        //     ],
        //     [
        //         // 3,43,4,
        //         // 7,61,5,26,25,
        //         // 6,50,58,57,27
        //         0x31 ,0x32,0x33,0x34,0x35,0x36,0x37,0x38 ,0x39, 0x3A,0x3B,0x3C,0x3D
        //     ]
        // ];
        // var cbCompareResult= [//每一道比较结果
        //     [-1,1,-5],
        //     [1,-1,-7],
        //     [-3,-3,-3],
        //     [3,3,15]
        // ];
        // var lGameScore = [-26,-28,-30,84];//游戏积分
        // var playerCount = 4;//玩家人数
        // var calcultest0 = function (bCardData, cbCompareResult, lGameScore, playerCount) {
        //     return function () {
        //         cc.log("开始比牌");
        //         SssUIMgr.getInstance().onCompareResult(bCardData, cbCompareResult, lGameScore, playerCount);
        //     }
        // };
        // setTimeout(calcultest0(bCardData, cbCompareResult,lGameScore, playerCount), 1500);
        // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //

		this.resetHandCardOnPanelcardBox();
		//添加文字聊天监听
		var calcu = function(thisObj){
			return function(even){
				thisObj.setChatBubble(even._userData);
			}
		}
		g_objHero.addListenerWordMsg(calcu(this));

	},
	//玩家结束输赢图片资源
	setEndShow:function(lGameScore){
//		if(lGameScore == null){
//			this.onUnscheduleAllSelectors();
//		}
		cc.log("sss### 比牌结束 显示结算分数");
		var table = ClientData.getInstance().getTable();
        var game = ClientData.getInstance().getGame();
        if(game == null){
        	game = new SssGameModel;
		}
		var result = 0;
		var isMe = false;
		for(var pos  = 0;pos<SssUIMgr.getInstance().getPlayerCount();pos++){
			var chairId = SssUIMgr.getInstance().getChairIdByPlayerPos(pos);
			//如果只有我一个人并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 1 && pos != 0){
                continue;
            }
			//如果玩家两个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 2 && (pos != 0 && pos != 3)){
                continue;
            }
			//如果玩家三个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 3 && (pos != 0 && pos != 2 && pos != 3)){
                continue;
            }
			//如果玩家四个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 4 && (pos != 0 && pos != 2 && pos != 3 && pos != 4)){
                continue;
            }
			//如果玩家五个并且 pos == 0 才画我自己
            if(SssUIMgr.getInstance().getPlayerCount() == 5 && (pos != 0 && pos != 2 && pos != 3 && pos != 4 && pos != 5)){
                continue;
            }
			var player = table.getPlayerByChairID(chairId);
			if(lGameScore == null){
				result = game.playerDatas[pos].addScore;
			}
			else{
				result = lGameScore[pos];
			}

			if(player == null){
				player=game.playerDatas[pos].nPlayer;
			}

			if(player){
				if(player.getUserId() == g_objHero.getUserId()){
					isMe = true;
				}
				else{
					isMe = false;
				}
			}

			//玩家总水数可见
			this.WaterBg[pos].setVisible(true);
			if(lGameScore[pos] >= 0){
				this.resultWater_win[pos].setString("."+lGameScore[pos]);
				this.resultWater_win[pos].setVisible(true);
				
				var slem = this.resultWater_win[pos].getString().length;
				this.resultWater_win[pos].setContentSize(35 * slem, 60);
			}
			else {
				this.resultWater_lost[pos].setString("/"+lGameScore[pos]);
				this.resultWater_lost[pos].setVisible(true);
				
				var slem = this.resultWater_lost[pos].getString().length;
				this.resultWater_lost[pos].setContentSize(35 * (slem-1), 60);
			}

			if(isMe == true){
				cc.log("sss### 比牌我的结果  result = "+result);
				if(this.Paneloutcard[0].getChildByName("endshowBg") != null){
					return;
				}

				var cardPath ="";
				if(result>0){
					SoundMgr.getInstance().playEffect("sss_win", 0, false);
					cc.log("我赢了  result = "+result);
					cardPath = "res/game-sss/outcome/sss_win.png";
				}
				else if(result < 0){
					SoundMgr.getInstance().playEffect("sss_lose", 0, false);
					cc.log("我输了  result = "+result);
					cardPath = "res/game-sss/outcome/sss_lose.png";
				}
				else {
					cc.log("是平局  result = "+result);
					cardPath = "res/game-sss/outcome/sss_ping.png";
				}

				var endShow = new ccui.ImageView(cardPath, ccui.Widget.LOCAL_TEXTURE);
				// var overSize = DlgPlayer.CardOver[pos].getSize();
				endShow.x = this.CardOver[pos].x;
				endShow.y = this.CardOver[pos].y - 20;
				endShow.setName("endshowBg");
				this.Paneloutcard[0].addChild(endShow);
				this.Paneloutcard[0].setVisible(true);
				endShow.setLocalZOrder(100);
			}
		}
	},
	//清空结算界面
	onResetPlayer:function(){
		//清空胜利
		if(this.Paneloutcard[0].getChildByName("endshowBg") != null){
			this.Paneloutcard[0].removeChildByName("endshowBg");
		}

		for(var playerNum = 0;playerNum<4;playerNum++) {
		this.WaterBg[playerNum].setVisible(false);
		this.resultWater_win[playerNum].setVisible(false);
		this.resultWater_lost[playerNum].setVisible(false);

		if(playerNum == 0){
			this.resultMyfirst_win.setVisible(false);
			this.resultMyfirst_lost.setVisible(false);
			this.resultMysecond_win.setVisible(false);
			this.resultMysecond_lost.setVisible(false);
			this.resulMythird_win.setVisible(false);
			this.resulMythird_lost.setVisible(false);
			}
		}
	},
	setPlayerBoxStatus:function(status){
		for(var num =0;num<SssUIMgr.getInstance().getPlayerCount();num++){
			if(status == true){
				this.PlayerBox[num].setTouchEnabled(status);
			}
			else{
				this.PlayerBox[num].setTouchEnabled(false);
			}
		}
	},
	setChatBubble: function (data) {
		var table = ClientData.getInstance().getTable();
		if(!table){
			return;
		}

		var player = table.getPlayerByUserId(data.dwSendUserID);

		var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(player.getChairID());

		this.PlayerDialog[pos].setVisible(true);
		this.DialogWord[pos].setString(data.szChatString);

		var calcu = function(thisObj, pos){
			return function(){
				cc.log("时间到了"+pos);
				thisObj.PlayerDialog[pos].setVisible(false);
			}
		}

		setTimeout(calcu(this, pos), 3000);
	},

	setPlayerReadystatus:function(num,status){
		this.PlayerReady[num].setVisible(status);
	},

	updatePlayerInfo: function(pos, player){
		cc.log("更新玩家数据"+pos);
		if(player == null){
			this.PanelPlayer[pos].setEnabled(false);
			this.PanelPlayer[pos].setVisible(false);
			return;
		}
		else{
			this.PanelPlayer[pos].setEnabled(true);
			this.PanelPlayer[pos].setVisible(true);
		}

		var faceURL = player.getHeaderUrl();
//		var gender = player.getGender();
		var nick = player.getNickName();
		var money = 0;
		var plaza = ClientData.getInstance().getPlaza();
		var curGameType = plaza.getCurGameType();
		if(curGameType==GAME_GENRE_PERSONAL){
			//房卡
			money = player.getScore();
		}
		else{
			//金币场
			money = player.getMoney();
		}
		var game = ClientData.getInstance().getGame();
		if(game){
			var roomOwnerId = game.getTableOwnerUserID();
			if(player.getUserId() == roomOwnerId){
				//this.Image_position[pos].setVisible(true);
				//this.PlayerDistance[pos].setVisible(true);
                this.Image_Fangzhu[pos].setVisible(true);//房主标识可见
			}
		}
		var distance = player.getMoney();
		var readyStauts = player.getStatus();
		if(readyStauts == US_READY){
			this.setPlayerReadystatus(pos,true);
		}

		this.PlayerNick[pos].setString(nick);
		this.PlayerMoney[pos].setString(money);
		this.setFaceByFaceURL(pos);
	},

	setFaceByFaceURL: function(pos){

        var chairId = SssUIMgr.getInstance().getChairIdByPlayerPos(pos);
        var table = ClientData.getInstance().getTable();
        var player = table.getPlayerByChairID(chairId);
        this.Player[pos] = player;
        cc.log("player.getUserId():"+player.getUserId()+" == g_objHero.getUserId()"+g_objHero.getUserId());
        if(player.getUserId() == g_objHero.getUserId()){
            cc.log("我的头像URL="+player.getHeaderUrl());
            cc.log("我的头像URL="+g_objHero.getHeaderUrl());
            player.setHeaderUrl(g_objHero.getHeaderUrl());
        }

		this.Image_thumb[pos].setVisible(true);
		var ImgFace = this.PlayerImgFace[pos];
        this.PlayerImgFace[pos].setVisible(true);
		var headsize = ImgFace.getSize();
		this.Player[pos].loadUrlImage(function(savePath){
            ImgFace.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
		});
	},
    //设置牌背景底可见
    showPlayerCardBg:function(pos){
		if(pos == null){
            for(var num = 0;num < CMD_SSS.GAME_PLAYER;num++){
                //如果只有我一个人并且 pos == 0 才画我自己
                if(SssUIMgr.getInstance().getPlayerCount() == 1 && num != 0){
                    continue;
                }
				//如果玩家两个并且 pos == 0 才画我自己
                if(SssUIMgr.getInstance().getPlayerCount() == 2 && (num != 0 && num != 3)){
                    continue;
                }
				//如果玩家三个并且 pos == 0 才画我自己
                if(SssUIMgr.getInstance().getPlayerCount() == 3 && (num != 0 && num != 2 && num != 3)){
                    continue;
                }
				//如果玩家四个并且 pos == 0 才画我自己
                if(SssUIMgr.getInstance().getPlayerCount() == 4 && (num != 0 && num != 2 && num != 3 && num != 4)){
                    continue;
                }
				//如果玩家五个并且 pos == 0 才画我自己
                if(SssUIMgr.getInstance().getPlayerCount() == 5 && (num != 0 && num != 2 && num != 3 && num != 4 && num != 5)){
                    continue;
                }

                if(num == 0)continue;
				this.CardBg[num].setVisible(true);
			}
		}
		else {
            if(pos != 0){
                this.CardBg[pos].setVisible(true);
			}
		}
    },
    //设置玩家组牌好了背景底牌可见
    ShowPlayerCardOverBg:function (pos) {
        this.CardOver[pos].setVisible(true);
        this.HidePlayerCardBg(pos);
    },
    //设置背景底不可见
    HidePlayerCardBg:function(pos){
    	cc.log("设置背景底不可见"+pos);
    	if(pos != 0){
            this.CardBg[pos].setVisible(false);
		}
    },
    //移除牌的类型图片
    removeCardShow:function(){
    	for(var num = 0 ;num<CMD_SSS.GAME_PLAYER;num++){
    		if(this.Paneloutcard[num].getChildByName("cardshow") != null){
                this.Paneloutcard[num].removeChildByName("cardshow");
                cc.log("removeChildByName" + num);
			}
    	}
    },
    //创建自己的桌面发牌
    CreateMyTableCards:function (pocker,laiPoker){
    	cc.log("创建了吗？pocker"+JSON.stringify(pocker));
        var cardboxSize = this.Panelcardbox[0].getSize();
        //手牌数据赋值
		for(var num = 0;num < pocker.length;num++){
			this.pockerValue[num] = pocker[num];
		}
		//癞子牌赋值
        for(var num = 0;num < laiPoker.length;num++){
            this.laiPocker[num] = pocker[num];
        }
        //创建桌面牌
        for(var temp = 0; temp<13;temp++){
            cc.log("1.1");
            this.handCards[temp] = this.onCreatCard(pocker[temp], 0);
            this.handCards[temp].setName("card"+temp);
            this.handCards[temp].x = cardboxSize.width/2;
            this.handCards[temp].y = cardboxSize.height*1.5;
            // this.Card[temp].x = (cardboxSize.width/13)*(temp+0.8);
            // this.Card[temp].y = cardboxSize.height/2;
            this.handCards[temp].setScale(0.76);
            this.handCards[temp].setVisible(false);
            this.Panelcardbox[0].addChild(this.handCards[temp]);
        }
		//创建公共牌
        cc.log("0");
		var bPublicPocker = false;
		if(pocker.length >= 16){
            cc.log("0.1");
            bPublicPocker = true;
            var nSpacing = -1;
            for(var temp = 13; temp<16;temp++){
                this.handCards[temp] = this.onCreatCard(pocker[temp], 0);
                this.handCards[temp].setName("card"+temp);
                this.handCards[temp].x = (nSpacing*50) +cardboxSize.width/2;
                this.handCards[temp].y = cardboxSize.height*2.5;
                this.handCards[temp].setScale(1.0);
                this.handCards[temp].setLocalZOrder(temp+ 1);

                var Scaleto1 = cc.ScaleTo(0.2,1.2);
                var Scaleto2 = cc.ScaleTo(0.2,0.9);
                //this.handCards[temp].runAction(cc.sequence(cc.delayTime(0.1*(temp -13),Scaleto1,Scaleto2,Scaleto3,Scaleto4,null)));
                this.Panelcardbox[0].addChild(this.handCards[temp]);
                this.handCards[temp].setVisible(false);

                this.handCards[temp].runAction(cc.sequence(cc.delayTime(0.1*(temp -13)),Scaleto1,Scaleto2));
                nSpacing++;
            }
		}
		//添加癞子标识
        if(laiPoker != null){//显示癞子闪烁
            for(var num = 0;num < pocker.length;num++){
                if(laiPoker[0] ==  pocker[num] || laiPoker[1] ==  pocker[num]
                    || laiPoker[2] ==  pocker[num] || laiPoker[3] ==  pocker[num]){
                    var laiSprite = new cc.Sprite("res/game-sss/Chinesepoke/FrameLai01.png");
                    var laiSize = laiSprite.getContentSize();
                    laiSprite.setAnchorPoint(0,0);
                    laiSprite.setName("laiSprite");
                    laiSprite.setVisible(false);

                    // //重复癞子动画
                    // var callFunc1 = cc.CallFunc(function () {
                    //     laiSprite.loadTexture("FrameLai01.png");
                    // });
                    // var callFunc2 = cc.CallFunc(function () {
                    //     laiSprite.loadTexture("FrameLai02.png");
                    // });
                    // laiSprite.runAction(cc.RepeatForever.create(cc.sequence(cc.delayTime(0.1),callFunc1,cc.delayTime(0.1),callFunc2)));

					this.handCards[num].addChild(laiSprite);
                }
            }
        }

        //显示发牌动画
        // var calpockerAni = function (thisObj) {
        //     return thisObj.ShowLicensingAni();
        // };
        setTimeout(this.ShowLicensingAni(),/*bPublicPocker == false?0:10*/10000);
    },
	//移除自己的桌面发牌
	RemoveMyTabelCards:function() {
        for(var temp = 0;temp<13;temp++){
        	if(this.Panelcardbox[0].getChildByName("card"+temp) != null){
                this.Panelcardbox[0].removeChildByName("card"+temp);
			}
        }
	},
    //发牌动画
	ShowLicensingAni:function () {
    	cc.log("你倒是发牌啊~"+JSON.stringify(this.pockerValue));
        var cardboxSize = this.Panelcardbox[0].getSize();
        for(var temp = 0; temp<this.pockerValue.length;temp++){

            this.handCards[temp].setVisible(true);
            var pos = [];
            pos.x = (cardboxSize.width/this.pockerValue.length)*(temp+0.8);
            pos.y = (cardboxSize.height/2);
            var delay = cc.delayTime(0.1*(temp));
            var move = cc.MoveTo(0.1,pos);//0.05
            var scale = cc.ScaleTo(0.1,0.94);
            //var seq = cc.Sequence.create(move, scale);
            var seq = cc.Spawn.create(move,scale);
            var that = this;
            var callfunc = cc.CallFunc(function(){
                that.ShowSortPockerAni();
                });
            if(temp >= this.pockerValue.length -1){
                this.handCards[temp].runAction(cc.Sequence(delay,seq,callfunc));
			}
			else {
                this.handCards[temp].runAction(cc.Sequence(delay,seq));
			}
        }
    },
    //合并排序动作（有赖添加）
	ShowSortPockerAni:function () {
		//显示癞子
    	for(var num= 0;num < this.pockerValue.length;num++){
			if(this.handCards[num].getChildByName("laiSprite") != null){
                this.handCards[num].getChildByName("laiSprite").setVisible(true);
			}
		}

        // //合并手牌并移除
        // var num =
        // var pos = this.handCards[num].getPosition() ;
        // for(var num= 0;num < this.pockerValue.length;num++){
    		// var moveTo = cc.moveTo(,this.handCards[num].getPosition());
        //     this.handCards[num].runAction();
        // }
		//排序

		//拉开手牌



    },
    //旧版打枪效果
    setCardShowGan:function(pos,nGun){
    	cc.log("玩家打枪数据parseData pos= "+pos+"shuju="+ JSON.stringify(nGun));
    	this.CardOver[pos].setVisible(false);
    	var nlen = nGun.length;
//    	this.Paneloutcard[pos].removeChildByName("cardshow");
//    	SoundMgr.getInstance().playEffect("sss_daqiang", 0, false);
    	var cardPath ="";
    	if(nlen>=3){
    		//全垒打的图片
    		cardPath = "res/game-sss/Chinesepoke/quanleida.png";
    	}
    	else{
    		cardPath = "res/game-sss/Chinesepoke/gun.png";
    	}
    	cc.log("cardPath=" + cardPath);
    	var gunShow = new ccui.ImageView(cardPath, ccui.Widget.LOCAL_TEXTURE);
    	var overSize = this.CardOver[pos].getSize();
    	gunShow.x = this.CardOver[pos].x;
    	gunShow.y = this.CardOver[pos].y;
    	// gunShow.setScaleX(0.8);
    	// gunShow.setScaleY(overSize.height/gunShow.height);
		gunShow.setScale(0.5);
    	gunShow.setName("cardshow");
    	this.Paneloutcard[pos].addChild(gunShow);
    	gunShow.setLocalZOrder(100);

    	for(var num = 0;num<nlen;num++){
    		cardPath = "res/game-sss/Chinesepoke/dong.png";
    		var cardShow1 = new ccui.ImageView(cardPath, ccui.Widget.LOCAL_TEXTURE);
    		cardShow1.x = this.CardOver[pos].x;
    		cardShow1.y = this.CardOver[pos].y;
    		// cardShow1.setScaleX(overSize.width/cardShow1.width);
    		// cardShow1.setScaleY(overSize.height/cardShow1.height);
    		cardShow1.setName("cardshow");
    		this.Paneloutcard[nGun[num]].addChild(cardShow1);
    		cardShow1.setLocalZOrder(100);
    	}
    },
    //显示打枪动画
	ShowShootAni:function(pos,nGun){
		cc.log("玩家打枪数据parseData pos= "+pos+"shuju="+ JSON.stringify(nGun));
		this.CardOver[pos].setVisible(false);
		var nlen = nGun.length;
		var type = 0;
        var time = 0;
		var count = 0;
		if(nlen>=3){
			//全垒打
			type = 4;
            time = 1/18;
			count = 24;
		}
		else{//打枪
			if(pos == 0){
				type = 1;
			}
			else{
				type = 3;
			}
            time = 1/24;
			count = 15;
		}

		var name = "sssdq"+type;
		var animateFrame = [];
		var banimateFrame = [];
		var animPath = "";
		//打枪全垒打
		//动画帧
		cc.log("开始打枪动画帧");
		for (var i = 1; i <= count; i++) {
			animPath = "tx/"+ name + (i < 10 ? ("0" + i) : i) +".png";
			var frame = this.opFrameCach.getSpriteFrame(animPath);
			animateFrame.push(frame);
		}
		var animation = new cc.Animation(animateFrame, time);
	    cc.log("结束打枪动画帧");
	//    	this.Paneloutcard[pos].removeChildByName("cardshow");
	//    this.removeCardShow();
	    SoundMgr.getInstance().playEffect("sss_daqiang", 0, false);
	    animPath = "tx/"+ name + "01.png";
	    cc.log("查看打枪路径："+animPath);
	    //var gunShow = new ccui.ImageView(animPath, ccui.Widget.LOCAL_TEXTURE);
	    var gunShow = new cc.Sprite();
	    var overSize = this.CardOver[pos].getSize();
	    gunShow.x = this.CardOver[pos].x;
	    //其他玩家全垒打缩放0.6
		if(pos != 0 && nlen>=3){
            gunShow.setScale(0.6);
		}
		if(pos == 0){
			gunShow.y = this.CardOver[pos].y + 160;
		}
		else{
			gunShow.y = this.CardOver[pos].y ;
		}
	    // gunShow.setScaleX(0.8);
	    // gunShow.setScaleY(overSize.height/gunShow.height);
		cc.log("1.");
	    gunShow.setName("cardshow");
	    this.Paneloutcard[pos].addChild(gunShow);
	    gunShow.setLocalZOrder(100);
	    //animation.retain();
        cc.log("2.");
		//被打枪全垒打
		if(nlen>=3){//被全垒打
			type = 5;
			time = 1/18;
			count = 23;
		}
		else{//被打枪
			type = 2;
            time = 1/24;
			count = 12;
		}
        name = "sssdq"+type;
		var banimPath = "";

		//动画帧
		for (var i = 1; i <= count; i++) {
			banimPath = "tx/"+ name + (i < 10 ? ("0" + i) : i) +".png";
			var bframe = this.opFrameCach.getSpriteFrame(banimPath);
			banimateFrame.push(bframe);
		}
		var banimation = new cc.Animation(banimateFrame, time);

		for(var num = 0;num<nlen;num++){
			banimPath = "tx/"+ name + "01.png";
			//var cardShow1 = new ccui.ImageView(banimPath, ccui.Widget.LOCAL_TEXTURE);
			var cardShow1 = new cc.Sprite();
			cardShow1.x = this.CardOver[nGun[num]].x;
			if(nGun[num] == 0){
				cardShow1.y = this.CardOver[nGun[num]].y + 110;
                cardShow1.x = this.CardOver[nGun[num]].x - 20;
                cardShow1.setScale(2.0);//被全垒打放大2.0

            }
			else{
				cardShow1.y = this.CardOver[nGun[num]].y ;
			}
			// cardShow1.setScaleX(overSize.width/cardShow1.width);
			// cardShow1.setScaleY(overSize.height/cardShow1.height);
			cardShow1.setName("cardshow");
			this.Paneloutcard[nGun[num]].addChild(cardShow1);
			cardShow1.setLocalZOrder(100);
			//banimation.retain();
            //如果是被打枪
			if(type == 2){

                cardShow1.runAction(cc.sequence(cc.delayTime(num*1.8) ,cc.animate(banimation)));
			}
			else{//被全垒打
                cardShow1.setScale(2);
                if(nGun[num] == 0){
                    cardShow1.runAction(cc.sequence(cc.delayTime(0.2*num) ,cc.animate(banimation),cc.scaleTo(0,2,2)));
				}else{
                    cardShow1.runAction(cc.sequence(cc.delayTime(0.2*num) ,cc.animate(banimation),cc.scaleTo(0,1,1)));
				}

			}

		}

        //如果是打枪 角度 间隔
        if(type == 2){
			var dr_x = [0,0,0,0,0,0];
			var dr_y = [0,0,0,0,0,0];
			for(var num = 0;num < nlen;num++){
                var op = nGun[num];
                dr_x[num] = /*this.Paneloutcard[op].getChildByName("cardshow").getPositionX() +*/ this.Paneloutcard[op].x + this.PanelPlayer[op].x;
                dr_y[num] = /*this.Paneloutcard[op].getChildByName("cardshow").getPositionY() + */this.Paneloutcard[op].y + this.PanelPlayer[op].y;
                dr_x[num] = parseInt(dr_x[num]);
                dr_y[num] = parseInt(dr_y[num]);

                var mr_x = /*this.Paneloutcard[pos].getChildByName("cardshow").getPositionX() +*/ this.Paneloutcard[pos].x + this.PanelPlayer[pos].x;
                var mr_y = /*this.Paneloutcard[pos].getChildByName("cardshow").getPositionY() +*/ this.Paneloutcard[pos].y + this.PanelPlayer[pos].y;
                // mr_x = parseInt(mr_x);
                // mr_y = parseInt(mr_y);

                mr_x = parseInt(dr_x[num] - mr_x);
                mr_y = parseInt( dr_y[num] -mr_y);
                //var rp = this.getAngle(mr_x,mr_y,dr_x[num], dr_y[num]);
                var rp = this.getAngle(0,0,mr_x,mr_y);
                //var rp = this.getAngle(0,0,100,-100);
                // gunShow.runAction(cc.sequence(cc.CallFunc(function(){
                //     cc.log("旋转角度："+ rp );
                //     gunShow.setRotation(rp);
                // },this),cc.delayTime(num*1.8) ,cc.animate(animation)));
                gunShow.runAction(cc.sequence( cc.RotateBy.create(0.2,rp,rp),cc.delayTime(num*1.8) ,cc.animate(animation) ));
			}
        }
        else{
            gunShow.runAction(cc.animate(animation));
        }
	},
    //获取两点之间的角度
    getAngle:function (px,py,mx,my){//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角

        cc.log("枪洞x:"+mx+"y:"+my+"玩家坐标x"+px+"y:"+py);
        var x = Math.abs(px-mx);
        var y = Math.abs(py-my);
        var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        var cos = y/z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度
        cc.log("x:"+x+"y:"+y+"z"+z+"cos:"+cos+"radina"+radina+"gngle"+angle);


        if(px > mx && py < my){//第一象限
			cc.log("1.");
            angle =  0 -angle;
		}
        // if(px < mx && py < my){//第二象限-
        //     cc.log("1.");
        //     angle -=  90;
        // }
        if(px > mx && py > my){//第三象限
            cc.log("1.");
            angle -=  180;
        }
        if(px < mx && py > my){//第四象限
            cc.log("1.");
            angle +=  90;
        }
        cc.log("最后旋转"+angle);
        // if(mx>px&&my>py){//鼠标在第四象限
        // 	angle = 180 - angle;
        // }
        //
        // if(mx==px&&my>py){//鼠标在y轴负方向上
        // 	angle = 180;
        // }
        //
        // if(mx>px&&my==py){//鼠标在x轴正方向上
        // 	angle = 90;
        // }
        //
        // if(mx<px&&my>py){//鼠标在第三象限
        // 	angle = 180+angle;
        // }
        //
        // if(mx<px&&my==py){//鼠标在x轴负方向
        // 	angle = 270;
        // }
        //
        // if(mx<px&&my<py){//鼠标在第二象限
        // 	angle = 360 - angle;
        // }

		return angle;
	},

    setCardShowSpecial:function(cardData,pos,isMe){
    	cardData = DlgSSSCombination.getInstance().onBubbleSort(cardData,13);
    	cc.log("特殊时间到了1"+pos+"特殊牌组="+JSON.stringify(cardData));
    	var sPCard = [];
    	for(var num  = 0;num<13;num++){
    		sPCard[12-num] = cardData[num];
    		cc.log(" 1nSpec = "+sPCard[12-num]);
    		if(cardData[num]%16 == 14){
    			cardData[num] = cardData[num]-13;
    		}
    	}
    	var special = DlgSSSCombination.getInstance().onGetSpecialcard(sPCard,13);
    	this.CardOver[pos].setVisible(false);

    	cc.log("特殊牌型的值："+special);
    	if(special>0){
    		this.Paneloutcard[pos].removeChildByName("cardshow");
    		SoundMgr.getInstance().playEffect("sss_showcard"+special, 0, false);
    		var cardPath = "res/game-sss/Chinesepoke/showcard-"+special+".png";
    		cc.log("cardPath=" + cardPath);
    		var cardShow = new ccui.ImageView(cardPath, ccui.Widget.LOCAL_TEXTURE);
    		var overSize = this.CardOver[pos].getSize();
    		cardShow.x = this.CardOver[pos].x;
    		cardShow.y = this.CardOver[pos].y-40;
    		cardShow.setName("cardshow");
    		this.Paneloutcard[pos].addChild(cardShow);
    		cardShow.setLocalZOrder(100);
    	}

    	if(isMe == true){
            cardShow.setScale(1.5);
    	}
    	else{
    		var cardboxSize = this.Paneloutcard[pos].getSize();
    		var Card = [];
    		var testCard = CardSprite.create(10,0,true);
    		var sizeCard = testCard.ImgFront.getSize();
    		cc.log("特殊时间到了1"+pos+"特殊牌组="+JSON.stringify(cardData));

    		for(var Inum = 0;Inum<13;Inum++){
    			this.Paneloutcard[pos].removeChildByName("Card"+Inum);
    		}

    		for(var num = 0;num<3;num++){
    			Card[num] = this.onCreatCard(cardData[num],0);
    			Card[num].x = ((cardboxSize.width/8)*(num+1.5))+40;
    			Card[num].y = (cardboxSize.height/3)*2;
    			Card[num].setScaleX(0.8);
    			Card[num].setScaleY(((cardboxSize.height/2) / (sizeCard.height)));
    			Card[num].setName("Card"+num);
    			this.Paneloutcard[pos].addChild(Card[num]);
    			Card[num].setLocalZOrder(num+1);
    		}

    		for(var num = 3;num<8;num++){
    			Card[num] = this.onCreatCard(cardData[num],0);
    			Card[num].x = ((this.cardboxSize.width/8)*(num-2.5))+50;
    			Card[num].y = this.cardboxSize.height/2-20;
    			Card[num].setScaleX(0.8);
    			Card[num].setScaleY(((cardboxSize.height/2) / (sizeCard.height)));
    			Card[num].setName("Card"+num);
    			this.Paneloutcard[pos].addChild(Card[num]);
    			Card[num].setLocalZOrder(num+1);
    		}

    		for(var num = 8;num<13;num++){
    			Card[num] = this.onCreatCard(cardData[num],0);
    			Card[num].x = ((this.cardboxSize.width/8)*(num-5-2.5))+50;
    			Card[num].y = this.cardboxSize.height/3;
    			Card[num].setScaleX(0.8);
    			Card[num].setScaleY(((cardboxSize.height/2) / (sizeCard.height)));
    			Card[num].setName("Card"+num);
    			this.Paneloutcard[pos].addChild(Card[num]);
    			Card[num].setLocalZOrder(num+1);
    		}
    	}
    },

    setCardShowFirst:function(cardData,resultData,posArr,pos,isMe){
    	cc.log("第一道POS=" + pos);
    	cc.log("isMe=" + isMe);
    	cc.log("第一道较牌数据" + JSON.stringify(cardData));
    	cc.log("第一道结果数据" + JSON.stringify(resultData));

    	var oneValue = DlgSSSCombination.getInstance().onGetFirstCards(cardData[posArr]);
    	if(oneValue<0 || oneValue>8){
    		oneValue = 0;
    	}
    	SoundMgr.getInstance().playEffect("sss_showcard"+oneValue, 0, false);
    	var cardPath = "res/game-sss/Chinesepoke/showcard-"+oneValue+".png";
    	cc.log("cardPath=" + cardPath);
    	var cardShow = new ccui.ImageView(cardPath, ccui.Widget.LOCAL_TEXTURE);
    	var overSize = this.CardOver[pos].getSize();
    	cardShow.x = this.CardOver[pos].x;
    	if(isMe){
    		cardShow.y = this.CardOver[pos].y + 140;
            cardShow.x = this.CardOver[pos].x  - 11;
            cardShow.setScale(1.5);
    	}
    	else{
    		cardShow.y = this.CardOver[pos].y + 20;
    	}
    	cardShow.setName("cardshow");
    	this.Paneloutcard[pos].addChild(cardShow);
    	cardShow.setLocalZOrder(100);
    	this.CardOver[pos].setVisible(false);

    	for(var Inum = 0;Inum<3;Inum++){
    		this.Paneloutcard[pos].removeChildByName("Card"+Inum);
    	}
    	var cardboxSize = this.Paneloutcard[pos].getSize();
    	var Card = [];
    	var testCard = CardSprite.create(10,0,true);
    	var sizeCard = testCard.ImgFront.getSize();
    	if(isMe){
    		for(var num = 0;num<3;num++){
    			Card[num] = this.onCreatCard(cardData[posArr][num],0);
    			Card[num].x = ((cardboxSize.width/4)*(num+1.5)) - 35;
    			Card[num].y = (cardboxSize.height* 1.2 );
    			Card[num].setScale(0.94);
    			Card[num].setName("Card"+num);
    			this.Paneloutcard[pos].addChild(Card[num]);
    			Card[num].setLocalZOrder(num+1);
    		}
    	}
    	else{
    		for(var num = 0;num<3;num++){
    			Card[num] = this.onCreatCard(cardData[posArr][num],0);
    			Card[num].x = ((cardboxSize.width/8)*(num+1.5))+40;
    			Card[num].y = (cardboxSize.height/3)*2;
    			Card[num].setScale(0.52);
    			Card[num].setName("Card"+num);
    			this.Paneloutcard[pos].addChild(Card[num]);
    			Card[num].setLocalZOrder(num+1);
    		}
    	}

    	cc.log("1");
        var slen = 0;
    	if(resultData[posArr]>0){
            cc.log("2");
    		if(pos == 0){
                cc.log("3");
    			this.resultMyfirst_win.setString("."+resultData[posArr]);
    			this.resultMyfirst_win.setVisible(true);
    			var slen = this.resultMyfirst_win.getString().length;
    			this.resultMyfirst_win.setContentSize(35*slen,60);
    		}else{
                cc.log("4");
                this.resultfirst_win[pos].setVisible(true);
                this.resultfirst_win[pos].setString("."+resultData[posArr]);
                slen = this.resultfirst_win[pos].getString().length;
                this.resultfirst_win[pos].setContentSize(35*(slen),60);
			}
    	}
    	else{
            cc.log("5");
    		if(pos == 0){
                cc.log("6");
    			this.resultMyfirst_lost.setVisible(true);
    			this.resultMyfirst_lost.setString("/"+resultData[posArr]);
    			var slen = this.resultMyfirst_lost.getString().length;
    			this.resultMyfirst_lost.setContentSize(35*(slen-1),60);
    		}else{
                cc.log("7");
                this.resultfirst_lost[pos].setVisible(true);
                this.resultfirst_lost[pos].setString("/"+resultData[posArr]);
                slen = this.resultfirst_lost[pos].getString().length;
			}
            if(resultData[posArr] == 0){
                this.resultfirst_lost[pos].setContentSize(35*slen,60);
            }
            else{
                this.resultfirst_lost[pos].setContentSize(35*(slen-1),60);
            }
    	}
    },

    setCardShowSecond:function(cardData,resultData,posArr,pos,isMe){
    	cc.log("第二道POS=" + pos);
    	cc.log("isMe=" + isMe);
    	cc.log("第二道较牌数据" + JSON.stringify(cardData));
    	cc.log("第二道结果数据" + JSON.stringify(resultData));
    	var card0 = [0,0,0];
    	var card1 = [0,0,0,0,0];
    	card0 = card0.concat(cardData[posArr]);
    	card0 = card0.concat(card1);
    	var cardDataValue = card0;
    	for(var num = 0;num<13;num++){
    		if(cardDataValue[num]%16 == 1){
    			cardDataValue[num] = cardDataValue[num]+13;
    		}
    	}
    	var oneValue = DlgSSSCombination.getInstance().onGetSecondThirdCards(cardDataValue,3);
    	if(oneValue<0 || oneValue>8){
    		oneValue = 0;
    	}
    	SoundMgr.getInstance().playEffect("sss_showcard"+oneValue, 0, false);
    	var cardPath = "res/game-sss/Chinesepoke/showcard-"+oneValue+".png";
    	cc.log("2cardPath=" + cardPath);
    	var cardShow = new ccui.ImageView(cardPath, ccui.Widget.LOCAL_TEXTURE);
    	var overSize = this.CardOver[pos].getSize();
    	cardShow.x = this.CardOver[pos].x;
    	if(isMe){
    		cardShow.y = this.CardOver[pos].y + 60;
            cardShow.x = this.CardOver[pos].x  - 35;
            cardShow.setScale(1.5);
    	}
    	else{
    		cardShow.y = this.CardOver[pos].y - 10;
    	}
    	cardShow.setName("cardshow");
    	this.Paneloutcard[pos].addChild(cardShow);
    	cardShow.setLocalZOrder(100);

    	for(var Inum = 3;Inum<8;Inum++){
    		this.Paneloutcard[pos].removeChildByName("Card"+Inum);
    	}
    	var cardboxSize = this.Paneloutcard[pos].getSize();
    	var Card = [];
    	var testCard = CardSprite.create(10,0,true);
    	var sizeCard = testCard.ImgFront.getSize();

    	if(isMe){
    		for(var num = 3;num<8;num++){
    			Card[num] = this.onCreatCard(cardData[posArr][num-3],0);
    			Card[num].x = ((cardboxSize.width/4)*(num-2.5))  - 35;
    			Card[num].y = cardboxSize.height*0.85;
    			Card[num].setScale(0.94);
    			Card[num].setName("Card"+num);
    			this.Paneloutcard[pos].addChild(Card[num]);
    			Card[num].setLocalZOrder(num+1);
    		}
    	}
    	else{
    		for(var num = 3;num<8;num++){
    			Card[num] = this.onCreatCard(cardData[posArr][num-3],0);
    			Card[num].x = ((cardboxSize.width/8)*(num-2.5))+40;
    			Card[num].y = cardboxSize.height/2;
    			Card[num].setScale(0.52);
    			Card[num].setName("Card"+num);
    			this.Paneloutcard[pos].addChild(Card[num]);
    			Card[num].setLocalZOrder(num+1);
    		}
    	}

    	var slen = 0;
    	if(resultData[posArr]>0){
    		if(pos == 0){
    			this.resultMysecond_win.setVisible(true);
    			this.resultMysecond_win.setString("."+resultData[posArr]);
    			slen = this.resultMysecond_win.getString().length;
    			this.resultMysecond_win.setContentSize(35*slen,60);
    		}else{
                this.resultsecond_win[pos].setVisible(true);
                this.resultsecond_win[pos].setString("."+resultData[posArr]);
                slen = this.resultsecond_win[pos].getString().length;
                this.resultsecond_win[pos].setContentSize(35*(slen),60);
			}
    	}
    	else{
    		if(pos == 0){
    			this.resultMysecond_lost.setVisible(true);
    			this.resultMysecond_lost.setString("/"+resultData[posArr]);
    			slen = this.resultMysecond_lost.getString().length;
    			this.resultMysecond_lost.setContentSize(35*(slen-1),60);
    		}else{
                this.resultsecond_lost[pos].setVisible(true);
                this.resultsecond_lost[pos].setString("/"+resultData[posArr]);
                slen = this.resultsecond_lost[pos].getString().length;
			}
            if(resultData[posArr] == 0){
                this.resultsecond_lost[pos].setContentSize(35*slen,60);
            }
            else{
                this.resultsecond_lost[pos].setContentSize(35*(slen-1),60);
            }
    	}
    },

    setCardShowThird:function(cardData,resultData,posArr,pos,isMe){
    	cc.log("第三道POS=" + pos);
    	cc.log("isMe=" + isMe);
    	cc.log("第三道较牌数据" + JSON.stringify(cardData));
    	cc.log("第三道结果数据" + JSON.stringify(resultData));
    	var card = [0,0,0,0,0,0,0,0];
    	var cardDataValue = card.concat(cardData[posArr]);
    	for(var num = 0;num<13;num++){
    		if(cardDataValue[num]%16 == 1){
    			cardDataValue[num] = cardDataValue[num]+13;
    		}
    	}
    	var oneValue = DlgSSSCombination.getInstance().onGetSecondThirdCards(cardDataValue,8);
    	if(oneValue<0 || oneValue>8){
    		oneValue = 0;
    	}
    	SoundMgr.getInstance().playEffect("sss_showcard"+oneValue, 0, false);
    	var cardPath = "res/game-sss/Chinesepoke/showcard-"+oneValue+".png";
    	cc.log("3cardPath=" + cardPath);
    	var cardShow = new ccui.ImageView(cardPath, ccui.Widget.LOCAL_TEXTURE);

    	var overSize = this.CardOver[pos].getSize();
    	cardShow.x = this.CardOver[pos].x;
    	if(isMe){
    		cardShow.y = this.CardOver[pos].y - 20;
            cardShow.x = this.CardOver[pos].x  - 35;
            cardShow.setScale(1.5);
    	}
    	else{
    		cardShow.y = this.CardOver[pos].y - 50;
    	}

    	cardShow.setName("cardshow");
    	this.Paneloutcard[pos].addChild(cardShow);
    	cardShow.setLocalZOrder(100);

    	for(var Inum = 8;Inum<13;Inum++){
    		this.Paneloutcard[pos].removeChildByName("Card"+Inum);
    	}
    	var cardboxSize = this.Paneloutcard[pos].getSize();
    	var Card = [];
    	var testCard = CardSprite.create(10,0,true);
    	var sizeCard = testCard.ImgFront.getSize();

    	if(isMe){
    		for(var num = 8;num<13;num++){
    			Card[num] = this.onCreatCard(cardData[posArr][num-8],0);
    			Card[num].x = ((cardboxSize.width/4)*(num-5-2.5))  - 35;
    			Card[num].y = cardboxSize.height*0.5;
    			Card[num].setScale(0.94);
    			Card[num].setName("Card"+num);
    			this.Paneloutcard[pos].addChild(Card[num]);
    			Card[num].setLocalZOrder(num+1);
    		}
    	}
    	else{
    		for(var num = 8;num<13;num++){
    			Card[num] = this.onCreatCard(cardData[posArr][num-8],0);
    			Card[num].x = ((cardboxSize.width/8)*(num-5-2.5))+40;
    			Card[num].y = cardboxSize.height/3;
    			Card[num].setScale(0.52);
    			Card[num].setName("Card"+num);
    			this.Paneloutcard[pos].addChild(Card[num]);
    			Card[num].setLocalZOrder(num+1);
    		}
    	}

    	var slen = 0;
    	if(resultData[posArr]>0){
    		if(pos == 0){
    			this.resulMythird_win.setString("."+resultData[posArr]);
    			this.resulMythird_win.setVisible(true);
    			slen = this.resulMythird_win.getString().length;
    			this.resulMythird_win.setContentSize(35*(slen),60);
    		}else{
                this.resulthird_win[pos].setVisible(true);
                this.resulthird_win[pos].setString("."+resultData[posArr]);
                slen = this.resulthird_win[pos].getString().length;
                this.resulthird_win[pos].setContentSize(35*(slen),60);
			}
    	}
    	else{
    		if(pos == 0){
    			this.resulMythird_lost.setString("/"+resultData[posArr]);
    			this.resulMythird_lost.setVisible(true);
    			slen = this.resulMythird_lost.getString().length;
    			this.resulMythird_lost.setContentSize(35*(slen-1),60);
    		}else{
                this.resulthird_lost[pos].setVisible(true);
                this.resulthird_lost[pos].setString("/"+resultData[posArr]);
                slen = this.resulthird_lost[pos].getString().length;
			}
            if(resultData[posArr] == 0){
                this.resulthird_lost[pos].setContentSize(35*slen,60);
            }
            else{
                this.resulthird_lost[pos].setContentSize(35*(slen-1),60);
            }
    	}
    },

    setCardonoutBox:function(num){
    	this.Panelcardbox[num].setVisible(false);
    	this.Paneloutcard[num].setVisible(true);
    	this.CardOver[num].setVisible(true);
    	this.CardOver[num].setLocalZOrder(100);
    	this.cardboxSize = this.Paneloutcard[num].getSize();
    	var Card = [];
    	var testCard = CardSprite.create(16,0,true);
    	var sizeCard = testCard.ImgFront.getSize();

    	for(var temp = 0; temp<13;temp++){
    		var testCard = this.Paneloutcard[num].getChildByName("Card"+temp);
    		Card[temp] = this.onCreatCard(16, 0);
    		if(testCard == null){
    			if(temp<3){
    				Card[temp].x = ((this.cardboxSize.width/8)*(temp+1.5))+40;
    				Card[temp].y = (this.cardboxSize.height/3)*2;
    			}
    			else if(temp<8 && temp>2){
    				Card[temp].x = ((this.cardboxSize.width/8)*(temp-2.5))+50;
    				Card[temp].y = this.cardboxSize.height/2;
    			}
    			else{
    				Card[temp].x = ((this.cardboxSize.width/8)*(temp-5-2.5))+50;
    				Card[temp].y = this.cardboxSize.height/3;
    			}

    			Card[temp].setScaleX(0.8);
    			Card[temp].setScaleY(((this.cardboxSize.height/2) / (sizeCard.height)));
    			Card[temp].setName("Card"+temp);
    			//Card[temp].setVisible(false);
    			this.Paneloutcard[num].addChild(Card[temp]);
    			Card[temp].setLocalZOrder(temp+1);
    		}
    	}
    },

    resetHandCardOnPanelcardBox:function(){
    	for(var num =0;num<CMD_SSS.GAME_PLAYER;num++){
    		cc.log("num = " + num);
    		this.PlayerReady[num].setVisible(false);
    		this.resultfirst_win[num].setVisible(false);
    		this.resultfirst_lost[num].setVisible(false);
    		this.resultsecond_win[num].setVisible(false);
    		this.resultsecond_lost[num].setVisible(false);
    		this.resulthird_win[num].setVisible(false);
    		this.resulthird_lost[num].setVisible(false);

    		for(var temp = 0;temp<13;temp++){
    			this.Paneloutcard[num].removeChildByName("Card"+temp);
    		}
    	}
    },

	setHandCardOnPanelcardbox:function(handCard,num){
		cc.log("num = " + num);
		for(var num1 =0;num1<13;num1++){
			cc.log("poke["+num1+"]"+handCard[num1]);
		}
		this.Panelcardbox[num].setVisible(false);
		this.Paneloutcard[num].setVisible(true);
		this.CardOver[num].setVisible(true);
		this.CardOver[num].setLocalZOrder(100);
		this.cardboxSize = this.Paneloutcard[num].getSize();
		var Card = [];
		var testCard = CardSprite.create(handCard[0],0,true);
		var sizeCard = testCard.ImgFront.getSize();

		for(var temp = 0; temp<13;temp++){
			var testCard = this.Paneloutcard[num].getChildByName("Card"+temp);
			if(handCard[temp]%16 == 14){
				Card[temp] = this.onCreatCard(handCard[temp]-13, 0);
			}
			else{
				Card[temp] = this.onCreatCard(handCard[temp], 0);
			}

			if(testCard == null){
				if(temp<3){
					Card[temp].x = ((this.cardboxSize.width/8)*(temp+1.5))+40;
					Card[temp].y = (this.cardboxSize.height/3)*2;
				}
				else if(temp<8 && temp>2){
					Card[temp].x = ((this.cardboxSize.width/8)*(temp-2.5))+50;
					Card[temp].y = this.cardboxSize.height/2;
				}
				else{
					Card[temp].x = ((this.cardboxSize.width/8)*(temp-5-2.5))+50;
					Card[temp].y = this.cardboxSize.height/3;
				}

				Card[temp].setScaleX(0.8);
				Card[temp].setScaleY(((this.cardboxSize.height/2) / (sizeCard.height)));

				this.Paneloutcard[num].addChild(Card[temp]);
				Card[temp].setName("Card"+temp);
			}
		}
	},

    onClickPlayerImg:function(sender, type){
        if (ccui.Widget.TOUCH_ENDED == type) {
           var strImgName = sender.getName();
           cc.log('sender.getTag()' + sender.getTag());
           var table = ClientData.getInstance().getTable();
           if(!table){
           	return;
           }
           var chairId = SssUIMgr.getInstance().getChairIdByPlayerPos(sender.getTag());
           var player = table.getPlayerByChairID(chairId);
           if(player){
           	PlazaUIMgr.getInstance().ongetPlayerInfo(player.getUserId());
           	var UIplayer = UIMgr.getInstance().getDlg(ID_DlgPlazaUserInfo);
           	if(UIplayer == null){
           		UIplayer = UIMgr.getInstance().openDlg(ID_DlgPlazaUserInfo);
           		UIplayer.setFaceByFaceId(player);
           	}
           }
		}
	},
	onClickBtnEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_talk":

				break;
			case "Button_word":

				break;
			case "luPart_bg":

				break;
			case "Button_help":

				break;
			case "Button_set":

				break;

			default:
				break;
			}
		}
	},
	//创建扑克牌
	onCreatCard : function(value,style){
		if (value == 0) value = 1;
		if (value == 0x41) value = 0x4e;
		if (value == 0x42) value = 0x4f;

		var cardPath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_" + style.toString() + ".png";
		cc.log("4cardPath"+cardPath);
		if (value < 0 || (value > 0x0d && value < 0x11) || (value > 0x1d && value < 0x21) ||
				(value > 0x2d && value < 0x31) || (value > 0x3d && value != 0x4e && value != 0x4f)) {
			cc.log("未知牌"+value);
			cardPath = "huaiFengCardListPlist/img_card_back.png";
		}

		var image_front = new ccui.ImageView(cardPath, ccui.Widget.PLIST_TEXTURE);
		return image_front;
	}
});
