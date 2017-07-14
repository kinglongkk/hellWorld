
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
        ccui.helper.doLayout(this._rootWidget);
        
        this.PanelMain = this._rootWidget.getChildByName('Panel_main');

        // 倍数
        this.TextMultiple = this._rootWidget.getChildByName("Text_multiple");

        this.TextMultiple.string = 1 ;
        // 底分
        this.TextBaseScore = this._rootWidget.getChildByName("Text_BaseScore");
        // 底牌区域
        this.Panelwhitecard = this._rootWidget.getChildByName("Panel_whitecard");
        this.Panelwhitecard.setVisible(false);
        this.PanelHand = this._rootWidget.getChildByName("Panel_whitecard");

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
    
    //底牌显示
    whitecard: function () {
    	return this.Panelwhitecard.setVisible(true);
    },
    // 更新底分
    updateBaseScore: function (nScore) {
        this.TextBaseScore.string = nScore;
    },
    
    // 更新倍数
    updateMultiple: function (nMultiple) {
        var game = ClientData.getInstance().getGame();
        if (!game) return;

        var nScore = game.getBankerScore();
        var a = game.getBombCount();

        // 王炸
        if (game.getRocketCount() >= 1) {
            a++;
        }

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
                }
            }
        }
    },
});
