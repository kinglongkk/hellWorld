/**
 * Created by lingjianfeng on 15/4/2.
 */

var GPBackgroundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.loadBg();
        return true;
    },
    loadBg : function(){
        var instance = GameManager.getInstance();
        var bgName = "res/" + instance.getCurrBgName();
        var node = new cc.Sprite(bgName);
        this.addChild(node);
        node.setPosition(GC.w2, GC.h2);
    }
});