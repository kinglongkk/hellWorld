/**
 * Created by lingjianfeng on 15/4/2.
 */

var GPPassLayer = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 138));
        this.loadPanel();
        this.loadButton();
        return true;
    },
    loadPanel : function(){
        var node = new cc.Sprite("#gp_gamePass.png");
        this.addChild(node);
        node.setPosition(GC.w2, GC.h2);
    },
    loadButton : function(){
        var nextNormal    = new cc.Sprite("res/ui_btnNext.png");
        var nextSelected  = new cc.Sprite("res/ui_btnNext.png");
        var nextDisabled  = new cc.Sprite("res/ui_btnNext.png");

        var next = new cc.MenuItemSprite(
            nextNormal,
            nextSelected,
            nextDisabled,
            function(){

                var levelStr = cc.sys.localStorage.getItem("maxLevelNum");
                var nextLevel = parseInt(levelStr + 1);
                new LevelLoader(nextLevel);

                var scene = new GamePlayScene();
                cc.director.runScene(new cc.TransitionFade(GC.TransitionTime, scene));

            }.bind(this));


        var backNormal    = new cc.Sprite("res/ui_btnBack.png");
        var backSelected  = new cc.Sprite("res/ui_btnBack.png");
        var backDisabled  = new cc.Sprite("res/ui_btnBack.png");

        var back = new cc.MenuItemSprite(
            backNormal,
            backSelected,
            backDisabled,
            function(){
                var scene = new ChooseLevelScene();
                cc.director.runScene(new cc.TransitionFade(GC.TransitionTime, scene));

            }.bind(this));

        var menu = new cc.Menu(next, back);
        this.addChild(menu);
        menu.alignItemsHorizontally();
        menu.setPosition(GC.w2, GC.h2 - 200);
    }
});