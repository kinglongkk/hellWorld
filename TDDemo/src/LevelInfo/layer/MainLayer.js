/**
 * Created by lingjianfeng on 15/4/2.
 */


var STAR_NUMBER = 3;
var LIMainLayer = cc.Layer.extend({
    infoPanel : null,
    ctor : function(){
        this._super();
        //
        this.loadInfoPanel();
        this.loadButton();
        this.loadStar();
        return true;
    },
    loadInfoPanel : function(){
        var node = new cc.Sprite("#li_levelInfoPanel.png");
        this.addChild(node);
        node.setPosition(GC.w2, GC.h2);

        this.infoPanel = node;
    },
    loadButton : function(){
        var startNormal    = new cc.Sprite(res.ui_btnStart_png);
        var startSelected  = new cc.Sprite(res.ui_btnStart_png);
        var startDisabled  = new cc.Sprite(res.ui_btnStart_png);

        var start = new cc.MenuItemSprite(
            startNormal,
            startSelected,
            startDisabled,
            function(){
                var scene = new GamePlayScene();
                cc.director.runScene(new cc.TransitionFade(GC.TransitionTime, scene));

            }.bind(this));

        var backNormal    = new cc.Sprite(res.ui_btnBack_png);
        var backSelected  = new cc.Sprite(res.ui_btnBack_png);
        var backDisabled  = new cc.Sprite(res.ui_btnBack_png);

        var back = new cc.MenuItemSprite(
            backNormal,
            backSelected,
            backDisabled,
            function(){
                var scene = new ChooseLevelScene();
                cc.director.runScene(new cc.TransitionFade(GC.TransitionTime, scene));
            }.bind(this));

        var menu = new cc.Menu(start, back);
        this.addChild(menu);
        menu.setPosition(GC.w / 2, 140);
        menu.alignItemsHorizontally();
    },
    loadStar : function(){
        var nodeSize = new cc.Sprite("#li_starBg.png").getContentSize();
        var space = nodeSize.width / 4;
        var startX = (GC.w - (STAR_NUMBER * nodeSize.width + (STAR_NUMBER - 1) * space)) / 2 + nodeSize.width / 2;
        var y = this.infoPanel.y + 115;

        for (var i = 0; i < STAR_NUMBER; i++){
            var x = startX + (nodeSize.width + space) * i;
            var node = new cc.Sprite("#li_starBg.png");
            this.addChild(node);
            node.setPosition(x, y);
        }
    }
});
