/**
 * Created by lingjianfeng on 15/4/2.
 */

var LEVEL_PAGE_COUNT = 3;

var CLMainLayer = cc.Layer.extend({
    mark : null,
    ctor: function () {
        this._super();
        this.loadPageView();
        this.loadPageMark();
        this.loadReturnButton();
        return true;
    },
    loadPageView : function(){
        var pageView = new ccui.PageView();
        this.addChild(pageView);
        pageView.setTouchEnabled(true);
        pageView.setContentSize(GC.winSize);
        pageView.addEventListener(this.onPageViewEvent, this);

        for (var i = 0; i < LEVEL_PAGE_COUNT; i ++){
            var node = new LevelPage("#cl_selectLevelBg_" + i + ".png", i);

            var layout = new ccui.Layout();
            pageView.addPage(layout);
            layout.setContentSize(GC.winSize);
            layout.addChild(node);
        }
    },
    loadPageMark : function(){
        var node = new PageMark({
            dir         : PageMark.DIR_Horizontal,
            space       : 20,
            count       : LEVEL_PAGE_COUNT,
            normalImg   : "#cl_pageMark_1.png",
            selectedImg : "#cl_pageMark_2.png"
        });
        this.addChild(node);
        node.setPosition(GC.w2, 50);

        this.mark = node;
    },
    loadReturnButton : function(){
        var node = new ccui.Button();
        this.addChild(node);
        node.loadTextures(
            res.ui_btnBackNormal_png,
            res.ui_btnBackPress_png,
            res.ui_btnBackNormal_png
        );
        node.setPosition(node.width / 2 + 30, node.height / 2 + 30);
        node.setTouchEnabled(true);
        node.addTouchEventListener(function(sender){
            var scene = new MainMenuScene();
            cc.director.runScene(new cc.TransitionFade(GC.TransitionTime, scene));
        }.bind(this));
    },
    onPageViewEvent: function (sender, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
                var currIndex = sender.getCurPageIndex().valueOf();
                this.mark.onChangeIndex(currIndex);
                break;
            default:
                break;
        }
    }
});