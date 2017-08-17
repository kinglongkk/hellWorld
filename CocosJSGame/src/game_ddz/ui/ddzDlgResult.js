var DdzResultButtonLayer = cc.Layer.extend({

    init: function () {
        // 从文件载入
    	
        var json = ccs.load(res.dlgResultButtonLayer_json);       
        this._rootWidget = json.node;
        this.addChild(this._rootWidget);

//        this.BtnBack = this._rootWidget.getChildByName("Button_back");
//
//        this.BtnBack.addTouchEventListener(function (sender, type) {
//            if (type == ccui.Widget.TOUCH_ENDED) {
//				UIMgr.getInstance().closeDlg(ID_DdzDlgResult);
//				this.showResult();
//            }
//        }, this);

        this.BtnShare = this._rootWidget.getChildByName("Button_share");
        this.BtnShare.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                if(cc.sys.isNative) {
                    //截屏
                    var target = WXShare.SHARE_TARGET_CIRCLE;
                    WXShare.getInstance().shareCaptureScreen(target, function () {
                        cc.log("++++++斗地主----分享+++成功+++");
                        WXShare.getInstance().showSysTip("---分享成功---");
                    });
                }
            }
        }, this);

        this.BtnReady = this._rootWidget.getChildByName("Button_ready");
        this.BtnReady.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
            	if (this.showResult()) {
                    SoundMgr.getInstance().playEffect("game_start", 0, false);

                    var game = ClientData.getInstance().getGame();

                    DdzUIMgr.getInstance().againGame();

                    GameFrameMsg.getInstance().sendReady();
				}
                UIMgr.getInstance().closeDlg(ID_DdzDlgResult);
            }
        }, this);
    },

	// 是否显示战绩页
	showResult: function (RecordInfo,Reason) {
		cc.log("战绩页"+RecordInfo);
		var game = ClientData.getInstance().getGame();
		if (game) {
			if (RecordInfo != null) {
				var Score = [0, 0, 0];
 				for(var i=0;i<RecordInfo.length;i++){
					for(var j=0;j<RecordInfo[i].length;j++){
						Score[j] += RecordInfo[i][j];
					}
				}
				// 游戏已开始并且结束了，弹战绩页
				var dlgGameRecordCenter =UIMgr.getInstance().openDlg(ID_DlgGameRecordCenter);
				//积分记录列表
				var recordInfo = {
					"DetailScore":RecordInfo,
					"AllScore":Score,
					"Reason":Reason
				};

				dlgGameRecordCenter.setInit(recordInfo, function(){
					cc.log("++++++战绩中心界面----退出房间++++++");
					//返回大厅
					GameKindMgr.getInstance().backPlazaScene();
				}, function(){
					UIMgr.getInstance().closeDlg(ID_DlgGameRecordCenter);
					// 重置数据
					DdzUIMgr.getInstance().resetGame();
					cc.director.getRunningScene().layer.updateNode();
					var table = ClientData.getInstance().getTable();
					//var Number = table.getPlayers().length;
					var playerCount = CMD_DDZ.GAME_PLAYER;
					for (var pos = 0; pos < playerCount; pos++) {
						var chairId = DdzUIMgr.getInstance().getChairIdByPlayerPos(pos);
						var player = table.getPlayerByChairID(chairId);
						if (player) player.setScore(chairId, 0);
					}
					UIMgr.getInstance().openDlg(ID_DdzDlgReady);

					// 重置房间续费状态
					var room = ClientData.getInstance().getRoom();
					if(!room) return;
					room.setRenew(false);
					cc.log("++++++战绩中心界面----续费成功回调++++++");

				}, function(){
					cc.log("++++++战绩中心界面----分享成功回调++++++");
				});
                return false;
			}
		}
		return true;
    },
});

DLG_CREATOR[ID_DdzDlgResult] = function() {
	return new DdzDlgResult();
};

var DdzDlgResult = DlgBase.extend({
	ctor: function(){
		this.LabNick = [];
		this.LabScoreWin = [];
		this.LabScoreLost = [];
		this.ImgPlayer = [];
		this.PanelCard = [];
		this.IconLand = [];
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
        //cc.spriteFrameCache.addSpriteFrames("res/game_ddz/ddzsouces/win_number.png");
        //cc.spriteFrameCache.addSpriteFrames("res/game_ddz/ddzsouces/lost_number.png");
		this.requence = null;
		var json = ccs.load(res.dlgResult_ddz_json);
		this._rootWidget = json.node;
		this._rootWidget.setLocalZOrder(20);
		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		//this._rootWidget.setLocalZOrder(10);
		this.bg = this._rootWidget.getChildByName("Panel_Bg");
		this.bg.setVisible(false);
		// 农民胜利还是地主胜利页面
		this.ImgResult = this._rootWidget.getChildByName("Panel_Bg").getChildByName("Image_ResultBg");
		//this.ImgResult = this.ImgResultBg.getChildByName("Image_Result");
		this.Imagexuan = this._rootWidget.getChildByName("Panel_Bg").getChildByName("Image_xuan");


		
		// 结果页
		this.PanelResult = this._rootWidget.getChildByName("Panel_Bg").getChildByName("Panel_Res");
		this.PanelResult.setVisible(false);
		
		// 标题栏
		//this.ImgTitle = this.PanelResult.getChildByName("Image_title");
		this.TextRocket = this.PanelResult.getChildByName("Text_rocket");
		this.TextBomb = this.PanelResult.getChildByName("Text_bomb");
		this.TextSpring = this.PanelResult.getChildByName("Text_spring");
		this.Textspr = this.PanelResult.getChildByName("Text_spr");

		// 战绩栏
		for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
			cc.log("i"+this.PanelResult)
			var Pout = this.PanelResult.getChildByName("Panel_outcome").getChildByName("Image_outcome" + i);
			this.ImgPlayer[i] 	 = Pout.getChildByName("Image_break").getChildByName("Image_player");
			this.LabNick[i] 	 = Pout.getChildByName("Image_break").getChildByName("Text_player");
			this.PanelCard[i] 	 = Pout.getChildByName("Image_break").getChildByName("Text_money");
			this.LabScoreWin[i]  = Pout.getChildByName("AtlasLabel_win");
			this.LabScoreLost[i] = Pout.getChildByName("AtlasLabel_lost");
			//this.PanelCard[i]	 = Pout.getChildByName("Panel_card");
			//this.IconLand[i]	 = Pout.getChildByName("Image_end");
		}

		// 输赢图标
		//this.ImgWin = this.PanelResult.getChildByName("Image_win");

		// 创建按钮
		this.PanelReady = new DdzResultButtonLayer();
		this.PanelReady.init();
		
		
		this.PanelResult.addChild(this.PanelReady);
		//this.updateResultIcon();
		this.updateTitle();
		this.updateResultView();
		this.showResultWithAnimation();

	},

	// 动画显示结算页
	showResultWithAnimation: function () {
        var game = ClientData.getInstance().getGame();
        if (!game) return;

        if (game.getTurnScore(g_objHero.getChairID()) == 0) {
            this.ImgResult.setVisible(true);
            this.PanelResult.setVisible(true);
		} else {
            var calcu = function() {
                return function() {
                    var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgResult);
                    if (dlg) {
						dlg.bg.setVisible(true);
                        dlg.ImgResult.setVisible(true);
                        dlg.PanelResult.setVisible(true);
						dlg.updateResultIcon();
                    }
                }
            }
            setTimeout(calcu(), 3000);
		}
    },

	// 更新结果图片
	updateResultIcon: function () {
		var game = ClientData.getInstance().getGame();
		if (!game) return;

		var nResult = 0;
		// 先判断自己是地主还农民
		if (game.getCallBankerChairId() == g_objHero.getChairID()) {
			// 地主是自己
			nResult |= 2;
		}

		// 判断自己赢还是输
		var imageName = null;
		var nScore = game.getTurnScore(g_objHero.getChairID());
		cc.log(nScore+"判断自己赢还是输")
		if (nScore > 0) {
			// 赢了
			nResult |= 1;
			cc.log(nResult+"判断自己赢")
			if( nResult > 2 ){
				imageName = "res/game_ddz/ddzsouces/doudzui0024.png";
				SoundMgr.getInstance().playEffect("game_win", 0, false);
				var rotate = cc.rotateBy(1,180);
				this.requence = rotate.repeatForever();
				this.Imagexuan.runAction(this.requence);
			}else{
				imageName = "res/game_ddz/ddzsouces/doudzui0023.png";
				SoundMgr.getInstance().playEffect("game_win", 0, false);
				var rotate = cc.rotateBy(1,180);
				this.requence = rotate.repeatForever();
				this.Imagexuan.runAction(this.requence);
			}
		}
		if (nScore < 0) {
			// 输了
			nResult |= 1;
			cc.log(nResult+"判断自己输")
			if( nResult > 2 ){
				imageName = "res/game_ddz/ddzsouces/doudzui0024b.png";
				SoundMgr.getInstance().playEffect("game_lose", 0, false);
				this.Imagexuan.setVisible(false);
			}else{
				imageName = "res/game_ddz/ddzsouces/doudzui0023b.png";
				SoundMgr.getInstance().playEffect("game_lose", 0, false);
				this.Imagexuan.setVisible(false);
			}
		}
		this.ImgResult.loadTexture(imageName, ccui.Widget.LOCAL_TEXTURE);
    },

	// 更新标题栏
	updateTitle: function () {
        var game = ClientData.getInstance().getGame();
        if (!game) return;

        this.TextRocket.string = game.getRocketCount();
        this.TextBomb.string   = game.getBombCount();

        // 春天
        var spring = game.getSpringCount();
        var str =  spring;
        // 反春天
        if (spring == 0) {
        	spring = game.getAntiSpring();
        	if (spring > 0) str =   spring;
		}
		if(str == 2){
			score = "res/game_ddz/ddzsouces/doudzui0031b.png";
			this.Textspr.loadTexture(score, ccui.Widget.LOCAL_TEXTURE);
			str = 1;
		}
        this.TextSpring.string = str;
    },

	// 更新战绩栏
	updateResultView: function () {
        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var table = ClientData.getInstance().getTable();
        if (!table) return;

		//this.LabScoreWin[i].getPlayerByChairID(chairId)
        for (var i = 0; i < CMD_DDZ.GAME_PLAYER; i++) {
        	//this.IconLand[i].setVisible(i == game.getCallBankerChairId());
			var chairID = DdzUIMgr.getInstance().getPlayerPosByChairId(i);
        	var player = table.getPlayerByChairID(i);
        	if (player) {
        		// 头像
				var imageThum = this.ImgPlayer[chairID];
				player.loadUrlImage(function (imagePath) {
					imageThum.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
				});
        		// 名字
        		this.LabNick[chairID].string = player.getNickName();
			}

			// 分数
			var moneyBy = player.getScore();
			var chairId = DdzUIMgr.getInstance().getChairIdByPlayerPos(i);
			var nScore = game.getTurnScore(chairId);
			this.PanelCard[chairID].string = moneyBy;
        	if (nScore > 0) {
				var slem = this.LabScoreWin[i].getString().length;
				this.LabScoreWin[i].setContentSize(50 * slem, 70);
        		this.LabScoreWin[i].setString('.' + nScore);
        		this.LabScoreWin[i].setVisible(true);
        		this.LabScoreLost[i].setVisible(false);
        		
        		var slem = this.LabScoreWin[i].getString().length;
        		this.LabScoreWin[i].setContentSize(50 * slem, 70);

			} else {
        		if (nScore == 0) {
                    this.LabScoreLost[i].setString(nScore);
				} else {
                    this.LabScoreLost[i].setString('/' + nScore);
				}
				var slem = this.LabScoreLost[i].getString().length;
				this.LabScoreLost[i].setContentSize(50 * slem, 70);
                this.LabScoreLost[i].setVisible(true);
                this.LabScoreWin[i].setVisible(false);
                var slem = this.LabScoreLost[i].getString().length;
				this.LabScoreLost[i].setContentSize(50 * slem, 70);
			}

			var SpringCount =  game.getSpringCount();//春天
			var AntiSpring = game.getAntiSpring();//反春
			var cardArr = game.getTurnCardData(i);//剩余牌
			if(SpringCount == 1 ){
				if(cardArr.length ==0){
					this.ddzSpring(chairID);
				}
			}
			if(AntiSpring == 2 ){
				if(cardArr.length ==0){
					this.ddzSpring(chairID);
				}
			}
			// 剩余牌
//			var cardArr = game.getTurnCardData(i);
//            this.PanelCard[i].removeAllChildren();
//        	for (var j = 0; j < cardArr.length; j++) {
//                if (cardArr[j] == 0) continue;
//                var cardSprite = new CardSprite();
//                cardSprite.setValue(cardArr[j], 0);
//                cardSprite.setAnchorPoint(cc.p(0, 0));
//                cardSprite.x = j * 40;
//                cardSprite.y = 0;
//                this.PanelCard[i].addChild(cardSprite);
//			}
		}
    },
	ddzSpring:function(chairID){
		cc.log("chairID="+chairID)
		cc.spriteFrameCache.addSpriteFrames(res.Spring,res.Spring_png);
		var size = cc.winSize;
		var sp=new cc.Sprite();
		if(chairID == 0 ){
			sp.setPosition(cc.p(size.width*0.5,200));
		}if(chairID == 1 ){
			sp.setPosition(cc.p(967,size.height*0.5+150));
		}if(chairID == 2 ){
			sp.setPosition(cc.p(350,450));
		}
		var animFrames = [];
		var str = "";
		for (var i = 1; i < 9; i++) {
			str = "spring00" + (i < 10 ? ("0" + i) : i)+".png";
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}
		var animation = new cc.Animation(animFrames, 1.0 / 18 );
		sp.runAction(cc.sequence(cc.animate(animation),cc.delayTime(2),cc.removeSelf()));
		var particle = new cc.ParticleSystem(res.tx7huapen);
		particle.setPosition(cc.p(200,150));
		sp.addChild(particle);
		this._rootWidget.addChild(sp);
	}
});
