/**
 * Created by lingjianfeng on 15/1/5.
 */



var BASE_LAYER_BACK_TAG = 1;
var BASE_LAYER_NEXT_TAG = 2;
var BASE_LAYER_RESTART_TAG = 3;

var BASE_MENU_TAG = 11;
var BASE_EN_TAG = 12;
var BASE_ZN_TAG = 13;
var BASE_INFO_TAG = 14;

// =================================
// -----------[BaseLayer]-----------
// =================================
// 功能：
//      1. 定义了3个实例切换的接口
//      2. 定义了3个说明的接口
//      3. 加载了3个示例切换按钮
//      4. 实现了MainMenu按钮返回主界面功能
var BaseLayer = cc.Layer.extend({
    // 返回主界面
    onMainMenuCallback : function (sender) {

        // 返回主界面场景
//        cc.director.runScene(new MainMenuScene());

        // overwrite me
        // cc.log("Please overwrite onMainMenuCallback");
        // cc.log("你也可以选择重写 onMainMenuCallback函数");
    },
    // 示例切换[上一个]
    onBackCallback : function(sender){
        // overwrite me
        cc.log("Please overwrite  onBackCallback");
    },
    // 示例切换[重启当前]
    onRestartCallback : function(sender){
        // overwrite me
        cc.log("Please overwrite  onRestartCallback");
    },
    // 示例切换[下一个]
    onNextCallback : function(sender){
        // overwrite me
        cc.log("Please overwrite  onNextCallback");
    },
    // 英文标题
    getEnTitle : function(){
        // overwrite me
        cc.log("Please overwrite  getEnTitle");
    },
    // 中文标题
    getZhTitle : function(){
        // overwrite me
        cc.log("Please overwrite  getZhTitle");
    },
    // 中文说明
    getZhInfo : function(){
        // overwrite me
        cc.log("Please overwrite  getZhInfo");
    },
    onEnter : function (){
        this._super();

        // 英文标题
        var enTitle = this.getEnTitle();
        var enLabel = new cc.LabelTTF(enTitle, "Arial", 28);
        this.addChild(enLabel, 100, BASE_EN_TAG);
        enLabel.x = GC.w2;
        enLabel.y = GC.h - 50;

        // 中文标题
        var zhTitle = this.getZhTitle();
        var zhLabel = new cc.LabelTTF(zhTitle, "Arial", 28);
        this.addChild(zhLabel, 100, BASE_ZN_TAG);
        zhLabel.x = GC.w2;
        zhLabel.y = GC.h - 100;

        // 中文说明
        var info = this.getZhInfo();
        var infoLabel = new cc.LabelTTF(info, "Arial", 22);
        this.addChild(infoLabel, 100, BASE_INFO_TAG);
        infoLabel.x = GC.w2;
        infoLabel.y = GC.h - 130;

        // 三个按钮[底部]
        var btnBack     = new cc.MenuItemImage(res.back1_png, res.back2_png, this.onBackCallback, this);
        var btnRestart  = new cc.MenuItemImage(res.restart1_png, res.restart2_png, this.onRestartCallback, this);
        var btnNext     = new cc.MenuItemImage(res.next1_png, res.next2_png, this.onNextCallback, this);

        // tag
        btnBack.tag     = BASE_LAYER_BACK_TAG;
        btnRestart.tag  = BASE_LAYER_NEXT_TAG;
        btnNext.tag     = BASE_LAYER_RESTART_TAG;

        // 位置
        var restartWidth    = btnRestart.width
        var restartHeight   = btnRestart.height;
        btnBack.x       =  GC.w2 - restartWidth * 2;
        btnBack.y       = restartHeight / 2 ;
        btnRestart.x    =  GC.w2;
        btnRestart.y    = restartHeight / 2 ;
        btnNext.x       =  GC.w2 + restartWidth * 2;
        btnNext.y       = restartHeight / 2 ;

        // 按钮包进菜单
        var menu = new cc.Menu(btnBack, btnRestart, btnNext);
        menu.x = 0;
        menu.y = 10;
        this.addChild(menu, 102, BASE_MENU_TAG);

        // 右下角的Main menu
        var label = cc.LabelTTF.create("Main Menu", "Arial", 36);
        var menuItem = cc.MenuItemLabel.create(label, this.onMainMenuCallback, this);
        var menu = cc.Menu.create(menuItem);
        menu.setPosition(0, 0);
        menuItem.setPosition(
                GC.w - label.getContentSize().width / 2 - 10,
                label.getContentSize().height / 2 + 10
        );
        this.addChild(menu, 1, BASE_MENU_TAG);

    }
});

