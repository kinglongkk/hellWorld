var DdzCardSprite = CardSprite.extend({

});
 

DLG_CREATOR[ID_DdzDlgPlayer] = function() {
	return new DdzDlgPlayer();
};

var DdzDlgPlayer = DlgBase.extend({
	ctor: function(){
		this.PanelPlayerPos = [];
		this.ImgBg = [];
		this.ImgFace = [];
		this.LabNick = [];
		this.LabMoney = [];
		this.PanelCardGroup = [];
		this.PanelOpen = [];
		this.openCards = [];

		this.ImgReady = [];

		this.DlgBg = [];
		this.TextDlg = [];

		this.opendeal =[];     //明牌
		this.handCards = [];  //手牌
        this.TextLoc = [];
        this.btnLoc = [];
        //this.TextCardCount = [];	// 剩余牌数

		this.ImgClockBg = [];	// 闹钟背景
		this.TextClock = [];	// 闹钟倒计时
		this.IconLand	= [];	// 地主标识
		this.TextScore = [];	// 叫分数

		this.timeOutClock = null;	// 闹钟定时器
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {
        if (this.timeOutClock != undefined) {
            clearInterval(this.timeOutClock);
            this.timeOutClock = undefined;
        }
	},

	init: function() {
		var json = ccs.load(res.dlgPlayer_ddz_json);
		this._rootWidget = json.node;
		cc.log(this._rootWidget)
		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);


		var i;
		for(i = 0; i < CMD_DDZ.GAME_PLAYER; i++){

			this.PanelPlayerPos[i] = this._rootWidget.getChildByName("Panel_player" + i);

			this.Buttonshezhi =  this._rootWidget.getChildByName("Button_shezhi");
			this.Buttonshezhi.addTouchEventListener(function (sender, type) {
				if (ccui.Widget.TOUCH_ENDED == type) {
					UIMgr.getInstance().openDlg(ID_DlgGameSet);
				}
			}, this);
			this.Buttonguize =  this._rootWidget.getChildByName("Button_guize");
			this.Buttonguize.addTouchEventListener(function (sender, type) {
				if (ccui.Widget.TOUCH_ENDED == type) {
					var dlgRule =UIMgr.getInstance().openDlg(ID_DlgGameRule);
				}
			}, this);

			this.PanelCardGroup[i] = this.PanelPlayerPos[i].getChildByName("Panel_cardbox");
//			this.TextCardCount[i]	= this.PanelPlayerPos[i].getChildByName("Text_cardcount");
//			if (this.TextCardCount[i]) {
//                this.TextCardCount[i].setVisible(false);	// 一开始默认先隐藏
//			}

			this.PanelOpen[i] = this.PanelPlayerPos[i].getChildByName("Panel_outcard");
			this.opendeal[i] = this.PanelPlayerPos[i].getChildByName("Panel_ope");
			this.ImgReady[i] = this.PanelPlayerPos[i].getChildByName("ImgReady");

			this.DlgBg[i] = this.PanelPlayerPos[i].getChildByName("Image_Dialog");
            this.DlgBg[i].setVisible(false);

			this.TextDlg[i] = this.DlgBg[i].getChildByName("Text_word");

			this.ImgClockBg[i]	= this.PanelPlayerPos[i].getChildByName("Image_clock");
			this.TextClock[i]	= this.ImgClockBg[i].getChildByName("Atl_second");
			this.ImgClockBg[i].setVisible(false);
			this.TextScore[i]	= this.PanelPlayerPos[i].getChildByName("Text_Score");
			this.TextScore[i].setVisible(false);

			// 个人信息层
			this.ImgBg[i] 		= this.PanelPlayerPos[i].getChildByName("Image_break").getChildByName("Image_player");
			this.TextLoc[i]		= this.PanelPlayerPos[i].getChildByName("Tplayer_distance");
			this.LabNick[i] 	= this.PanelPlayerPos[i].getChildByName("Image_break").getChildByName("Text_nickname");
			this.LabMoney[i] 	= this.PanelPlayerPos[i].getChildByName("Image_break").getChildByName("Text_money");
			this.btnLoc[i]		= this.PanelPlayerPos[i].getChildByName("Image_position");
			cc.log(this.btnLoc[i])
			this.ImgFace[i]		= this.PanelPlayerPos[i].getChildByName("Image_break").getChildByName("Image_player");
            //this.Image_break    = this.ImgFace[i].getChildByName("Image_break");
            //this.Image_break.setVisible(false);
            
            // 先把定位隐藏掉
			this.TextLoc[i].setVisible(false);
			this.btnLoc[i].setVisible(false);

            // 添加事件
            this.ImgFace[i].setTouchEnabled(true);
            this.ImgFace[i].setTag(i);
            this.ImgFace[i].addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED == type) {
                    var table = ClientData.getInstance().getTable();
                    if(!table){
                        return;
                    }
                    var chairId = DdzUIMgr.getInstance().getChairIdByPlayerPos(sender.getTag());
                    var player = table.getPlayerByChairID(chairId);
                    if (player)
						UIMgr.getInstance().openDlg(ID_DlgUserInfo);
                        PlazaUIMgr.getInstance().ongetPlayerInfo(player.getUserId());
                }
            });
            this.IconLand[i]	= this.PanelPlayerPos[i].getChildByName("Image_Land");
            this.IconLand[i].setVisible(false);

			this.PanelPlayerPos[i].setEnabled(false);
			this.PanelPlayerPos[i].setVisible(false);
		}

		this.updatePlayerInfo(0, g_objHero);

        //添加文字聊天监听
        var calcu = function(thisObj){
            return function(even){
                thisObj.setChatBubble(even._userData);
            }
        }
        g_objHero.addListenerWordMsg(calcu(this));

		// 初始化房间信息
		this.Panel_roomInfo = this._rootWidget.getChildByName("Panel_Personal");
		this.Panel_roomInfoEx = this.Panel_roomInfo.getChildByName("Panel_roomInfoEx");
		// 房间信息扩展
		var game = ClientData.getInstance().getGame();
		var roomSpecialInfo = game.getGameRoomOhterInfo();
		var payType = game.getGameRoomPayType();

		if(roomSpecialInfo!=undefined)
		{
			this.Image_PayType = this.Panel_roomInfo.getChildByName("Image_PayType");
			var bAA = (payType == 2 ? true: false);
			this.Image_PayType.loadTexture(bAA==true ? res.payType_AA : res.payType_Zhuang, ccui.Widget.LOCAL_TEXTURE);

			// 开关 res.info_Close  资源是开
			this.openCb = function (sender, type) {
				if (ccui.Widget.TOUCH_ENDED == type){
					this.btnOpen +=1;
					this.Panel_roomInfoEx.setVisible(this.btnOpen%2==0?false:true);
					this.Panel_content.setVisible(this.btnOpen%2==0?false:true);
					this.Btn_RoomInfoEx.loadTextureNormal(this.btnOpen%2==0 ?  res.info_Open : res.info_Close , ccui.Widget.LOCAL_TEXTURE);
					this.btnOpen = this.btnOpen%2;
				}
			};

			this.btnOpen = 0;
			this.Btn_RoomInfoEx = this.setBtnCallBack(this.Panel_roomInfo,"Btn_RoomInfoEx",this.openCb);
			this.Panel_content = this.Panel_roomInfo.getChildByName("Panel_content");

			var ListBgSize = this.Panel_roomInfoEx.getContentSize();
			var testH =  20;
			var info = [];

			if(roomSpecialInfo.GameType!=undefined){
				info.push(roomSpecialInfo.GameType==0 ? "经典场" : (roomSpecialInfo.GameType==1 ?  "欢乐场" : "癞子场"));
			}

			if(roomSpecialInfo.King == true){
				info.push("八王");
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
	},


	betValue: function(pos, value, leaveMoney){
		this.setMoney(pos, leaveMoney);

		SoundMgr.getInstance().playEffect("add_score", 0, false);
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
	// 更新玩家积分
	scoreValue: function(){
        var table = ClientData.getInstance().getTable();
        if (!table) return;

        var plaza = ClientData.getInstance().getPlaza();
        var nType = plaza.getCurGameType();
		for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
			var player = table.getPlayerByChairID(i);
			var nScore = player.getMoney();
            if(nType == GAME_GENRE_PERSONAL) {
            	nScore = player.getScore();
			}

			this.setMoney(DdzUIMgr.getInstance().getPlayerPosByChairId(i), nScore);
		}
	},

	updateCallScore: function () {

    },

	setHandCardSpace: function(pos, width){
		var i;
		for(i=0; i<CMD_NIUNIU_TB.GAME_PLAYER; i++){
			if(i == 0){
				this.handCards[i].setCardSpace(new cc.p(120,0));
			}else{
				this.handCards[i].setCardSpace(new cc.p(60,0));
			}
		}
	},

	//发牌结束点位置
	getCardPosByIndex: function(pos, cardIndex){
		// cc.log("++++++ = pos = " + pos + " cardIndex = " + cardIndex);
		var cardSpace = this.handCards[pos].getCardSpace();
		var card = CardSprite.create(0x00, 0, false);
		var cardSize = card.getSize();
		var scale = this.handCards[pos].getScale();
		var cardPos = cc.p( (cardSize.width / 2 + cardIndex * cardSpace.x) * scale, (cardSize.height / 2) * scale);
		var worldPos = this.handCards[pos].getWorldPosition();
		var ptEnd = cc.pAdd(worldPos, cardPos);
		//cc.log("worldPos x = " + worldPos.x + " y = " + worldPos.y);

		return worldPos;
	},

	//手牌
	addCard:function(pos, value, bFace, cb){
		var cardGroup = this.handCards[pos];

		cardGroup.addCard(value, bFace);
		var len = cardGroup.getCardGroupLen();
		if(len == 5){			
			if(pos == 0){
				this.handCards[pos].setCardSpace(new cc.p(120,0));

				cardGroup.setAllFace(true);
				cardGroup.runUnfold(cb);
			}else{
				this.handCards[pos].setCardSpace(new cc.p(60,0));

				cardGroup.runUnfold();
			}			
		}
	},

	//type = 0 - 10
	setNiuType: function(pos, type){

	},

	resetDlg: function(){
		for(i=0; i<CMD_NIUNIU_TB.GAME_PLAYER; i++){
			this.handCards[i].clearAllCard();
			this.handCards[i].setCardSpace(new cc.p(3,0));
			this.PanelType[i].setVisible(false);
			this.LabBet[i].setVisible(false);
			this.openCards[i].clearAllCard();
			this.LabLose[i].setVisible(false);
			this.LabWin[i].setVisible(false);
		}
	},

	tipCard: function(pos, cardValue){
		var len = this.handCards[pos].getCardGroupLen();

		for(var i=0; i<len; i++){
			var card = this.handCards[pos].getCardByIndex(i);
			if(card){
				for(var j=0; j<cardValue.length; j++){
					if(j<3 && card.getCardValue() == cardValue[j]){
						card.onCardUp(true);
					}
				}
			}
		}
	},

	openCard: function(pos, cardValue){
		this.handCards[pos].clearAllCard();
		this.openCards[pos].clearAllCard();

		this.openCards[pos].addCardList(cardValue, true);

		for(var i=0; i<3; i++){
			var card = this.openCards[pos].getCardByIndex(i);
			if(card){
				card.onCardUp(true);
			}
		}

		SoundMgr.getInstance().playEffect("open_card", 0, false);
	},

	onClickBackListGame: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			cc.log('onClickBackListGame');
		}
	},
	//最新玩家信息
	updatePlayerInfo: function(pos, player){
		cc.log("pos="+pos);
		if(player == null){
			this.PanelPlayerPos[pos].setEnabled(false);
			this.PanelPlayerPos[pos].setVisible(false);
			return;
		}

		this.PanelPlayerPos[pos].setEnabled(true);
		this.PanelPlayerPos[pos].setVisible(true);

		var faceId = player.getUserId();
		var gender = player.getGender();
		var nick = player.getNickName();
		var money = player.getMoney();
		var status = player.getStatus();

        var plaza = ClientData.getInstance().getPlaza();
        var curGameType = plaza.getCurGameType();	//设置游戏类型 1：房卡 其他：金币
        if(curGameType == GAME_GENRE_PERSONAL){
            //房卡
			money = player.getScore();
        }

		this.setFaceByFaceId(pos, faceId, gender);
		this.setNickName(pos, nick);
		this.setMoney(pos, money);
		this.setStatus(pos, status);
	},

	setFaceByFaceId: function(pos, userID, gender){
        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }

        var player = table.getPlayerByUserId(userID);
        if (!player) return;

        var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(player.getChairID());
        cc.log("排位="+pos+"userid="+userID+"chairid="+player.getChairID());

        var ImageThum = this.ImgFace[pos];
        player.loadUrlImage(function (imagePath) {
            ImageThum.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
        });
	},

	setNickName: function(pos, strNick){
		if(pos != 0){
			strNick = MyUtil.strCut(strNick, 6, true);
		}

		this.LabNick[pos].string = strNick;
	},
	setMoney: function(pos, money){
		this.LabMoney[pos].string = money;
	},
	setStatus: function(pos, status){
		this.ImgReady[pos].setVisible(status == US_READY);
		if (status == US_READY) {
			this.PanelOpen[pos].removeAllChildren();
			if (pos == 0) {
				//UIMgr.getInstance().closeDlg(ID_DdzDlgReady);
			}
		}
		// 掉线状态
		if (status == US_OFFLINE) {
			// 显示断线状态
			//this.Image_break.setVisible(true);
		}else{
			//this.Image_break.setVisible(false);
		}
	},
	getCancel:function(){
		this.ImgReady[0].setVisible(false);
	},
	setBanker: function(pos){
		 
	},

    setChatBubble: function (data) {
        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }

        var player = table.getPlayerByUserId(data.dwSendUserID);

        var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(player.getChairID());
        this.DlgBg[pos].setVisible(true);
        this.TextDlg[pos].string = data.szChatString;

        var calcu = function(thisObj, pos){
            return function(){
                cc.log("时间到了"+pos);
                thisObj.DlgBg[pos].setVisible(false);
            }
        };

        setTimeout(calcu(this, pos), 3000);
    },

    setClockUI: function (pos) {
		for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
			this.ImgClockBg[i].setVisible(i == pos);
		}

        if (this.timeOutClock != undefined) {
			clearInterval(this.timeOutClock);
            this.timeOutClock = undefined;
        }

		if (this.TextClock[pos]) {
            // 设置倒计时
            var calcu = function (thisObj, textClock) {
                return function () {

					var slem = textClock.getString().length;
					textClock.setContentSize(39 * slem, 55);
                    var nTime = parseInt(textClock.getString());
                    if (nTime <= 0) {
                        if (thisObj.timeOutClock != undefined) {
                        	clearInterval(thisObj.timeOutClock);
                        	thisObj.timeOutClock = undefined;
                        }
                    } else {
                        nTime--;
                        textClock.string = nTime;
						var sl = textClock.getString().length;
						textClock.setContentSize(39 * sl, 55);
                    }
                }
            };

            var table = ClientData.getInstance().getTable();
            if(!table){
                return;
            }

            var game = ClientData.getInstance().getGame();
            if(!game){
                return;
            }

            var gameStatus = table.getGameStatus();
            if (gameStatus == CMD_DDZ.GS_TK_CALL) {
            	// 叫庄
                this.TextClock[pos].string = game.getTimeCallScore();
			} else if (gameStatus == CMD_DDZ.GS_TK_PLAYING) {
            	// 游戏中
				this.TextClock[pos].string = game.getTimeOutCard();
			}

            this.timeOutClock = setInterval(calcu(this, this.TextClock[pos]), 1000);
		}
    },

	//托管
	onTrusteeto:function(data){
		cc.log("进入托管状态"+data);
		var eUser = data.TrusteeUser;
		var chairId = DdzUIMgr.getInstance().getChairIdByPlayerPos(0);
		if(eUser != chairId)return;
		if(data.Trustee == true){
			UIMgr.getInstance().closeDlg(ID_DdzDlgCardOp);
			UIMgr.getInstance().openDlg(ID_DdzDlgState);
		}else{
			UIMgr.getInstance().closeDlg(ID_DdzDlgState);
		}
	},
    // 展示牌
	updateCards: function () {
		//显示底牌区域
		var dlg = UIMgr.getInstance().openDlg(ID_DdzDlgSence);
		dlg.whitecard();
		
        for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
            this.PanelCardGroup[i].removeAllChildren();
        }

		var game = ClientData.getInstance().getGame();
		if (!game) return;

        game.sortCardsValueWithChairId(g_objHero.getChairID());
		var cardsValue = game.getHandCardValues(g_objHero.getChairID());
		cc.log("斗地主牌"+cardsValue);

		var centerX = this.PanelCardGroup[0].getContentSize().width / 2;
		var centerCardIndex = (DdzModel.prototype.CountArray(cardsValue) - 1) / 2;
		this.AnchorX = [];
		for (var i = 0; i < DdzModel.prototype.CountArray(cardsValue); i++) {

			if (cardsValue[i] == 0) continue;
			var cardSprite = new CardSprite();
			cardSprite.setValue(cardsValue[i], 0);
			cardSprite.setContentSize(cardSprite.ImgBack.getContentSize());
			cardSprite.setTouchEnabled(false);
			var that = this;
			listener = cc.EventListener.create({
				event:cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches:true,                                                      // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
				onTouchBegan:function(touch, event){                                      //实现 onTouchBegan 事件回调函数

					var target = event.getCurrentTarget();  // 获取事件所绑定的 target, 通常是cc.Node及其子类
					// 获取当前触摸点相对于按钮所在的坐标
					var locationInNode = target.convertToNodeSpace(touch.getLocation());

					that.isUp = false;
					var allChild = that.PanelCardGroup[0].getChildren();
					if (allChild.length > 0) {
						var startSprite = allChild[0];
						var endSprite = allChild[allChild.length - 1];
						if (locationInNode.x < startSprite.x) {
							that.isUp = startSprite.isUp();
						} else if (locationInNode.x > endSprite.x + endSprite.getContentSize.width / 2) {
							that.isUp = endSprite.isUp();
						}
					}

					var rect = cc.rect(0.5,0,1200,180);//点击到划牌区域的矩形位置
					if (cc.rectContainsPoint(rect, locationInNode)){
						cc.log("鼠标按下"+locationInNode.x+","+locationInNode.y);
						cc.log(that.isUp +"up")
						that.InNode =  locationInNode.x;

						for(var i = 0; i < allChild.length; i++){
							var spriteCard = allChild[i];
							if (that.InNode >= that.AnchorX[i].startX && that.InNode <= that.AnchorX[i].endX) {
								that.isUp = spriteCard.isUp();
								cc.log(that.AnchorX[i].startX)
								cc.log(that.AnchorX[i].endX)
								cc.log(spriteCard.getCardValue()+"i"+i)
								break;
							}
						}
					}
					return true;
				},
				onTouchMoved:function(touch, event){
					var target = event.getCurrentTarget();  // 获取事件所绑定的 target, 通常是cc.Node及其子类
					// 获取当前触摸点相对于按钮所在的坐标
					var locationInNode = target.convertToNodeSpace(touch.getLocation());
					var rect = cc.rect(0.5,0,1200,180);//点击到划牌区域的矩形位置
					if (cc.rectContainsPoint(rect, locationInNode)){
						that.location  = locationInNode.x
					}
					var max = Math.max(that.InNode, that.location);
					var min = Math.min(that.InNode, that.location);
					var allChild = that.PanelCardGroup[0].getChildren();
					for(var i = 0; i < allChild.length; i++){
						var spriteCard = allChild[i];
						if(spriteCard.x > min && spriteCard.x <= max){
							spriteCard.onCardUp(!that.isUp);
						}
					}
					max = 0;
					min = 0;
					return true;										
				},
				onTouchEnded:function(touch, event){
					var target = event.getCurrentTarget();  // 获取事件所绑定的 target, 通常是cc.Node及其子类
					// 获取当前触摸点相对于按钮所在的坐标
					var locationInNode = target.convertToNodeSpace(touch.getLocation());
					var rect = cc.rect(0.5,0,1200,180);//点击到划牌区域的矩形位置
					var touchX = touch.getLocation().x;
					if (cc.rectContainsPoint(rect, locationInNode)){
						var allChild = that.PanelCardGroup[0].getChildren();
						for(var i = 0; i < allChild.length; i++){
							var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
							var AnchorX = dlg.AnchorX[i];
							if ((AnchorX.startX+128) < touchX && (AnchorX.endX+128) > touchX) {
								var spriteCard = allChild[i];
								spriteCard.onCardUp(!that.isUp);
								break;
							}
						}
					}
					var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgCardOp);
					if (!dlg) return;	// 轮到自己出牌的时候才能点
					// 选牌是否有效，按钮是否显示可按
					var dlg1 = UIMgr.getInstance().getDlg(ID_DdzDlgPlayer);
					var cardsValue = dlg1.getWillSendCard();
					dlg.BtnOut.setBright(cardsValue.length > 0);
					dlg.BtnOut.setTouchEnabled(cardsValue.length > 0);
					return true;
				}
			});
			

			
			cardSprite.setAnchorPoint(cc.p(0.5, 0));
			cardSprite.x = centerX + (i - centerCardIndex) * 51;
			cardSprite.y = 0;
			this.PanelCardGroup[0].addChild(cardSprite);
			cc.eventManager.addListener(listener, this.PanelCardGroup[0]);

			this.laiziSearchData = DdzModel.prototype.GetCardValue(cardsValue[i]);
			var game = ClientData.getInstance().getGame();
			var laizidata = game.getLiziCard();
			if(this.laiziSearchData == laizidata){
				var laiSprite = new cc.Sprite("res/public/huaiFengCard/FrameLai01.png");
				laiSprite.setAnchorPoint(cc.p(0, 0));
				cardSprite.addChild(laiSprite);
			}
			var Anchor = {};
			//192-67+728-600
			Anchor.startX = cardSprite.x - cardSprite.getContentSize().width * 0.5; //+ this.PanelCardGroup[0].x - this.PanelCardGroup[0].getContentSize().width * 0.5;
			Anchor.endX = Anchor.startX+40;
			if(i == DdzModel.prototype.CountArray(cardsValue)-1){
				Anchor.endX = Anchor.startX +cardSprite.getContentSize().width
			}
			this.AnchorX[i] = Anchor;

		}

		// 其它人的牌
		var cardCount = [0, game.getHandCardCount(DdzUIMgr.getInstance().getChairIdByPlayerPos(1)), game.getHandCardCount(DdzUIMgr.getInstance().getChairIdByPlayerPos(2))];
		for (var i = 1; i < CMD_DDZ.GAME_PLAYER; i++) {
			//this.TextCardCount[i].string = cardCount[i];
			//this.TextCardCount[i].setVisible(cardCount[i] > 0);
			for (var j = 0; j < cardCount[i]; j++) {
                var cardSprite = new ccui.ImageView();
                cardSprite.loadTexture("huaiFengCardListPlist/img_card_back.png", ccui.Widget.PLIST_TEXTURE);
                cardSprite.setAnchorPoint(cc.p(0, 0));
                cardSprite.x = j * 20;
                cardSprite.y = 0;
                this.PanelCardGroup[i].addChild(cardSprite);
			}
		}

    },

    // 更新出牌区域
	updateOpenCard: function (pos, cardsData) {
		this.TextScore[pos].setVisible(false);
		if (this.PanelOpen[pos]) {
			this.PanelOpen[pos].removeAllChildren();
            for (var i = 0; i < cardsData.length; i++) {
            	if (cardsData[i] == 0) continue;
                var cardSprite = new CardSprite();
                cardSprite.setValue(cardsData[i], 0);
                cardSprite.setAnchorPoint(cc.p(0, 0));
                if (pos == 0) {
					var centerCardIndex = (DdzModel.prototype.CountArray(cardsData)) / 2;
					var widthX = this.PanelOpen[pos].getContentSize().width / 2;
					cardSprite.x = widthX + (i - centerCardIndex) * 50;
                    cardSprite.y = 0;
				} else if (pos == 1) {
                	var width = this.PanelOpen[pos].getContentSize().width;
                	var length = ((i < 10) && cardsData.length > 10)? 10 : cardsData.length;
                    cardSprite.x = width - 126 - 50 * (length - i);
                    cardSprite.y = (1 - parseInt(i / 10)) * 175;
				} else {
                    cardSprite.x = (i % 10) * 50;
                    cardSprite.y = (1 - parseInt(i / 10)) * 175;
				}

				this.laiziSearchData = DdzModel.prototype.GetCardValue(cardsData[i]);
				var game = ClientData.getInstance().getGame();
				var laizidata = game.getLiziCard();
				if(this.laiziSearchData == laizidata){
					var laiSprite = new cc.Sprite("res/public/huaiFengCard/FrameLai01.png");
					laiSprite.setAnchorPoint(cc.p(0, 0));
					cardSprite.addChild(laiSprite);
				}
                this.PanelOpen[pos].addChild(cardSprite);
            }
		}
    },
	//重连明牌区域
	ddzMingcar:function(){
		var game = ClientData.getInstance().getGame();
		if (!game) return;
		for (var i = 0; i < 3; i++) {
			if (i != g_objHero.chairID) {
				var card = game.getHandCardValues(i);
				if (card && card.length > 0) {
					var data = {ShowCardUser: i, CardData: card};
					this.ddzMingcard(data);
				}
			}
		}
	},
	ddzMingcard:function(data){
		cc.log("--------明牌--------------"+data);
		var cardbright = [];
		var showID =  data.ShowCardUser;
		cardbright = data.CardData;
		var chairId = DdzUIMgr.getInstance().getPlayerPosByChairId(showID);
		if(chairId == 0 )return;
		for (var i = 0; i < cardbright.length; i++) {
			var cardSprite = new CardSprite();
			cardSprite.setValue(cardbright[i],0);
			cardSprite.setScale(0.5);
			if(i < 6){
				cardSprite.x =0;
				cardSprite.y =120;
				cardSprite.x =i*30;
			}
			if( i >= 6 && i < 12){
				cardSprite.x =0;
				cardSprite.y =80;
				cardSprite.x =i*30-180;
			}
			if( i >= 12 && i < 18){
				cardSprite.x =0;
				cardSprite.y =40;
				cardSprite.x =i*30-360;
			}
			if( i >= 18){
				cardSprite.x =0;
				cardSprite.y =0;
				cardSprite.x =i*30-540;
			}
			this.opendeal[chairId].addChild(cardSprite);
		}
	},
	ddzMing:function(){
		for(var i = 0 ; i < 3 ; i++ ){
			this.opendeal[i].removeAllChildren();
		}
	},
    // 玩家放弃出牌，需要清空这个人出牌区
	clearPlayerOpenCard: function (pos) {
		if (this.PanelOpen[pos]) {
			this.PanelOpen[pos].removeAllChildren();
		}
		// 如果是自己，归位手上的牌
		if (pos == 0) {
			this.resetAllCard();
		}
		// 显示不出
		this.TextScore[pos].setVisible(true);
		var winImgName = "ddzsouces/doudzui0015b.png";
		this.TextScore[pos].loadTexture(winImgName, ccui.Widget.PLIST_TEXTURE);
		//this.TextScore[pos].string = "不出";
    },

    // 更新地主标识
    updateLandHead: function () {
        var game = ClientData.getInstance().getGame();
        if(!game) {
            return;
        }
        UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
		UIMgr.getInstance().closeDlg(ID_ddzDlgOpenCard);
        var bankerChairId = game.getBankerChairId();
        var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(bankerChairId);
        for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
        	this.IconLand[i].setVisible(i == pos);
		}
    },

    // 地主消息回来，更新界面
	updateWithBankerInfoMsg: function () {
		this.updateLandHead();
        var game = ClientData.getInstance().getGame();
        if(!game) {
            return;
        }

		var bankerChairId = game.getCallBankerChairId();
        var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(bankerChairId);

        this.updateCards();
        
        this.setClockUI(pos);
        cc.log("this.setClockUI(pos)"+this.setClockUI(pos))
        if (pos == 0) {
			// 关闭叫分按钮
			UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
			UIMgr.getInstance().closeDlg(ID_ddzDlgOpenCard);
			// 打开打牌界面
			var dlg = UIMgr.getInstance().openDlg(ID_DdzDlgCardOp);
			dlg.checkCard();
		}
    },

    // 更新当前玩家状态
	updatePlayerStatus: function () {
        var game = ClientData.getInstance().getGame();
        if(!game) {
            return;
        }

        var currentChairId = game.getCurrentUser();

        var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(currentChairId);
        //清楚个人出牌区
        if(this.PanelOpen[pos] != null){
        	this.PanelOpen[pos].removeAllChildren();
        }
        
        this.setClockUI(pos);

        if (pos == 0) {
            var table = ClientData.getInstance().getTable();
            if(!table) {
                return;
            }

            var gameStatus = table.getGameStatus();
            cc.log("更新自己的状态"+gameStatus);
            switch (gameStatus) {
                case CMD_DDZ.GS_TK_FREE:
                    break;
                case CMD_DDZ.GS_TK_CALL:
                    //叫庄
                    UIMgr.getInstance().closeDlg(ID_DdzDlgCardOp);
                    UIMgr.getInstance().openDlg(ID_DdzDlgCallScore);
					UIMgr.getInstance().openDlg(ID_ddzDlgOpenCard);
                    break;
                case CMD_DDZ.GS_TK_PLAYING:
                    // 游戏进行中
                    UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
					UIMgr.getInstance().closeDlg(ID_ddzDlgOpenCard);
                    var dlg = UIMgr.getInstance().openDlg(ID_DdzDlgCardOp);
                    dlg.checkCard();
                    break;
                default:
                    break;
            }
		} else {
        	UIMgr.getInstance().closeDlg(ID_DdzDlgCardOp);
        	UIMgr.getInstance().closeDlg(ID_DdzDlgCallScore);
			UIMgr.getInstance().closeDlg(ID_ddzDlgOpenCard);
		}
    },

    // 更新玩家位置信息
    updatePlayersLocation: function () {
        var table = ClientData.getInstance().getTable();
        if(!table){
            return;
        }

        for(var i = 0; i < DdzUIMgr.GAME_PLAYER; i++){
            var chairId = DdzUIMgr.getInstance().getChairIdByPlayerPos(i);

            var player = table.getPlayerByChairID(chairId);

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
                    if (nDistance < 1000) {
                        this.TextLoc[i].string = nDistance + "米";
                    } else {
                        this.TextLoc[i].string = parseInt(nDistance / 1000) + "千米";
                    }
                }
            }
        }
    },

	// 出牌
	sendCard: function () {

		var cardsValue = this.getWillSendCard();

		cc.log("出牌长度" +  cardsValue.length)
        if (cardsValue.length > 0) {
            DdzGameMsg.getInstance().sendOutCard(cardsValue);
            UIMgr.getInstance().closeDlg(ID_DdzDlgCardOp);
		}
		else {
            DlgTip.openSysTip("出牌数据无效");
		}
    },

	// 取出当前选中的牌
	getWillSendCard: function () {
        var cardsValue = [];
        var allChild = this.PanelCardGroup[0].getChildren();
        for(var i = 0; i < allChild.length; i++){
            var spriteCard = allChild[i];
            if (spriteCard.isUp) {
                if (spriteCard.isUp()) {
                    cardsValue[cardsValue.length] = spriteCard.getCardValue();
                }
            }
        }

        cc.log("即将出牌的数据"+cardsValue);
        if (cardsValue.length <= 0) {
            return [];
        }

        var game = ClientData.getInstance().getGame();
        if (!game) return [];

        var lastSendUser = game.getLastSendCardUser();
        var turnCardData = [];	// 上个玩家是自己，代表此次可以随意出牌
		var nType = DdzCardType.CT_ERROR;
        if (lastSendUser != g_objHero.getChairID()) {
            turnCardData = game.getTurnCardData(lastSendUser);
			if(turnCardData == null )turnCardData =[];
            nType = game.getCardDatatype(lastSendUser);
			if(nType == null )nType = DdzCardType.CT_ERROR;
        }

        cc.log("当前牌"+turnCardData+"长度="+turnCardData.length+"类型"+nType);
        if (DdzModel.prototype.CompareCardLaizi(turnCardData, nType, cardsValue)) {
            return cardsValue;
        }
        else {
            return [];
        }
    },

	// 提示
    prompt: function (arr) {
        var allChild = this.PanelCardGroup[0].getChildren();

        cc.log("prompt"+arr);
        this.resetAllCard();
        for (var j = 0; j < arr.length; j++) {
            for(var i = 0; i < allChild.length; i++){
                var spriteCard = allChild[i];
                if (spriteCard.getCardValue() == arr[j] && !spriteCard.isUp()) {
                    spriteCard.onCardUp(true);
                    break;
                }
            }
        }  

        // 选牌是否有效，按钮是否显示可按
        var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgCardOp);
        if (dlg) {
            dlg.BtnOut.setBright(true);
        	dlg.BtnOut.setTouchEnabled(true);
		}

    },
	

	// 所有牌归为
	resetAllCard: function () {
        var allChild = this.PanelCardGroup[0].getChildren();
        for (var i = 0; i < allChild.length; i++) {
            var spriteCard = allChild[i];
            spriteCard.onCardUp(false);
        }
    },

	// 显示或隐藏叫分、不出标签
	showTextSore: function (show, pos) {
		if (this.TextScore[pos])
			this.TextScore[pos].setVisible(show);
    },
	
	// 叫分
	callScore: function (pos) {
        var game = ClientData.getInstance().getGame();
        if (!game) return;
		var callScoreUser = game.getCallBankerChairId();
		if (callScoreUser == CMD_DDZ.INVALID) return;
		var callScore = game.getLastCallScore();
		cc.log(callScore+"0不叫1一分2二分3三分")
		//var score = "不叫";
		var score = "";
		switch (callScore) {
		case 0:
			score = "res/game_ddz/ddzsouces/doudzui0015.png";
			SoundMgr.getInstance().playEffect("men_call_bj", 0, false);
			break;
		case 1:
			score = "res/game_ddz/ddzsouces/doudzui0016.png";
			SoundMgr.getInstance().playEffect("men_call_1", 0, false);
			break;
		case 2:
			score = "res/game_ddz/ddzsouces/doudzui0017.png";
			SoundMgr.getInstance().playEffect("men_call_2", 0, false);
			break;
		case 3:
			score = "res/game_ddz/ddzsouces/doudzui0017s.png";
			SoundMgr.getInstance().playEffect("men_call_3", 0, false);
			break;
		case 65535:
			score = "res/game_ddz/ddzsouces/doudzui0017s.png";
			SoundMgr.getInstance().playEffect("men_call_3", 0, false);
			break;
		default:

			break;
		}
		var pos = DdzUIMgr.getInstance().getPlayerPosByChairId(callScoreUser);
		cc.log("叫庄用户分数ID="+callScoreUser+"位置="+pos+"分数"+callScore);
		if (this.TextScore[pos]) {
			//this.TextScore[pos].string = score;
			this.TextScore[pos].loadTexture(score, ccui.Widget.LOCAL_TEXTURE);
			this.TextScore[pos].setVisible(true);
			cc.log("我叫分了"+callScore)
		}
    }
});
