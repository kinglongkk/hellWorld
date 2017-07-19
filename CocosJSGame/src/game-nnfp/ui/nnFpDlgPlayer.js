/*
* 玩家游戏界面
* */
DLG_CREATOR[ID_NnFpDlgPlayer] = function () {
    return new NnFpDlgPlayer();
};

var NnFpDlgPlayer = DlgBase.extend({
    ctor: function () {
        this.PanelPlayerPos = [];
        this.ImgBg = [];
        this.ImgFaceBg = [];
        this.ImgFace = [];
        this.LabNick = [];
        this.LabMoney = [];
        this.PanelCardGroup = [];
        this.PanelOpen = [];
        this.openCards = [];
        this.PanelType = [];
        this.ImgReady = [];
        this.LabBet = [];
        this.PanelBanker = [];
        this.PanelAddChip = [];
        this.addChipArr = [];
        this.PanelAddScore = [];
        this.addScoreArr = [];
        this.LabImage = [];

        this.DlgBg = [];
        this.TextDlg = [];

        this.handCards = [];  //手牌

        this.timeOutArr = [];
        this.TextLoc = [];
        this.btnLoc = [];
    },

    onCreate: function () {
        this.init();
    },

    onClose: function () {},

    init: function () {
        var json = ccs.load(res.dlgNnFpPlayer_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        // for (var i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
        for (var i = 0; i < 6; i++) {
            this.PanelPlayerPos[i] = this._rootWidget.getChildByName("PanelPlayerPos_" + i);
            this.PanelCardGroup[i] = this.PanelPlayerPos[i].getChildByName("PanelCardGroup");
            this.PanelOpen[i] = this.PanelPlayerPos[i].getChildByName("PanelOpen");
            this.PanelType[i] = this.PanelPlayerPos[i].getChildByName("PanelType");
            this.ImgReady[i] = this.PanelPlayerPos[i].getChildByName("ImgReady");
            this.ImgReady[i].setVisible(false);

            // 个人信息层
            this.ImgBg[i] = this.PanelPlayerPos[i].getChildByName("ImgBg");
            this.ImgFaceBg[i] = this.ImgBg[i].getChildByName("ImgFaceBg");
            this.ImgFace[i] = this.ImgFaceBg[i].getChildByName("ImgFace");

            // 添加事件
            this.ImgFace[i].setTouchEnabled(true);
            this.ImgFace[i].setTag(i);
            this.ImgFace[i].addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    var table = ClientData.getInstance().getTable();
                    if (!table) return;
                    var chairId = NiuniuFPUIMgr.getInstance().getChairIdByPlayerPos(sender.getTag());
                    var player = table.getPlayerByChairID(chairId);
                    if (player) PlazaUIMgr.getInstance().ongetPlayerInfo(player.getUserId());
                }
            });

            this.LabNick[i] = this.ImgBg[i].getChildByName("LabNick");
            this.LabMoney[i] = this.ImgBg[i].getChildByName("LabMoney");
            if (i !== 0) {
                this.TextLoc[i] = this.ImgBg[i].getChildByName("Text_location");
                this.TextLoc[i].setVisible(false);
                this.btnLoc[i] = this.ImgBg[i].getChildByName("Image_location");
                this.btnLoc[i].setVisible(false);
                this.btnLoc[i].addTouchEventListener(function (sender, type) {
                    if (ccui.Widget.TOUCH_ENDED === type) {
                        DlgTip.openSysTip("地址详情功能未开放");
                    }
                });
            }

            //显示庄家和加注倍数位置
            this.PanelBanker[i] = this.PanelPlayerPos[i].getChildByName("Panel_Banker");
            // this.PanelBanker[i].setVisible(false);

            //显示抢或者不抢   最终抢庄倍数显示
            this.PanelAddChip[i] = this.PanelPlayerPos[i].getChildByName("Panel_AddChip");
            this.addChipArr[i]  = this.PanelAddChip[i].getPosition();
            this.PanelAddChip[i].setVisible(false);

            this.PanelAddScore[i] = this.PanelPlayerPos[i].getChildByName("Panel_AddScore");
            this.addScoreArr[i] = this.PanelAddScore[i].getPosition();
            this.PanelAddScore[i].setVisible(false);

            this.LabBet[i] = this.PanelPlayerPos[i].getChildByName("LabBet");
            this.LabBet[i].ignoreContentAdaptWithSize(true);

            // this.LabLose[i] = this.PanelPlayerPos[i].getChildByName("LabLose");
            this.LabImage[i] = this.PanelPlayerPos[i].getChildByName("LabImage");
            // this.LabLose[i].ignoreContentAdaptWithSize(true);
            this.LabImage[i].setVisible(false);

/*            this.LabWin[i] = this.PanelPlayerPos[i].getChildByName("LabWin");
            this.LabWin[i].ignoreContentAdaptWithSize(true);
            this.LabWin[i].setVisible(false);*/

            this.DlgBg[i] = this.PanelPlayerPos[i].getChildByName("Image_dlg");
            this.TextDlg[i] = this.DlgBg[i].getChildByName("Text_dlg");
            this.DlgBg[i].setVisible(false);

            //手牌
            this.handCards[i] = CardGroup.create(0, false);
            this.handCards[i].setAnchorPoint(cc.p(0.5, 0.5));
            var size = this.PanelCardGroup[i].getSize();
            this.handCards[i].x = size.width / 2;
            this.handCards[i].y = size.height / 2;
            this.PanelCardGroup[i].addChild(this.handCards[i]);

            if (i === 0) this.handCards[i].setCardSpace(new cc.p(80, 0));
            else this.handCards[i].setCardSpace(new cc.p(50, 0));

            //this.handCards[i].addCardList([0x01,0x01,0x01,0x01,0x01], true)

            //开牌
            this.openCards[i] = CardGroup.create(0, false);
            this.openCards[i].setAnchorPoint(cc.p(0.5, 0.5));
            var oCSize = this.PanelOpen[i].getSize();
            this.openCards[i].x = oCSize.width / 2;
            this.openCards[i].y = oCSize.height / 2;
            this.PanelOpen[i].addChild(this.openCards[i]);

            if (i === 0) this.openCards[i].setCardSpace(new cc.p(60, 0));
            else this.openCards[i].setCardSpace(new cc.p(50, 0));

            this.PanelType[i].setVisible(false);
            this.LabBet[i].setVisible(false);

            this.PanelPlayerPos[i].setEnabled(false);
            this.PanelPlayerPos[i].setVisible(false);
        }

        this.Image_WaitForAddChip = this.PanelPlayerPos[0].getChildByName("Image_WaitForAddChip");
        this.Image_WaitForAddChip.setVisible(false);

        //显示公共牌区域
        this.PanelPublicCards = this.PanelPlayerPos[0].getChildByName("PanelPublicCards");
        this.publicCards = CardGroup.create(0, false);
        this.publicCards.setAnchorPoint(cc.p(0.5, 0.5));
        var size = this.PanelPublicCards.getSize();
        this.publicCards.x = size.width / 2;
        this.publicCards.y = size.height / 2;
        this.PanelPublicCards.addChild(this.publicCards);
        this.publicCards.setCardSpace(new cc.p(300, 0));

        //开牌显示多张牌区域
        this.PanelOpenPublicCards = this.PanelPlayerPos[0].getChildByName("PanelOpenPublicCards");
        this.openSurplusCards = CardGroup.create(0, false);
        this.openSurplusCards.setAnchorPoint(cc.p(0.5, 0.5));
        var oPCardsSize = this.PanelOpenPublicCards.getSize();
        this.openSurplusCards.x = oPCardsSize.width / 2;
        this.openSurplusCards.y = oPCardsSize.height / 2;
        this.PanelOpenPublicCards.addChild(this.openSurplusCards);
        this.openSurplusCards.setCardSpace(new cc.p(140, 0));

        //显示赢了 动画
        this.PanelWin = this.PanelPlayerPos[0].getChildByName("Panel_Win");
        this.PanelWin.setVisible(false);

        //显示输了图片
        this.imgLose = this.PanelPlayerPos[0].getChildByName("Img_lose");
        this.imgLose.setVisible(false);

        var player = new Player();
        player.setNickName("牛一");
        player.setMoney(100001);
        player.setStatus(US_SIT);
        player.setGender(0);

        for (var i = 0; i < 6; i++) {
            this.updatePlayerInfo(i, player);
        }

        // 进来后就更新位置信息
        this.updatePlayersLocation();
        /*modify start
         * by xjn 2017.5.2
         * */
        //添加文字聊天监听
        var calcu = function (thisObj) {
            return function (even) {
                cc.log(JSON.stringify(even));
                thisObj.setChatBubble(even._userData);
            }
        };
        g_objHero.addListenerWordMsg(calcu(this));
    },

    resetDlg: function () {
        for (var i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
            this.handCards[i].clearAllCard();
            // this.handCards[i].setCardSpace(new cc.p(3, 0));
            this.PanelType[i].setVisible(false);
            this.LabBet[i].setVisible(false);
            this.openCards[i].clearAllCard();
            this.LabImage[i].setVisible(false);
            this.PanelAddChip[i].setPosition(cc.p(this.addChipArr[i]));
            var multiple = this.PanelAddChip[i].getChildByName("AtlasLabel_Multiple");
            var multipleImg =  this.PanelAddChip[i].getChildByName("Image_26");
            multipleImg.setColor(cc.color(255, 255, 255));
            multiple.setColor(cc.color(255, 255, 0));
            this.PanelAddChip[i].setVisible(false);
        }
        this.PanelWin.setVisible(false);
        this.imgLose.setVisible(false);
        this.publicCards.clearAllCard();
        this.openSurplusCards.clearAllCard();
        this.Image_WaitForAddChip.setVisible(false);

    },

    //清理玩家的牌
    resetPlayerDlg: function (pos) {
        this.handCards[pos].clearAllCard();
        this.handCards[pos].setCardSpace(new cc.p(3, 0));
        this.PanelType[pos].setVisible(false);
        this.LabBet[pos].setVisible(false);
        this.openCards[pos].clearAllCard();
        this.LabImage[pos].setVisible(false);
        if (pos === 0) {
            this.PanelWin.setVisible(false);
            this.imgLose.setVisible(false);
        }
    },

    updatePlayerInfo: function (pos, player) {
        /*        if (player == null) {
         this.PanelPlayerPos[pos].setEnabled(false);
         this.PanelPlayerPos[pos].setVisible(false);
         return;
         }*/

        this.PanelPlayerPos[pos].setEnabled(true);
        this.PanelPlayerPos[pos].setVisible(true);

        var worldPos = this.ImgBg[pos].getWorldPosition();
        // cc.log("获取头像的坐标位置");
        cc.log(worldPos);

        // var nick = player.getNickName();
        // var money = player.getMoney();
        // var status = player.getStatus();

        this.showFaceImage(pos, player);
        // this.showNiceName(pos, nick);
        // this.showMoney(pos, money);
        // this.showReadyOrCancel(pos, status);

    },

    showFaceImage: function (pos, player) {
        // cc.log("更新玩家头像pos=" + pos + "tag=" + this.ImgFace[pos].getTag());
        var table = ClientData.getInstance().getTable();
        if (!table) return;
        if (!player) return;

        var ImageThum = this.ImgFace[pos];
        player.loadUrlImage(function (imagePath) {
            // cc.log("头像图片" + imagePath);
            ImageThum.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
            ImageThum.setContentSize(cc.size(68, 68));
        });
    },

    showNiceName: function (pos, strNick) {
        if (pos !== 0) strNick = MyUtil.strCut(strNick, 10, true);
        this.LabNick[pos].string = strNick;
    },

    showMoney: function (pos, money) {
        if (!money) {
            var table = ClientData.getInstance().getTable();
            if (table) {
                var chairId = NiuniuFPUIMgr.getInstance().getChairIdByPlayerPos(pos);
            }
        } else {
            this.LabMoney[pos].string = money;
        }
    },

    //设置状态
    showReadyOrCancel: function (pos, status) {
        cc.log("准备状态pos=" + pos + "status=" + status);
        this.ImgReady[pos].setVisible(status === US_READY);
        this.PanelWin.setVisible(false);
        this.imgLose.setVisible(false);
    },

    betValue: function (pos, value) {
        this.LabBet[pos].string = value;
        this.LabBet[pos].setVisible(false);

        // SoundMgr.getInstance().playEffect("add_score", 0, false);
    },

    //显示两张公共牌
    showPublicCards: function(cardsValue) {
        this.publicCards.addCardList(cardsValue, true);
        var callFunc = cc.CallFunc(function () {
            this.publicCards.runAction(cc.sequence(cc.moveBy(1, cc.p(50, 50))))
        }, this)

        this.publicCards.runAction(cc.sequence(cc.moveTo(0.5, cc.p(20,20))))
    },



    //手牌
    addCard: function (pos, value, bFace, cb) {
        var cardGroup = this.handCards[pos];
        var lastCard = cardGroup.addCard(value, bFace);
        var len = cardGroup.getCardGroupLen();
        if (len === 4) {
            if (pos === 0) {
                this.handCards[pos].setCardSpace(new cc.p(64, 0));
                cardGroup.setAllFace(true);
                cardGroup.runUnfold();
                //显示抢庄按钮
                UIMgr.getInstance().openDlg(ID_DlgNnFpRobBanker);
                // NiuniuFPUIMgr.getInstance().openTimer("robBanker");
            } else {
                this.handCards[pos].setCardSpace(new cc.p(42, 0));
                cardGroup.runUnfold();
            }
        }
        if (len === 5 && pos === 0) {
            lastCard.setPosition(cc.pAdd(lastCard.getPosition(), cc.p(100, 0)));
            cardGroup.setAllFace(true);
            // cardGroup.runUnfold(cb);
            if (cb) {
                cb();
            }
            this.PanelBanker[0].removeAllChildren();
        }
    },

    //显示抢庄或不抢
    showCallScore: function (pos, scoreMultiple) {
        cc.log("显示抢庄位置 = " + pos);
        cc.log("显示抢庄分数 = " + scoreMultiple);
        var imgStr = "gameNnFpPlist/nnui0043.png";//不抢
        if (scoreMultiple > 0) imgStr = "gameNnFpPlist/nnui0044.png";
        var img = new ccui.ImageView(imgStr, ccui.Widget.PLIST_TEXTURE);
        this.PanelBanker[pos].addChild(img);
    },

    //显示抢庄倍数
    showCallScoreMultiple: function (pos, scoreMultiple, bankerPos) {
        this.PanelBanker[pos].removeAllChildren();
        var noAddImg = this.PanelAddScore[pos].getChildByName("Image_NoAdd");
        noAddImg.setVisible(false);
        if (scoreMultiple > 0) {
            var scoreMultipleValue = "." + scoreMultiple;
            var multiple = this.PanelAddScore[pos].getChildByName("AtlasLabel_Multiple");
            var multipleImg =  this.PanelAddScore[pos].getChildByName("Image_26");
            multipleImg.setColor(cc.color(255, 255, 255));
            multiple.setColor(cc.color(255, 255, 0));
            multiple.setString(scoreMultipleValue);
            this.PanelAddScore[pos].setVisible(true);
            if (pos === bankerPos) {
                multipleImg.setColor(cc.color(255, 255, 0));
                multiple.setColor(cc.color(255, 0, 255));

                var pEnd;
                var faceSize = this.ImgBg[bankerPos].getPosition();
                pEnd = cc.pSub(faceSize, cc.p(0, 90));
                if (bankerPos === 0) pEnd = cc.pAdd(faceSize, cc.p(100, -30));
                if (bankerPos === 3) pEnd = cc.pSub(faceSize, cc.p(100, 0));

                var callFunc = cc.CallFunc(function () {
                    for (var i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
                        if (pos !== bankerPos) this.PanelAddScore[i].setVisible(false);
                    }
                    cc.log("其他玩家的抢庄倍数消失");
                }, this);

                this.PanelAddScore[bankerPos].runAction(cc.sequence(cc.moveTo(0.5, cc.p(pEnd))));
            }
        }
    },

    //显示加注按钮或者等待开始
    showBtnOrAddChip: function () {
        //不是庄家的玩家显示加注按钮
        var game = ClientData.getInstance().getGame();
        if (!game) return;
        var bankerChairId = game.getBankerChairId();
        if (bankerChairId === g_objHero.getChairID()) {
            //如果庄家是自己 显示等待玩家加注  x:667;y:285
            this.Image_WaitForAddChip.setVisible(true);
        } else {
            UIMgr.getInstance().openDlg(ID_DlgNnFpAddChip);
        }
        for (var i = 0; i < 4; i++) {
            this.PanelAddChip[i].setVisible(false);
        }
    },

    //显示加注倍数
    showAddChipMultiple: function (pos, chipMultiple) {
        cc.log("这里是显示加注");
        cc.log("显示加注座位 = " + pos);
        cc.log("显示加注分数 = " + chipMultiple);
        var AddChipArr = this.PanelAddChip[pos].getChildren();
        this.PanelAddChip[pos].setVisible(true);
        if (chipMultiple > 0) {
            var chipMultipleValue = "." + chipMultiple;
            var multiple = this.PanelAddChip[pos].getChildByName("AtlasLabel_Multiple");
            multiple.setString(chipMultipleValue);
            AddChipArr[0].setVisible(true);
            AddChipArr[1].setVisible(true);
            AddChipArr[2].setVisible(false);
        } else {
            AddChipArr[0].setVisible(false);
            AddChipArr[1].setVisible(false);
            AddChipArr[2].setVisible(true);
        }

        var pEnd;
        var faceSize = this.ImgBg[pos].getPosition();
        pEnd = cc.pSub(faceSize, cc.p(0, 90));
        if (pos === 0) pEnd = cc.pAdd(faceSize, cc.p(100, 0));
        if (pos === 3) pEnd = cc.pSub(faceSize, cc.p(100, 0));

        this.PanelAddChip[pos].runAction(cc.sequence(cc.moveTo(0.5, cc.p(pEnd))));
    },

    //显示亮牌用户
    showCardsValue: function (pos, cardsValue, surplusCards) {
        cc.log("显示亮牌位置 = " + pos);
        cc.log("显示亮牌的牌值 = " + cardsValue);
        cc.log("显示多出两张的牌值 = " + surplusCards);
        this.handCards[pos].clearAllCard();
        this.openCards[pos].clearAllCard();

        this.openCards[pos].addCardList(cardsValue, true);

        if (surplusCards) {
            this.publicCards.clearAllCard();
            this.openSurplusCards.addCardList(surplusCards, true);
        }
        /*        var size = this.PanelOpen[0].getSize();
         for (var i = 0; i < cardsValue.length; i++) {
         var card = this.openCards[pos].getCardByIndex(i);
         var posX = card.getPositionX() + 80;
         var posTwoX = card.getPositionX() - 130;
         if (pos !== 0) {
         posX = card.getPositionX() - 10;
         }
         if (card) {
         card.setPosition(cc.p(posX, -size.height + 20));
         }
         if (card && i > 1) {
         card.setPosition(cc.p(posTwoX, -size.width));
         }
         }*/
        // SoundMgr.getInstance().playEffect("open_card", 0, false);
    },

    //type = 0 - 11
    showCardsType: function (pos, type) {
        if (type < 0) type = 0;
        var sex = "woman";
        var bullNum = "nnftb_niuniu" + type;
        // var gender = this.getGenderByPos(pos);
        // if (gender === 1) sex = "man";
        // SoundMgr.getInstance().playEffect(bullNum, sex, false);

        this.PanelType[pos].setVisible(true);
        this.PanelType[pos].removeAllChildren(true);
        var size = this.PanelType[pos].getSize();

        var niuPicInfo = [
            "nnFpAnimationPlist/nnui0013.png",//没牛
            "nnFpAnimationPlist/nnui0013a.png",//牛一
            "nnFpAnimationPlist/nnui0013b.png",//牛二
            "nnFpAnimationPlist/nnui0013c.png",//牛三
            "nnFpAnimationPlist/nnui0013d.png",//牛四
            "nnFpAnimationPlist/nnui0013e.png",//牛五
            "nnFpAnimationPlist/nnui0013f.png",//牛六
            "nnFpAnimationPlist/nnui0013g.png",//牛七
            "nnFpAnimationPlist/nnui0013h.png",//牛八
            "nnFpAnimationPlist/nnui0013i.png",//牛九
            "nnFpAnimationPlist/nnui0013j.png",//牛牛
            "nnFpAnimationPlist/nnui0013k.png",//三条
            "nnFpAnimationPlist/nnui0013l.png",//顺子
            "nnFpAnimationPlist/nnui0013m.png",//同花
            "nnFpAnimationPlist/nnui0013n.png",//葫芦
            "nnFpAnimationPlist/nnui0013o.png",//炸弹
            "nnFpAnimationPlist/nnui0013p.png",//同花顺
            "nnFpAnimationPlist/nnui0013q.png",//五花牛
            "nnFpAnimationPlist/nnui0013r.png"//五小牛
        ];

        var node = new ccui.ImageView(niuPicInfo[type], ccui.Widget.PLIST_TEXTURE);
        this.PanelType[pos].addChild(node);

        var spawn1 = cc.spawn(
            cc.moveTo(0, cc.p(size.width / 2, size.height / 2)),
            cc.scaleTo(0, 2)
        );

        var spawn2 = cc.spawn(
            cc.scaleTo(0.2, 0.8)
        );

        var spawn3 = cc.spawn(
            cc.scaleTo(0.2, 1)
        );
        var delay = cc.delayTime(0.3);

        var moveBy1 = cc.moveBy(0.2, cc.p(size.width - 70, -size.height - 40));
        var moveBy2 = cc.moveBy(0.1, cc.p(-10, 10));

        var callFun = cc.callFunc(function () {});
        if (type > 9) {
            callFun = cc.callFunc(function () {
                var particle = new cc.ParticleSystem(res.tx1huoyan_plist);
                particle.setPosition(cc.p(size.width / 2, size.height / 2));
                this.PanelType[pos].addChild(particle)
            }, this);
        }
        var seq = cc.sequence(spawn1, spawn2, spawn3, callFun, delay, moveBy1, moveBy2);
        node.runAction(seq);
    },

    //显示得分
    showScoreValue: function (pos, value) {
        this.LabBet[pos].setVisible(false);

        this.LabImage[pos].setVisible(true);
        var labLose = this.LabImage[pos].getChildByName("LabLose");
        var labWin = this.LabImage[pos].getChildByName("LabWin");
        labLose.ignoreContentAdaptWithSize(true);
        labWin.ignoreContentAdaptWithSize(true);
        cc.log("游戏结束，分数：" + pos + "," + value);
        var strValue = value;
        if (value > 0) {
            strValue = "." + value;
            labLose.setVisible(false);
            labWin.setVisible(true);
            labWin.string = strValue;
        } else {
            strValue = "/" + value;
            labLose.setVisible(true);
            labWin.setVisible(false);
            labLose.string = strValue;
        }
        // this.setMoney(pos);
    },

    /*    //随机庄家头像闪动
    blinkHeadPortrait: function (arr) {
        var arr = [0, 1, 2, 3, 4, 5];
        var faceArr = [];
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (!dlg) return;
        for (var i = 0; i < arr.length; i++) {
            faceArr[i] = dlg.getBankerWordPos(i, false);
        }
        var blinkStr = "gameNnFpPlist/nnui0003c.png";
        var blinkFaceNode = new ccui.ImageView(blinkStr, ccui.Widget.PLIST_TEXTURE);
        for (var i = 0; i < arr.length; i++) {
            var faceSize = this.ImgBg[arr[i]].getSize();
            var spaw = cc.spawn(
                cc.moveTo(0.2, cc.p(faceSize.width / 2, faceSize.height / 2)),
                cc.blink(0.2, 5)
            );
            spaw.repeat(arr.length);
        }

        var callFunc = cc.callFunc(function () {
            cc.moveTo(0.5, cc.p(100, 100));
        }, this);
        blinkFaceNode.runAction(cc.sequence(spaw, callFunc))

    },*/

    //玩家头像坐标
    getBankerWordPos: function (pos, isMore) {
        var pEnd = 0;
        var faceSize = this.ImgBg[pos].getWorldPosition();
        if (isMore) return faceSize;
        if (pos === 0) {
            pEnd = cc.pAdd(faceSize, cc.p(80, 18));
            return pEnd;
        }
        if (pos === 3) {
            pEnd = cc.pAdd(faceSize, cc.p(80, -40));
            return pEnd;
        }
        if (pos === 4 || pos === 5) {
            pEnd = cc.pSub(faceSize, cc.p(80, 40));
            return pEnd;
        }
        pEnd = cc.pAdd(faceSize, cc.p(80, -40));
        return pEnd;
    },

    setChatBubble: function (data) {
        var table = ClientData.getInstance().getTable();
        if (!table) return;

        var player = table.getPlayerByUserId(data.dwSendUserID);

        var pos = NiuniuFPUIMgr.getInstance().getPlayerPosByChairId(player.getChairID());
        this.DlgBg[pos].setVisible(true);
        this.TextDlg[pos].string = data.szChatString;

        var calcu = function (thisObj, pos) {
            return function () {
                cc.log("时间到了" + pos);
                thisObj.DlgBg[pos].setVisible(false);
            }
        };

        setTimeout(calcu(this, pos), 3000);
    },

    updateResultIcon: function (isShow) {
        if (!isShow) {
            this.PanelWin.setVisible(isShow);
            this.imgLose.setVisible(isShow);
            return;
        }
        // 显示赢了还是输了
        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var score = game.getScore(g_objHero.getChairID());
        if (score > 0) {
            this.PanelWin.removeAllChildren(true);
            this.PanelWin.setVisible(isShow);

            var size = this.PanelWin.getSize();
            var json = ccs.load(res.nnFpWinOrLose_json);
            var widget = json.node;

            widget.x = size.width / 2;
            widget.y = size.height / 2;
            this.PanelWin.addChild(widget);
            var action = json.action;
            widget.runAction(action);
            action.gotoFrameAndPlay(0, 60, isShow);
            return;
        }
        this.PanelWin.setVisible(!isShow);
        this.imgLose.setVisible(isShow);

    },

    // 更新玩家位置信息
    updatePlayersLocation: function () {
        var table = ClientData.getInstance().getTable();
        if (!table) return;

        for (var i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
            var chairId = NiuniuFPUIMgr.getInstance().getChairIdByPlayerPos(i);

            var player = table.getPlayerByChairID(chairId);

            if (player && player.getUserId() !== g_objHero.getUserId()) {
                var nearUserInfo = player.getNearUserInfo();
                var myUserInfo = g_objHero.getNearUserInfo();
                cc.log("更新玩家位置信息2" + nearUserInfo + myUserInfo);
                if (nearUserInfo && myUserInfo) {
                    // 根据经纬度计算距离
                    var locationTable = {};
                    locationTable["myLatitude"] = myUserInfo.getLatitude();
                    locationTable["myLongitude"] = myUserInfo.getLongitude();
                    locationTable["otherLatitude"] = nearUserInfo.getLatitude();
                    locationTable["otherLongitude"] = nearUserInfo.getLongitude();
                    var strSendData = JSON.stringify(locationTable);
                    cc.log("根据经纬度计算距离入参:" + strSendData);

                    var loc = 0;
                    if (cc.sys.isNative) {
                        if (cc.sys.os === cc.sys.OS_ANDROID) {
                            loc = jsb.reflection.callStaticMethod(
                                "org/cocos2dx/javascript/AppActivity",
                                "metersBetweenLocation",
                                "(Ljava/lang/String;)V",
                                strSendData
                            );
                        }

                        if (cc.sys.os === cc.sys.OS_IOS) {
                            loc = jsb.reflection.callStaticMethod(
                                "AppController",
                                "metersBetweenLocation:",
                                strSendData
                            );
                        }
                    }
                    cc.log("距离=" + loc);
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

    updateHeadWithUrl: function (imagePath, userID1, userID2, userID3, userID4) {
        cc.log("下载完的图片" + imagePath + "userid" + userID1);

        var table = ClientData.getInstance().getTable();
        if (!table) return;

        var idArr = [];
        if (userID1) idArr[0] = userID1;
        if (userID2) idArr[1] = userID2;
        if (userID3) idArr[2] = userID3;
        if (userID4) idArr[3] = userID4;

        for (var i = 0; i < idArr.length; i++) {
            var userID = idArr[i];
            var player = table.getPlayerByUserId(userID);

            var pos = NiuniuFPUIMgr.getInstance().getPlayerPosByChairId(player.getChairID());
            // if (this.ImgFace[pos].getTag() > 0) continue;
            cc.log("排位=" + pos + "userid=" + userID);

            var size = this.ImgFace[pos].getSize();
            var imgFace = new ccui.ImageView(imagePath + "/" + userID, ccui.Widget.LOCAL_TEXTURE);
            imgFace.x = size.width / 2;
            imgFace.y = size.height / 2;
            var sizeImg = imgFace.getSize();
            imgFace.setScaleX(72 / sizeImg.width);
            imgFace.setScaleY(72 / sizeImg.height);
            this.ImgFace[pos].addChild(imgFace);
            this.ImgFace[pos].setTag(userID);

            // 添加事件
            imgFace.setTouchEnabled(true);
            imgFace.setTag(userID);
            imgFace.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    PlazaUIMgr.getInstance().ongetPlayerInfo(sender.getTag());
                }
            });
        }
    },

    getGenderByPos: function (pos) {
        var chairId = NiuniuFPUIMgr.getInstance().getChairIdByPlayerPos(pos);
        var table = ClientData.getInstance().getTable();
        var player = table.getPlayerByChairID(chairId);
        return player.getGender();
    },

    //发牌结束点位置
    getCardPosByIndex: function (pos, cardIndex) {
        var cardSpace = this.handCards[pos].getCardSpace();
        var card = CardSprite.create(0x00, 0, false);
        var cardSize = card.getSize();
        var scale = this.handCards[pos].getScale();
        var cardPos = cc.p((cardSize.width / 2 + cardIndex * cardSpace.x) * scale, (cardSize.height / 2) * scale);
        var worldPos = this.handCards[pos].getWorldPosition();
        var ptEnd = cc.pAdd(worldPos, cardPos);
        return ptEnd;
    },

    //获取最后一张牌坐标
    getLastCardPos: function () {
        var lastCard = this.handCards[0].getCardByIndex(4);
        var pEnd = cc.pAdd(lastCard.getWorldPosition(), cc.p(75, 90));
        // var pEnd = lastCard.getWorldPosition();
        return pEnd;
    },

    tipCard: function (pos, cardValue) {
        var len = this.handCards[pos].getCardGroupLen();
        for (var i = 0; i < len; i++) {
            var card = this.handCards[pos].getCardByIndex(i);
            if (card) {
                for (var j = 0; j < cardValue.length; j++) {
                    if (j < 3 && card.getCardValue() === cardValue[j]) {
                        // card.onCardUp(true);
                    }
                }
            }
        }
    },

    onClickBackListGame: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED === type) {
            cc.log('onClickBackListGame');
        }
    },

    // 展示牌
    updateCards: function () {
        for (var i = 0; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
            this.PanelCardGroup[i].removeAllChildren();
        }

        var cardsValue = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        var centerX = this.PanelCardGroup[0].getContentSize().width / 2;
        var centerCardIndex = (13 - 1) / 2;
        this.AnchorX = [];

        for (var i = 0; i < 13; i++) {

            if (cardsValue[i] === 0) continue;
            var cardSprite = new CardSprite();
            cardSprite.setValue(cardsValue[i], 0);
            cardSprite.setContentSize(cardSprite.ImgBack.getContentSize());
            cardSprite.setTouchEnabled(false);
            var that = this;

            var listener = cc.EventListener.create({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,                                                      // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
                onTouchBegan:function(touch, event){                                      //实现 onTouchBegan 事件回调函数

                    return true;

                },
                onTouchMoved:function(touch, event){
                    var target2 = event.getCurrentTarget();                                // 获取事件所绑定的 target, 通常是cc.Node及其子类
                    var locationInNode2 = target2.convertToNodeSpace(touch.getLocation());  // 获取当前触摸点所在位置坐标
                    var s2 = target2.getContentSize();
                    var rect2 = cc.rect(0,0, s2.width, s2.height);
                    var touchX2 = touch.getLocation().x;
                    if(cc.rectContainsPoint(rect2, locationInNode2)){                 // 点击范围判断检测
                        var allChild = that.PanelCardGroup[0].getChildren();
                        for(var i = 0; i < allChild.length; i++){
                            var dlg2 = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                            var AnchorX2 = dlg2.AnchorX[i];
                            if (AnchorX2.startX < touchX2 && AnchorX2.endX > touchX2) {
                                var spriteCard = allChild[i];
                                if(that.To != spriteCard.getCardValue()){
                                    spriteCard.onCardUp(!spriteCard.isUp());
                                }
                                that.To = spriteCard.getCardValue();
                                break;
                            }
                        }
                        return true;
                    }
                    return true;
                },
                onTouchEnded:function(touch, event){
                    var target = event.getCurrentTarget();                                // 获取事件所绑定的 target, 通常是cc.Node及其子类
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());  // 获取当前触摸点所在位置坐标
                    var s = target.getContentSize();
                    var rect = cc.rect(0,0, s.width, s.height);
                    var touchX = touch.getLocation().x;
                    if(cc.rectContainsPoint(rect, locationInNode)){                 // 点击范围判断检测
                        var allChild = that.PanelCardGroup[0].getChildren();
                        for(var i = 0; i < allChild.length; i++){
                            var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                            var AnchorX = dlg.AnchorX[i];
                            if (AnchorX.startX < touchX && AnchorX.endX > touchX) {
                                var spriteCard = allChild[i];
                                spriteCard.onCardUp(!spriteCard.isUp());
                                break;
                            }
                        }
                    }
                    var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgCardOp);
                    if (!dlg) return;	// 轮到自己出牌的时候才能点
                    // 选牌是否有效，按钮是否显示可按
                    var dlg1 = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
                    var cardsValue = dlg1.getWillSendCard();
                    dlg.BtnOut.setBright(cardsValue.length > 0);
                    dlg.BtnOut.setTouchEnabled(cardsValue.length > 0);
                    return true;
                },
            });

            cc.eventManager.addListener(listener, this.PanelCardGroup[0]);
//			this.cardSprite.addTouchEventListener(function (sender, type) {
//				if (type == ccui.Widget.TOUCH_ENDED) {
//					cc.log("选中了牌值="+sender.getCardValue());
//                    var dlg = UIMgr.getInstance().getDlg(ID_DdzDlgCardOp);
//                    if (!dlg) return;	// 轮到自己出牌的时候才能点
//                    sender.onCardUp(!sender.isUp());
//
//                    // 选牌是否有效，按钮是否显示可按
//                    var cardsValue = this.getWillSendCard();
//                    dlg.BtnOut.setBright(cardsValue.length > 0);
//                    dlg.BtnOut.setTouchEnabled(cardsValue.length > 0);
//				}
//            }, this);

            cardSprite.setAnchorPoint(cc.p(0.5, 0));
            cardSprite.x = centerX + (i - centerCardIndex) * 40;
            cardSprite.y = 0;
            this.PanelCardGroup[0].addChild(cardSprite);

            var Anchor = {};
            Anchor.startX = cardSprite.x - cardSprite.getContentSize().width * 0.5 + this.PanelCardGroup[0].x - this.PanelCardGroup[0].getContentSize().width * 0.5;
            Anchor.endX = Anchor.startX + 40;
            if(i === (13 - 1)){
                Anchor.endX = Anchor.startX +cardSprite.getContentSize().width
            }
            this.AnchorX[i] = Anchor;
        }

        // 其它人的牌
        var cardCount = [0, 1, 2];
        for (var i = 1; i < CMD_NIUNIU_TB.GAME_PLAYER; i++) {
            for (var j = 0; j < cardCount[i]; j++) {
                var cardSprite = new ccui.ImageView();
                cardSprite.loadTexture("huaiFengCardListPlist/img_card_back.png", ccui.Widget.PLIST_TEXTURE);

                cardSprite.setAnchorPoint(cc.p(0, 0));
                cardSprite.x = j * 10;
                cardSprite.y = 0;
                this.PanelCardGroup[i].addChild(cardSprite);
            }
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
        if (lastSendUser != g_objHero.getChairID()) {
            turnCardData = game.getTurnCardData(lastSendUser);
        }

        cc.log("当前牌"+turnCardData+"长度="+turnCardData.length);
        if (DdzModel.prototype.CompareCard(turnCardData, cardsValue)) {
            return cardsValue;
        }
        else {
            return [];
        }
    },
});
