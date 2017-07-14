DLG_CREATOR[ID_DlgNnFpResult] = function() {
	return new DlgNnFpResult();
};

var DlgNnFpResult = DlgBase.extend({
	ctor: function(){
        this._whiteColor = cc.color(255, 255, 255);
        this._yellowColor = cc.color(255, 255, 0);
        this._blueColor = cc.color(102, 255, 255);
    },

	onCreate: function() {
		this.init();
	},

	onClose: function() {},

	init: function() {
        var json = ccs.load(res.nnFpResultScene_json);
        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        this.Panel_bg = this._rootWidget.getChildByName("Panel_bg");
        this.Image_bg = this.Panel_bg.getChildByName("Image_bg");
        //总成绩显示
        this.Image_bottom = this.Image_bg.getChildByName("Image_bottom");

        this.ListView_result = this.Image_bg.getChildByName("ListView_result");
        this.Image_board = this.ListView_result.getChildByName("Image_board");

        //按钮
        this.Btn_outRoom = this.Panel_bg.getChildByName("Btn_outRoom");
        this.Btn_outRoom.setTouchEnabled(true);
        this.Btn_outRoom.addTouchEventListener(this.onClickEvent, this);
        this.Btn_share = this.Panel_bg.getChildByName("Btn_share");
        this.Btn_share.setTouchEnabled(true);
        this.Btn_share.addTouchEventListener(this.onClickEvent, this);
        this.Btn_payMore = this.Panel_bg.getChildByName("Btn_payMore");
        this.Btn_payMore.setTouchEnabled(true);
        this.Btn_payMore.addTouchEventListener(this.onClickEvent, this);

        //头像
        this.Image_top = this.Image_bg.getChildByName("Image_top");

        this.fillData();
    },

    //按局数来填充数据
    fillData: function () {
        this.fillHeadPortrait();
        var game = ClientData.getInstance().getGame();
        var pointLen = game.getCurentCount(),
            len = pointLen,
            resultItemArray = [];
        if (pointLen < 9) len = 9;
        for (var i = 0; i < len; i++) {
            var imgNode = resultItemArray[i];
            if (i === 0) {
                imgNode = this.Image_board;
            } else {
                imgNode = this.Image_board.clone();
            }
            this.ListView_result.pushBackCustomItem(imgNode);
            this.fillSingleScore(imgNode, i, pointLen);
        }
    },

    //局数和每局输赢分数
    fillSingleScore: function (imgNode, index, pointLen) {
        var len = g_outcome.gamePlayernum,
	        textCount,
            Text_score = [];
        textCount = imgNode.getChildByName("Text_count");
        var indexStr = index > (pointLen - 1) ? "" : "第" + (index + 1) + "局";
        textCount.setColor(this._yellowColor);
        textCount.setString(indexStr);

        var img_bg = imgNode.getChildByName("Image_scoreBg");
        index % 2 > 0 ? img_bg.setVisible(false) : img_bg.setVisible(true);

	    for (var i = 0; i < len; i++) {
            Text_score[i] = imgNode.getChildByName("Text_score_" + i);
            var score = g_outcome.getPointByChairId(i)[index] || 0;
            if (score > 0) {
                score = "+" + score;
                Text_score[i].setColor(this._whiteColor);
            } else {
                Text_score[i].setColor(this._blueColor);
            }
            Text_score[i].setString(score);
            if (index > pointLen -1) Text_score[i].setString("");
        }
    },

    //头像与总成绩
    fillHeadPortrait: function () {
        var len = g_outcome.gamePlayernum,
            Panel_players = [],
            Total_Text_score = [],
            textName,
            imgName;
        for (var i = 0; i < len; i++) {
            var player = g_outcome.getPlayerByChairId(i);
            Panel_players[i] = this.Image_top.getChildByName("Panel_player_" + i);
            textName = Panel_players[i].getChildByName("Text_name");
            imgName = Panel_players[i].getChildByName("Image_name");

            if (g_objHero.getChairID() === player.getChairID()) {
                textName.setColor(this._yellowColor);
            } else {
                textName.setColor(this._whiteColor);
            }
            var playerName = player.getNickName();
            if (playerName) textName.setString(playerName);

            player.loadUrlImage(function (imagePath) {
                imgName.loadTexture(imagePath, ccui.Widget.LOCAL_TEXTURE);
            });

            Total_Text_score[i] = this.Image_bottom.getChildByName("Text_totalScore_" + i);
            var totalScore = this.getTotalScore(i) || 0;
            if (totalScore > 0) {
                totalScore = "+" + totalScore;
                Total_Text_score[i].setColor(this._yellowColor);
            } else {
                Total_Text_score[i].setColor(this._blueColor);
            }
            Total_Text_score[i].setString(totalScore);
        }
    },

    //每个人的总成绩
    getTotalScore: function (index) {
        var scoreArray = g_outcome.getPointByChairId(index);
        var resultScore = 0;
        for (var i = 0; i < scoreArray.length; i++) {
            resultScore += scoreArray[i];
        }
        return resultScore;
    },

    onClickEvent: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED === type) {
            var strBtnName = sender.getName();
            cc.log('onClickEvent ' + strBtnName);
            switch (strBtnName) {
                case "Btn_outRoom":
                    GameUserMsg.getInstance().sendStandUp(true);
                    GameKindMgr.getInstance().backPlazaScene();
                    break;
                case "Btn_share":
                    this.shareResult();
                    break;
                case "Btn_payMore":
                    break;
                default:
                    break;
            }
        }
    },

    shareResult: function () {
        if(cc.sys.isNative) {
            //截屏
            var target = WXShare.SHARE_TARGET_CIRCLE;
            WXShare.getInstance().shareCaptureScreen(target, function () {
                cc.log("++++++战绩中心界面----分享+++成功+++");
                WXShare.getInstance().showSysTip("---分享成功---");
            });
        }
    }
});