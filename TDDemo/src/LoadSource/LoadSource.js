/**
 * Created by lingjianfeng on 15/4/19.
 */


var LoadSourceLayer = cc.Layer.extend({
    backgroundLayer : null,
    mainLayar : null,
    ctor:function () {
        this._super();
        this.loadBackground();
        this.loadMainLayer();
        return true;
    },
    loadBackground : function(){
        this.backgroundLayer = new LSBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadMainLayer : function(){
        this.mainLayar = new LSMainLayer();
        this.addChild(this.mainLayar);
    }
});

var LoadSourceScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LoadSourceLayer();
        this.addChild(layer);
    }
});