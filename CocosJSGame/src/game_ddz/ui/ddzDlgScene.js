
DLG_CREATOR[ID_DdzDlgSence] = function() {
    return new DdzDlgSence();
};

var DdzDlgSence = DlgBase.extend({
    ctor: function(){
        this.ImghandCards = [];
    },

    onCreate: function() {
        this.init();
    },
    
    init: function() {

        var json = ccs.load(res.dlgScene_ddz_json);
        this._rootWidget = json.node;
        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        this._rootWidget.setLocalZOrder(5);
        ccui.helper.doLayout(this._rootWidget);

        this.PanelMain = this._rootWidget.getChildByName('Panel_main');

        // 倍数
        this.TextMultiple = this._rootWidget.getChildByName("Text_multiple");

        this.TextMultiple.string = 1 ;
        var slem = this.TextMultiple.getString().length;
        this.TextMultiple.setContentSize(39 * slem, 55);
        // 底分
        this.TextBaseScore = this._rootWidget.getChildByName("Text_BaseScore");
        // 底牌区域
        this.Panelwhitecard = this._rootWidget.getChildByName("Panel_whitecard");
        this.Panelwhitecard.setVisible(false);
        this.PanelHand = this._rootWidget.getChildByName("Panel_whitecard");
        cc.spriteFrameCache.addSpriteFrames(res.huaiFengCardPlist_plist,res.huaiFengCardPlist_png);
        // 底牌数组
        for (var i = 0; i < 3; i++) {
        	this.ImghandCards[i] = this.PanelHand.getChildByName("Image_Hand" + i);
        	this.ImghandCards[i].loadTexture("huaiFengCardListPlist/img_card_back.png", ccui.Widget.PLIST_TEXTURE);
        }
        									
        var game = ClientData.getInstance().getGame();
        if(game){
            this.updateBaseScore(game.getCellScore());
        }

    },
    //飞机
    ddzAircraft:function(){
        cc.log("-----------------------------飞机--------------------------------------")
        SoundMgr.getInstance().playEffect("men_plane", 0, false);
        cc.spriteFrameCache.addSpriteFrames(res.Aircraft,res.Aircraft_png);
        var size = cc.winSize;
        var sp=new cc.Sprite();
        sp.setPosition(cc.p(size.width*0.5,size.height*0.5));
        var animFrames = [];
        var str = "";
        for (var i = 1; i < 9; i++) {
            str = "aircraft00" + (i < 10 ? ("0" + i) : i)+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 1.0 / 24 );
        sp.setPosition(cc.p(1500,500));
        var action = cc.sequence(
            cc.moveTo(0.2, cc.p(1500, 500)),
            cc.moveTo(2, cc.p(-200, 500))
        );
        sp.runAction(action);
        sp.runAction(cc.animate(animation).repeatForever());
        sp.runAction(cc.sequence(cc.Animate.create(animation),cc.delayTime(3),cc.removeSelf()));
        var particle = new cc.ParticleSystem(res.tx4weix);
        particle.y = 150;
        sp.addChild(particle);
        this._rootWidget.addChild(sp);
    },
    //炸弹动画
    Bombanimation:function(){
        cc.log("-----------------------------炸--------------------------------------")
        SoundMgr.getInstance().playEffect("men_bomb", 0, false);
        cc.spriteFrameCache.addSpriteFrames(res.Rocket,res.Rocket_png);
        var size = cc.winSize;
        var sp=new cc.Sprite();
        sp.setPosition(cc.p(size.width*0.5,size.height*0.5));
        sp.setScale(3);
        var animFrames = [];
        var str = "";
        for (var i = 1; i < 23; i++) {
            str = "tx1zhad00" + (i < 10 ? ("0" + i) : i)+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 1.0 / 18 );
        sp.runAction(cc.sequence(cc.animate(animation),cc.delayTime(0),cc.removeSelf()));
        var particle = new cc.ParticleSystem(res.tx4weix);
        sp.addChild(particle);
        this._rootWidget.addChild(sp);
    },
    //王炸动画
    Wanganimation:function(){
        cc.log("-----------------------------王炸--------------------------------------");
        SoundMgr.getInstance().playEffect("men_roket", 0, false);
        cc.spriteFrameCache.addSpriteFrames(res.RocketH,res.RocketH_png);
        var sp=new cc.Sprite();
        var animFrames = [];
        var str = "";
        for (var i = 1; i < 3; i++) {
            str = "rocket00" + (i < 10 ? ("0" + i) : i)+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 1.0 / 24 );
        sp.setPosition(cc.p(680,-250));
        var action = cc.sequence(
            cc.moveTo(1, cc.p(680, 300)),
            cc.moveTo(0.7, cc.p(680, 1200))
        );
        sp.runAction(action);
        sp.runAction(cc.animate(animation).repeatForever());
        sp.runAction(cc.sequence(cc.Animate.create(animation),cc.delayTime(3),cc.removeSelf()));
        var particle = new cc.ParticleSystem(res.tx4weix);
        particle.x = sp.getContentSize().width +120;
        particle.y = 100;
        sp.addChild(particle);
        this._rootWidget.addChild(sp);

    },
    //底牌显示
    whitecard: function () {
    	return this.Panelwhitecard.setVisible(true);
    },
    // 更新底分
    updateBaseScore: function (nScore) {
        this.TextBaseScore.string = nScore;
        var slem = this.TextBaseScore.getString().length;
        this.TextBaseScore.setContentSize(39 * slem, 55);
    },
    // 更新倍数
    updateMultiple: function (nMultiple) {
        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var nScore = game.getBankerScore();
        var a = game.getBombCount();

        // 春天
        if (game.getSpringCount() >= 1 || game.getAntiSpring() >= 1) {
            cc.log("有春天");
            a++;
        }

        cc.log("炸弹春天倍数"+a);
        nMultiple = nScore * Math.pow(2, a);
        if(nMultiple == 0){
        	nMultiple = 1;
        }

        this.TextMultiple.string = nMultiple;
        var slem = this.TextBaseScore.getString().length;
        this.TextBaseScore.setContentSize(39 * slem, 55);
    },

    // 更新底牌
    updateHandCard: function (bRest) {
        for (var i = 0; i < 3; i++) {
            this.ImghandCards[i].removeAllChildren();
        }
        if (bRest) return;
        var game = ClientData.getInstance().getGame();
        if (game) {
            var handCard = game.getBankerCard();
            if (handCard && handCard.length == 3) {
                for (var i = 0; i < handCard.length; i++) {
                    var spriteCard = new CardSprite();
                    spriteCard.loadJson(handCard[i], 0);
                    this.ImghandCards[i].addChild(spriteCard);

                    this.laiziSearchData = DdzModel.prototype.GetCardValue(handCard[i]);
                    var game = ClientData.getInstance().getGame();
                    var laizidata = game.getLiziCard();
                    if(this.laiziSearchData == laizidata){
                        var laiSprite = new cc.Sprite("res/public/huaiFengCard/FrameLai01.png");
                        laiSprite.setAnchorPoint(cc.p(0, 0));
                        spriteCard.addChild(laiSprite);
                    }
                }
            }
        }
    }
});
