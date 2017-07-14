/**
 * Created by lingjianfeng on 14/12/20.
 *
 *
 */
//

var Lesson0304SceneLayer = cc.Layer.extend({

    sprite : null,
    ctor:function () {
        this._super();

        var helloLabel = new cc.LabelTTF("场景切换和带有颜色的层", "Arial",24);
        helloLabel.x = GC.w2;
        helloLabel.y = GC.h - helloLabel.getContentSize().height;
        this.addChild(helloLabel, 5);

        var helloLabel1 = new cc.LabelTTF("TransitionScene and LayerColor", "Arial",24);
        helloLabel1.x = GC.w2;
        helloLabel1.y = GC.h - 2 * helloLabel.getContentSize().height;
        this.addChild(helloLabel1, 5);


        // 创建一个带有【颜色】的层 . RGBA
        var layer = new cc.LayerColor(cc.color(255, 128, 128));
        this.addChild(layer);

        // 给层添加了一个触摸事件
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan
        }, this);

        return true;
    },

    onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();

        target.runSceneTran();
        return true;
    },
    runSceneTran:function () {
        var time = 1.5;
        var scene = new cc.Scene();
        var layer = new cc.LayerColor(cc.color(128, 128, 255));
//        添加透明
//        var layer = new cc.LayerColor(cc.color(128, 128, 255, 100));
//        层设置大小
        layer.setContentSize(GC.w * 0.8, GC.h * 0.8);
        layer.setPosition(GC.w * 0.1, GC.h * 0.1);
        scene.addChild(layer, 0);

//        cc.director.runScene(scene);

//        基础切换
//        cc.director.runScene(new cc.TransitionScene(time,scene));

//        继承，cc.TransitionScene。提供了方向支持。
//        支持的方向：LeftOver，RightOver，UpOver，DownOver
//        cc.TRANSITION_ORIENTATION_LEFT_OVER
//        cc.TRANSITION_ORIENTATION_RIGHT_OVER
//        cc.TRANSITION_ORIENTATION_UP_OVER
//        cc.TRANSITION_ORIENTATION_DOWN_OVER
//        cc.director.runScene(new cc.TransitionSceneOriented(time,scene,cc.TRANSITION_ORIENTATION_LEFT_OVER));

//        旋转
//        cc.director.runScene(new cc.TransitionRotoZoom(time, scene));
//        跳转
//        cc.director.runScene(new cc.TransitionJumpZoom(time, scene));

//        四方推入
//        cc.director.runScene(new cc.TransitionMoveInL(time,scene));
//        cc.director.runScene(new cc.TransitionMoveInR(time,scene));
//        cc.director.runScene(new cc.TransitionMoveInT(time,scene));
//        cc.director.runScene(new cc.TransitionMoveInB(time,scene));

//        四面滑入
//        cc.director.runScene(new cc.TransitionSlideInL(time,scene));
//        cc.director.runScene(new cc.TransitionSlideInR(time,scene));
//        cc.director.runScene(new cc.TransitionSlideInB(time,scene));
//        cc.director.runScene(new cc.TransitionSlideInT(time,scene));

//        本场景缩小切换到另一场景放大
//        cc.director.runScene(new cc.TransitionShrinkGrow(time,scene));

//        X轴和Y轴翻转
//        cc.director.runScene(new cc.TransitionFlipX(time,scene,cc.TRANSITION_ORIENTATION_LEFT_OVER));
//        cc.director.runScene(new cc.TransitionFlipY(time,scene,cc.TRANSITION_ORIENTATION_UP_OVER));

//        X轴和Y轴有角度翻转
//        cc.director.runScene(new cc.TransitionFlipAngular(time,scene,cc.TRANSITION_ORIENTATION_RIGHT_OVER));


//        水平翻转屏幕，做一个 传入/穿出 缩放， 正面是传出的场景，背面是传入的场景。
//        cc.director.runScene(new cc.TransitionZoomFlipX(time,scene,cc.TRANSITION_ORIENTATION_LEFT_OVER));
//        cc.director.runScene(new cc.TransitionZoomFlipY(t,scene,cc.TRANSITION_ORIENTATION_LEFT_OVER));

//        一半水平一半垂直传入/穿出翻转并一点点的缩放屏幕正面是传出的场景，背面是传入的场景
//        cc.director.runScene(new cc.TransitionZoomFlipAngular(time,scene,cc.TRANSITION_ORIENTATION_LEFT_OVER));

//        淡出传出场景，淡入传入场景
//        cc.director.runScene(new cc.TransitionFade(time,scene));
//        cc.director.runScene(new cc.TransitionFade(time,scene, cc.color(255,128,255, 255))));

//        两个 scenes 使用 RenderTexture 对象交叉淡入淡出
//        cc.director.runScene(new cc.TransitionCrossFade(time,scene));

//        随机顺序关闭淡出场景的 tiles
//        cc.director.runScene(new cc.TransitionTurnOffTiles(time,scene));

//        奇数列向上推移而偶数列向下推移.
//        cc.director.runScene(new cc.TransitionSplitCols(time,scene));
//        cc.director.runScene(new cc.TransitionSplitRows(time,scene));

//        从各个方向淡出 scene 的所有 tiles
//        cc.director.runScene(new cc.TransitionFadeTR(time,scene));
//        cc.director.runScene(new cc.TransitionFadeBL(time,scene));
//        cc.director.runScene(new cc.TransitionFadeUp(time,scene));
//        cc.director.runScene(new cc.TransitionFadeDown(time,scene));

    }
});

var Lesson0304Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Lesson0304SceneLayer();
        this.addChild(layer);

    }
});

