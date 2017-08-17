/**
 * Created by lingjianfeng on 15/4/19.
 */


var LSMainLayer = cc.Layer.extend({
    loadNumber : 7,
    loadIndex : 0,
    loadBar : null,
    ctor: function () {
        this._super();
        this.loadProgressBar();
        this.loadSource();
        this.scheduleUpdate();
        return true;
    },
    update : function(dt){

        var percent = this.loadIndex / this.loadNumber * 100;
        this.loadBar.setPercentage(percent);

        if (this.loadIndex == this.loadNumber) {
            cc.audioEngine.playMusic(res.music_mp3, true);
            cc.director.runScene(new MainMenuScene());

        }

    },
    loadProgressBar : function(){
        var barBg = new cc.Sprite(res.load_png);
        this.addChild(barBg);
        barBg.setPosition(GC.w2, GC.h2);

        var bar = new cc.ProgressTimer(new cc.Sprite(res.loadBar_png));
        barBg.addChild(bar);
        bar.setPosition(GC.w2, GC.h2);
        bar.setType(cc.ProgressTimer.TYPE_BAR);
        bar.setMidpoint(cc.p(0, 0.5));
        bar.setBarChangeRate(cc.p(1, 0));
        bar.setPercentage(0);
        bar.setPosition(cc.p(barBg.width / 2, barBg.height / 6));

        this.loadBar = bar;

    },
    loadSource : function(){
        cc.textureCache.addImage(res.MainMenu_png);
        cc.spriteFrameCache.addSpriteFrames(res.MainMenu_plist);
        this.loadIndex++;

        cc.textureCache.addImage(res.LeveInfo_png);
        cc.spriteFrameCache.addSpriteFrames(res.LeveInfo_plist);
        this.loadIndex++;

        cc.textureCache.addImage(res.ChooseLevel_png);
        cc.spriteFrameCache.addSpriteFrames(res.ChooseLevel_plist);
        this.loadIndex++;

        cc.textureCache.addImage(res.GamePlay_Info_png);
        cc.spriteFrameCache.addSpriteFrames(res.GamePlay_Info_plist);
        this.loadIndex++;

        cc.textureCache.addImage(res.enemy_png);
        cc.spriteFrameCache.addSpriteFrames(res.enemy_plist);
        this.loadIndex++;

        cc.textureCache.addImage(res.sh_bg_png, this.loadingCallBack, this);
        cc.textureCache.addImage(res.go_failedPanel_png, this.loadingCallBack, this);

    },
    loadingCallBack : function(sender){
        this.loadIndex++;
    }
});