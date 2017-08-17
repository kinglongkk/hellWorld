/**
 * Created by lingjianfeng on 15/4/7.
 */


var GOMainLayer = cc.Layer.extend({
    failedPanel : null,
    ctor:function () {
        this._super();
        this.loadFailedPanel();
        this.loadReturnButton();
        this.loadParticleEffect();
        this.loadFailedPanelAction();
        return true;
    },
    loadFailedPanel : function(){
        var node = new cc.Sprite("res/go_failedPanel.png");
        this.addChild(node);
        node.setPosition(GC.w2, GC.h);

        this.failedPanel = node;
    },
    loadReturnButton : function(){
        var node = new ccui.Button();
        this.failedPanel.addChild(node);
        node.setPosition(this.failedPanel.width / 2, 100);
        node.loadTextures(
            "res/ui_btnBack.png",
            "res/ui_btnBack.png",
            "res/ui_btnBack.png"
        );
        node.setTouchEnabled(true);
        node.addTouchEventListener(function(sender){
            var scene = new ChooseLevelScene();
            cc.director.runScene(new cc.TransitionFade(GC.TransitionTime, scene));
        }.bind(this));

    },
    loadParticleEffect : function(){
        var node = new cc.ParticleSystem("res/changjing.plist");
        this.addChild(node);
        node.setPosition(GC.w2, 0);
    },
    loadFailedPanelAction : function(){
        var action = cc.moveTo(0.8, cc.p(GC.w2, GC.h2));
        this.failedPanel.runAction(action.easing(cc.easeElasticOut()));
    }
});