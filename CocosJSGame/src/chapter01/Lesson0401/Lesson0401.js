/**
 * Created by lingjianfeng on 14/12/24.
 *
 *
 */

var Lesson0401SceneLayer = cc.Layer.extend({

    node : null,
    ctor : function () {
        this._super();

        this.loadTitle();

        // 精灵创建
        this.node = new cc.Sprite(res.node128_png);
        this.node.setPosition(GC.w2, GC.h2);
        this.addChild(this.node);

//        表白神器：爱心跳动效果
//        this.loveYou();

//        回合制游戏：梦幻西游战斗小小小Demo
//        this.xyqCombatDemoCopy();

        // 及时动作模块
        this.instantAction();

        // 持续动作模块
        this.intervalAction();

        // 回合制游戏：梦幻西游战斗小小小Demo
        this.xyqCombatDemo();

        return true;
    },
    loadTitle : function(){
        var helloLabel = new cc.LabelTTF("动作", "Arial",24);
        helloLabel.x = GC.w2;
        helloLabel.y = GC.h - helloLabel.getContentSize().height;
        this.addChild(helloLabel, 5);

        var helloLabel1 = new cc.LabelTTF("cc.Action", "Arial",24);
        helloLabel1.x = GC.w2;
        helloLabel1.y = GC.h - 2 * helloLabel.getContentSize().height;
        this.addChild(helloLabel1, 5);
    },

//    及时动作
    instantAction : function(){

        // cc.place : 放置
        if (!true){
            //  将节点放置在绝对坐标位置
//            var placeAction = cc.place(cc.p(200, 200));  //  和下面那行代码功能是一样的。
            var placeAction = cc.place(200, 200);
            this.node.runAction(placeAction);
        }

        // cc.flipX | cc.flipY : 翻转
        if(!true){
            // 水平方向
            var flipXAction = cc.flipX(true);

            // 水平方向
            var flipYAction = cc.flipY(true);

            this.node.runAction(cc.sequence(cc.delayTime(0.5), flipXAction, cc.delayTime(0.5), flipYAction));

        }

        // cc.show | cc.hide : 显示和隐藏
        if (!true){
            // 显示节点动作
            var showAction = cc.show();

            // 隐藏节点动作
            var hideAction = cc.hide();

            this.node.runAction(cc.sequence(cc.delayTime(0.5), hideAction, cc.delayTime(0.5), showAction));

        }

        // cc.removeSelf : 删除自己
        if (!true){
            var removeSelfAction = cc.removeSelf();
            this.node.runAction(removeSelfAction);
        }


        // [TODO]  do do do
        // cc.callFunc : 函数动作
        // API ： cc.callFunc(selector, selectorTarget, data)
        if (!true){

            // 1. 不带参数函数
            if (!true){
                var callAction = cc.callFunc(this.callBack1.bind(this));
                var callAction1 = cc.callFunc(this.callBack1, this);  // 跟上面那行鬼代码是一样的哈
                this.node.runAction(callAction);
                this.node.runAction(callAction1);
            }

            // 2. 带参数函数
            if (!true){
                var sayHello = function(){
                    cc.log("Hello Word, I am Jeff");
                };

                var data = {
                    name        : "凌建风",
                    age         : 22,
                    doSomething : sayHello
                };

                var callAction2 = cc.callFunc(this.callBack2, this, data);
                this.node.runAction(callAction2);
            }

            // 3. 匿名函数
            if (true){
                var callAction3 = cc.callFunc(function(){
                    cc.log("callBack 3 ...");
                });
                this.node.runAction(callAction3);
            }

        }


    },

    callBack1 : function(){
        cc.log("callBack1 ... ");
    },

    callBack2 : function(sender, data){
        cc.log("callBack 2 ... ", data);
        this.node.runAction(cc.callFunc(data.doSomething))
    },


//    持续动作
    intervalAction : function(){

        // 属性变化动作
        {

            var time = 1.0;
            // xxxTo 和 xxxBy 的区别：
            //  to指向【终点】 , by从【起点】开始
            //  to是【绝对】的 , by都是【相对】而言

            // 1. move
            if (!true){
//            ------------------------------------------------------------------
//            cc.moveTo && cc.moveBy   移动的动作
//            ------------------------------------------------------------------
//              【作用】 : 创建一个移动的动作
//              参数1   : 移动【到】目标坐标【所需】的【时间】
//              参数2   : 移动的目标【坐标】
//              【举例】 :
//                  1秒内，精灵移动到点x为屏幕右上角  --> cc.p(960, 640)
                var actionMoveTo = cc.moveTo(time, cc.p(960, 640));

//              【举例】：
//                  1秒内，x轴移动向右移动480，y轴向上移动320
                var actionMoveBy = cc.moveBy(time, cc.p(480, 320));
                this.node.runAction(cc.sequence(actionMoveTo, actionMoveBy));

            }

            // 2. jump    TODO  看一下啦，表辣么小气...
            if (!true){

                // 设置下当前坐标
                this.node.setPosition(0, 0);

//          ------------------------------------------------------------------
//          cc.jumpTo && cc.jumpBy  跳的动作
//          ------------------------------------------------------------------
//              【作用】：创建一个跳的动作
//              参数1：跳到目标动作位子的所需时间
//              参数2：目标位置
//              参数3：跳的高度
//              参数4：跳到目标位置的次数
//              【举例】：1秒时间，跳到(480, 320)，跳跃高度为50像素，总共跳跃4次
                var actionJumpTo = cc.jumpTo(time, cc.p(480, 320), 50, 4);

//              【举例】：
//                  1秒时间，原地跳，跳跃高度为100像素，总共跳跃4次
                var actionJumpBy = cc.jumpBy(time, cc.p(0, 0), 100, 4);
                this.node.runAction(cc.sequence(actionJumpTo, actionJumpBy));
            }

            // 3. bezier
            // TODO  讲 讲 讲
            if (!true){
                // 设置下当前坐标
                this.node.setPosition(0, 0);
//          ------------------------------------------------------------------
//          cc.bezierTo && cc.bezierBy 贝塞尔曲线运动的动作
//          ------------------------------------------------------------------
//              【作用】：创建一个贝塞尔曲线运动的动作
//              参数1：贝塞尔曲线运动的【时间】
//              参数2 ：控制点【结构体】
//              【举例】:
//                1秒时间，从屏幕做左下角，做曲线运动，移动到右下角，并且保证左右对称
                var controlPointsTo = [
                    cc.p(0, GC.h),     //控制点1
                    cc.p(GC.w, GC.h),  //控制点2
                    cc.p(GC.w, 0)      //控制点3，即终点位置
                ];
                var bezierTo = cc.bezierTo(time, controlPointsTo);

//              【举例】:
//                1秒时间，x轴往负方向移动480，y不变
                var controlPointsBy = [
                    cc.p(0, GC.h),
                    cc.p(-GC.w2, GC.h),
                    cc.p(-480, 0)
                ];
                var bezierBy = cc.bezierBy(time, controlPointsBy);
                this.node.runAction(cc.sequence(bezierTo, bezierBy));
            }

            // 4. scale
            if (!true){
//          ------------------------------------------------------------------
//          cc.scaleTo && cc.scaleBy  缩放的动作
//          ------------------------------------------------------------------
//             【作用】 : 创建一个缩放的动作, 支持反向.reverse()
//              参数1：达到缩放大小的所需【时间】
//              参数2：x缩放【比例】，若【没有】参数3，则表示x和y【都】缩放对应的比例
//              参数3：y缩放【比例】
//             【举例】：
//                  用1秒的时间，把图片缩放到【原图】大小的50%
                var actionScaleTo = cc.scaleTo(time, 0.5);

//             【举例】：
//                  用1秒的时间，把图片缩放到【当前】大小的200%
                var actionScaleBy = cc.scaleBy(time, 2);

//             【举例】
//                  用1秒的时间，把x方向缩放到【原图】大小的50%， y方向缩放到【原图】大小的150%
                var actionScale = cc.scaleBy(time, 0.5, 1.5);
                var actionScaleRev = actionScale.reverse();

                this.node.runAction(cc.sequence(actionScaleTo, actionScaleBy, actionScale, actionScaleRev));

            }

            // 5. rotate
            if (!true){
//          ------------------------------------------------------------------
//          cc.rotateTo && cc.rotateBy  旋转的动作
//          ------------------------------------------------------------------
//              【作用】：创建一个旋转的动作
//              参数1：旋转的【时间】
//              参数2：旋转的【角度】，数值【正】为【顺】时针，【负】为【逆】时针
//              【举例】：
//                  用1秒的时间，基于【cocos2d坐标系】旋转到90度
//                  【备注】： cocos2d中，向上表示0度， 右表示90度， 左表示-90度
                var actionRotateTo = cc.rotateTo(time, 90);

//              【举例】：
//                  用1秒的时间，基于【当前】的角度旋转-90度
                var actionRotateBy = cc.rotateBy(time, -90);
                this.node.runAction(cc.sequence(actionRotateTo, actionRotateBy, actionRotateBy.reverse()));

            }
        }

        // 视觉特效动作
        {

            // fade
            if(!true){
//        ------------------------------------------------------------------
//        cc.fadeIn && cc,fadeOut 渐变动作
//        -----------------------------------------------------------------
//            【作用】：创建一个渐变出现的动作, 支持反向
//            参数：时间
//            【举例】：
//                  1秒内出现，再消失
                var actionFadeIn = cc.fadeIn(time);
                var actionFadeInRev = actionFadeIn.reverse();
                {
//                this.node.opacity = 0;  // 【确保】fadeIn之前，节点的【透明度】【为0】
//                this.node.runAction(cc.sequence(actionFadeIn,actionFadeInRev));
                }

//            【举例】：
//                  1秒内出现，再消失 -- 注意：和上面一样的效果，只是实现方式不同
                var actionFadeOut = cc.fadeOut(time);
                var actionFadeOutRev = actionFadeOut.reverse();

//            【举例】:
//                  用1秒的时间, 透明度渐变到半透明(128)
                var actionFadeTo = cc.fadeTo(time, 128);
                this.node.runAction(cc.sequence(actionFadeOut, actionFadeOutRev, actionFadeTo));
            }

            // tint
            if(!true){
//          ------------------------------------------------------------------
//          cc.tintTo && cc.tintBy 色彩变化的消失动作
//          ------------------------------------------------------------------
//              【作用】：创建一个色彩变化的动作 ， 支持反向
//              参数1：色彩变化的动作【时间】
//              参数2：红色分量
//              参数3：蓝色分量
//              参数4：绿色分量
//              【举例】：
//                  用1秒的时间，红色和蓝色分量不变，绿色分量降到0,
                var actionTintTo = cc.tintTo(time, 255, 255, 0);
//                 this.node.runAction(actionTintTo);

//              【举例】：
//                  用1秒的时间，基于【当前】的颜色分量值，红色和蓝色分量不变，绿色分量上降255,
                var actionTintBy = cc.tintBy(time, 0, 0, 255);
                this.node.runAction(cc.sequence(actionTintTo, actionTintBy));
            }

            // blink
            if(!true){
//          ------------------------------------------------------------------
//           cc.blink  闪烁的动作
//          ------------------------------------------------------------------
//              【作用】 :创建一额闪烁的动1
//              参数1：闪烁完成的时间
//              参数2:闪烁的次数
//              【举例】：
//                    1秒时间，闪烁5次  。。。 卡丁车游戏，碰到了闪烁效果。
                var actionBlink = cc.blink(time, 10);
                this.node.runAction(actionBlink);
            }

            // orbit TODO lock lock lock
            if (!true){
//          ------------------------------------------------------------------
//          cc.orbitCamera   摄像机动作
//          ------------------------------------------------------------------
//              【作用】：创建一个球面坐标轨迹进行旋转的动作
//              参数1 ：旋转轨迹的时间
//              参数2 ：起始半径
//              参数3 ：半径差
//              参数4 ：起始z角
//              参数5 ：旋转z角的差
//              参数6 ：起始x角
//              参数7 ：旋转x角的差
//              【举例】：
                var orbit1 = cc.orbitCamera(2,10, 0, 0, 180, 0, 0);
                var orbit2 = cc.orbitCamera(2,10, 0, 0, 180, -45, 0);
                var orbit3 = cc.orbitCamera(2,10, 0, 0, 180, 90, 0);
                var actionorbitCamera = cc.sequence(orbit1, orbit2, orbit3);
                this.node.runAction(actionorbitCamera);
            }

            // follow   TODO   do do do
            if (!true){
//          ------------------------------------------------------------------
//           cc.follow
//          ------------------------------------------------------------------
//              【作用】：创建一个跟随动作
//              参数1：跟随的目标对象
//              【说明】：
//                  跟随范围，离开范围就不再跟随
//                  cc.follow经常用来设置layer跟随sprite，可以实现类似摄像机跟拍的效果,
//                  效果是精灵在地图上移动，地图也会跟着移动，但是精灵仍然是在整个界面的中心位置

                var tmpNode = new cc.Sprite(res.node64_png);
                this.addChild(tmpNode);
                tmpNode.setPosition(GC.w * 0.3 , GC.h * 0.3);

                var move = cc.moveBy(time, cc.p(GC.w * 2, 0));
                var move_back = move.reverse();
                var seq = cc.sequence(move, move_back);
                var rep = seq.repeatForever();//一直重复动作
                tmpNode.runAction(rep);
                this.runAction(cc.follow(tmpNode, cc.rect(0, 0,GC.w*2-100,GC.h)));//整个层跟随小男孩移动

            }
        }

        // 复合动作  TODO 讲 讲 讲
        {

            // delayTime
            if (!true){
//          ------------------------------------------------------------------
//          cc.delayTime 延迟的动作
//          ------------------------------------------------------------------
//              【作用】：创建一个延迟的动作
//              参数  延迟的时间
//              【举例】：
//                  【延迟】2秒，再让精灵用1秒的时间旋转到50度
                var actionDelayTime = cc.delayTime(1);
                var actionRotation = cc.rotateTo(1, 50);
                this.node.runAction(cc.sequence(actionDelayTime,actionRotation));
            }

            // repeat/repeatForever
            if (!true){
//          ------------------------------------------------------------------
//          cc.repeat
//          ------------------------------------------------------------------
//              【作用】：对目标动作进行重复运动
//              参数1：目标动作
//              参数2：重复次数
//              【举例】：
//                  一组动作，重复执行3次。这组动作是，执行一次函数，暂停1秒。
                var callBack = function(){
                    cc.log("Hello Word");
                }
                var action = cc.sequence(cc.callFunc(callBack),cc.delayTime(1));
                this.node.runAction(action.repeat(3));

//          ------------------------------------------------------------------
//           cc.repeatForever
//          ------------------------------------------------------------------
//              【作用】：对目标动作进行永久性的重复运动 。【备注】目标动作可以是cc.sequence ，cc.spawn。
//              参数：目标动作
//              【举例】：
//                  风车效果，一个精灵一直旋转
                var actionRepeatForever = cc.rotateBy(5 * time, 360).repeatForever();
                this.node.runAction(actionRepeatForever);

            }

            // sequence
            if (!true){
//          ------------------------------------------------------------------
//	        cc.sequence
//          ------------------------------------------------------------------
//          【作用】：让多个动作按照【前后】【顺序】【逐一】执行
//          参数：目标动作的可变参数
                var actionMoveTo = cc.moveTo(time, 300, 200);
                var actionDelayTime = cc.delayTime(0.5);
                var actionRotation = cc.rotateTo(time, 50);
                this.node.runAction(cc.sequence(actionMoveTo, actionDelayTime, actionRotation));
            }

            // cc.spawn
            if (!true){
//          ------------------------------------------------------------------
//	        cc.spawn
//          ------------------------------------------------------------------
//          【作用】：让多个动作【并发】执行
//          参数：目标动作的可变参数
                var actionMoveTo = cc.moveTo(time, 300, 200);
                var actionRotation = cc.rotateTo(time, 50);
                this.node.runAction(cc.spawn(actionMoveTo, actionDelayTime, actionRotation));
            }

            // reverse  TODO
            if(!true){
//          ------------------------------------------------------------------
//	        reverse
//          ------------------------------------------------------------------
//          【作用】：返回动作的【逆动作】
//          【举例】 :
//              1秒内，精灵移动到点x为屏幕右上角  --> cc.p(960, 640)
                var actionMoveTo = cc.moveTo(time, cc.p(960, 640));
                var actionMoveToRev = actionMoveTo.reverse(); // 返回动作的逆动作
//          【举例】：
//              1秒内，x轴移动向右移动480，y轴向上移动320
                var actionMoveBy = cc.moveBy(time, cc.p(480, 320));
                this.node.runAction(cc.sequence(actionMoveTo, actionMoveToRev, actionMoveBy));

            }

            // Speed
            if (!true){
//        ------------------------------------------------------------------
//        cc.speed
//        ------------------------------------------------------------------
//          作用：让目标动作运行速度加倍
//           参数1：目标动作
//           参数2:倍速

                var actionMoveTo = cc.moveTo(3, cc.p(200, 300));
                var speed = cc.speed(actionMoveTo,50); //设置现在运动速度是原来的50倍
                this.node.runAction(speed);//改变速度后的动作

            }

            // ActionEase   缓冲动作
            {
//            ---------------------------------------------------------------------
//                ActionEase
//            ---------------------------------------------------------------------
//                 cc.easeBounceIn
//                让目标动作缓慢开始
//                var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseBounceIn =actionMoveTo.easing(cc.easeBounceIn());
//                this.node.runAction(actionEaseBounceIn);

//                  -----------------------------------------

//              cc.easeBounceInOut
//              作用：让目标动作赋予反弹力，且以目标动作起始与结束位子开始反弹

//                var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseBounceInOut =actionMoveTo.easing(cc.easeBounceInOut());
//                this.node.runAction(actionEaseBounceInOut);

//                  -----------------------------------------

//              cc.easeBackIn
//              作用：让目标动作赋予回力 ， 且以目标动作起点位置作为回力点

//                 var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseBackIn =actionMoveTo.easing(cc.easeBackIn());
//                this.node.runAction(actionEaseBackIn);

//                  -----------------------------------------

//              cc.easeBackOut
//              作用：让目标动作赋予回力 ， 且以目标动作终点位置作为回力点
//                var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseBackOut =actionMoveTo.easing(cc.easeBackOut());
//                this.node.runAction(actionEaseBackOut);

//                  -----------------------------------------

//              cc.easeBackInOut
//              作用：让目标动作赋予回力 ， 且以目标动作起点和终点位置作为回力点
//                var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseBackInOut =actionMoveTo.easing(cc.easeBackInOut());
//                this.node.runAction(actionEaseBackInOut);

//                  -----------------------------------------

//              cc.easeElasticIn
//              作用：让目标动作赋予弹性 ，且以目标动作起点位子赋予弹性
//                var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseElasticIn =actionMoveTo.easing(cc.easeElasticIn());
//                this.node.runAction(actionEaseElasticIn);

//                  -----------------------------------------

//               cc.easeElasticOut
//              作用：让目标动作赋予弹性 ，且以目标动作终点位子赋予弹性
//                var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseElasticOut =actionMoveTo.easing(cc.easeElasticOut());
//                this.node.runAction(actionEaseElasticOut);

//                  -----------------------------------------

//               cc.easeElasticInOut
//              作用：让目标动作赋予弹性 ，且以目标动作起点和终点位子赋予弹性
//                var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseElasticInOut =actionMoveTo.easing(cc.easeElasticInOut());
//                this.node.runAction(actionEaseElasticInOut);


//                  -----------------------------------------

//              cc.easeExponentialIn TODO  DO DO DO
//              让目标动作缓慢开始
//                var actionMoveTo = cc.moveTo(2, cc.p(GC.w, GC.h2));
//                var actionEaseExponentialIn =actionMoveTo.easing(cc.easeExponentialIn());
//                this.node.runAction(actionEaseExponentialIn);

//                  -----------------------------------------

//              cc.easeExponentialOut
//              让目标动作缓慢中止
//                var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseeExponentialOut =actionMoveTo.easing(cc.easeExponentialOut());
//                this.node.runAction(actionEaseeExponentialOut);

//                  -----------------------------------------

//              cc.easeExponentialInOut
//              让目标动作缓慢开始和中止
//                 var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                 var actionExponentialInOut =actionMoveTo.easing(cc.easeExponentialInOut());
//                 this.node.runAction(actionExponentialInOut);

//                  -----------------------------------------

//              cc.easeRateAction
//              作用 ： 让目标动作设置速率
//              参数1:目标动作
//              参数2：速率
//                var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseRateAction =cc.easeRateAction(actionMoveTo,3);
//                this.node.runAction(actionEaseRateAction)

//                  -----------------------------------------
//              cc.easeSineIn
//              作用：动作由慢到快
//              参数：目标动作
//                 var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                 var actionEaseSineIn =actionMoveTo.easing(cc.easeSineIn());
//                 this.node.runAction(actionEaseSineIn);

//                  -----------------------------------------

//              cc.easeSineOut
//              作用：动作由快到慢
//              参数：目标动作
//                 var actionMoveTo = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                 var actionEaseSineOut =actionMoveTo.easing(cc.easeSineOut());
//                 this.node.runAction(actionEaseSineOut);

//                  ----------------------------------------

//              cc.easeSineInOut
//              作用：动作由慢到快再快到慢
//               参数：目标动作
//                 var actionMoveOut = cc.moveTo(3, cc.p(GC.w, GC.h2));
//                var actionEaseSineInOut =actionMoveOut.easing(cc.easeSineInOut());
//                this.node.runAction(actionEaseSineInOut);
            }
        }
    },

    // 心脏跳动效果
    loveYou : function () {
        var heart = new cc.Sprite(res.heart_png);
        this.addChild(heart);
        heart.setPosition(480, 320);

        var time = 0.1;
        var scale1 = cc.scaleTo(time, 1.2);
        var scale2 = cc.scaleTo(time, 1);
        var scale3 = cc.scaleTo(time, 1.1);
        var scale4 = scale2.clone();
        var delay = cc.delayTime(1);

        var loveYouAction = cc.sequence(
            scale1,
            scale2,
            scale3,
            scale4,
            delay
        );
        heart.runAction(loveYouAction.repeatForever());

    },

    // 梦幻西游战斗小Demo
    xyqCombatDemo : function(){

        // ---------- 加载【资源】【播放音乐】 ---------
        // 加载plist资源
        cc.spriteFrameCache.addSpriteFrames(res.boy_plist);
        cc.spriteFrameCache.addSpriteFrames(res.meinv_plist);
        // 循环播放背景音乐 TODO 开启音乐
        cc.audioEngine.playMusic(res.attack_music, true);

        // ---------- 创建【背景】和【剑侠客】 ---------
        // 背景
        var bg = new cc.Sprite(res.xyq_bg);
        this.addChild(bg);
        bg.setPosition(GC.w2, GC.h2);

        // 创建 小伙子
        var boy = new cc.Sprite("#boy_0_1.png");
        this.addChild(boy, 1);
        boy.name = "剑侠客";
        boy.setPosition(GC.w * 0.7, GC.h * 0.4);

        // 帅哥脚下的阴影
        var shadow = new cc.Sprite("res/action/shadow.png");
        boy.addChild(shadow);
        shadow.setAnchorPoint(0.2, 0.3);


        // ---------- 创建【动作】 ---------
        // 站立动画数组
        var standFrames = [];
        // 攻击图片数组
        var attackFrames = [];
        // 所有站立图片加入数组
        for (var i = 1; i <= 7; i++) {
            var str = "boy_0_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            standFrames.push(frame);
        }
        for (var i = 1; i <= 10; i++) {
            var str = "boy_1_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            attackFrames.push(frame);
        }

        // 站立动画
        var standAnimation = new cc.Animation(standFrames, 0.1);
        // 站立动作
        var standAnimate = cc.animate(standAnimation);
        // 攻击动画
        var attackAnimation = new cc.Animation(attackFrames, 0.1);
        // 攻击动作
        var attackAnimate = cc.animate(attackAnimation);

        var attackAnimateWithEffect = cc.spawn(
            attackAnimate,
            cc.sequence(
                cc.delayTime(0.1 * 7), // 延迟0.7秒，在第7帧播放音效
                cc.callFunc(function(){
                    cc.audioEngine.playEffect(res.attack_effct);
                })
            )
        )

        // 冲上去移动动作
        var moveAction = cc.moveTo(0.2, 400, 400);
        // 退回来移动动作
        var moveBackAction = cc.moveTo(0.2, GC.w * 0.7, GC.h * 0.4);
        // 运行动作：先给哥哥站着不要动
        boy.runAction(standAnimate.repeatForever());

        //        动画和动作的关系
        //        一个【动画动作 - animate】里面只能有一个【动画 - Animation】对象，
        //          【动画 - Animation】对象里面可以有【很多】张图片
        //        动作{
        //            动画{
        //                图片1.png,
        //                图片2.png,
        //                图片3.png,
        //                图片4.png
        //            }
        //        }

        // ---------- 触发【攻击】 ---------
        // 对当前层添加一个触摸事件，【备注】：先用着，后面的视频会详讲
        var onTouchBegan = function (touch, event) {
            cc.log("冲上去，摸她一下...");

            // 停止所有动作
            boy.stopAllActions();

            // 停止所有动作后继续给老子站着
            // 【备注】：cc.sequence 和  cc.spawn中都不能有repeatForever, 所以要stopAllActions一下。
            var clearAndStand = cc.callFunc(function(){
                boy.stopAllActions();
                boy.runAction(standAnimate);

            });

            // 顺序动作，上去妹子摸一下，然后退回来，继续装酷...
            var action = cc.sequence(
                moveAction,
                attackAnimateWithEffect,
                moveBackAction,
                clearAndStand);
            boy.runAction(action);

            return true;
        }

        // 给当前层注册触摸监听
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: onTouchBegan
        }, this);



        // ---------- 创建【妹子】 ---------
        var beautifulGirl = new cc.Sprite("#meinv_0_1.png");
        this.addChild(beautifulGirl);
        beautifulGirl.name = "玄彩娥";
        beautifulGirl.setPosition(GC.w * 0.35, GC.h * 0.7);

        // 美女脚下也有阴影
        var shadow1 = new cc.Sprite("res/action/shadow.png");
        beautifulGirl.addChild(shadow1);
        shadow1.setAnchorPoint(0.33, 0.3);

        // 攻击动画数组
        var meinvStandFrames = [];
        // 所有站立图片加入数组
        for (var i = 1; i <= 10; i++) {
            var str = "meinv_0_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            meinvStandFrames.push(frame);
        }
        // 站立动画
        var meinvAnimation = new cc.Animation(meinvStandFrames, 0.1);
        // 站立动作
        var meinvAnimate = cc.animate(meinvAnimation);
        beautifulGirl.runAction(meinvAnimate.repeatForever());


    },

    xyqCombatDemoCopy : function(){
        // 加载plist资源
        cc.spriteFrameCache.addSpriteFrames(res.boy_plist);
        cc.spriteFrameCache.addSpriteFrames(res.meinv_plist);
        // 循环播放背景音乐 TODO 开启音乐
        cc.audioEngine.playMusic(res.attack_music, true);

        // 背景
        var bg = new cc.Sprite(res.xyq_bg);
        this.addChild(bg);
        bg.setNormalizedPosition(0.5, 0.5);

        // 创建 小伙子
        var boy = new cc.Sprite("#boy_0_1.png");
        this.addChild(boy, 1);
        boy.name = "剑侠客";
        boy.setPosition(GC.w * 0.7, GC.h * 0.4);

        // 小伙子脚下的阴影
        var shadow = new cc.Sprite("res/action/shadow.png");
        boy.addChild(shadow);
        shadow.setAnchorPoint(0.2, 0.3);

        // 站立动画数组
        var standFrames = [];
        // 攻击图片数组
        var attackFrames = [];
        // 所有站立图片加入数组
        for (var i = 1; i <= 7; i++) {
            var str = "boy_0_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            standFrames.push(frame);
        }
        for (var i = 1; i <= 10; i++) {
            var str = "boy_1_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            attackFrames.push(frame);
        }

        // 站立动画
        var standAnimation = new cc.Animation(standFrames, 0.1);
        // 站立动作
        var standAnimate = cc.animate(standAnimation);
        // 攻击动画
        var attackAnimation = new cc.Animation(attackFrames, 0.1);
        // 攻击动作
        var attackAnimate = cc.animate(attackAnimation);
        var attackAnimateWithEffect = cc.spawn(
            attackAnimate,
            cc.sequence(
                cc.delayTime(0.1 * 7), // 休眠0.7秒，在第7帧播放音效
                cc.callFunc(function(){
                    cc.audioEngine.playEffect(res.attack_effct);
                })
            )
        )

        // 冲上去移动动作
        var moveAction = cc.moveTo(0.2, 400, 400);
        // 退回来移动动作
        var moveBackAction = cc.moveTo(0.2, GC.w * 0.7, GC.h * 0.4);
        // 运行动作：先给哥哥站着不要动
        boy.runAction(standAnimate.repeatForever());

        //        动画和动作的关系
        //        一个【动画动作 - animate】里面只能有一个【动画 - Animation】对象，
        //          【动画 - Animation】对象里面可以有【很多】张图片
        //        动作{
        //            动画{
        //                图片1.png,
        //                图片2.png,
        //                图片3.png,
        //                图片4.png
        //            }
        //        }

        // 对当前层添加一个触摸事件，【备注】：先用着，后面的视频会详讲
        var onTouchBegan = function (touch, event) {
            cc.log("冲上去，摸她一下...");

            // 停止所有动作
            boy.stopAllActions();

            // 停止所有动作后继续给老子站着
            var clearAndStand = cc.callFunc(function(){
                boy.stopAllActions();
                boy.runAction(standAnimate);

            });

            // 顺序动作，上去妹子摸一下，然后退回来，继续装酷...
            var action = cc.sequence(
                moveAction,
                attackAnimateWithEffect,
                moveBackAction,
                clearAndStand);
            boy.runAction(action);

            return true;

        }

        // 给当前层注册触摸监听
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: onTouchBegan
        }, this);


        var beautifulGirl = new cc.Sprite("#meinv_0_1.png");
        this.addChild(beautifulGirl);
        beautifulGirl.name = "玄彩娥";
        beautifulGirl.setPosition(GC.w * 0.35, GC.h * 0.7);

        // 美女脚下也有阴影
        var shadow1 = new cc.Sprite("res/action/shadow.png");
        beautifulGirl.addChild(shadow1);
        shadow1.setAnchorPoint(0.33, 0.3);

        // 攻击动画数组
        var meinvStandFrames = [];
        // 所有站立图片加入数组
        for (var i = 1; i <= 10; i++) {
            var str = "meinv_0_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            meinvStandFrames.push(frame);
        }
        // 站立动画
        var meinvAnimation = new cc.Animation(meinvStandFrames, 0.1);
        // 站立动作
        var meinvAnimate = cc.animate(meinvAnimation);
        beautifulGirl.runAction(meinvAnimate.repeatForever());
    }
});

var Lesson0401Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Lesson0401SceneLayer();
        this.addChild(layer);
    }
});

