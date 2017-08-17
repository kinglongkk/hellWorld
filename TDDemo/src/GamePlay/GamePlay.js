/**
 * Created by lingjianfeng on 15/4/2.
 */

var GamePlayLayer = cc.Layer.extend({
    backgroundLayer     : null,
    mainLayar           : null,
    ctor:function () {
        this._super();
        // 加载[背景层]
        this.loadBackgroundLayer();
        // 加载[游戏主层]
        this.loadMainLayer();
        return true;
    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = new GPBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadMainLayer : function(){
        this.mainLayar = new GPMainLayer();
        this.addChild(this.mainLayar);
    }
});

var GamePlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.loadResource();
        this.loadLayer();
    },
    onExit : function(){
        this.unLoadResource();
        this._super();
    },
    loadResource : function(){
    },
    unLoadResource : function(){
    },
    loadLayer : function(){
        var layer = new GamePlayLayer();
        this.addChild(layer);
    }
});