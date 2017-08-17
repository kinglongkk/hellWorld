/**
 * Created by lingjianfeng on 15/4/2.
 */

var CLBackgroundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.loadBg();
        return true;
    },
    loadBg : function(){
        var node = new cc.Sprite(res.sh_bg_png);
        this.addChild(node);
        node.setPosition(GC.w2, GC.h2);
    }
});
