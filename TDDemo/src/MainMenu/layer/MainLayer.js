/**
 * Created by lingjianfeng on 15/4/1.
 */


var MMMainLayer = cc.Layer.extend({
    btnStart : null,
    ctor:function () {
        this._super();
        // 加载[Title]
        this.loadTitle();
        // 加载[开始按钮]
        this.loadStartButton();
        // 加载[粒子系统]_开始按钮
        this.loadStartButtonParticle();
        return true;
    },
    loadTitle : function(){
        var node = new cc.Sprite("#mm_title.png");
        this.addChild(node);
        node.setPosition(GC.w / 3, GC.h / 3 * 2);

        var move = cc.moveBy(0.8, cc.p(0, 20));
        var action = cc.sequence(move, move.reverse()).repeatForever();
        node.runAction(action);
    },
    loadStartButton : function(){
        var nodeNormal    = new cc.Sprite("#mm_btnStartGame.png");
        var nodeSelected  = new cc.Sprite("#mm_btnStartGame.png");
        var nodeDisabled  = new cc.Sprite("#mm_btnStartGame.png");

        var node = new cc.MenuItemSprite(
            nodeNormal,
            nodeSelected,
            nodeDisabled,
            function(){
                var scene = new ChooseLevelScene();
                cc.director.runScene(new cc.TransitionFade(GC.TransitionTime, scene));

            }.bind(this));
        node.setPosition(GC.w2, GC.h2 / 2);

        var menu = new cc.Menu(node);
        this.addChild(menu);
        menu.setPosition(0, 0);

        this.btnStart = node;
    },
    loadStartButtonParticle : function(){
        var node = new cc.ParticleSystem(res.startParticle_plist);
        this.addChild(node);
        node.setPosition(this.btnStart.x - this.btnStart.width / 2, this.btnStart.y - this.btnStart.height / 2);

        var action = this.getFollowAction(50, this.btnStart);
        node.runAction(action);
    },
    // 获取[描边动作]
    getFollowAction : function(stretch, node){
        var width = node.width;
        var height = node.height;

        var bezier1 = [cc.p(-stretch, 0), cc.p(-stretch, height), cc.p(0, height)];
        var bezierBy1 = cc.bezierBy(0.6, bezier1);
        var move1 = new cc.moveBy(0.7, cc.p(width, 0));

        var bezier2 = [cc.p(stretch, 0), cc.p(stretch, -height), cc.p(0, -height)];
        var bezierBy2 = cc.bezierBy(0.6, bezier2);
        var move2 = new cc.moveBy(0.7, cc.p(-width, 0));

        var action = cc.sequence(bezierBy1, move1, bezierBy2, move2).repeatForever();
        return action;
    }
});
