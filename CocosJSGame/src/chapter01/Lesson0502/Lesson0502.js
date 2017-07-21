/**
 * Created by lingjianfeng on 15/1/3.
 */
//    Demo索引
var DEMO_IDX = 0;

// ==================================================================
// ----------------------------[场景入口]-----------------------------
// ==================================================================
var EventScene = cc.Scene.extend({
    onEnter : function(){
        this._super();

        // ------ 触摸相关 ------
//        var layer = new TouchOneByOne();
//        var layer = new TouchAllAtOnce();
//        var layer = new TouchPriority();
//        var layer = new EnabledTouch();
//        var layer = new TouchPauseResume();

        // ------ 重力感应 ------
//        var layer = new Acceleration();

        // ------ 键盘 ------
//        var layer = new Keyboard();

        // ------ 鼠标 ------
//        var layer = new Mouse();

        // ------ 自定义 ------
        var layer = new Custom();

        this.addChild(layer);
    }
});

// 模版，所有具体Demo层的父类。只是实现了3个功能。
//  1. 返回上一个Demo
//  2. 重启当前Demo
//  3. 进入下一个Demo
var TouchBaseLayer = BaseLayer.extend({
    onEnter : function(){
        this._super();
    },
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
    }
});


// ==================================================================
// -------------------- TOUCH_ONE_BY_ONE 示例 -----------------------
// ==================================================================
var TouchOneByOne = TouchBaseLayer.extend({

    onEnter : function () {
        this._super();

        // 左上角的精灵
        var sprite1 = new cc.Sprite(res.cyan_png);
        sprite1.setPosition(GC.w2 - sprite1.getContentSize().width / 2, GC.h2 + sprite1.getContentSize().height / 2);
        this.addChild(sprite1);

        // 中间的精灵
        var sprite2 = new cc.Sprite(res.magenta_png);
        sprite2.setPosition(GC.w2, GC.h2);
        this.addChild(sprite2);

        // 右下角的精灵。【注意】：父节点是sprite2
        var sprite3 = new cc.Sprite(res.yellow_png);
        sprite3.setPosition(sprite3.getContentSize().width , 0);
        sprite2.addChild(sprite3);

        //
        var listener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : false,    // TODO【事件吞噬】，阻止事件传递给下一层(层根据事件优先级而定，而非对象(节点)的zOrder值)
            onTouchBegan: function (touch, event) {
                // 获取当前触发事件的对象 TODO【备注】：有比getCurrentTarget更好的选择。
                //  但这里主要是3个精灵引用了同一套的事件处理方案，所以采用此方式。见下面的.clone
                var target = event.getCurrentTarget();
                // 获取点击坐标[基于本地坐标]
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                // 获取当前节点大小
                var size = target.getContentSize();
                // 区域设定
                var rect = cc.rect(0, 0, size.width, size.height);
                // 判断触摸点是否在节点区域内
                if (!(cc.rectContainsPoint(rect, locationInNode))) {
                    return false;
                }


                // 开始逻辑处理
                cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                target.opacity = 180;

                // TODO  true 和 false 的区别。 return false 的话，onTouchMoved和onTouchEnded不会被调用到
                return true;
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                // 返回从【前一个】触摸点【到当前点】的delta【距离】
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                target.opacity = 255;
            },
            onTouchCancelled : function(touch, event){
                cc.log("onTouchCancelled");
            }
        });

        cc.eventManager.addListener(listener, sprite1);
        cc.eventManager.addListener(listener.clone(), sprite2);
        cc.eventManager.addListener(listener.clone(), sprite3);

        // 3种移除监听器的方式
//        cc.eventManager.removeListeners(listener);   // 根据listener对象
//        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE);  // 根据listener类型
//        cc.eventManager.removeListeners(aNode);  // 根据节点
        return true;
    },
    // 英文标题
    getEnTitle : function(){
        return "1. Touch_One_By_One";
    },
    // 中文标题
    getZhTitle : function(){
        return "Touch_One_By_One 触摸机制";
    }

});

// ==================================================================
// -------------------- TOUCH_ALL_AT_ONCE 示例 -----------------------
// ==================================================================
var TouchAllAtOnce = TouchBaseLayer.extend({
    onEnter : function () {
        this._super();

        var node = new TouchAllAtOnceSprite(res.node256_png);
        this.addChild(node);
        node.setPosition(GC.w2, GC.h2);

        return true;
    },
    // 英文标题
    getEnTitle : function(){
        return "2. TouchAllAtOnce";
    },
    // 中文标题
    getZhTitle : function(){
        return "多点触摸机制";
    }
});


// ==================================================================
// ----------------------- 触摸优先级 示例 -----------------------------
// ==================================================================
var TouchPriority =  TouchBaseLayer.extend({
    onEnter : function(){
        this._super();

        // 左上角的精灵. 触摸优先级为：30
        var sprite1 = new TouchOneByOneSprite(res.cyan_png, 30);
        sprite1.setPosition(GC.w2 - sprite1.getContentSize().width / 2, GC.h2 + sprite1.getContentSize().height / 2);
        this.addChild(sprite1);

        // 中间的精灵.   触摸优先级为：-10
        var sprite2 = new TouchOneByOneSprite(res.magenta_png, -10);
        sprite2.setPosition(GC.w2, GC.h2);
        this.addChild(sprite2);

        // 右下角的精灵. 触摸优先级为：10
        var sprite3 = new TouchOneByOneSprite(res.yellow_png, 10);
        sprite3.setPosition(sprite3.getContentSize().width , 0);
        sprite2.addChild(sprite3);

    },

    // 英文标题
    getEnTitle : function(){
        return "3. Touch Priority";
    },
    // 中文标题
    getZhTitle : function(){
        return "触摸优先级";
    },
    // 中文说明
    getZhInfo : function(){
        return "priority值越低，触摸优先级越高"
    }

});


// ==================================================================
// --------------------- 移除监听器，实现触摸开关 ------------------------
// ==================================================================
var EnabledTouch = TouchBaseLayer.extend({

    onEnter:function () {
        this._super();

        var node = new TouchEnabledSprite(res.cyan_png);
        this.addChild(node);
        node.setPosition(GC.w2, GC.h2);

        var enable = false;
        // 开关item
        var toggleItem = new cc.MenuItemToggle(
            new cc.MenuItemFont("Enabled"),
            new cc.MenuItemFont("Disabled"),
            function (sender) {
                // 触摸开关。
                node.setTouchEnabled(enable);
                enable = !enable;
            });

        toggleItem.setPosition(GC.w2, 180);
        var menu = new cc.Menu(toggleItem);
        menu.setPosition(0, 0);
        menu.setAnchorPoint(0, 0);
        this.addChild(menu, 1);

        return true;
    },
    // 英文标题
    getEnTitle : function(){
        return "4. TouchEnabled";
    },
    // 中文标题
    getZhTitle : function(){
        return "触摸开关";
    }

});

// ==================================================================
// ----------------------- 事件[暂停/恢复] ----------------------------
// ==================================================================
var TouchPauseResume = TouchBaseLayer.extend({
    onEnter : function () {
        this._super();

        // 左上角的精灵. 触摸优先级为：30
        var sprite1 = new TouchOneByOneSprite(res.cyan_png);
        sprite1.setPosition(GC.w2 - sprite1.getContentSize().width / 2, GC.h2 + sprite1.getContentSize().height / 2);
        this.addChild(sprite1);

        // 中间的精灵.   触摸优先级为：-10
        var sprite2 = new TouchOneByOneSprite(res.magenta_png);
        sprite2.setPosition(GC.w2 + 100, GC.h2);
        this.addChild(sprite2);

        // 右下角的精灵. 触摸优先级为：10
        var sprite3 = new TouchOneByOneSprite(res.yellow_png, -10);  // TODO sprite3 采用了触控优先级方式
        sprite3.setPosition(sprite3.getContentSize().width , 0);
        sprite2.addChild(sprite3, -1);

        var self = this;

        var popup = new cc.MenuItemFont("Popup", function(sender){

            // TODO【事件暂停】 sprite3 采用触摸优先级方式，所以，特殊处理
            sprite3.getListener().setEnabled(false); // getListener 自定义的方法
            cc.eventManager.pauseTarget(self, true);  // TODO true 表示是否联级-->关联所有子节点

            //  创建一个颜色层，半透明
            var colorLayer = new cc.LayerColor(cc.color(0, 0, 255, 128));
            self.addChild(colorLayer, 999); //set colorLayer to top

            // 创建按钮
            var btn_normal = new cc.Scale9Sprite(res.bg_scale9_png);
            var btn_press = new cc.Scale9Sprite(res.bg_scale9_png);
            var titleBtn = new cc.LabelTTF("Close Dialog", "Arial", 26);
            titleBtn.color = cc.color(255, 128, 128);

            var controlButton = new cc.ControlButton(titleBtn, btn_normal);
            controlButton.setBackgroundSpriteForState(btn_press, cc.CONTROL_STATE_HIGHLIGHTED);
            controlButton.setTitleColorForState(cc.color.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);
            controlButton.anchorX = 0.5;
            controlButton.anchorY = 1;
            controlButton.x = GC.w2 + 50;
            controlButton.y =  GC.h2 - 150;

            controlButton.addTargetWithActionForControlEvents(this, function(){
                colorLayer.removeFromParent();
                // TODO 【事件恢复】
                cc.eventManager.resumeTarget(self, true);
                sprite3.getListener().setEnabled(true);
            }, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);

            // 创建背景面板
            var background = new cc.Scale9Sprite(res.bg_scale9_png);
            background.width = 300;
            background.height = 170;
            background.x = GC.w2 + 50;
            background.y = GC.h2 - 150;

            colorLayer.addChild(background);
            colorLayer.addChild(controlButton, 1);

        });

        popup.setAnchorPoint(1,0.5);
        popup.setPosition(cc.visibleRect.right);

        var menu = new cc.Menu(popup);
        menu.setAnchorPoint(0, 0);
        menu.setPosition(0, 0);

        this.addChild(menu);
    },
    // 英文标题
    getEnTitle : function(){
        return "5. Event pause and resume";
    },
    // 中文标题
    getZhTitle : function(){
        return "事件暂停/恢复 -- 事件遮罩";
    }
});

// ==================================================================
// --------------------------- 重力加速计 ----------------------------
// ==================================================================
var Acceleration =  TouchBaseLayer.extend({
    onEnter : function(){
        this._super();

        var sprite = new cc.Sprite(res.node64_png);
        this.addChild(sprite);
        sprite.setPosition(GC.w2, GC.h2);

        if( 'accelerometer' in cc.sys.capabilities ) {
            // 开始重力加速度
            cc.inputManager.setAccelerometerEnabled(true);
            // 设置迭代间隔
            cc.inputManager.setAccelerometerInterval(1/60);

            var listener = cc.EventListener.create({
                event       : cc.EventListener.ACCELERATION,
                callback    : this.onListenerAccelerometer
            });
            cc.eventManager.addListener(listener, sprite);

        }else{
            cc.log("accelerometer not supported");
        }
    },
    onListenerAccelerometer : function(acc, event){
        cc.log( "acc.x : " + acc.x + "   acc.y : " +acc.y);
        // 备注：acc.x 和 acc.y 取值范围 [-1 到 1].
        var target = event.getCurrentTarget();
        var ballSize  = target.getContentSize();
        var currPos  = target.getPosition();

        // TODO 速度定义
        var speed = 15;
        target.x = Acceleration.fixPos(
                currPos.x + acc.x * speed,
                ballSize.width / 2,
                GC.w - ballSize.width / 2);
        target.y = Acceleration.fixPos(
                currPos.y + acc.y * speed,
                ballSize.height / 2,
                GC.h - ballSize.height / 2);
    },
    // 重写onExit方法
    // 【注意】：所有onExit中，先处理自己的业务逻辑，再去调用this._super();
    // TODO 隐喻：女孩子上下楼梯
    onExit:function(){
        // 关闭重力加速度监听
        cc.inputManager.setAccelerometerEnabled(false);
        this._super();
    },
    // 英文标题
    getEnTitle : function(){
        return "6. accelerometer";
    },
    // 中文标题
    getZhTitle : function(){
        return "重力加速计";
    }
});



// ==================================================================
// ---------------------------- 键盘事件 -----------------------------
// ==================================================================
var Keyboard = TouchBaseLayer.extend({

    _label : null,
    onEnter:function () {
        this._super();

        // 创建一个label
        this.lebel = new cc.LabelTTF("No keyboard event received!", "", 20);
        this.addChild(this.lebel);
        this.lebel.setPosition(GC.w2, GC.h2);

        if( 'keyboard' in cc.sys.capabilities ) {
            // 为this.lebel 添加一个键盘监听事件
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                target: this.lebel,
                onKeyPressed: this.onKeyPressed,
                onKeyReleased: this.onKeyReleased
            }, this.lebel);
        }else{
            cc.log("keyboard 不支持键盘事件");
        }

        return true;
    },

    // 键按下
    onKeyPressed : function(keyCode, event){
        // 三目运算 。 isNative 判断是否为本地平台。
        this.target.setString("Key " + (cc.sys.isNative ? this.target.getNativeKeyName(keyCode) : String.fromCharCode(keyCode) ) + "(" + keyCode.toString()  + ") was pressed!");
    },
    // 键释放
    onKeyReleased: function(keyCode, event){
        this.target.setString("Key " + (cc.sys.isNative ? this.target.getNativeKeyName(keyCode) : String.fromCharCode(keyCode) ) + "(" + keyCode.toString()  + ") was released!");
    },
    // 返回本地按键名称
    getNativeKeyName:function(keyCode) {
        var allCode = Object.getOwnPropertyNames(cc.KEY);
        var keyName = "";
        for(var x in allCode){
            if(cc.KEY[allCode[x]] == keyCode){
                keyName = allCode[x];
                break;
            }
        }
        return keyName;
    },
    // 英文标题
    getEnTitle : function(){
        return "7. Keyboard";
    },
    // 中文标题
    getZhTitle : function(){
        return "键盘事件";
    }

});
// 限制在屏幕内
Acceleration.fixPos = function(pos, min, max){
    var ret = pos;
    if(pos < min)
        ret = min;
    else if(pos > max)
        ret = max;
    return ret;
};



// ==================================================================
// ----------------------------- 鼠标事件 -----------------------------
// ==================================================================
var Mouse =  TouchBaseLayer.extend({
    node : null,
    onEnter : function(){
        this._super();

        this.node = new cc.Sprite(res.node64_png);
        this.addChild(this.node);
        this.node.setPosition(GC.w2, GC.h2);
        if( "mouse" in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event       : cc.EventListener.MOUSE,
                target      : this,
                onMouseDown : this.onMouseDown,
                onMouseUp   : this.onMouseUp,
                onMouseMove : this.onMouseMove,
                onMouseScroll:this.onMouseScroll
            }, this);
        }else{
            cc.log("mouse not support");
        }

    },
    // 鼠标事件[按下]
    onMouseDown: function(event){
        var pos = event.getLocation();
        var button = event.getButton();
        if (button == cc.EventMouse.BUTTON_LEFT){
            // 左键
            cc.log("左键按下", + pos.x + " " + pos.y);
        }else if(button == cc.EventMouse.BUTTON_RIGHT){
            // 右键
            cc.log("右键按下", + pos.x + " " + pos.y);
        }else if(button == cc.EventMouse.BUTTON_MIDDLE){
            // 滚轮
            cc.log("右键按下");
        }
    },
    // 鼠标事件[抬起]
    onMouseUp: function(event){
        var pos = event.getLocation();
        var button = event.getButton();
        if (button == cc.EventMouse.BUTTON_LEFT){
            // 左键
            cc.log("左键抬起", + pos.x + " " + pos.y);
        }else if(button == cc.EventMouse.BUTTON_RIGHT){
            // 右键
            cc.log("右键抬起", + pos.x + " " + pos.y);
        }else if(button == cc.EventMouse.BUTTON_MIDDLE){
            // 滚轮
            cc.log("右键抬起");
        }

    },
    // 鼠标事件[移动]
    onMouseMove: function(event){
        var pos = event.getLocation();
        this.target.node.x = pos.x;
        this.target.node.y = pos.y;
    },
    // 鼠标事件[滚动轮滚动]
    onMouseScroll: function(event){
        // 实现节点放大缩小
        var pos = cc.p(event.getScrollX(), event.getScrollY());
        if (pos.y > 0){
            this.target.node.scale += 0.05;
        }else{
            this.target.node.scale -= 0.05;
        }
    },
    // 英文标题
    getEnTitle : function(){
        return "8. MOUSE";
    },
    // 中文标题
    getZhTitle : function(){
        return "鼠标";
    }
});

// ==================================================================
// -------------------------- 自定义事件 ------------------------------
// ==================================================================
var Custom = TouchBaseLayer.extend({

    _listener1  : null,
    _item1Count : 0,
    label       : null,
    onEnter : function () {
        this._super();

        // TODO 取代了cocos2d-x 2.x版本中的NotificationCenter。
        this.label = new cc.LabelTTF("No custom event 1 received!", "", 20);
        this.addChild(this.label);
        this.label.setPosition(GC.w2, GC.h - 150);

        // 自定义事件回调函数
        cc.eventManager.addListener({
            event       : cc.EventListener.CUSTOM,
            target      : this.label,
            eventName   : "custom_event1",
            callback    : this.customCallBack
        }, this.label);

        // 作用域保存
        var self = this;
        var sendItem = new cc.MenuItemFont("Send Custom Event 1", function(sender){
            self._item1Count++;
//            sender.parent 为【菜单】， sender.parent.parent 为当前层
//            sender.parent.parent._item1Count++;  // 效果等同上面那行代码，但是，我们一般不这样做。
            var event = new cc.EventCustom("custom_event1");
            event.setUserData(self._item1Count.toString());
//            手工分发事件，触发前面定义的回调函数
            cc.eventManager.dispatchEvent(event);
        });
        sendItem.setPosition(GC.w2, GC.h2);

        var menu = new cc.Menu(sendItem);
        menu.setPosition(0, 0);
        menu.setAnchorPoint(0, 0);
        this.addChild(menu, 1);


        return true;
    },
    customCallBack : function(event){
        var target = event.getCurrentTarget();
        // 可以通过getUserData来设置需要传输的用户自定义数据
        target.setString("Custom event 1 received, " + event.getUserData() + " times");
    },
    // 英文标题
    getEnTitle : function(){
        return "9. CustomEvent";
    },
    // 中文标题
    getZhTitle : function(){
        return "自定义事件";
    }

});


// 数组[Demo集合]
var arrayDemo = [
    // 事件[ONE_BY_ONE]
    TouchOneByOne,
    // 事件[ALL_AT_ONCE]
    TouchAllAtOnce,
    // 事件[触摸优先级]
    TouchPriority,
    // 事件[触摸开关]
    EnabledTouch,
    // 事件[暂停/恢复]
    TouchPauseResume,
    // 事件[重力加速计]
    Acceleration,
    // 事件[键盘]
    Keyboard,
    // 事件[鼠标]
    Mouse,
    // 事件[自定义]
    Custom
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
