/**
 * Created by lingjianfeng on 15/4/2.
 */

var LevelInfoLayer = cc.Layer.extend({
    backgroundLayer : null,
    mainLayar : null,
    ctor:function () {
        this._super();
        this.loadBackground();
        this.loadMainLayer();
        return true;
    },
    loadBackground : function(){
        this.backgroundLayer = new LIBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadMainLayer : function(){
        this.mainLayar = new LIMainLayer();
        this.addChild(this.mainLayar);
    }
});

var LevelInfoScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LevelInfoLayer();
        this.addChild(layer);
    }
});