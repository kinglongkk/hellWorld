/**
 * Created by lingjianfeng on 15/1/3.
 */

var TouchAllAtOnceSprite = cc.Sprite.extend({
    ctor : function(aTexture){
        this._super(aTexture);

        this.setTag(998);

        // 判断当前平台是否支持多点触控
        if( 'touches' in cc.sys.capabilities ) {
            var listener = cc.EventListener.create({
                //  TODO 不支持事件吞噬。
                event           : cc.EventListener.TOUCH_ALL_AT_ONCE,
                target          : this,  // 推荐此种用法
                onTouchesBegan  : this.onTouchesBegan,
                onTouchesMoved  : this.onTouchesMoved,
                onTouchesEnded  : this.onTouchesEnded
            });
            cc.eventManager.addListener(listener, this);
        }else{
            cc.log("当前平台不支持多点触控");
        }

        // 第二种写法
//        if( 'touches' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event           : cc.EventListener.TOUCH_ALL_AT_ONCE,
                target          : this,
                swallowTouches  : true,
                onTouchesBegan  : this.onTouchesBegan,
                onTouchesMoved  : this.onTouchesMoved,
                onTouchesEnded  : this.onTouchesEnded
            }, this);
//        }else{
//            cc.log("当前平台不支持多点触控");
//        }

    },
    onTouchesBegan: function (touches, event) {

        var self = this.target;   // TODO this，实际上是listener对象

        // TODO 点击区域判断

        // touches[0] 表示只捕获一个触摸点
        for (var i = 0; i < touches.length;i++ ) {
            var touch = touches[i];
            var pos = touch.getLocation();
            var id = touch.getID();
            // i 表示第几个触摸点 。 若需要屏蔽android多点问题，可以考虑采用TOUCH_ALL_AT_ONCE 触摸方式
            cc.log("Touch #" + i + ". onTouchesBegan at: " + pos.x + " " + pos.y + " Id:" + id);
            cc.log(self.getTag());
        }

    },
    onTouchesMoved: function (touches, event) {
        var self = this.target;
        for (var i = 0; i < touches.length;i++ ) {
            var touch = touches[i];
            var pos = touch.getLocation();
            var id = touch.getID();
            cc.log("Touch #" + i + ". onTouchesMoved at: " + pos.x + " " + pos.y + " Id:" + id);
            cc.log(self.getTag());
        }
    },
    onTouchesEnded: function (touches, event) {
        var self = this.target;
        for (var i = 0; i < touches.length;i++ ) {
            var touch = touches[i];
            var pos = touch.getLocation();
            var id = touch.getID();
            cc.log("Touch #" + i + ". onTouchesEnded at: " + pos.x + " " + pos.y + " Id:" + id);
            cc.log(self.getTag());
        }
    }

});


var TouchOneByOneSprite = cc.Sprite.extend({
    _listener : null,
    _priority : 0,
    ctor: function(aTexture, priority){
        this._super(aTexture);
        this._priority = priority || 0;

        // TODO 建议采用 target 方式
        var listener = cc.EventListener.create({
            event           : cc.EventListener.TOUCH_ONE_BY_ONE,
            target          : this,
            swallowTouches  : true,
            onTouchBegan    : this.onTouchBegan,
            onTouchMoved    : this.onTouchMoved,
            onTouchEnded    : this.onTouchEnded,
            onTouchCancelled : this.onTouchCancelled

        });

        if(this._priority != 0){
            // 触摸优先级添加。
            // TODO addListener(listener, nodeOrPriority);  如果nodeOrPriority为数字，则表示优先级。
            cc.eventManager.addListener(listener, this._priority);
        }
        else{
            cc.eventManager.addListener(listener, this);
        }
        this._listener = listener;
    },

    onTouchBegan: function (touch, event) {
        var locationInNode = this.target.convertToNodeSpace(touch.getLocation());
        var size = this.target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);
        if (!cc.rectContainsPoint(rect, locationInNode)) {
            return false;
        }

        this.target.setColor(cc.color.RED);

        return true;
    },
    onTouchMoved : function (touch, event) {
    },
    onTouchEnded : function (touch, event) {
        this.target.setColor(cc.color.WHITE);
    },
    onTouchCancelled : function(touch, event){
    },
    getListener : function(){
        return this._listener;
    },
    onExit: function(){
        if (this._listener != null){
            cc.eventManager.removeListener(this._listener);
        }
        this._super();
    }
});


// 可开关触摸事件的精灵
var TouchEnabledSprite = cc.Sprite.extend({
    _listener : null,
    _priority : null,
    ctor: function(aTexture, priority){
        this._super(aTexture);
        this._priority = priority || 0;

        var listener = cc.EventListener.create({
            event           : cc.EventListener.TOUCH_ONE_BY_ONE,
            target          : this,
            swallowTouches  : true,
            onTouchBegan    : this.onTouchBegan,
            onTouchMoved    : this.onTouchMoved,
            onTouchEnded    : this.onTouchEnded
        });

        // TODO 因为下面有个移除事件操作，此操作会使得listener的引用计数-1，当引用计数为0的时候，listener就会被引擎内存管理自动回收。
        // TODO 内存管理的一种方式。调用使得listener的引用计数+1， 从而保证对象不会被回收。[如何理解：开门，关门，必须保证有门在]
        this.setUserObject(listener);

        cc.eventManager.addListener(listener, this);
        this._listener = listener;
    },

    onTouchBegan: function (touch, event) {
        var locationInNode = this.target.convertToNodeSpace(touch.getLocation());
        var size = this.target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (!cc.rectContainsPoint(rect, locationInNode)) {
            return false;
        }

        this.target.setColor(cc.color.RED);

        return true;
    },
    onTouchMoved: function (touch, event) {
    },
    onTouchEnded: function (touch, event) {
        this.target.setColor(cc.color.WHITE);
    },
    setTouchEnabled : function(enable){
        if (this._listener){
            if (enable){
                // 事件添加
                cc.eventManager.addListener(this._listener, this);
            }else{
                cc.eventManager.removeListener(this._listener);
            }
        }else{
            cc.error("this._listener 为空...");
        }

    },
    onExit: function(){
        if (this._listener != null){
            cc.eventManager.removeListener(this._listener);
        }

        this._super();
    }

});

