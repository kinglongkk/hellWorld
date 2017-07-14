/**
 * Created by lingjianfeng on 14/12/23.
 *
 *
 */

var Lesson0306SceneLayer = cc.Layer.extend({

    ctor:function () {
        this._super();

        this.loadTitle();

//        创建精灵
        this.newSprite();
//        精灵操作
        this.useSpriteFun();

        return true;
    },

    loadTitle : function(){
        var helloLabel = new cc.LabelTTF("精灵", "Arial",24);
        helloLabel.x = GC.w2;
        helloLabel.y = GC.h - helloLabel.getContentSize().height;
        this.addChild(helloLabel, 5);

        var helloLabel1 = new cc.LabelTTF("cc.Sprite", "Arial",24);
        helloLabel1.x = GC.w2;
        helloLabel1.y = GC.h - 2 * helloLabel.getContentSize().height;
        this.addChild(helloLabel1, 5);
    },

//    【5种创建精灵方式 + 1种优化技巧】
    newSprite : function(){

//        API 原型： 5个
//        var sprite = new cc.Sprite();
//        var sprite = new cc.Sprite(filename, rect);
//        var sprite = new cc.Sprite(texture, rect);
//        var sprite = new cc.Sprite(‘#’ + spriteFrameName);
//        var sprite = new cc.Scale9Sprite(filename);

//        1. 颜色精灵
        if (!true){
            var colorSprite = new cc.Sprite();
            // not setContentSize
            colorSprite.setTextureRect(cc.rect(0, 0, 128, 128));
            colorSprite.setColor(cc.color(255, 128, 128));
            colorSprite.setNormalizedPosition(0.5, 0.5);
            this.addChild(colorSprite);
        }

//        2. 普通精灵
        if (!true){
            var sprite = new cc.Sprite(res.node152_png);
            sprite.setNormalizedPosition(0.3, 0.5);
            this.addChild(sprite);

            var rectSprite = new cc.Sprite(res.node152_png, cc.rect(37 , 37, 74, 74));
            rectSprite.setNormalizedPosition(0.6, 0.5);
            this.addChild(rectSprite);
        }

//        3. 使用texture创建
        if(!true){
            var texture = cc.textureCache.addImage("res/node_512.png");
            var textureSprite = new cc.Sprite(texture);
            textureSprite.setNormalizedPosition(0.5, 0.5);
            this.addChild(textureSprite);
        }

//        4. 通过plist
        if(!true){
            // plist文件加载到缓存
            cc.spriteFrameCache.addSpriteFrames(res.skill_plist);
            var frameSprite = new cc.Sprite("#skill_12.png");
            frameSprite.setNormalizedPosition(0.5, 0.5);
            this.addChild(frameSprite)
        }

//        5. Scale9精灵
        if(!true){

            // 【说明】： 使用Scale9Sprite需要引入"extensions"模块   --> project.js -->  "modules" : ["cocos2d", "extensions"]
            var scale9Sprite = new cc.Scale9Sprite(res.scale9_png);
            this.addChild(scale9Sprite);
            scale9Sprite.setNormalizedPosition(0.25, 0.5);
            scale9Sprite.setContentSize(28 * 10 , 28 * 10);

            var scale9Sprite1 = new cc.Sprite(res.scale9_png);
            this.addChild(scale9Sprite1);
            scale9Sprite1.setScale(10);
            scale9Sprite1.setNormalizedPosition(0.75, 0.5);

        }

//        【大放送】BatchNode性能优化技巧
        if (!true){
//            1. 批量渲染
//            2. 一个cc.SpriteBatchNode【只能】有【一个】纹理
//            3. 【只有】cc.Sprite类型【或继承于】cc.Sprite类型的结点【才】可以加入cc.SpriteBatchNode
//            4. 用途举例：写字板
            var texture = cc.textureCache.addImage("res/node_64.png");
            var spriteBatchNode = new cc.SpriteBatchNode(texture, 50);  // 50 表示初始容量，可自动扩展
            this.addChild(spriteBatchNode);

            for (var i = 0; i < 1000; i++){
                var x = Math.random() * GC.w;
                var y = Math.random() * GC.w;
                var batchSprite = new cc.Sprite(spriteBatchNode.texture);
                batchSprite.setPosition(x, y);
                spriteBatchNode.addChild(batchSprite);
            }
        }
    },

//    【精灵操作】
    useSpriteFun : function(){

        // 1. 换【纹理】
        if (!true){
            var sprite = new cc.Sprite(res.node152_png);
            sprite.setNormalizedPosition(0.5, 0.5);
            this.addChild(sprite);

            var callback = function(){
//                sprite.texture = res.node512_png;
                sprite.setTexture(res.node512_png);
            };
            sprite.schedule(callback, 1);
        }

        // 2. 换【帧】
        if (!true){
            // plist文件加载到内存
            cc.spriteFrameCache.addSpriteFrames(res.skill_plist);
            var frameSprite = new cc.Sprite("#skill_12.png");
            frameSprite.setNormalizedPosition(0.5, 0.5);
            this.addChild(frameSprite);

            var frames = [];
            // 遍历pist中的每张子图, 将子图加入frame中
            for (var i = 1; i <= 14; i++) {

                // 【注意】：这里不用加 #
                var str = "skill_" + i+ ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                frames.push(frame);
            }

            var callFun = cc.callFunc(function(){
                // 【注意】：这里【不】用加 #
                var tmpFrame = cc.spriteFrameCache.getSpriteFrame("skill_6.png");
                frameSprite.setSpriteFrame(tmpFrame);
            }.bind(this));

            // 定义一个【动画】，每隔0.2秒播放一帧
            var animation = new cc.Animation(frames, 0.1);
            // 动画【动作】
            var animate = cc.animate(animation);
            var sequence = cc.sequence(animate, callFun);
            //让精灵frameSprite执行这个动作，循环执行
            frameSprite.runAction(sequence);
        }

        // 3. 翻转
        if (true){
            var sprite = new cc.Sprite(res.node152_png);
            sprite.setNormalizedPosition(0.5, 0.5);

//            【赛车游戏】
//            sprite.flippedX = true;
//            sprite.setFlippedX(true);

//            sprite.flippedY = true;
//            sprite.setFlippedY(true);

            this.addChild(sprite);
        }

    }

});

var Lesson0306Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Lesson0306SceneLayer();
        this.addChild(layer);
    }
});

