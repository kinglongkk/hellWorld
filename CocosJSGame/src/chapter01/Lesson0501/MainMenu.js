/**
 * Created by lingjianfeng on 15/1/5.
 */

var LINE_SPACE = 100;

var MainMenuLayer = cc.LayerColor.extend({
    onEnter : function(){
        this._super();

        // 菜单
        var itemMenu = new cc.Menu();

        // 遍历所有的示例
        for (var i = 0; i < testNames.length; i++) {
            var label = new cc.LabelTTF(testNames[i].title, "Arial", 64);
            var menuItem = new cc.MenuItemLabel(label, this.onMenuCallback, this);
            itemMenu.addChild(menuItem, i + 10000);
            menuItem.setPosition(GC.w2, GC.h - (i + 1) * LINE_SPACE);
        }

        // 菜单属性配置
        itemMenu.setContentSize(GC.w, (testNames.length + 1) * LINE_SPACE);
        itemMenu.setPosition(0, 0);
        this.addChild(itemMenu);

    },

    //
    onMenuCallback : function(sender){

        // TODO 根据层级区分当前的菜单item
        var idx = sender.getLocalZOrder() - 10000;
        var testCase = testNames[idx];
        var scene = testCase.getScene();
        cc.director.runScene(scene);

//        如果需要加载资源
//        if (false){
//            var res = testCase.resource || [];
//            cc.LoaderScene.preload(res, function () {
//                var scene = testCase.getScene();
//                cc.director.runScene(scene);
//            }, this);
//        }
    }
});


// =================================
// ------------[场景入口]------------
// =================================
var MainMenuScene = cc.Scene.extend({
    onEnter : function(){
        this._super();

        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});

var testNames = [
    {
        title:"Unit1",
        getScene:function () {
            return new Unit01Scene();
        }
    },
    {
        title:"Unit2",
        getScene:function () {
            return new Unit01Scene();
        }
    },
    {
        title:"Unit3",
        getScene:function () {
            return new Unit01Scene();
        }
    },
    {
        title:"Unit4",
        resource : null, // 如果需要资源
        getScene:function () {
            return new Unit01Scene();
        }
    },
    {
        title:"Unit5",
        resource : null,
        getScene:function () {
            return new Unit01Scene();
        }
    }
]