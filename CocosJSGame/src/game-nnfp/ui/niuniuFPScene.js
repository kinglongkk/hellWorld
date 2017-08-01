var NiuniuFPMainLayer = cc.Layer.extend({

    init: function () {

        // 从文件载入
        cc.spriteFrameCache.addSpriteFrames(res.nnFpAnimationPlist_plist);
        cc.spriteFrameCache.addSpriteFrames(res.huaiFengCardPlist_plist);
        var json = ccs.load(res.dlgNnFpScene_json);

        this._rootWidget = json.node;
        this.addChild(this._rootWidget);

        this.Text_Num = this._rootWidget.getChildByName("Image_gameNum_bg").getChildByName("Text_Num");
        this.Text_node = this._rootWidget.getChildByName("Image_note_bg").getChildByName("Text_node");
        this.Text_roomNum = this._rootWidget.getChildByName("Image_roomNum_bg").getChildByName("Text_roomNum");

        this.Text_roomNum.string = g_objHero.getRoomID();

        g_objHero.setBackPlazaSign(false);

        var game = ClientData.getInstance().getGame();
        if (!game) return;

        this.Text_node.setString(game.getCellScore());
        this.allNum = game.getGameCount() || game.getDrawCountLimit();
        this.curentNum = game.getPlayCount(); // 当前局数
        if (this.curentNum <= this.allNum) {
            this.Text_Num.string = this.curentNum + "/" + this.allNum;
            game.setCurentCount(this.curentNum);
        }

    },

    // 更新已玩局数
    updateNode: function () {
        this.curentNum++;
        if (this.curentNum <= this.allNum) {
            this.Text_Num.string = this.curentNum + "/" + this.allNum;
            var game = ClientData.getInstance().getGame();
            if (game) {
                game.setCurentCount(this.curentNum);
            }
        }
    },
    //掉线后显示局数
    resetNumberOfGames: function () {
        var game = ClientData.getInstance().getGame();
        if (game) {
            this.Text_Num.string = game.getCurentCount() + "/" + this.allNum;
            this.curentNum = game.getCurentCount();
        }
    },

    resetRounds: function () {
        this.curentNum = 0;
        this.Text_Num.string = this.curentNum + "/" + this.allNum;
    },

    onClickSet: function(sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                var scaleTo = cc.ScaleTo(0.05, 1.05);
                sender.runAction(scaleTo);
                break;
            case ccui.Widget.TOUCH_MOVED:
                var scaleTo = cc.ScaleTo(0.05, 1);
                sender.runAction(scaleTo);
                break;
            case ccui.Widget.TOUCH_ENDED:
                var scaleTo = cc.ScaleTo(0.05, 1);
                sender.runAction(scaleTo);
                // UIMgr.getInstance().openDlg(ID_DlgGameSet);
                //切换账号
                LogonMsgHandler.getInstance().close();
                ClientData.getInstance().setReplaceScene(true);

                if (cc.sys.isNative) {
                    var scene = new cc.TransitionPageTurn(0.5, new LoginScene(), false);
                    cc.director.runScene(scene);
                } else {
                    cc.director.runScene(new LoginScene());
                }
                break;
            default:
                break;
        }
    },

    // 是否局数到了
    isFinished: function () {
        return this.curentNum >= this.allNum;
    }
});


var NiuniuFPScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        this.init();
        
        var game = new NiuniuFPGame();

        ClientData.getInstance().setGame(game);

        this.layer = new NiuniuFPMainLayer();
        this.addChild(this.layer);
        this.layer.init();

        //游戏管理
        var gameUIMgr = NiuniuFPUIMgr.getInstance();
        GameKindMgr.getInstance().setGameUIMgr(gameUIMgr);
    },

    onEnter: function () {
        this._super();
    },

    onEnterTransitionDidFinish: function () {
        this._super();

        this.sceneName = "NiuniuFPScene";

        ClientData.getInstance().setReplaceScene(false);

        UIMgr.getInstance().init(this.layer);
        NiuniuFPUIMgr.getInstance().init(this.layer);
    },

    getSceneName: function () {
        return this.sceneName;
    },

    isPlazaScene: function () {
        return false;
    },

    isGameScene: function () {
        return true;
    },

    onExit: function () {
        cc.Scene.prototype.onExit.call(this);

        SoundMgr.getInstance().stopMusic();
    },

    // 更新位置信息
    updateLoaction: function () {
        var dlg = UIMgr.getInstance().getDlg(ID_NnFpDlgPlayer);
        if (dlg) {
            dlg.updatePlayersLocation();
        }
    },

    // 战绩中心
    showResult: function () {
        var game = ClientData.getInstance().getGame();
        if (game && !(game.getCurentCount() === 0)) {
            NiuniuFPUIMgr.getInstance().sendOpenResult();
            g_objHero.setBackPlazaSign(true);
        } else {
            GameUserMsg.getInstance().sendStandUp(true);
            GameKindMgr.getInstance().backPlazaScene();
        }
    }
});
