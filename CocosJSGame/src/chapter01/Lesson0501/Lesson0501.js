/**
 * Created by lingjianfeng on 15/1/5.
 */



//    Demo索引
var DEMO_IDX = 0;


// =================================
// ------------[场景入口]------------
// =================================
var Unit01Scene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        var layer = new Demo1();
//        var layer = new Demo2();
//        var layer = new Demo3();
//        var layer = new Demo4();
//        var layer = new Demo5();
//        var layer = new Demo6();
        this.addChild(layer);
    }
});



//
// Demo模版，所有具体Demo层的父类。只是实现了3个功能。
//  1. 返回上一个Demo
//  2. 重启当前Demo
//  3. 进入下一个Demo
var DemoBaseLayer = BaseLayer.extend({
    // 示例切换[上一个]
    onBackCallback : function(sender){
        var scene = new cc.Scene();
        scene.addChild(onBackDemo());
        cc.director.runScene(scene);
    },
    // 示例切换[重启当前]
    onRestartCallback : function(sender){
        var scene = new cc.Scene();
        scene.addChild(onRestartDemo());
        cc.director.runScene(scene);
    },
    // 示例切换[下一个]
    onNextCallback : function(sender){
        var scene = new cc.Scene();
        scene.addChild(onNextDemo());
        cc.director.runScene(scene);
    },
    onEnter : function(){
        this._super();
    }
});



// 第1个Demo
var Demo1 = DemoBaseLayer.extend({
    // 英文标题
    getEnTitle : function(){
        return "Demo1";
    },
    // 中文标题
    getZhTitle : function(){
        return "实例1";
    },
    // 中文说明
    getZhInfo : function(){
        return " Unit1 : 一百块都不给我...好心塞...1";
    },
    onEnter : function(){
        this._super();
    }
});

// 第2个Demo
var Demo2 = DemoBaseLayer.extend({
    // 英文标题
    getEnTitle : function(){
        return "Demo2";
    },
    // 中文标题
    getZhTitle : function(){
        return "实例2";
    },
    // 中文说明
    getZhInfo : function(){
        return " Unit1 : 为了迎娶白富美，写代码也是蛮拼的...2";
    },
    onEnter : function(){
        this._super();
    }
});


// 第3个Demo
var Demo3 = DemoBaseLayer.extend({
    // 英文标题
    getEnTitle : function(){
        return "Demo3";
    },
    // 中文标题
    getZhTitle : function(){
        return "实例3";
    },
    // 中文说明
    getZhInfo : function(){
        return " Unit1 : 来福州，请你吃麻辣烫，6快钱的那种...3";
    },
    onEnter : function(){
        this._super();
    }
});


// 第4个Demo
var Demo4 = DemoBaseLayer.extend({
    // 英文标题
    getEnTitle : function(){
        return "Demo4";
    },
    // 中文标题
    getZhTitle : function(){
        return "实例4";
    },
    // 中文说明
    getZhInfo : function(){
        return " Unit1 : 我也是醉了...4";
    },
    onEnter : function(){
        this._super();
    }
});


// 第5个Demo
var Demo5 = DemoBaseLayer.extend({
    // 英文标题
    getEnTitle : function(){
        return "Demo5";
    },
    // 中文标题
    getZhTitle : function(){
        return "实例5";
    },
    // 中文说明
    getZhInfo : function(){
        return " Unit1 :2015 有代码，任性...5";
    },
    onEnter : function(){
        this._super();
    }
});


// 第6个Demo
var Demo6 = DemoBaseLayer.extend({
    // 英文标题
    getEnTitle : function(){
        return "Demo6";
    },
    // 中文标题
    getZhTitle : function(){
        return "实例6";
    },
    // 中文说明
    getZhInfo : function(){
        return " Unit1 : 买个Iphone 6plus,看看它到底拉屎不拉屎...6";
    },
    onEnter : function(){
        this._super();
    }
});



// 数组[Demo集合]
var arrayDemo = [
    Demo1,
    Demo2,
    Demo3,
    Demo4,
    Demo5,
    Demo6
];


// 返回上一个Demo
var onBackDemo = function () {
    DEMO_IDX--;
    if (DEMO_IDX < 0){
        DEMO_IDX += arrayDemo.length;
    }
    return new arrayDemo[DEMO_IDX]();
};

// 重启当前Demo
var onRestartDemo = function () {
    return new arrayDemo[DEMO_IDX]();
};

// 进入下一个Demo
var onNextDemo = function () {
    DEMO_IDX++;
    DEMO_IDX = DEMO_IDX % arrayDemo.length;  // 取余，保证头尾循环
    return new arrayDemo[DEMO_IDX]();
};


