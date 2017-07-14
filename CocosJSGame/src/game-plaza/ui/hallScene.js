var HallMainLayer = cc.Layer.extend({
    _uiLayer: null,
    init: function () {
        cc.log("HallMainLayer--------------------------------------------------began");
        this._uiLayer = ccui.Layout.create();
        this._uiLayer.setLayoutType(ccui.Layout.ABSOLUTE);
        var sizeDir = cc.director.getWinSize();
        this._uiLayer.setSize(sizeDir);
        this.addChild(this._uiLayer);

        //预先加载开红包动画资源
        cc.spriteFrameCache.addSpriteFrames(res.openRedEnvelop_plist);
        //cc.spriteFrameCache.addSpriteFrames(res.dlgTip_plist);
        cc.spriteFrameCache.addSpriteFrames(res.dlgHelpCardType_plist);

        UIMgr.getInstance().init(this._uiLayer);
        HallUIMgr.getInstance().startGame(this._uiLayer);

        //test
        //SceneMgr.getInstance().setPlayeGameType(GAME_TYPE_TAG.GAME_TYPE_Niuniuwr);
        //SceneMgr.getInstance().onLoginToGame(true, 0);

        cc.log("HallMainLayer--------------------------------------------------end");

        //this.test();
    },

    //-----------------------test---------------------------------------------------------------------
    addButton: function (str, pt) {
        var button = ccui.Button.create();
        button.setName(str);
        button.setTouchEnabled(true);
        button.setScale9Enabled(true);
        button.loadTextures("res/CloseNormal.png", "res/CloseSelected.png", "");
        button.setTitleText(str);
        button.setPosition(pt);
        button.setSize(cc.size(100, 50));
        button.addTouchEventListener(this.touchEvent, this);
        this._uiLayer.addChild(button);
    },
    test: function () {
        this.addButton("toGame", cc.p(100, 100));
    },
    touchEvent: function (sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            switch (sender.getName()) {
                case "toGame":
                {
                    HallUIMgr.getInstance().connectGameMsg();
                }
                    break;
                default :
                    break;
            }
        }
    }
});


var HallMainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HallMainLayer();
        this.addChild(layer);
        layer.init();
    }
});